
import React, { useState, useRef, useEffect } from 'react';
import { useCars } from '../context/CarContext';
import { useTheme } from '../context/ThemeContext';
import { Car, Booking, ContactMessage, Auction, HolidayPrize } from '../types';
import { auth, db, storage } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Plus, Edit, Trash2, Save, X, Image as ImageIcon, 
  LogIn, Search, 
  Calendar, Gauge, LayoutDashboard, Fuel, Settings, Upload, AlertTriangle, Wifi, WifiOff, Check, Star, Loader2, Phone, User as UserIcon, Clock, Mail, Gavel, Timer, Bell, BellOff, Info, Link as LinkIcon, Clipboard, CloudUpload, ChevronLeft, ChevronRight, Heart, Gift, Tag, Database, RefreshCw, PauseCircle, Wrench, AlertCircle
} from 'lucide-react';
import { BRANDS, BODY_TYPES, FUELS, CAR_FEATURES, LOCATIONS, POLLUTION_STANDARDS, TRACTIONS } from '../constants';
import { Link } from 'react-router-dom';

// --- ULTRA-ROBUST COMPRESSOR V2 (WebP Edition - 1920px @ 85%) ---
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Procesarea imaginii a durat prea mult."));
    }, 8000);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        clearTimeout(timeoutId);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const MAX_WIDTH = 1920; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
            resolve(event.target?.result as string); 
            return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // CHANGED: Quality set to 0.85 (85%)
        const dataUrl = canvas.toDataURL('image/webp', 0.85); 
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Imaginea este coruptă."));
      };
    };
    
    reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Nu s-a putut citi fișierul."));
    };
  });
};

// Helper: Compress Base64 String -> WebP Base64 (85% Quality)
const recompressBase64ToWebP = (base64String: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String.startsWith('data:') ? base64String : `data:image/jpeg;base64,${base64String}`;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const MAX_WIDTH = 1920;
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            if (!ctx) { resolve(base64String); return; }

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            // CHANGED: Quality set to 0.85 (85%)
            resolve(canvas.toDataURL('image/webp', 0.85));
        };
        img.onerror = (e) => reject(e);
    });
};

const isLegacyImage = (img: string) => !img.startsWith('http') && img.length > 50;

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus: (id: string, status: Booking['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdateStatus, onDelete }) => {
  const isToday = new Date(booking.date).toDateString() === new Date().toDateString();
  
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
  const { seasonalTheme, setSeasonalTheme, holidayPrize, saveHolidayPrize } = useTheme();

  const [activeTab, setActiveTab] = useState<'inventory' | 'calendar' | 'messages' | 'auctions' | 'settings'>('inventory');
  const [user, setUser] = useState<User | null>(null);
  const [isDemoAuth, setIsDemoAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  
  // Custom Modal State (replaces window.confirm/alert)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  });

  const [migratingId, setMigratingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [featureInput, setFeatureInput] = useState('');
  const [featureSearch, setFeatureSearch] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [uploadingCount, setUploadingCount] = useState(0); 
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auctionFileInputRef = useRef<HTMLInputElement>(null);
  const prizeFileInputRef = useRef<HTMLInputElement>(null);
  
  // Upload States
  const [isAuctionUploading, setIsAuctionUploading] = useState(false); 
  const [isPrizeUploading, setIsPrizeUploading] = useState(false);

  // Prize & Auction Forms
  const [prizeForm, setPrizeForm] = useState<HolidayPrize>({ isEnabled: false, image: '', title: '', description: '', buttonLink: '' });
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

  // Derived Values
  const totalValue = cars.reduce((acc, c) => acc + (c.price || 0), 0);
  const totalCars = cars.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalMessages = messages.length;

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

  useEffect(() => {
    if (holidayPrize) setPrizeForm(holidayPrize);
  }, [holidayPrize]);

  useEffect(() => {
    if ('Notification' in window) setPermissionStatus(Notification.permission);
  }, []);

  // --- MODAL HELPERS ---
  const showAlert = (title: string, message: string) => {
    setModalConfig({ isOpen: true, type: 'alert', title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };

  const handleModalClose = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalConfirm = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
    handleModalClose();
  };

  // --- ACTIONS ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        showAlert('Eroare Autentificare', error.message);
      }
    } else {
      if (password === 'admin123') {
        setIsDemoAuth(true);
      } else {
        showAlert('Eroare', 'Parola pentru Mod Demo este "admin123"');
      }
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    else {
      setIsDemoAuth(false);
      setPassword('');
    }
  };

  const handleEnableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      showAlert("Succes", "Notificări activate cu succes!");
      setPermissionStatus('granted');
    } else {
      if ('Notification' in window) setPermissionStatus(Notification.permission);
    }
  };

  // --- SAFE MANUAL REPAIR ---
  const handleFixCarImages = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation();
    if (!storage) {
        showAlert("Eroare", "Storage nu este configurat.");
        return;
    }
    
    showConfirm(
      "Reparare Imagini",
      `Ești sigur că vrei să repari imaginile pentru ${car.make} ${car.model}?\n\nProcesul va:\n1. Converti imaginile la WebP (rapid, 85% calitate)\n2. Redimensiona la 1920px\n3. Muta fișierele în Cloud Storage.`,
      async () => {
        setMigratingId(car.id);
        const newImages: string[] = [];
        let hasChanges = false;

        try {
            for (const img of car.images) {
                if (isLegacyImage(img)) {
                    try {
                        console.log("Compressing legacy image...");
                        // 1. Re-compress legacy string to optimized WebP base64
                        const webpBase64 = await recompressBase64ToWebP(img);
                        
                        // 2. Upload the optimized WebP to Storage
                        const fileName = `car-images/restored/${car.id}_${Math.random().toString(36).substr(2, 9)}.webp`;
                        const storageRef = ref(storage, fileName);
                        
                        const metadata = {
                          cacheControl: 'public, max-age=31536000, immutable',
                          contentType: 'image/webp'
                        };

                        // ADDED METADATA FOR CACHING
                        await uploadString(storageRef, webpBase64, 'data_url', metadata);
                        const url = await getDownloadURL(storageRef);
                        
                        newImages.push(url);
                        hasChanges = true;
                    } catch (err) {
                        console.error("Failed to fix image:", err);
                        newImages.push(img);
                    }
                } else {
                    newImages.push(img);
                }
            }

            if (hasChanges) {
                await updateCar({ ...car, images: newImages });
                showAlert("Succes", `Imaginile pentru ${car.make} ${car.model} au fost optimizate și reparate.`);
            } else {
                showAlert("Info", "Nu au fost găsite imagini de reparat pentru această mașină.");
            }

        } catch (error: any) {
            showAlert("Eroare", error.message);
        } finally {
            setMigratingId(null);
        }
      }
    );
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
      description: `✅ Garanție și Încredere
🛡️ Garanție 12 luni inclusă pentru motor și cutia de viteze.
🧾 Factură fiscală pentru fiecare achiziție.
🛣️ Kilometraj garantat și verificabil (fără surprize neplăcute!).

💳 Finanțare Flexibilă (Rate fixe)
🆓 0% Avans – Pleci cu mașina doar cu buletinul!
👥 Persoane Fizice: Salariați sau pensionari (18-75 ani).
⏱️ Perioadă flexibilă: Creditare între 12 și 60 de luni.
🌍 Contracte din străinătate: Acceptăm venituri externe.
📉 Istoric Negativ? Avem soluții de credit online și pentru tine.
💼 Persoane Juridice: Oferte dedicate de Leasing Auto.

🔄 Servicii Buy-Back
🚗 Mașina ta poate fi avansul! Evaluăm corect autoturismul tău actual pentru a-l folosi ca plată pentru cel nou.

📋 Birocrație? Ne ocupăm noi!
Oferim servicii complete prin biroul nostru de intermedieri:
📑 Dosar complet pentru înmatriculare și acte auto.
🏎️ Programare și efectuare omologare RAR.
🔴 Obținere numere roșii (autorizație provizorie).`,
      features: [],
      seats: 5,
      doors: 5,
      isHotDeal: false,
      isSold: false,
      location: 'Satu Mare',
      pollutionStandard: 'Euro 6',
      traction: 'Fata',
      color: 'Negru'
    });
    setFeatureInput('');
    setFeatureSearch('');
    setImageInput('');
    setUploadingCount(0);
    setIsEditing(true);
  };

  const handleEdit = (car: Car) => {
    setCurrentCar({ ...car });
    setFeatureInput('');
    setFeatureSearch('');
    setImageInput('');
    setUploadingCount(0);
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    showConfirm(
      "Șterge Autoturism",
      "Ești sigur că vrei să ștergi acest anunț definitiv? Această acțiune nu poate fi anulată.",
      async () => {
        setDeletingId(id);
        try {
          await deleteCar(id);
        } catch (error: any) {
          showAlert("Eroare", "Eroare la ștergere: " + error.message);
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  const handleSave = async () => {
    if (uploadingCount > 0) {
      showAlert("Așteaptă", 'Vă rugăm așteptați finalizarea încărcării imaginilor.');
      return;
    }

    if (!currentCar.make || !currentCar.model || currentCar.price === undefined) {
      showAlert("Eroare", 'Te rog completează câmpurile obligatorii: Marca, Model, Preț.');
      return;
    }

    const validImages = (currentCar.images || []).filter(img => !img.startsWith('blob:'));
    const finalImages = validImages.length > 0 ? validImages : ["https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"];

    const cleanedCar = {
      ...currentCar,
      images: finalImages,
      features: currentCar.features || [],
      location: currentCar.location || 'Satu Mare',
      createdAt: currentCar.createdAt || Date.now() // Set createdAt if missing (New or Legacy edit)
    } as Car;

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
      showAlert("Eroare", "Marca, Modelul și Prețul de pornire sunt obligatorii.");
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
      startTime, endTime, startingBid: auctionForm.startBid,
      currentBid: auctionForm.startBid, bids: [], status: 'active', extensionCount: 0
    };
    await createAuction(newAuction);
    showAlert("Succes", "Licitație pornită cu succes!");
    // Reset form but keep last used values for convenience except image
    setAuctionForm(prev => ({ ...prev, image: '' }));
  };

  const addFeature = (e: React.KeyboardEvent | any) => {
    const key = (e as React.KeyboardEvent).key || 'Enter';
    if (key === 'Enter' && featureInput.trim()) {
      if(e.preventDefault) e.preventDefault();
      const newFeature = featureInput.trim();
      const currentFeatures = currentCar.features || [];
      if (!currentFeatures.includes(newFeature)) {
          setCurrentCar({
            ...currentCar,
            features: [...currentFeatures, newFeature]
          });
      }
      setFeatureInput('');
    }
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = currentCar.features || [];
    if (currentFeatures.includes(feature)) {
        setCurrentCar({ ...currentCar, features: currentFeatures.filter(f => f !== feature) });
    } else {
        setCurrentCar({ ...currentCar, features: [...currentFeatures, feature] });
    }
  };

  const addImage = () => {
    const rawInput = imageInput.trim();
    if (rawInput) {
      const urls = rawInput.split(/[\s,]+/).filter(u => u.length > 5);
      const cleanUrls = urls.map(u => !/^https?:\/\//i.test(u) ? 'https://' + u : u);
      setCurrentCar(prev => ({ ...prev, images: [...(prev.images || []), ...cleanUrls] }));
      setImageInput('');
    }
  };

  const handleImageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addImage(); }
  };

  const handlePasteFromButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
         const urls = text.split(/[\s,]+/).filter(u => u.length > 5);
         const cleanUrls = urls.map(u => !/^https?:\/\//i.test(u) ? 'https://' + u : u);
         setCurrentCar(prev => ({ ...prev, images: [...(prev.images || []), ...cleanUrls] }));
      }
    } catch (err) {
      showAlert("Info", "Nu am putut accesa clipboard-ul. Te rog folosește Ctrl+V.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files) as File[];
    const newImages = fileArray.map(f => ({ tempId: Math.random().toString(), blob: URL.createObjectURL(f), file: f }));

    setCurrentCar(prev => ({ ...prev, images: [...(prev.images || []), ...newImages.map(i => i.blob)] }));
    setUploadingCount(prev => prev + fileArray.length);

    for (const item of newImages) {
        let finalUrl = "";
        try {
            const compressedBase64 = await compressImage(item.file);
            if (storage) { 
                try {
                    const storageRef = ref(storage, `car-images/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`);
                    
                    const metadata = {
                      cacheControl: 'public, max-age=31536000, immutable',
                      contentType: 'image/webp'
                    };

                    // ADDED METADATA FOR CACHING
                    const uploadTask = uploadString(storageRef, compressedBase64, 'data_url', metadata);
                    await Promise.race([ uploadTask, new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 15000)) ]);
                    finalUrl = await getDownloadURL(storageRef);
                } catch (err) { finalUrl = compressedBase64; }
            } else { finalUrl = compressedBase64; }
        } catch (error) {
            setCurrentCar(prev => ({ ...prev, images: (prev.images || []).filter(img => img !== item.blob) }));
        } finally {
            if (finalUrl) {
                setCurrentCar(prev => {
                    const currentImages = [...(prev.images || [])];
                    const index = currentImages.indexOf(item.blob);
                    if (index !== -1) currentImages[index] = finalUrl;
                    return { ...prev, images: currentImages };
                });
            }
            URL.revokeObjectURL(item.blob);
            setUploadingCount(prev => Math.max(0, prev - 1));
        }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAuctionFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsAuctionUploading(true);
    try {
        const compressedDataUrl = await compressImage(files[0]);
        
        // Upload to Storage if available to prevent base64 bloat
        if (storage) {
            const storageRef = ref(storage, `auction-images/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`);
            
            const metadata = {
                cacheControl: 'public, max-age=31536000, immutable',
                contentType: 'image/webp'
            };

            await uploadString(storageRef, compressedDataUrl, 'data_url', metadata);
            const url = await getDownloadURL(storageRef);
            setAuctionForm(prev => ({ ...prev, image: url }));
        } else {
            setAuctionForm(prev => ({ ...prev, image: compressedDataUrl })); 
        }
    } catch (error: any) { 
        showAlert("Eroare", `Eroare la încărcare: ${error.message}`); 
    } finally { 
        setIsAuctionUploading(false); 
    }
  };

  const handlePrizeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsPrizeUploading(true);
    try {
        const compressedDataUrl = await compressImage(files[0]);
        
        // Upload to Storage if available
        if (storage) {
            const storageRef = ref(storage, `prize-images/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`);
            
            const metadata = {
                cacheControl: 'public, max-age=31536000, immutable',
                contentType: 'image/webp'
            };

            await uploadString(storageRef, compressedDataUrl, 'data_url', metadata);
            const url = await getDownloadURL(storageRef);
            setPrizeForm(prev => ({ ...prev, image: url }));
        } else {
            setPrizeForm(prev => ({ ...prev, image: compressedDataUrl }));
        }
    } catch (error: any) { 
        showAlert("Eroare", `Eroare: ${error.message}`); 
    } finally { 
        setIsPrizeUploading(false); 
    }
  };

  const handleSavePrize = async () => {
    if (!prizeForm.title || !prizeForm.description) { showAlert("Eroare", "Titlul și descrierea sunt obligatorii."); return; }
    try {
      await saveHolidayPrize(prizeForm);
      showAlert("Succes", "Premiul a fost salvat cu succes!");
    } catch (e: any) { showAlert("Eroare", `Eroare la salvare: ${e.message}`); }
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

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (!currentCar.images) return;
    const newImages = [...currentCar.images];
    if (direction === 'left') {
      if (index === 0) return;
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else {
      if (index === newImages.length - 1) return;
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setCurrentCar({ ...currentCar, images: newImages });
  };

  const filteredInventory = cars
    .filter(c => 
      c.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

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
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-2xl border border-gold-500/30 shadow-2xl p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{modalConfig.title}</h2>
              <p className="text-gray-500 mb-6">{modalConfig.message}</p>
              <button onClick={handleModalClose} className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold">OK</button>
            </div>
          </div>
        )}
        
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
      {/* ... (Previous code remains the same) ... */}
      {showSetup && <SetupGuide />}
      
      {/* GLOBAL MODAL */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl border border-gold-500/30 shadow-2xl p-8 text-center relative overflow-hidden">
            {/* Visual Indicator */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalConfig.type === 'confirm' ? 'bg-blue-500/10 text-blue-500' : 'bg-gold-500/10 text-gold-500'}`}>
               {modalConfig.type === 'confirm' ? <AlertCircle size={40} /> : <Info size={40} />}
            </div>
            
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{modalConfig.title}</h2>
            <p className="text-gray-500 mb-8 leading-relaxed whitespace-pre-wrap">{modalConfig.message}</p>
            
            <div className="flex gap-4">
              {modalConfig.type === 'confirm' && (
                <button 
                  onClick={handleModalClose} 
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold hover:bg-white/5"
                >
                  Anulează
                </button>
              )}
              <button 
                onClick={handleModalConfirm} 
                className={`flex-1 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${modalConfig.type === 'confirm' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gold-500 hover:bg-gold-600 text-black'}`}
              >
                {modalConfig.type === 'confirm' ? 'Confirmă' : 'Am înțeles'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* ... (Header and Stats sections remain the same) ... */}
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3"><LayoutDashboard className="text-gold-500" /> Dashboard Dealer</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
               {isConnected ? (
                 <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20 font-bold">ONLINE</span>
               ) : (
                 <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded border border-red-500/20 font-bold">OFFLINE</span>
               )}
               {fcmToken ? (
                 <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded border border-blue-500/20 font-bold flex items-center gap-1">
                   <Bell size={10} /> NOTIFICĂRI ACTIVE
                 </span>
               ) : (
                 <button 
                   onClick={handleEnableNotifications} 
                   className={`text-xs px-2 py-1 rounded border font-bold flex items-center gap-1 transition-colors ${
                     permissionStatus === 'denied' 
                       ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                       : 'bg-gray-100 dark:bg-white/10 text-gray-500 border-gray-300 dark:border-white/10 hover:bg-gold-500 hover:text-black'
                   }`}
                 >
                   {permissionStatus === 'denied' ? <BellOff size={10} /> : <Bell size={10} />}
                   {permissionStatus === 'denied' ? 'NOTIFICĂRI BLOCATE' : 'ACTIVEAZĂ NOTIFICĂRI'}
                 </button>
               )}
            </div>
          </div>
          <div className="flex gap-4">
             <Link to="/" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white hover:bg-white/5 transition-colors">Vezi Website</Link>
             <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 font-bold transition-all">Deconectare</button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Valoare Stoc</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{totalValue.toLocaleString()} €</h3>
          </div>
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 cursor-pointer hover:border-gold-500/50 transition-colors" onClick={() => setActiveTab('calendar')}>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Programări (Noi)</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {pendingBookings}
              {pendingBookings > 0 && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
            </h3>
          </div>
          <div className="glass-panel p-6 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 cursor-pointer hover:border-gold-500/50 transition-colors" onClick={() => setActiveTab('messages')}>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Mesaje Contact</p>
            <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">{totalMessages}</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 mb-8 overflow-x-auto">
           {['inventory', 'auctions', 'calendar', 'messages', 'settings'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-white'}`}
             >
               {tab === 'inventory' ? 'Gestiune Stoc' : tab === 'auctions' ? 'Licitații' : tab === 'calendar' ? 'Calendar' : tab === 'messages' ? 'Mesaje' : <> <Settings size={14} /> Setări Site </>}
             </button>
           ))}
        </div>

        {/* --- INVENTORY TAB --- */}
        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            {/* Inventory Search & Add */}
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
                <div key={car.id} className={`group glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 border border-gray-200 dark:border-white/5 bg-white dark:bg-[#121212] hover:border-gold-500/50 transition-all shadow-sm ${car.isSold ? 'opacity-80 grayscale' : ''}`}>
                  <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={car.images[0]} 
                      alt={car.model} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/121212/C5A059?text=Link+Invalid"; }}
                    />
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 flex gap-1 flex-col items-start">
                       {car.isSold && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase">VÂNDUT</span>}
                       {!car.isSold && car.isHotDeal && <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase">HOT</span>}
                    </div>
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
                    <div className="flex justify-between items-end">
                       <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{car.price?.toLocaleString()} €</div>
                       <div className="text-xs text-gray-400 mt-1">
                          Adăugat: {car.createdAt ? new Date(car.createdAt).toLocaleDateString('ro-RO') : 'N/A'}
                       </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-3 shrink-0 relative mt-4 md:mt-0">
                    
                    {/* --- MANUAL REPAIR BUTTON --- */}
                    {car.images.some(img => isLegacyImage(img)) && (
                       <button
                         onClick={(e) => handleFixCarImages(e, car)}
                         disabled={migratingId === car.id}
                         className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
                         title="Repară și convertește la WebP"
                       >
                         {migratingId === car.id ? <Loader2 className="animate-spin" size={20} /> : <Wrench size={20} />}
                       </button>
                    )}

                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(car); }} 
                      className="bg-gray-100 dark:bg-white/10 hover:bg-gold-500 hover:text-black p-3 rounded-lg transition-all"
                      title="Editează"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(e, car.id)} 
                      disabled={deletingId === car.id}
                      className="bg-gray-100 dark:bg-white/10 hover:bg-red-500 hover:text-white p-3 rounded-lg transition-all disabled:opacity-50"
                      title="Șterge"
                    >
                      {deletingId === car.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredInventory.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white dark:bg-[#121212] rounded-xl border border-dashed border-gray-300 dark:border-white/10">
                   <p>Nu am găsit niciun rezultat.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
           <div className="animate-fade-in space-y-8">
              {/* ... settings content ... */}
              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Database className="text-blue-500" /> 
                    Reparare Bază de Date (Optimizare WebP)
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl">
                    Dacă aveți mașini cu imagini vechi (Base64), acestea vor încetini site-ul.
                    Folosiți butonul <strong><Wrench className="inline w-4 h-4 text-blue-500" /> Repară</strong> din tab-ul <strong>Gestiune Stoc</strong> pentru a le converti automat în format <strong>WebP (1920px)</strong> și a le muta în Cloud Storage.
                 </p>
                 <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-sm text-blue-400 font-bold">
                       Notă: Erorile "Extension context invalidated" apar din cauza volumului mare de date vechi. Reparați mașinile una câte una pentru a rezolva problema definitiv.
                    </p>
                 </div>
              </div>
              {/* ... other settings ... */}
              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Heart className={seasonalTheme === 'valentine' ? "text-red-500 fill-current" : "text-gray-400"} /> 
                    Teme Sezoniere
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                       onClick={() => setSeasonalTheme('default')}
                       className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${seasonalTheme === 'default' ? 'border-gold-500 bg-gold-500/10' : 'border-gray-200 dark:border-white/10 hover:border-gold-500/50'}`}
                    >
                       <div className="w-full h-24 bg-gray-900 rounded-lg flex items-center justify-center border border-white/10">
                          <span className="text-gold-500 font-bold">ORIGINAL</span>
                       </div>
                       <span className={`font-bold ${seasonalTheme === 'default' ? 'text-gold-500' : 'text-gray-500'}`}>Theme Default</span>
                    </button>
                    <button 
                       onClick={() => setSeasonalTheme('valentine')}
                       className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${seasonalTheme === 'valentine' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-200 dark:border-white/10 hover:border-pink-500/50'}`}
                    >
                       <div className="w-full h-24 bg-pink-900/30 rounded-lg flex items-center justify-center border border-pink-500/30 relative overflow-hidden">
                          <Heart className="text-pink-500 absolute top-2 right-2 opacity-50" size={16} />
                          <Heart className="text-pink-500 absolute bottom-2 left-2 opacity-50" size={24} />
                          <span className="text-pink-500 font-bold z-10">VALENTINE</span>
                       </div>
                       <span className={`font-bold ${seasonalTheme === 'valentine' ? 'text-pink-500' : 'text-gray-500'}`}>Valentine's Day</span>
                    </button>
                 </div>
              </div>
              
              {/* HOLIDAY PRIZE SECTION */}
              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                 {/* ... prize content ... */}
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Gift className="text-gold-500" /> 
                    Premiu & Pop-up Sezonier (Inimioară)
                 </h3>
                 <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <input 
                          type="checkbox" 
                          id="prizeEnabled" 
                          checked={prizeForm.isEnabled} 
                          onChange={(e) => setPrizeForm({...prizeForm, isEnabled: e.target.checked})} 
                          className="w-5 h-5 accent-gold-500 cursor-pointer" 
                        />
                        <label htmlFor="prizeEnabled" className="cursor-pointer font-bold text-gray-900 dark:text-white">Activează Pop-up cu Premiu (pe inimioara din stânga jos)</label>
                    </div>
                    {/* ... rest of prize form ... */}
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Imagine Premiu</label>
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={prizeForm.image} 
                            onChange={(e) => setPrizeForm({...prizeForm, image: e.target.value})} 
                            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                            placeholder="Link imagine sau Upload..." 
                          />
                          <input type="file" ref={prizeFileInputRef} onChange={handlePrizeFileUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />
                          <button 
                            type="button" 
                            onClick={() => prizeFileInputRef.current?.click()} 
                            disabled={isPrizeUploading}
                            className="bg-gold-500 text-black px-4 rounded-lg hover:bg-gold-600 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
                          >
                            {isPrizeUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                          </button>
                       </div>
                       {prizeForm.image && (
                         <div className="mt-4 relative inline-block group">
                           <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                             <img src={prizeForm.image} alt="Preview" className="w-full h-full object-cover" />
                           </div>
                           <button 
                             onClick={() => setPrizeForm({...prizeForm, image: ''})}
                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                           >
                             <X size={14} />
                           </button>
                         </div>
                       )}
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Titlu Premiu</label>
                       <input 
                         type="text" 
                         value={prizeForm.title} 
                         onChange={(e) => setPrizeForm({...prizeForm, title: e.target.value})} 
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                         placeholder="Ex: Reducere 500€" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Descriere</label>
                       <textarea 
                         rows={3}
                         value={prizeForm.description} 
                         onChange={(e) => setPrizeForm({...prizeForm, description: e.target.value})} 
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500 resize-none" 
                         placeholder="Ex: Felicitări! Ai câștigat o reducere..." 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Link Buton (Opțional)</label>
                       <input 
                         type="text" 
                         value={prizeForm.buttonLink || ''} 
                         onChange={(e) => setPrizeForm({...prizeForm, buttonLink: e.target.value})} 
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gold-500" 
                         placeholder="https://..." 
                       />
                    </div>
                    
                    <button 
                      onClick={handleSavePrize}
                      className="bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                      <Save size={18} /> Salvează Setări
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* --- CALENDAR TAB --- */}
        {activeTab === 'calendar' && (
           <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Calendar Programări</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {bookings.map(booking => (
                   <BookingCard 
                     key={booking.id} 
                     booking={booking} 
                     onUpdateStatus={updateBookingStatus} 
                     onDelete={deleteBooking} 
                   />
                 ))}
                 {bookings.length === 0 && (
                   <div className="col-span-2 text-center py-12 text-gray-500 bg-white dark:bg-[#121212] rounded-xl border border-dashed border-gray-300 dark:border-white/10">
                      Nu există programări.
                   </div>
                 )}
              </div>
           </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
           <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mesaje Clienți</h2>
              <div className="grid grid-cols-1 gap-4">
                 {messages.map(msg => (
                   <MessageCard 
                     key={msg.id} 
                     message={msg} 
                     onDelete={deleteMessage}
                   />
                 ))}
                 {messages.length === 0 && (
                   <div className="text-center py-12 text-gray-500 bg-white dark:bg-[#121212] rounded-xl border border-dashed border-gray-300 dark:border-white/10">
                      Nu există mesaje.
                   </div>
                 )}
              </div>
           </div>
        )}

        {/* --- AUCTIONS TAB --- */}
        {activeTab === 'auctions' && (
           <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Administrare Licitații</h2>
              
              {/* Add New Auction Form */}
              <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/10 mb-8">
                 <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Pornește Licitație Nouă</h3>
                 <form onSubmit={handleStartAuction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Marca" value={auctionForm.make} onChange={e => setAuctionForm({...auctionForm, make: e.target.value})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="text" placeholder="Model" value={auctionForm.model} onChange={e => setAuctionForm({...auctionForm, model: e.target.value})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="number" placeholder="An" value={auctionForm.year} onChange={e => setAuctionForm({...auctionForm, year: Number(e.target.value)})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="number" placeholder="Km" value={auctionForm.mileage} onChange={e => setAuctionForm({...auctionForm, mileage: Number(e.target.value)})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="text" placeholder="Combustibil" value={auctionForm.fuel} onChange={e => setAuctionForm({...auctionForm, fuel: e.target.value})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="number" placeholder="Preț Pornire (€)" value={auctionForm.startBid} onChange={e => setAuctionForm({...auctionForm, startBid: Number(e.target.value)})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    <input type="number" placeholder="Durată (ore)" value={auctionForm.duration} onChange={e => setAuctionForm({...auctionForm, duration: Number(e.target.value)})} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" required />
                    
                    <div className="flex gap-2">
                        <input type="text" placeholder="URL Imagine" value={auctionForm.image} onChange={e => setAuctionForm({...auctionForm, image: e.target.value})} className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white" />
                        <input type="file" ref={auctionFileInputRef} onChange={handleAuctionFileUpload} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => auctionFileInputRef.current?.click()} disabled={isAuctionUploading} className="bg-gray-100 dark:bg-white/10 px-4 rounded-lg hover:bg-gold-500 hover:text-black transition-colors disabled:opacity-50">
                           {isAuctionUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                        </button>
                    </div>

                    <textarea placeholder="Descriere Scurtă" value={auctionForm.description} onChange={e => setAuctionForm({...auctionForm, description: e.target.value})} className="md:col-span-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-gold-500 text-gray-900 dark:text-white h-24 resize-none" />

                    <button type="submit" className="md:col-span-2 bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 rounded-lg shadow-lg">Pornește Licitația</button>
                 </form>
              </div>

              {/* List of Auctions */}
              <div className="space-y-4">
                 {auctions.map(auction => (
                    <div key={auction.id} className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                       <img src={auction.carImage} alt="Car" className="w-24 h-24 object-cover rounded-lg" />
                       <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white">{auction.carMake} {auction.carModel}</h4>
                          <p className="text-sm text-gray-500">Status: <span className={`font-bold uppercase ${auction.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{auction.status}</span></p>
                          <p className="text-sm text-gray-500">Ofertă Curentă: <span className="text-gold-500 font-bold">{auction.currentBid} €</span></p>
                       </div>
                       {auction.status === 'active' && (
                         <button onClick={() => cancelAuction(auction.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition-all">
                            Anulează
                         </button>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>
      
      {/* Editor Modal for Inventory */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#121212] w-full max-w-4xl rounded-2xl border border-gold-500/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
             <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">{currentCar.id ? 'Editează Mașină' : 'Adaugă Mașină Nouă'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
             </div>
             
             <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                {/* Basic Info */}
                <section>
                   <h3 className="text-gold-500 font-bold uppercase text-xs tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Informații De Bază</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Marcă</label>
                         <select value={currentCar.make} onChange={(e) => setCurrentCar({...currentCar, make: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Model</label>
                         <input type="text" value={currentCar.model || ''} onChange={(e) => setCurrentCar({...currentCar, model: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Preț (€)</label>
                         <input type="number" value={currentCar.price || 0} onChange={(e) => setCurrentCar({...currentCar, price: Number(e.target.value)})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">An</label>
                         <input type="number" value={currentCar.year || new Date().getFullYear()} onChange={(e) => setCurrentCar({...currentCar, year: Number(e.target.value)})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Km</label>
                         <input type="number" value={currentCar.mileage || 0} onChange={(e) => setCurrentCar({...currentCar, mileage: Number(e.target.value)})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Combustibil</label>
                         <select value={currentCar.fuel} onChange={(e) => setCurrentCar({...currentCar, fuel: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Transmisie</label>
                         <select value={currentCar.transmission} onChange={(e) => setCurrentCar({...currentCar, transmission: e.target.value as any})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            <option value="Automată">Automată</option>
                            <option value="Manuală">Manuală</option>
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Caroserie</label>
                         <select value={currentCar.bodyType} onChange={(e) => setCurrentCar({...currentCar, bodyType: e.target.value as any})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Putere (CP)</label>
                         <input type="number" value={currentCar.power || 0} onChange={(e) => setCurrentCar({...currentCar, power: Number(e.target.value)})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Motor (cm3/L)</label>
                         <input type="text" value={currentCar.engineSize || ''} onChange={(e) => setCurrentCar({...currentCar, engineSize: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Locație</label>
                         <select value={currentCar.location} onChange={(e) => setCurrentCar({...currentCar, location: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                         </select>
                      </div>
                       <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Norma Poluare</label>
                         <select value={currentCar.pollutionStandard} onChange={(e) => setCurrentCar({...currentCar, pollutionStandard: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {POLLUTION_STANDARDS.map(p => <option key={p} value={p}>{p}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Tracțiune</label>
                         <select value={currentCar.traction} onChange={(e) => setCurrentCar({...currentCar, traction: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white">
                            {TRACTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">Culoare</label>
                         <input type="text" value={currentCar.color || ''} onChange={(e) => setCurrentCar({...currentCar, color: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-gray-500 font-bold">VIN</label>
                         <input type="text" value={currentCar.vin || ''} onChange={(e) => setCurrentCar({...currentCar, vin: e.target.value})} className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" />
                      </div>
                   </div>
                   
                   <div className="mt-4 flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" checked={currentCar.isHotDeal || false} onChange={(e) => setCurrentCar({...currentCar, isHotDeal: e.target.checked})} className="accent-gold-500 w-5 h-5" />
                         <span className="text-gray-900 dark:text-white font-bold">Hot Deal (Promo)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" checked={currentCar.isSold || false} onChange={(e) => setCurrentCar({...currentCar, isSold: e.target.checked})} className="accent-red-500 w-5 h-5" />
                         <span className="text-gray-900 dark:text-white font-bold text-red-500">Vândut</span>
                      </label>
                   </div>
                </section>

                {/* Images */}
                <section>
                   <h3 className="text-gold-500 font-bold uppercase text-xs tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Galerie Foto</h3>
                   
                   <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1 flex gap-2">
                         <input 
                           type="text" 
                           value={imageInput} 
                           onChange={(e) => setImageInput(e.target.value)} 
                           onKeyDown={handleImageInputKeyDown}
                           placeholder="URL Imagine (sau Paste)" 
                           className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-2 text-gray-900 dark:text-white" 
                         />
                         <button onClick={addImage} className="bg-gray-200 dark:bg-white/10 px-4 rounded hover:bg-gold-500 hover:text-black transition-colors"><Plus /></button>
                         <button onClick={handlePasteFromButton} className="bg-gray-200 dark:bg-white/10 px-4 rounded hover:bg-gold-500 hover:text-black transition-colors" title="Paste din Clipboard"><Clipboard /></button>
                      </div>
                      
                      <div className="relative">
                         <input 
                           type="file" 
                           multiple 
                           accept="image/*" 
                           ref={fileInputRef}
                           onChange={handleFileUpload} 
                           className="hidden" 
                         />
                         <button 
                           onClick={() => fileInputRef.current?.click()} 
                           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded flex items-center gap-2"
                           disabled={uploadingCount > 0}
                         >
                           {uploadingCount > 0 ? <Loader2 className="animate-spin" /> : <CloudUpload />}
                           Upload
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {currentCar.images?.map((img, idx) => (
                         <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-700">
                            <img src={img} alt={`Car ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                               <button onClick={() => setAsCover(idx)} className="p-1.5 bg-gold-500 text-black rounded hover:scale-110" title="Setează ca principală"><Star size={16} /></button>
                               <button onClick={() => moveImage(idx, 'left')} disabled={idx === 0} className="p-1.5 bg-white text-black rounded hover:scale-110 disabled:opacity-50"><ChevronLeft size={16} /></button>
                               <button onClick={() => moveImage(idx, 'right')} disabled={idx === (currentCar.images?.length || 0) - 1} className="p-1.5 bg-white text-black rounded hover:scale-110 disabled:opacity-50"><ChevronRight size={16} /></button>
                               <button onClick={() => removeImage(idx)} className="p-1.5 bg-red-500 text-white rounded hover:scale-110"><Trash2 size={16} /></button>
                            </div>
                            {idx === 0 && <span className="absolute top-1 left-1 bg-gold-500 text-black text-[10px] font-bold px-1.5 rounded">COVER</span>}
                         </div>
                      ))}
                   </div>
                </section>

                {/* Description */}
                <section>
                   <h3 className="text-gold-500 font-bold uppercase text-xs tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Descriere</h3>
                   <textarea 
                     value={currentCar.description || ''} 
                     onChange={(e) => setCurrentCar({...currentCar, description: e.target.value})} 
                     className="w-full h-40 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded p-4 text-gray-900 dark:text-white resize-none leading-relaxed"
                     placeholder="Descriere detaliată..."
                   />
                </section>

                {/* Features */}
                <section>
                   <h3 className="text-gold-500 font-bold uppercase text-xs tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Dotări</h3>
                   
                   <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          value={featureInput}
                          onChange={(e) => {
                             setFeatureInput(e.target.value);
                             setFeatureSearch(e.target.value);
                          }}
                          onKeyDown={addFeature}
                          placeholder="Caută sau adaugă dotare..." 
                          className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded pl-10 pr-4 py-2 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button onClick={addFeature} className="bg-gray-200 dark:bg-white/10 px-4 rounded hover:bg-gold-500 hover:text-black transition-colors"><Plus /></button>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                      {CAR_FEATURES.filter(f => f.toLowerCase().includes(featureSearch.toLowerCase())).map(feature => (
                         <button 
                           key={feature}
                           onClick={() => toggleFeature(feature)}
                           className={`text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between group ${currentCar.features?.includes(feature) ? 'bg-gold-500 text-black font-bold' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                         >
                            {feature}
                            {currentCar.features?.includes(feature) && <Check size={14} />}
                         </button>
                      ))}
                   </div>
                   
                   {/* Custom added features that are not in the standard list */}
                   {currentCar.features && currentCar.features.some(f => !CAR_FEATURES.includes(f)) && (
                      <div className="mt-4">
                         <h4 className="text-xs font-bold text-gray-500 mb-2">Dotări Extra Adăugate:</h4>
                         <div className="flex flex-wrap gap-2">
                            {currentCar.features.filter(f => !CAR_FEATURES.includes(f)).map(f => (
                               <span key={f} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                                  {f}
                                  <button onClick={() => toggleFeature(f)} className="hover:text-white"><X size={14} /></button>
                               </span>
                            ))}
                         </div>
                      </div>
                   )}
                </section>
             </div>

             <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-4 bg-gray-50 dark:bg-white/5">
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 font-bold transition-colors">Anulează</button>
                <button 
                   onClick={handleSave} 
                   disabled={uploadingCount > 0}
                   className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                   {uploadingCount > 0 ? <Loader2 className="animate-spin" /> : <Save />}
                   Salvează
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
