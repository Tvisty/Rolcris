
import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Calendar, ArrowRight, Zap, ImageOff } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const mainImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="group relative bg-white dark:bg-[#121212] rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gold-500/50 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]">
      {/* Badge */}
      {car.isHotDeal && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <Zap size={12} fill="currentColor" />
          HOT DEAL
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
        <img
          src={mainImage}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute bottom-3 left-4 z-20 flex gap-2">
           <span className="text-white font-bold text-lg font-display tracking-wide drop-shadow-md">
             {car.make} {car.model}
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        {/* Specs Row */}
        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gold-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge size={14} className="text-gold-500" />
            <span>{car.mileage?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={14} className="text-gold-500" />
            <span>{car.fuel}</span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Preț</p>
            <p className="text-2xl font-bold text-gold-500 font-display">
              {car.price?.toLocaleString()} €
            </p>
          </div>
          
          <Link 
            to={`/inventory/${car.id}`}
            className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gold-500 hover:text-black text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold border border-gray-200 dark:border-white/10"
          >
            Vezi Detalii
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
