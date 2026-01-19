import { Car, Review } from './types';

export const MOCK_CARS: Car[] = [];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Andrei Popescu',
    carPurchased: 'BMW X5 M50d',
    rating: 5,
    comment: 'Servicii impecabile. Mașina a fost exact ca în descriere, iar procesul de cumpărare a durat mai puțin de o oră.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Elena Ionescu',
    carPurchased: 'Porsche Macan',
    rating: 5,
    comment: 'Profesionalism și transparență totală. Recomand Autoparc RolCris pentru oricine caută o mașină premium verificată.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Mihai Radu',
    carPurchased: 'Mercedes E-Class',
    rating: 5,
    comment: 'O experiență de 5 stele. Echipa a fost foarte răbdătoare și m-a ajutat să aleg configurația perfectă pentru mine.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];

export const BRANDS = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Tesla', 'Land Rover', 'Jaguar', 'Volvo', 'Skoda', 'Dacia', 'Volkswagen', 'Toyota', 'Ford', 'Renault'];
export const BODY_TYPES = ['SUV', 'Sedan', 'Coupe', 'Cabrio', 'Break', 'Hatchback'];
export const FUELS = ['Diesel', 'Benzină', 'Hibrid', 'Electric'];