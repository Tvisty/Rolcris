
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: 'Diesel' | 'Benzină' | 'Benzină/Gaz' | 'Hibrid' | 'Electric' | 'Diesel/Electric';
  transmission: 'Automată' | 'Manuală';
  bodyType: 'SUV' | 'Sedan' | 'Coupe' | 'Cabrio' | 'Break' | 'Hatchback' | 'Dube' | 'Monovolum';
  power: number; // HP
  engineSize: string; // e.g. 3.0L
  vin?: string;
  images: string[];
  isHotDeal?: boolean;
  isSold?: boolean; // New field for Sold status
  description: string;
  features: string[];
  seats: number;
  location?: string; // New field for location filtering
  pollutionStandard?: string; // e.g. Euro 6
  traction?: string; // e.g. 4x4
  color?: string; // e.g. Negru
}

export interface Booking {
  id: string;
  carId: string;
  carName: string; // Snapshot of name in case car is deleted
  carImage: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO Date String
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: number;
  type?: string; // 'Test Drive', 'Service', 'Finanțare', 'Detailing', 'Info'
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string; // ISO Date String
  isRead?: boolean;
}

export interface Bid {
  bidderName: string;
  bidderPhone: string;
  amount: number;
  timestamp: number;
  timestampStr?: string;
}

export interface Auction {
  id: string;
  carId: string; // Generated unique ID for this auction item
  carMake: string;
  carModel: string;
  carYear: number;
  carMileage: number;
  carFuel: string;
  carImage: string;
  carDescription?: string;
  startTime: number; // Timestamp
  endTime: number; // Timestamp
  startingBid: number;
  currentBid: number;
  bids: Bid[];
  status: 'active' | 'completed' | 'cancelled';
  extensionCount: number; // Tracks how many times it has been extended
}

export interface Review {
  id: string;
  name: string;
  carPurchased: string;
  rating: number; // 1-5
  comment: string;
  image: string;
}

export interface HolidayPrize {
  isEnabled: boolean;
  image: string;
  title: string;
  description: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface FilterState {
  make: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  fuel: string[];
  bodyType: string[];
  location?: string;
}

export type SeasonalTheme = 'default' | 'valentine' | 'halloween' | 'martisor' | 'romania' | 'easter' | 'christmas' | 'blackfriday';
