
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Car, Booking, ContactMessage, Auction, Bid } from '../types';
import { supabase } from '../supabase';

interface CarContextType {
  cars: Car[];
  bookings: Booking[];
  messages: ContactMessage[];
  auctions: Auction[];
  addCar: (car: Car) => Promise<void>;
  updateCar: (car: Car) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  addMessage: (message: ContactMessage) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  createAuction: (auction: Omit<Auction, 'id'>) => Promise<void>;
  placeBid: (auctionId: string, bid: Bid) => Promise<{ success: boolean; message: string }>;
  cancelAuction: (id: string) => Promise<void>;
  requestNotificationPermission: () => Promise<string | null>;
  isLoading: boolean;
  isConnected: boolean;
  connectionError: string | null;
  fcmToken: string | null;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Refs to track previous counts for notifications
  const prevBookingsCount = useRef<number>(0);
  const prevMessagesCount = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);

  // Notifications
  const requestNotificationPermission = async () => {
     return null; // Disabled for now during migration
  };

  const triggerLocalNotification = (title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
       try {
         new Notification(title, {
           body: body,
           icon: '/logo.webp'
         });
         const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
         audio.volume = 0.5;
         audio.play().catch(() => {});
       } catch (e) {
         console.log("Notification API error:", e);
       }
    }
  };

  const syncToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {
      console.warn("Local storage save failed", e);
    }
  };

  const getFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  useEffect(() => {
      const fetchData = async () => {
       setIsLoading(true);
       try {
           // Step 1: Fetch initial chunk (Limit 6 cars to drastically improve Critical Path Latency)
           const [carsRes, bookingsRes, messagesRes, auctionsRes] = await Promise.all([
               supabase.from('cars').select('*').order('createdAt', { ascending: false }).limit(6),
               supabase.from('bookings').select('*').order('date', { ascending: true }),
               supabase.from('messages').select('*').order('date', { ascending: false }),
               supabase.from('auctions').select('*')
           ]);
           
           if (carsRes.error) throw carsRes.error;
           if (bookingsRes.error) throw bookingsRes.error;
           if (messagesRes.error) throw messagesRes.error;
           if (auctionsRes.error) throw auctionsRes.error;
           
           if(carsRes.data) {
             setCars(carsRes.data as Car[]);
             syncToLocalStorage('cars', carsRes.data);
             
             // Step 2: Fetch the remaining cars lazily in the background
             setTimeout(() => {
                 supabase.from('cars').select('*').order('createdAt', { ascending: false }).range(6, 1000).then(restRes => {
                     if (restRes.data && !restRes.error) {
                         setCars(prev => {
                             const existingIds = new Set(prev.map(c => c.id));
                             const newCars = (restRes.data as Car[]).filter(c => !existingIds.has(c.id));
                             const combined = [...prev, ...newCars];
                             syncToLocalStorage('cars', combined);
                             return combined;
                         });
                     }
                 });
             }, 500); // Slight delay helps browser prioritize main UI render
           }
           if(bookingsRes.data) {
               setBookings(bookingsRes.data as Booking[]);
               syncToLocalStorage('bookings', bookingsRes.data);
               prevBookingsCount.current = bookingsRes.data.length;
           }
           if(messagesRes.data) {
               setMessages(messagesRes.data as ContactMessage[]);
               syncToLocalStorage('messages', messagesRes.data);
               prevMessagesCount.current = messagesRes.data.length;
           }
           if(auctionsRes.data) {
             setAuctions(auctionsRes.data as Auction[]);
             syncToLocalStorage('auctions', auctionsRes.data);
           }
           
           setIsConnected(true);
           setConnectionError(null);
           setTimeout(() => { isInitialLoad.current = false; }, 2000);
       } catch (err: any) {
           console.warn("Database offline. Falling back to LocalStorage.");
           setIsConnected(false);
           setConnectionError("Offline Mode");
           setCars(getFromLocalStorage('cars', []));
           setBookings(getFromLocalStorage('bookings', []));
           setMessages(getFromLocalStorage('messages', []));
           setAuctions(getFromLocalStorage('auctions', []));
       } finally {
           setIsLoading(false);
       }
    };
    
    fetchData();

    // Subscribe to realtime changes with optimized state updates instead of full refetch
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, payload => {
          if (payload.eventType === 'INSERT') setCars(prev => [payload.new as Car, ...prev]);
          else if (payload.eventType === 'UPDATE') setCars(prev => prev.map(c => c.id === payload.new.id ? payload.new as Car : c));
          else if (payload.eventType === 'DELETE') setCars(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
          if (payload.eventType === 'INSERT') setBookings(prev => [...prev, payload.new as Booking]);
          else if (payload.eventType === 'UPDATE') setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new as Booking : b));
          else if (payload.eventType === 'DELETE') setBookings(prev => prev.filter(b => b.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
          if (payload.eventType === 'INSERT') setMessages(prev => [payload.new as ContactMessage, ...prev]);
          else if (payload.eventType === 'UPDATE') setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new as ContactMessage : m));
          else if (payload.eventType === 'DELETE') setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, payload => {
          if (payload.eventType === 'INSERT') setAuctions(prev => [...prev, payload.new as Auction]);
          else if (payload.eventType === 'UPDATE') setAuctions(prev => prev.map(a => a.id === payload.new.id ? payload.new as Auction : a));
          else if (payload.eventType === 'DELETE') setAuctions(prev => prev.filter(a => a.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCar = async (car: Car) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const { id, ...carData } = car;
    const payload = {
        ...carData,
        id: tempId,
        createdAt: carData.createdAt || Date.now()
    } as Car;
    
    setCars(prev => {
      const newCars = [payload, ...prev];
      syncToLocalStorage('cars', newCars);
      return newCars;
    });
    
    if (isConnected) {
       await supabase.from('cars').insert(payload);
    }
  };

  const updateCar = async (updatedCar: Car) => {
    const payload = {
        ...updatedCar,
        createdAt: updatedCar.createdAt || Date.now()
    };

    setCars(prev => {
      const newCars = prev.map(c => c.id === updatedCar.id ? payload : c);
      syncToLocalStorage('cars', newCars);
      return newCars;
    });
    
    if (isConnected) {
       const { id, ...carData } = payload;
       await supabase.from('cars').update(carData).eq('id', updatedCar.id);
    }
  };

  const deleteCar = async (id: string) => {
    setCars(prev => {
      const newCars = prev.filter(c => c.id !== id);
      syncToLocalStorage('cars', newCars);
      return newCars;
    });
    
    if (isConnected) {
      await supabase.from('cars').delete().eq('id', id);
    }
  };

  const addBooking = async (booking: Booking) => {
    setBookings(prev => {
      const newBookings = [...prev, booking];
      syncToLocalStorage('bookings', newBookings);
      return newBookings;
    });
    if (isConnected) {
      const { id, ...bookingData } = booking;
      await supabase.from('bookings').insert(bookingData);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings(prev => {
      const newBookings = prev.map(b => b.id === id ? { ...b, status } : b);
      syncToLocalStorage('bookings', newBookings);
      return newBookings;
    });
    if (isConnected) {
      await supabase.from('bookings').update({ status }).eq('id', id);
    }
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => {
      const newBookings = prev.filter(b => b.id !== id);
      syncToLocalStorage('bookings', newBookings);
      return newBookings;
    });
    if (isConnected) {
      await supabase.from('bookings').delete().eq('id', id);
    }
  };

  const addMessage = async (message: ContactMessage) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      syncToLocalStorage('messages', newMessages);
      return newMessages;
    });
    if (isConnected) {
      const { id, ...msgData } = message;
      await supabase.from('messages').insert({ ...msgData, date: new Date(msgData.date).toISOString() });
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => {
      const newMessages = prev.filter(m => m.id !== id);
      syncToLocalStorage('messages', newMessages);
      return newMessages;
    });
    if (isConnected) {
      await supabase.from('messages').delete().eq('id', id);
    }
  };

  const createAuction = async (auction: Omit<Auction, 'id'>) => {
    const newAuction = { ...auction, id: Math.random().toString(36).substr(2, 9) } as Auction;
    setAuctions(prev => {
      const newAuctions = [...prev, newAuction];
      syncToLocalStorage('auctions', newAuctions);
      return newAuctions;
    });
    if (isConnected) {
      await supabase.from('auctions').insert(auction);
    }
  };

  const cancelAuction = async (id: string) => {
    setAuctions(prev => {
      const newAuctions = prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a);
      syncToLocalStorage('auctions', newAuctions);
      return newAuctions;
    });
    if (isConnected) {
      await supabase.from('auctions').update({ status: 'cancelled' }).eq('id', id);
    }
  };

  const placeBid = async (auctionId: string, bid: Bid): Promise<{ success: boolean; message: string }> => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return { success: false, message: "Licitația nu a fost găsită." };
    if (auction.status !== 'active') return { success: false, message: "Licitația nu mai este activă." };
    if (Date.now() > auction.endTime) return { success: false, message: "Timpul a expirat." };
    if (bid.amount <= auction.currentBid) return { success: false, message: `Oferta trebuie să fie mai mare decât ${auction.currentBid} €.` };

    let newEndTime = auction.endTime;
    let newExtensionCount = auction.extensionCount;
    const now = Date.now();
    const timeRemaining = auction.endTime - now;
    
    if (timeRemaining < 60000 && auction.extensionCount < 3) {
      newEndTime = auction.endTime + 600000;
      newExtensionCount = auction.extensionCount + 1;
    }

    const updatedData = {
      currentBid: bid.amount,
      bids: [...auction.bids, bid],
      endTime: newEndTime,
      extensionCount: newExtensionCount
    };

    setAuctions(prev => {
      const newAuctions = prev.map(a => a.id === auctionId ? { ...a, ...updatedData } : a);
      syncToLocalStorage('auctions', newAuctions);
      return newAuctions;
    });
    
    if (isConnected) {
      const { error } = await supabase.from('auctions').update(updatedData).eq('id', auctionId);
      if(error) {
         return { success: false, message: "Eroare rețea." };
      }
    }
    return { success: true, message: "Ofertă plasată cu succes!" };
  };

  return (
    <CarContext.Provider value={{ 
      cars, bookings, messages, auctions,
      addCar, updateCar, deleteCar, 
      addBooking, updateBookingStatus, deleteBooking,
      addMessage, deleteMessage,
      createAuction, placeBid, cancelAuction,
      requestNotificationPermission,
      isLoading, isConnected, connectionError, fcmToken
    }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};
