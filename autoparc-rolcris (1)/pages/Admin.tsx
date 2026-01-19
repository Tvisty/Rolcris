
import React, { useState, useRef, useEffect } from 'react';
import { useCars } from '../context/CarContext';
import { Car, Booking, ContactMessage, Auction } from '../types';
import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { 
  Plus, Edit, Trash2, Save, X, Image as ImageIcon, 
  LogIn, LogOut, Search, DollarSign, 
  Calendar, Gauge, Zap, LayoutDashboard, Fuel, Settings, Upload, FileText, AlertTriangle, Wifi, WifiOff, HelpCircle, Copy, Check, Star, Loader2, Phone, User as UserIcon, Clock, Mail, Gavel, Timer, Bell, BellOff
} from 'lucide-react';
import { BRANDS, BODY_TYPES, FUELS } from '../constants';
import { Link } from 'react-router-dom';

// Image Compression Helper
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; 
        
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (id: string, status: Booking['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdateStatus, onDelete }) => {
  const isToday = new Date(booking.date).toDateString() === new Date().toDateString();
  
  // Badge Color Logic based on Booking Type
  const getTypeBadge = (type?: string) => {
    const t = type || 'General';
    switch(t) {
      case 'Test Drive': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Service': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Detailing': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'Finanțare': return 'bg-gold-500/10 text-gold-500 border-gold-500/20';
      case 'Info': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${isToday ? 'border-gold-500 bg-gold-500/5' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]'} shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center`}>
       <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg p-3 w-16 h-16 shrink-0">
         <span className="text-xs text-gray-500 uppercase font-bold">{new Date(booking.date).toLocaleString('ro-RO', { month: 'short' })}</span>
         <span className="text-2xl font-bold text-gray-900 dark:text-white">{new Date(booking.date).getDate()}</span>
       </div>
       
       <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
             <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
               <Clock size={12} /> {new Date(booking.date).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
             </span>
             
             {/* Dynamic Type Badge */}
             <span className={`px-2 py-0.5 rounded text-xs font-bold border uppercase ${getTypeBadge(booking.type)}`}>
               {booking.type || 'General'}
             </span>

             {booking.status === 'pending' && <span className="bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded text-xs font-bold">În Așteptare</span>}
             {booking.status === 'confirmed' && <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs font-bold">Confirmat</span>}
             {booking.status === 'completed' && <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-bold">Finalizat</span>}
             {booking.status === 'cancelled' && <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-xs font-bold">Anulat</span>}
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white text-lg">{booking.carName}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
             <span className="flex items-center gap-1"><UserIcon size={14} /> {booking.customerName}</span>
             <span className="flex items-center gap-1"><Phone size={14} /> {booking.customerPhone}</span>
          </div>
       </div>

       <div className="flex gap-2 shrink-0">
          {booking.status === 'pending' && (
            <button onClick={() => onUpdateStatus(booking.id, 'confirmed')} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
              <Check size={20} />
            </button>
          )}
          <button onClick={() => onDelete(booking.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
            <Trash2 size={20} />
          </button>
       </div>
    </div>
  );
};

const MessageCard: React.FC<{ message: ContactMessage, onDelete: (id: string) => Promise<void> }> = ({ message, onDelete }) => {
  return (
    <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
             <Mail size={20} />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 dark:text-white">{message.name}</h4>
             <p className="text-xs text-gray-500">{new Date(message.date).toLocaleString('ro-RO')}</p>
           </div>
        </div>
        <button onClick={() => onDelete(message.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
        "{message.message}"
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-100 dark:border-white/5 pt-3 mt-auto">
         <span className="flex items-center gap-1"><Mail size={14} /> {message.email}</span>
         <span className="flex items-center gap-1"><Phone size={14} /> {message.phone}</span>
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const { cars, bookings, messages, auctions, addCar, updateCar, deleteCar, updateBookingStatus, deleteBooking, deleteMessage, createAuction, cancelAuction, isConnected, requestNotificationPermission, fcmToken } = useCars();
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'calendar' | 'messages' | 'auctions'>('inventory');
  
  const [user, setUser] = useState<User | null>(null);
  const [isDemoAuth, setIsDemoAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auctionFileInputRef = useRef<HTMLInputElement>(null);

  // Auction Creation State
  const [auctionForm, setAuctionForm] = useState({
    make: 'BMW',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    fuel: 'Diesel',
    image: '',
    startBid: 1000,
    duration: 24,
    description: ''
  });

  const totalValue = cars.reduce((acc, c) => acc + (c.price || 0), 0);
  const totalCars = cars.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalMessages = messages.length;
  const activeAuctionsCount = auctions.filter(a => a.status === 'active').length;

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        alert('Autentificare eșuată: ' + error.message);
      }
    } else {
      if (password === 'admin123') {
        setIsDemoAuth(true);
      } else {
        alert('Mod Demo: Parola este "admin123"');
      }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    } else {
      setIsDemoAuth(false);
      setPassword('');
    }
  };

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      alert("Notificări activate cu succes!");
    } else {
      alert("Nu s-au putut activa notificările. Verifică setările browserului.");
    }
  };

  const handleAddNew = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setCurrentCar({
      id: isConnected ? undefined : newId,
      make: 'BMW',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuel: 'Diesel',
      transmission: 'Automată',
      bodyType: 'SUV',
      power: 0,
      engineSize: '',
      vin: '',
      images: [],
      description: '',
      features: [],
      seats: 5,
      isHotDeal: false
    });
    setFeatureInput('');
    setImageInput('');
    setIsEditing(true);
  };

  const handleEdit = (car: Car) => {
    setCurrentCar({ ...car });
    setFeatureInput('');
    setImageInput('');
    setIsEditing(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    setDeletingId(id);
    try {
      await deleteCar(id);
    } catch (error: any) {
      alert("Eroare la ștergere: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  const handleSave = async () => {
    if (!currentCar.make || !currentCar.model || !currentCar.price) {
      alert('Te rog completează câmpurile obligatorii: Marca, Model, Preț.');
      return;
    }

    const cleanedCar = {
      ...currentCar,
      images: (currentCar.images && currentCar.images.length > 0) 
        ? currentCar.images 
        : ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"],
      features: currentCar.features || []
    } as Car;

    const jsonSize = new Blob([JSON.stringify(cleanedCar)]).size;
    if (jsonSize > 1000000) {
      alert(`Atenție! Dimensiunea datelor (${(jsonSize/1024/1024).toFixed(2)} MB) depășește limita admisă de 1MB. Te rog șterge câteva poze sau încearcă din nou.`);
      return;
    }

    const exists = cars.find(c => c.id === cleanedCar.id);
    if (exists) {
      await updateCar(cleanedCar);
    } else {
      await addCar(cleanedCar);
    }
    setIsEditing(false);
    setCurrentCar({});
  };

  const handleStartAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auctionForm.make || !auctionForm.model || !auctionForm.startBid) {
      alert("Marca, Modelul și Prețul de pornire sunt obligatorii.");
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + (auctionForm.duration * 60 * 60 * 1000);

    const newAuction: Omit<Auction, 'id'> = {
      carId: Math.random().toString(36).substr(2, 9),
      carMake: auctionForm.make,
      carModel: auctionForm.model,
      carYear: auctionForm.year,
      carMileage: auctionForm.mileage,
      carFuel: auctionForm.fuel,
      carImage: auctionForm.image || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop",
      carDescription: auctionForm.description,
      startTime,
      endTime,
      startingBid: auctionForm.startBid,
      currentBid: auctionForm.startBid,
      bids: [],
      status: 'active',
      extensionCount: 0
    };

    await createAuction(newAuction);
    alert("Licitație pornită cu succes!");
    // Reset form
    setAuctionForm({
      make: 'BMW',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      fuel: 'Diesel',
      image: '',
      startBid: 1000,
      duration: 24,
      description: ''
    });
  };

  const addFeature = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && featureInput.trim()) {
      e.preventDefault();
      setCurrentCar({
        ...currentCar,
        features: [...(currentCar.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(currentCar.features || [])];
    newFeatures.splice(index, 1);
    setCurrentCar({ ...currentCar, features: newFeatures });
  };

  const addImage = () => {
    let url = imageInput.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      setCurrentCar({
        ...currentCar,
        images: [...(currentCar.images || []), url]
      });
      setImageInput('');
    }
  };

  const handleImageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsCompressing(true);
      const fileArray = Array.from(files) as File[];
      const uploadedImages: string[] = [];
      
      try {
        for (const file of fileArray) {
           const compressedBase64 = await compressImage(file);
           try {
             if (!storage) throw new Error("Firebase Storage not available");
             const fileName = `car-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
             const storageRef = ref(storage, fileName);
             await uploadString(storageRef, compressedBase64, 'data_url');
             const downloadURL = await getDownloadURL(storageRef);
             uploadedImages.push(downloadURL);
           } catch (storageError) {
             console.warn("Storage upload failed, falling back to compressed base64:", storageError);
             uploadedImages.push(compressedBase64);
           }
        }
        setCurrentCar(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedImages]
        }));
      } catch (error) {
        console.error("Image processing error:", error);
        alert("Eroare la procesarea imaginilor.");
      } finally {
        setIsCompressing(false);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAuctionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsCompressing(true);
      const file = files[0];
      
      try {
           const compressedBase64 = await compressImage(file);
           try {
             if (!storage) throw new Error("Firebase Storage not available");
             const fileName = `auction-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
             const storageRef = ref(storage, fileName);
             await uploadString(storageRef, compressedBase64, 'data_url');
             const downloadURL = await getDownloadURL(storageRef);
             setAuctionForm(prev => ({ ...prev, image: downloadURL }));
           } catch (storageError) {
             console.warn("Storage upload failed, falling back to compressed base64:", storageError);
             setAuctionForm(prev => ({ ...prev, image: compressedBase64 }));
           }
      } catch (error) {
        console.error("Image processing error:", error);
        alert("Eroare la procesarea imaginilor.");
      } finally {
        setIsCompressing(false);
      }
    }
    if (auctionFileInputRef.current) auctionFileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...(currentCar.images || [])];
    newImages.splice(index, 1);
    setCurrentCar({ ...currentCar, images: newImages });
  };

  const setAsCover = (index: number) => {
    if (index === 0 || !currentCar.images) return;
    const newImages = [...currentCar.images];
    const imageToMove = newImages[index];
    newImages.splice(index, 1); 
    newImages.unshift(imageToMove);
    setCurrentCar({ ...currentCar, images: newImages });
  };

  const filteredInventory = cars.filter(c => 
    c.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SetupGuide = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] w-full max-w-2xl rounded-2xl border border-gold-500/30 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">Configurare Firebase</h2>
            <button onClick={() => setShowSetup(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
          </div>
          <p className="text-gray-400 mb-4">Introduceți credențialele proiectului dvs. în `firebase.ts` pentru a activa baza de date în timp real.</p>
        </div>
        <div className="bg-white/5 p-6 flex justify-end">
          <button onClick={() => setShowSetup(false)} className="bg-gold-500 text-black font-bold py-2 px-6 rounded-lg">Am înțeles</button>
        </div>
      </div>
    </div>
  );

  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-display">Se încarcă...</div>;
  const isAuthenticated = user || isDemoAuth;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-4">
        {showSetup && <SetupGuide />}
        <div className="glass-panel w-full max-w-md p-10 rounded-3xl border border-white/10 bg-[#121212]/60 backdrop-blur-2xl shadow-2xl">
          <div className="text-center mb-8">
            <img src="https://i.imgur.com/e7JOUNo.png" alt="Logo" className="h-20 mx-auto mb-6 object-contain" />
            <h1 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-widest">Admin Portal</h1>
            <div className="flex justify-center mt-4">
              {isConnected ? (
                 <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-500 text-xs flex items-center gap-2">
                    <Wifi size={14} /><span>Sistem Online</span>
                 </div>
              ) : (
                <button onClick={() => setShowSetup(true)} className="bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs flex items-center gap-2 rounded-lg">
                  <WifiOff size={14} /><span>Offline / Configurare</span>
                </button>
              )}
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type={auth ? "email" : "text"} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" placeholder="Email / Utilizator" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" placeholder="Parolă" />
            <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
              <LogIn size={20} /> Autentificare
            </button>
          </form>
          <div className="mt-8 text-center"><Link to="/" className="text-gray-500 hover:text-white text-sm">← Înapoi la Site</Link></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-12">
      {showSetup && <SetupGuide />}
      
      {pendingDeleteId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl border border-red-500/30 shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><AlertTriangle size={48} /></div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">Atenție!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Ești sigur că vrei să ștergi acest anunț definitiv?</p>
            <div className="flex gap-4">
              <button onClick={() => setPendingDeleteId(null)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold">Anulează</button>
              <button onClick={confirmDelete} className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-2"><Trash2 size={18} /> Șterge</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3"><LayoutDashboard className="text-gold-500" /> Dashboard Dealer</h1>
            <div className="flex items-center gap-2 mt-2">
               {isConnected ? (
                 <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20 font-bold">ONLINE</span>
               ) : (
                 <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded border border-red-500/20 font-bold">OFFLINE</span>
               )}
               {fcmToken ? (
                 <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded border border-blue-500/20 font-bold flex items-center gap-1"><Bell size={10} /> NOTIFICĂRI ACTIVE</span>
               ) : (
                 <button onClick={handleEnableNotifications} className="bg-gray-100 dark:bg-white/10 text-gray-500 text-xs px-2 py-1 rounded border border-gray-300 dark:border-white/10 font-bold flex items-center gap-1 hover:bg-gold-500 hover:text-black transition-colors"><BellOff size={10} /> ACTIVEAZĂ NOTIFICĂRI</button>
               )}
            </div>
          </div>
          <div className="flex gap-4">
             <Link to="/" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white hover:bg-white/5 transition-colors">Vezi Website</Link>
             <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 font-bold transition-all">Deconectare</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Valoare Stoc</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{totalValue.toLocaleString()} €</h3>
          </div>
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10" onClick={() => setActiveTab('calendar')}>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Programări (Noi)</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {pendingBookings}
              {pendingBookings > 0 && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
            </h3>
          </div>
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 cursor-pointer hover:border-gold-500/50 transition-colors" onClick={() => setActiveTab('messages')}>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Mesaje Contact</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {totalMessages}
            </h3>
          </div>
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 cursor-pointer hover:border-gold-500/50 transition-colors" onClick={() => setActiveTab('auctions')}>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Licitații Active</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {activeAuctionsCount}
            </h3>
          </div>
        </div>

        <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('inventory')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'inventory' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-white'}`}
           >
             Gestiune Stoc
           </button>
           <button 
             onClick={() => setActiveTab('auctions')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'auctions' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-white'}`}
           >
             Licitații
           </button>
           <button 
             onClick={() => setActiveTab('calendar')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'calendar' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-white'}`}
           >
             Calendar Programări
           </button>
           <button 
             onClick={() => setActiveTab('messages')}
             className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'messages' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-white'}`}
           >
             Mesaje
           </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-[#121212] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Căutare după marcă..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-100 dark:bg-white/5 border border-transparent focus:border-gold-500 rounded-lg py-2.5 pl-10 text-gray-900 dark:text-white outline-none" />
              </div>
              <button onClick={handleAddNew} className="w-full md:w-auto bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:scale-[1.05] transition-all">
                <Plus size={20} /> Adaugă în Stoc
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredInventory.map(car => (
                <div key={car.id} className="group glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#121212] hover:border-gold-500/50 transition-all shadow-sm">
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={car.images[0]} 
                      alt={car.model} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                         // Fixes image issue by showing fallback
                         e.currentTarget.src = "https://placehold.co/600x400/121212/C5A059?text=Link+Invalid";
                      }}
                    />
                    {car.isHotDeal && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase">HOT</div>}
                  </div>
                  <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gold-500 transition-colors">{car.make} {car.model}</h3>
                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded border border-gray-200 dark:border-white/10 font-mono">{car.id}</span>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-gold-500"/> {car.year}</span>
                      <span className="flex items-center gap-1"><Gauge size={14} className="text-gold-500"/> {car.mileage?.toLocaleString()} km</span>
                      <span className="flex items-center gap-1"><Fuel size={14} className="text-gold-500"/> {car.fuel}</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{car.price?.toLocaleString()} €</div>
                  </div>
                  <div className="flex md:flex-col gap-3 shrink-0 relative mt-4 md:mt-0">
                    <button onClick={() => handleEdit(car)} className="px-5 py-2.5 bg-gray-100 dark:bg-white/10 rounded-xl text-gray-700 dark:text-white hover:bg-gold-500 hover:text-black transition-all flex items-center justify-center gap-2 text-sm font-bold">
                      <Edit size={16} /> Editează
                    </button>
                    <button onClick={(e) => handleDeleteClick(e, car.id)} disabled={deletingId === car.id} className="px-5 py-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold border border-red-500/20">
                      {deletingId === car.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}Șterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'auctions' && (
          <div className="animate-fade-in space-y-8">
             <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/10 mb-8">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Plus className="text-gold-500" /> Start Licitație Nouă</h3>
               <form onSubmit={handleStartAuction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  
                  {/* Row 1 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Marca</label>
                    <select 
                      value={auctionForm.make} 
                      onChange={(e) => setAuctionForm({...auctionForm, make: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500"
                    >
                      {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Model</label>
                    <input 
                      type="text" 
                      value={auctionForm.model} 
                      onChange={(e) => setAuctionForm({...auctionForm, model: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                      placeholder="Ex: Seria 5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">An</label>
                    <input 
                      type="number" 
                      value={auctionForm.year} 
                      onChange={(e) => setAuctionForm({...auctionForm, year: Number(e.target.value)})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Rulaj (km)</label>
                    <input 
                      type="number" 
                      value={auctionForm.mileage} 
                      onChange={(e) => setAuctionForm({...auctionForm, mileage: Number(e.target.value)})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Combustibil</label>
                    <select 
                      value={auctionForm.fuel} 
                      onChange={(e) => setAuctionForm({...auctionForm, fuel: e.target.value})} 
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500"
                    >
                      {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Imagine (URL sau Upload)</label>
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={auctionForm.image} 
                          onChange={(e) => setAuctionForm({...auctionForm, image: e.target.value})} 
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                          placeholder="https://..."
                        />
                        <input type="file" ref={auctionFileInputRef} onChange={handleAuctionFileUpload} accept="image/*" className="hidden" />
                        <button 
                          type="button" 
                          onClick={() => auctionFileInputRef.current?.click()} 
                          className="bg-gold-500 text-black px-4 rounded-lg hover:bg-gold-600 transition-all flex items-center justify-center" 
                          disabled={isCompressing}
                        >
                          {isCompressing ? <Loader2 className="animate-spin"/> : <Upload size={20} />}
                        </button>
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Preț Pornire (€)</label>
                     <input type="number" value={auctionForm.startBid} onChange={(e) => setAuctionForm({...auctionForm, startBid: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" />
                  </div>
                  
                  {/* Row 3 */}
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Durată (Ore)</label>
                     <input type="number" value={auctionForm.duration} onChange={(e) => setAuctionForm({...auctionForm, duration: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Descriere Scurtă</label>
                     <input type="text" value={auctionForm.description} onChange={(e) => setAuctionForm({...auctionForm, description: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" placeholder="Ex: Stare perfectă, unic proprietar..." />
                  </div>
                  
                  <button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 rounded-lg shadow-lg">
                    Pornește
                  </button>
               </form>
             </div>

             <div className="space-y-4">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Licitații Active</h3>
               {auctions.filter(a => a.status === 'active' && Date.now() < a.endTime).map(auction => (
                 <div key={auction.id} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]">
                    <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                       <img src={auction.carImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-lg font-bold text-gray-900 dark:text-white">{auction.carMake} {auction.carModel}</h4>
                       <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span>Start: {auction.startingBid} €</span>
                          <span className="text-gold-500 font-bold">Curent: {auction.currentBid} €</span>
                          <span>Oferte: {auction.bids.length}</span>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Timer size={16} /> 
                          {new Date(auction.endTime).toLocaleString()}
                       </div>
                       <button onClick={() => cancelAuction(auction.id)} className="text-red-500 text-sm font-bold border border-red-500/20 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors">
                          Anulează
                       </button>
                    </div>
                 </div>
               ))}
               {auctions.filter(a => a.status === 'active' && Date.now() < a.endTime).length === 0 && (
                 <p className="text-gray-500 italic">Nu există licitații active.</p>
               )}
             </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="animate-fade-in space-y-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Programări Test Drive</h3>
            
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-white/10">
                <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Nu există programări în acest moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                 {bookings.filter(b => b.status === 'pending').length > 0 && (
                   <div className="mb-8">
                      <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-orange-500/20 pb-2">În Așteptare</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookings.filter(b => b.status === 'pending').map(booking => (
                          <BookingCard key={booking.id} booking={booking} onUpdateStatus={updateBookingStatus} onDelete={deleteBooking} />
                        ))}
                      </div>
                   </div>
                 )}

                 <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Toate Programările</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {bookings.filter(b => b.status !== 'pending').map(booking => (
                        <BookingCard key={booking.id} booking={booking} onUpdateStatus={updateBookingStatus} onDelete={deleteBooking} />
                      ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="animate-fade-in space-y-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mesaje Contact</h3>
            
            {messages.length === 0 ? (
               <div className="text-center py-20 bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-white/10">
                <Mail className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Nu aveți mesaje noi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map(msg => (
                  <MessageCard key={msg.id} message={msg} onDelete={deleteMessage} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121212] w-full max-w-6xl h-[90vh] rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-[#121212]">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {currentCar.id ? <Edit className="text-gold-500"/> : <Plus className="text-gold-500"/>}
                {currentCar.make ? `${currentCar.make} ${currentCar.model}` : 'Adăugare Autoturism Nou'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  <div className="space-y-6">
                     <h3 className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2"><Settings size={16} /> Detalii Tehnice</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Marca</label>
                          <select value={currentCar.make} onChange={(e) => setCurrentCar({...currentCar, make: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500 transition-all">{BRANDS.map(b => <option key={b} value={b} className="bg-white dark:bg-[#121212]">{b}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Model</label>
                          <input type="text" value={currentCar.model} onChange={(e) => setCurrentCar({...currentCar, model: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" placeholder="Ex: Seria 5, GLE 350d" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Preț (€)</label>
                          <input type="number" value={currentCar.price} onChange={(e) => setCurrentCar({...currentCar, price: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-bold outline-none focus:border-gold-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">An</label>
                          <input type="number" value={currentCar.year} onChange={(e) => setCurrentCar({...currentCar, year: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Rulaj (km)</label>
                          <input type="number" value={currentCar.mileage} onChange={(e) => setCurrentCar({...currentCar, mileage: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Putere (CP)</label>
                          <input type="number" value={currentCar.power} onChange={(e) => setCurrentCar({...currentCar, power: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Combustibil</label>
                          <select value={currentCar.fuel} onChange={(e) => setCurrentCar({...currentCar, fuel: e.target.value as any})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500">{FUELS.map(f => <option key={f} value={f} className="bg-white dark:bg-[#121212]">{f}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Transmisie</label>
                          <select value={currentCar.transmission} onChange={(e) => setCurrentCar({...currentCar, transmission: e.target.value as any})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500"><option value="Automată" className="bg-white dark:bg-[#121212]">Automată</option><option value="Manuală" className="bg-white dark:bg-[#121212]">Manuală</option></select>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Caroserie</label>
                          <select value={currentCar.bodyType} onChange={(e) => setCurrentCar({...currentCar, bodyType: e.target.value as any})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500">{BODY_TYPES.map(b => <option key={b} value={b} className="bg-white dark:bg-[#121212]">{b}</option>)}</select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Motor (Ex: 3.0L)</label>
                          <input type="text" value={currentCar.engineSize} onChange={(e) => setCurrentCar({...currentCar, engineSize: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" placeholder="Ex: 2.0 TDI" />
                        </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Serie Șasiu (VIN)</label>
                       <input type="text" value={currentCar.vin} onChange={(e) => setCurrentCar({...currentCar, vin: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500 font-mono uppercase" placeholder="VF1..." />
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                        <input type="checkbox" id="isHotDeal" checked={currentCar.isHotDeal} onChange={(e) => setCurrentCar({...currentCar, isHotDeal: e.target.checked})} className="w-5 h-5 accent-gold-500 cursor-pointer" />
                        <label htmlFor="isHotDeal" className="cursor-pointer flex-1 font-bold text-gray-900 dark:text-white">Marchează ca Oferta Specială (HOT DEAL)</label>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Dotări (Adaugă și apasă Enter)</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus-within:border-gold-500 transition-all">
                           {currentCar.features?.map((f, i) => (
                             <span key={i} className="bg-gold-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">{f}<button onClick={() => removeFeature(i)}><X size={12}/></button></span>
                           ))}
                           <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={addFeature} className="bg-transparent outline-none text-sm text-gray-900 dark:text-white flex-1 min-w-[100px]" placeholder="Tastează dotare..." />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2"><ImageIcon size={16} /> Galerie & Descriere</h3>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Galerie Foto (URL sau Upload)</label>
                        <div className="flex gap-2 mb-4">
                           <input type="text" value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={handleImageInputKeyDown} className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500 text-sm" placeholder="Adaugă link imagine..." />
                           <button onClick={addImage} className="bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white px-4 rounded-lg hover:bg-gold-500 hover:text-black transition-all"><Plus size={20} /></button>
                           <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
                           <button onClick={() => fileInputRef.current?.click()} className="bg-gold-500 text-black px-4 rounded-lg hover:bg-gold-600 transition-all" disabled={isCompressing}>{isCompressing ? <Loader2 className="animate-spin"/> : <Upload size={20} />}</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto p-1 custom-scrollbar">
                           {currentCar.images?.map((img, idx) => (
                             <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 group bg-gray-100 dark:bg-white/5">
                               <img 
                                 src={img} 
                                 alt="preview" 
                                 className="w-full h-full object-cover" 
                                 onError={(e) => {
                                   e.currentTarget.src = "https://placehold.co/600x400/121212/C5A059?text=Link+Invalid";
                                   e.currentTarget.className = "w-full h-full object-cover opacity-50"; 
                                 }}
                               />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button onClick={() => setAsCover(idx)} className="bg-white p-2 rounded-full text-gold-500 shadow-xl hover:scale-110 transition-all"><Star size={14} fill={idx === 0 ? "currentColor" : "none"} /></button>
                                  <button onClick={() => removeImage(idx)} className="bg-red-500 p-2 rounded-full text-white shadow-xl hover:scale-110 transition-all"><Trash2 size={14} /></button>
                                </div>
                                {idx === 0 && <div className="absolute top-0 right-0 bg-gold-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-bl">COPERTA</div>}
                             </div>
                           ))}
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Descriere Detaliată</label>
                        <textarea value={currentCar.description} onChange={(e) => setCurrentCar({...currentCar, description: e.target.value})} className="w-full h-64 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-4 text-gray-900 dark:text-white outline-none focus:border-gold-500 text-sm leading-relaxed" placeholder="Introduceți detaliile despre revizii, stare, opțiuni speciale..." />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#121212] flex justify-end gap-4">
               <button onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-white font-bold hover:bg-white/10 transition-all">Anulează</button>
               <button onClick={handleSave} className="px-10 py-3 rounded-xl bg-gold-500 text-black font-bold hover:bg-gold-600 shadow-xl transition-all flex items-center gap-2"><Save size={20} /> Salvează în Sistem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
