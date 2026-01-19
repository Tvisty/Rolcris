
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Car, Booking, ContactMessage, Auction, Bid } from '../types';
import { db, auth, messaging, getToken, onMessage } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

  const requestNotificationPermission = async () => {
    if (!messaging) {
      console.error("Firebase Messaging not initialized (Check network/HTTPS)");
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // VAPID Key from environment variables
        const vapidKey = process.env.VAPID_KEY;

        if (!vapidKey || vapidKey.includes('PASTE_YOUR')) {
           console.error("❌ VAPID KEY MISSING: Please add VAPID_KEY to .env or Vercel Settings.");
           alert("Eroare Configurare: Lipsește Cheia VAPID pentru notificări.");
           return null;
        }

        // Register Service Worker explicitly to ensure scope is correct
        let registration;
        try {
           // Ensure firebase-messaging-sw.js is in your PUBLIC folder
           registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
           console.log('✅ Service Worker Registered with scope:', registration.scope);
        } catch (swError) {
           console.error("❌ Service Worker Registration Failed:", swError);
           alert("Eroare: Service Worker nu a putut fi înregistrat. Verifică dacă fișierul firebase-messaging-sw.js este în folderul 'public'.");
           return null;
        }
            
        // Get Token
        try {
          const token = await getToken(messaging, { 
             vapidKey: vapidKey,
             serviceWorkerRegistration: registration 
          });
          
          if (token) {
            console.log('✅ FCM Token:', token);
            setFcmToken(token);
            // Optionally save this token to Firestore under a 'users/{uid}/tokens' collection
            return token;
          } else {
            console.warn('No registration token available. Request permission to generate one.');
          }
        } catch (tokenError) {
           console.error("❌ Error retrieving FCM token:", tokenError);
           alert("Eroare la obținerea token-ului de notificare.");
        }
      } else {
        alert("Permisiunea pentru notificări a fost refuzată.");
      }
    } catch (error) {
      console.error('An error occurred while retrieving token.', error);
    }
    return null;
  };

  useEffect(() => {
    // Listener for foreground messages
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('📩 Message received in foreground:', payload);
        // Show a simple browser notification if the app is in foreground
        const title = payload.notification?.title || 'Notificare Nouă';
        const options = {
          body: payload.notification?.body,
          icon: 'https://i.imgur.com/e7JOUNo.png'
        };
        
        // Check if browser supports Notification constructor
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
           new Notification(title, options);
        } else {
           // Fallback for when Notification API isn't fully available in context
           alert(`${title}: ${options.body}`);
        }
      });
    }
  }, []);

  const triggerLocalNotification = (title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
       try {
         new Notification(title, {
           body: body,
           icon: 'https://i.imgur.com/e7JOUNo.png'
         });
         // Also play a subtle sound
         const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
         audio.volume = 0.5;
         audio.play().catch(() => {});
       } catch (e) {
         console.log("Notification API error:", e);
       }
    }
  };

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined = undefined;
    let unsubscribeBookings: (() => void) | undefined = undefined;
    let unsubscribeMessages: (() => void) | undefined = undefined;
    let unsubscribeAuctions: (() => void) | undefined = undefined;

    const setupRealtimeListener = (user: any) => {
      if (!db) {
        setIsConnected(false);
        setConnectionError("Firebase not initialized");
        setCars([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setConnectionError(null);
      
      // Clean up previous listeners
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeAuctions) unsubscribeAuctions();

      console.log("🔄 Connecting to Firestore...");
      
      // 1. Cars Listener
      const qCars = query(collection(db, "cars"));
      unsubscribeSnapshot = onSnapshot(qCars, 
        (querySnapshot) => {
          setIsConnected(true);
          const carList: Car[] = [];
          querySnapshot.forEach((doc) => {
            carList.push({ ...doc.data(), id: doc.id } as Car);
          });
          setCars(carList);
          setIsLoading(false);
        }, 
        (error) => {
          handleFirestoreError(error);
        }
      );

      // 2. Bookings Listener (Ordered by date)
      const qBookings = query(collection(db, "bookings"), orderBy("date", "asc"));
      unsubscribeBookings = onSnapshot(qBookings, 
        (querySnapshot) => {
          const bookingList: Booking[] = [];
          querySnapshot.forEach((doc) => {
            bookingList.push({ ...doc.data(), id: doc.id } as Booking);
          });
          
          // NOTIFICATION LOGIC FOR BOOKINGS
          // Only trigger if not initial load and count increased
          if (!isInitialLoad.current && bookingList.length > prevBookingsCount.current) {
             const newBooking = bookingList[bookingList.length - 1]; // Approximation
             if (user) { // Only notify if admin is logged in (conceptually)
                triggerLocalNotification("O nouă programare!", `${newBooking.customerName} a solicitat ${newBooking.type}`);
             }
          }
          prevBookingsCount.current = bookingList.length;
          setBookings(bookingList);
        },
        (error) => console.warn("⚠️ Bookings fetch failed:", error.message)
      );

      // 3. Messages Listener (Ordered by date desc)
      const qMessages = query(collection(db, "messages"), orderBy("date", "desc"));
      unsubscribeMessages = onSnapshot(qMessages, 
        (querySnapshot) => {
          const messageList: ContactMessage[] = [];
          querySnapshot.forEach((doc) => {
            messageList.push({ ...doc.data(), id: doc.id } as ContactMessage);
          });

          // NOTIFICATION LOGIC FOR MESSAGES
          if (!isInitialLoad.current && messageList.length > prevMessagesCount.current) {
             const newMessage = messageList[0];
             if (user) {
                triggerLocalNotification("Mesaj Nou", `De la: ${newMessage.name}`);
             }
          }
          prevMessagesCount.current = messageList.length;
          
          setMessages(messageList);
        },
        (error) => console.warn("⚠️ Messages fetch failed:", error.message)
      );

      // 4. Auctions Listener
      const qAuctions = query(collection(db, "auctions"));
      unsubscribeAuctions = onSnapshot(qAuctions,
        (querySnapshot) => {
          const auctionList: Auction[] = [];
          querySnapshot.forEach((doc) => {
            auctionList.push({ ...doc.data(), id: doc.id } as Auction);
          });
          setAuctions(auctionList);
          
          // After first batch of data, disable initial load flag after a short delay
          setTimeout(() => { isInitialLoad.current = false; }, 2000);
        },
        (error) => console.warn("⚠️ Auctions fetch failed:", error.message)
      );
    };

    const handleFirestoreError = (error: any) => {
      let errorMessage = error.message;
      if (error.code === 'permission-denied') {
         console.warn("⚠️ Firestore Permission Denied.");
         errorMessage = "Permission Denied: Check Firestore Rules";
      } else if (error.code === 'unavailable') {
         errorMessage = "Network/Client Offline";
      }
      setConnectionError(errorMessage);
      setIsConnected(false);
      setIsLoading(false);
    }

    let unsubscribeAuth = () => {};
    if (auth) {
      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setupRealtimeListener(user);
      });
    }

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeAuctions) unsubscribeAuctions();
      unsubscribeAuth();
    };
  }, []);

  // --- CAR ACTIONS ---

  const addCar = async (car: Car) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    setCars(prev => [ { ...car, id: tempId }, ...prev ]);

    if (db && isConnected) {
      const { id, ...carData } = car;
      try {
        await addDoc(collection(db, "cars"), carData);
      } catch (e: any) {
        console.error("Add failed:", e);
        setCars(prev => prev.filter(c => c.id !== tempId));
      }
    }
  };

  const updateCar = async (updatedCar: Car) => {
    setCars(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
    if (db && isConnected) {
      try {
        const carRef = doc(db, "cars", updatedCar.id);
        const { id, ...carData } = updatedCar;
        await updateDoc(carRef, carData as any);
      } catch (e: any) {
        console.error("Update failed:", e);
      }
    }
  };

  const deleteCar = async (id: string) => {
    setCars(prev => prev.filter(c => c.id !== id));
    if (db && isConnected) {
      try {
        await deleteDoc(doc(db, "cars", id));
      } catch (e: any) {
        console.error("Delete failed:", e);
        alert(`Eroare la ștergere: ${e.message}`);
      }
    }
  };

  // --- BOOKING ACTIONS ---

  const addBooking = async (booking: Booking) => {
    if (db && isConnected) {
      const { id, ...bookingData } = booking;
      await addDoc(collection(db, "bookings"), bookingData);
    } else {
      setBookings(prev => [...prev, booking]);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (db && isConnected) {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, { status });
    }
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    if (db && isConnected) {
      await deleteDoc(doc(db, "bookings", id));
    }
  };

  // --- MESSAGE ACTIONS ---

  const addMessage = async (message: ContactMessage) => {
    if (db && isConnected) {
      const { id, ...msgData } = message;
      await addDoc(collection(db, "messages"), msgData);
    } else {
      setMessages(prev => [message, ...prev]);
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (db && isConnected) {
      await deleteDoc(doc(db, "messages", id));
    }
  };

  // --- AUCTION ACTIONS ---

  const createAuction = async (auction: Omit<Auction, 'id'>) => {
    if (db && isConnected) {
      await addDoc(collection(db, "auctions"), auction);
    } else {
      // Offline fallback for demo
      const newAuction = { ...auction, id: Math.random().toString(36).substr(2, 9) };
      setAuctions(prev => [...prev, newAuction]);
    }
  };

  const cancelAuction = async (id: string) => {
    if (db && isConnected) {
      await updateDoc(doc(db, "auctions", id), { status: 'cancelled' });
    } else {
      setAuctions(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
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
    
    // RULE: If bid is in the last minute (60000 ms) AND extension count < 3
    // Add 10 minutes (600000 ms)
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

    if (db && isConnected) {
      try {
        await updateDoc(doc(db, "auctions", auctionId), updatedData);
        return { success: true, message: "Ofertă plasată cu succes!" };
      } catch (e: any) {
        return { success: false, message: "Eroare de rețea." };
      }
    } else {
      setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, ...updatedData } : a));
      return { success: true, message: "Ofertă plasată (Demo Mode)!" };
    }
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
