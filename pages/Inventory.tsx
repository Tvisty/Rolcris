
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronUp, Search, Loader2, Check } from 'lucide-react';
import CarCard from '../components/CarCard';
import { BRANDS, BODY_TYPES, FUELS, CAR_FEATURES, LOCATIONS } from '../constants';
import { SortOption } from '../types';
import { useCars } from '../context/CarContext';

const FilterSection: React.FC<React.PropsWithChildren<{ title: string; defaultOpen?: boolean }>> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-white/10 py-5">
      <button className="flex justify-between items-center w-full mb-4" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-gray-900 dark:text-white font-bold font-display tracking-wide">{title}</h3>
        {isOpen ? <ChevronUp size={16} className="text-gold-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {isOpen && <div className="space-y-3 animate-fade-in">{children}</div>}
    </div>
  );
};

const Inventory: React.FC = () => {
  const { cars, isLoading } = useCars();
  const [searchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Initialize state with URL params if present, otherwise defaults
  // Extended default ranges to prevent accidentally hiding valid cars
  const [filters, setFilters] = useState({
    priceRange: [0, Number(searchParams.get('maxPrice')) || 1000000],
    selectedBrand: searchParams.get('make') || '',
    selectedModel: '',
    selectedBody: '',
    selectedFuel: '',
    selectedTransmission: '',
    selectedLocation: '',
    // CHANGED: Default min year to 0 to catch cars with unspecified years
    yearRange: [Number(searchParams.get('minYear')) || 0, new Date().getFullYear() + 1], 
    maxMileage: '',
    selectedSeats: '',
    selectedFeatures: [] as string[]
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Update filters if URL params change
  useEffect(() => {
    const make = searchParams.get('make');
    const minYear = searchParams.get('minYear');
    const maxPrice = searchParams.get('maxPrice');

    if (make || minYear || maxPrice) {
      setFilters(prev => ({
        ...prev,
        selectedBrand: make || prev.selectedBrand,
        yearRange: [minYear ? Number(minYear) : prev.yearRange[0], prev.yearRange[1]],
        priceRange: [prev.priceRange[0], maxPrice ? Number(maxPrice) : prev.priceRange[1]]
      }));
    }
  }, [searchParams]);

  // Handle body scroll locking when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);

  // Filter Logic
  const filteredCars = useMemo(() => {
    if (!cars) return [];
    
    let result = cars.filter(car => {
      // Type safety checks: Ensure car properties exist before comparison
      const carPrice = Number(car.price) || 0;
      const carYear = Number(car.year) || 0;

      // Brand
      if (filters.selectedBrand && car.make !== filters.selectedBrand) return false;
      // Model (Partial text match)
      if (filters.selectedModel && !car.model.toLowerCase().includes(filters.selectedModel.toLowerCase())) return false;
      // Body Type
      if (filters.selectedBody && car.bodyType !== filters.selectedBody) return false;
      // Fuel
      if (filters.selectedFuel && car.fuel !== filters.selectedFuel) return false;
      // Transmission
      if (filters.selectedTransmission && car.transmission !== filters.selectedTransmission) return false;
      // Location
      if (filters.selectedLocation && car.location !== filters.selectedLocation) return false;
      // Year Range
      if (carYear < filters.yearRange[0] || carYear > filters.yearRange[1]) return false;
      // Price Range
      if (carPrice < filters.priceRange[0] || carPrice > filters.priceRange[1]) return false;
      // Max Mileage
      if (filters.maxMileage && car.mileage > Number(filters.maxMileage)) return false;
      // Seats
      if (filters.selectedSeats && car.seats !== Number(filters.selectedSeats)) return false;
      // Features (Must have all selected)
      if (filters.selectedFeatures.length > 0) {
        const hasAllSelectedFeatures = filters.selectedFeatures.every(feature => 
            car.features && car.features.includes(feature)
        );
        if (!hasAllSelectedFeatures) return false;
      }

      return true;
    });

    // Sorting
    if (sortOption === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (sortOption === 'price_desc') result.sort((a, b) => b.price - a.price);
    if (sortOption === 'newest') result.sort((a, b) => b.year - a.year);

    return result;
  }, [filters, sortOption, cars]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000000],
      selectedBrand: '',
      selectedModel: '',
      selectedBody: '',
      selectedFuel: '',
      selectedTransmission: '',
      selectedLocation: '',
      yearRange: [0, new Date().getFullYear() + 1],
      maxMileage: '',
      selectedSeats: '',
      selectedFeatures: []
    });
    // Don't close immediately to let user see it reset
  };

  const toggleFeatureFilter = (feature: string) => {
    setFilters(prev => {
        const current = prev.selectedFeatures;
        if (current.includes(feature)) {
            return { ...prev, selectedFeatures: current.filter(f => f !== feature) };
        } else {
            return { ...prev, selectedFeatures: [...current, feature] };
        }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      
      {/* Header & Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">Stoc Disponibil</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">
             {isLoading ? 'Se încarcă...' : `${filteredCars.length} autoturisme găsite`}
           </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => setIsMobileFilterOpen(true)}
             className="md:hidden flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-sm"
           >
             <Filter size={18} /> Filtre
           </button>

           <div className="relative flex-1 md:w-48">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-4 py-3 rounded-lg appearance-none cursor-pointer focus:border-gold-500 outline-none shadow-sm"
              >
                <option value="newest">Cele mai noi</option>
                <option value="price_asc">Preț: Crescător</option>
                <option value="price_desc">Preț: Descrescător</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
           </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`
          fixed inset-0 z-[100] bg-white dark:bg-[#0a0a0a] p-6 overflow-y-auto transition-transform duration-300 md:relative md:translate-x-0 md:bg-transparent md:p-0 md:w-72 md:block md:z-0
          ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-6 sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 pb-4 border-b border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Filtre</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full text-gray-900 dark:text-white hover:bg-red-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="glass-panel rounded-xl p-6 md:sticky md:top-24 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 pb-32 md:pb-6">
            
            {/* LOCATIE - Moved to top for visibility */}
            <FilterSection title="Locație">
                <div className="space-y-2">
                    {LOCATIONS.map(loc => (
                        <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border ${filters.selectedLocation === loc ? 'bg-gold-500 border-gold-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gold-500'} transition-colors flex items-center justify-center`}>
                                {filters.selectedLocation === loc && <div className="w-2 h-2 bg-black rounded-full" />}
                            </div>
                            <input 
                                type="radio" 
                                name="location" 
                                className="hidden"
                                checked={filters.selectedLocation === loc}
                                onChange={() => setFilters({...filters, selectedLocation: filters.selectedLocation === loc ? '' : loc})}
                            />
                            <span className={`text-sm ${filters.selectedLocation === loc ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {loc}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* PRICE */}
            <FilterSection title="Preț (€)">
              <div className="flex gap-2 items-center">
                 <input 
                   type="number" 
                   placeholder="Min"
                   value={filters.priceRange[0]} 
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                   onChange={(e) => setFilters({...filters, priceRange: [Number(e.target.value), filters.priceRange[1]]})}
                 />
                 <span className="text-gray-500">-</span>
                 <input 
                   type="number" 
                   placeholder="Max"
                   value={filters.priceRange[1]} 
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                   onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], Number(e.target.value)]})}
                 />
              </div>
            </FilterSection>

            {/* MARCA */}
            <FilterSection title="Marca">
              <select 
                value={filters.selectedBrand}
                onChange={(e) => setFilters({...filters, selectedBrand: e.target.value})}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded p-3 focus:border-gold-500 outline-none cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#121212]">Toate</option>
                {BRANDS.map(b => <option key={b} value={b} className="bg-white dark:bg-[#121212]">{b}</option>)}
              </select>
            </FilterSection>

            {/* MODEL */}
            <FilterSection title="Model">
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Caută model..." 
                   value={filters.selectedModel}
                   onChange={(e) => setFilters({...filters, selectedModel: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 pl-10 text-gray-900 dark:text-white focus:border-gold-500 outline-none text-sm placeholder-gray-500"
                 />
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </FilterSection>

            {/* AN */}
            <FilterSection title="An Fabricație">
              <div className="flex gap-2 items-center">
                 <input 
                   type="number" 
                   placeholder="Min"
                   value={filters.yearRange[0]} 
                   onChange={(e) => setFilters({...filters, yearRange: [Number(e.target.value), filters.yearRange[1]]})}
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                 />
                 <span className="text-gray-500">-</span>
                 <input 
                   type="number" 
                   placeholder="Max"
                   value={filters.yearRange[1]} 
                   onChange={(e) => setFilters({...filters, yearRange: [filters.yearRange[0], Number(e.target.value)]})}
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-2 text-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                 />
              </div>
            </FilterSection>

            {/* KILOMETRAJ */}
            <FilterSection title="Kilometraj Max">
              <div className="relative">
                 <input 
                   type="number" 
                   placeholder="Ex: 100000"
                   value={filters.maxMileage} 
                   onChange={(e) => setFilters({...filters, maxMileage: e.target.value})}
                   className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 pr-8 text-gray-900 dark:text-white focus:border-gold-500 outline-none text-sm placeholder-gray-500"
                 />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">km</span>
              </div>
            </FilterSection>

            {/* CUTIE DE VITEZE */}
            <FilterSection title="Cutie de Viteze">
              <div className="flex flex-wrap gap-2">
                {['Manuală', 'Automată'].map(trans => (
                  <button
                    key={trans}
                    onClick={() => setFilters({...filters, selectedTransmission: filters.selectedTransmission === trans ? '' : trans})}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      filters.selectedTransmission === trans 
                        ? 'bg-gold-500 border-gold-500 text-black font-bold' 
                        : 'border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:border-gold-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {trans}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* CAROSERIE */}
            <FilterSection title="Caroserie">
              <div className="space-y-2">
                {BODY_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border ${filters.selectedBody === type ? 'bg-gold-500 border-gold-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gold-500'} transition-colors flex items-center justify-center`}>
                      {filters.selectedBody === type && <div className="w-2 h-2 bg-black rounded-[1px]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="bodyType" 
                      className="hidden"
                      checked={filters.selectedBody === type}
                      onChange={() => setFilters({...filters, selectedBody: filters.selectedBody === type ? '' : type})}
                    />
                    <span className={`text-sm ${filters.selectedBody === type ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* COMBUSTIBIL */}
            <FilterSection title="Combustibil">
              <div className="flex flex-wrap gap-2">
                {FUELS.map(fuel => (
                  <button
                    key={fuel}
                    onClick={() => setFilters({...filters, selectedFuel: filters.selectedFuel === fuel ? '' : fuel})}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      filters.selectedFuel === fuel 
                        ? 'bg-gold-500 border-gold-500 text-black font-bold' 
                        : 'border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400 hover:border-gold-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* LOCURI (Updated) */}
            <FilterSection title="Locuri">
              <div className="flex flex-wrap gap-2">
                {[4, 5, 7, 9].map(seats => (
                  <button
                    key={seats}
                    onClick={() => setFilters({...filters, selectedSeats: filters.selectedSeats === String(seats) ? '' : String(seats)})}
                    className={`px-3 py-2 rounded-lg border text-sm font-bold transition-all ${
                      filters.selectedSeats === String(seats)
                        ? 'bg-gold-500 border-gold-500 text-black' 
                        : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gold-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {seats === 9 ? '8+1' : seats}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* FEATURES (New) */}
            <FilterSection title="Dotări">
                <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {CAR_FEATURES.map(feature => (
                        <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-sm border ${filters.selectedFeatures.includes(feature) ? 'bg-gold-500 border-gold-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gold-500'} transition-colors flex items-center justify-center shrink-0`}>
                                {filters.selectedFeatures.includes(feature) && <Check size={12} className="text-black" />}
                            </div>
                            <span className={`text-sm ${filters.selectedFeatures.includes(feature) ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {feature}
                            </span>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={filters.selectedFeatures.includes(feature)}
                                onChange={() => toggleFeatureFilter(feature)}
                            />
                        </label>
                    ))}
                </div>
            </FilterSection>

            <button 
              onClick={resetFilters}
              className="w-full mt-6 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-dashed border-gray-400 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white rounded-lg transition-colors"
            >
              Resetează Filtrele
            </button>

            {/* Mobile Only: See Results Button */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
               <button 
                 onClick={() => setIsMobileFilterOpen(false)}
                 className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
               >
                 Vezi {filteredCars.length} Rezultate
               </button>
            </div>

          </div>
        </aside>

        {/* Car Grid */}
        <div className="flex-1">
           {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
               <Loader2 className="w-10 h-10 text-gold-500 animate-spin mb-4" />
               <p className="text-gray-500 dark:text-gray-400">Se încarcă oferta...</p>
             </div>
           ) : filteredCars.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Filter size={32} className="text-gray-500" />
                </div>
                <h3 className="text-xl text-gray-900 dark:text-white font-bold mb-2">Niciun rezultat găsit</h3>
                <p className="text-gray-500 dark:text-gray-400">Încearcă să ajustezi filtrele pentru a găsi mașina dorită.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 text-gold-500 hover:text-gray-900 dark:hover:text-white underline font-medium"
                >
                  Resetează toate filtrele
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Inventory;
