
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
           icon: 'https://i.imgur.com/e7JOUNo.png'
         });
         const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
         audio.volume = 0.5;
         audio.play().catch(() => {});
       } catch (e) {
         console.log("Notification API error:", e);
       }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
       setIsLoading(true);
       try {
           const [carsRes, bookingsRes, messagesRes, auctionsRes] = await Promise.all([
               supabase.from('cars').select('*').order('createdAt', { ascending: false }),
               supabase.from('bookings').select('*').order('date', { ascending: true }),
               supabase.from('messages').select('*').order('date', { ascending: false }),
               supabase.from('auctions').select('*')
           ]);
           
           if(carsRes.data) setCars(carsRes.data as Car[]);
           if(bookingsRes.data) {
               setBookings(bookingsRes.data as Booking[]);
               prevBookingsCount.current = bookingsRes.data.length;
           }
           if(messagesRes.data) {
               setMessages(messagesRes.data as ContactMessage[]);
               prevMessagesCount.current = messagesRes.data.length;
           }
           if(auctionsRes.data) setAuctions(auctionsRes.data as Auction[]);
           
           setIsConnected(true);
           setConnectionError(null);
           setTimeout(() => { isInitialLoad.current = false; }, 2000);
       } catch (err: any) {
           setIsConnected(false);
           setConnectionError(err.message);
       } finally {
           setIsLoading(false);
       }
    };
    
    fetchData();

    // Subscribe to realtime changes
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, payload => {
         fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
         fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
         fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, payload => {
         fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCar = async (car: Car) => {
    const { id, ...carData } = car;
    const tempId = Math.random().toString(36).substr(2, 9);
    setCars(prev => [{ ...car, id: tempId }, ...prev]); // optimistic
    
    const payload = {
        ...carData,
        id: tempId,
        createdAt: carData.createdAt || Date.now()
    };
    await supabase.from('cars').insert(payload);
  };

  const updateCar = async (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
    const { id, ...carData } = updatedCar;
    
    const payload = {
        ...carData,
        createdAt: carData.createdAt || Date.now()
    }
    
    await supabase.from('cars').update(payload).eq('id', id);
  };

  const deleteCar = async (id: string) => {
    const carToDelete = cars.find(c => c.id === id);
    if (carToDelete && carToDelete.images) {
      const deletePromises = carToDelete.images.map(async (imgUrl) => {
        if (imgUrl.includes('supabase.co')) {
          try {
             // extract path
             const parts = imgUrl.split('/car-images/');
             if(parts.length > 1) {
                 const path = parts[1];
                 await supabase.storage.from('car-images').remove([path]);
             }
          } catch (e) {
             console.warn('Storage delete err:', e);
          }
        }
      });
      await Promise.all(deletePromises);
    }
    
    setCars(prev => prev.filter(c => c.id !== id));
    await supabase.from('cars').delete().eq('id', id);
  };

  const addBooking = async (booking: Booking) => {
    const { id, ...bookingData } = booking;
    await supabase.from('bookings').insert(bookingData);
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    await supabase.from('bookings').update({ status }).eq('id', id);
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    await supabase.from('bookings').delete().eq('id', id);
  };

  const addMessage = async (message: ContactMessage) => {
    const { id, ...msgData } = message;
    await supabase.from('messages').insert({ ...msgData, date: new Date(msgData.date).toISOString() });
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await supabase.from('messages').delete().eq('id', id);
  };

  const createAuction = async (auction: Omit<Auction, 'id'>) => {
    await supabase.from('auctions').insert(auction);
  };

  const cancelAuction = async (id: string) => {
    setAuctions(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    await supabase.from('auctions').update({ status: 'cancelled' }).eq('id', id);
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

    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, ...updatedData } : a));
    const { error } = await supabase.from('auctions').update(updatedData).eq('id', auctionId);
    
    if(error) {
       return { success: false, message: "Eroare de rețea." };
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
