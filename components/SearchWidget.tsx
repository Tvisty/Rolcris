
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BRANDS } from '../constants';

const SearchWidget: React.FC = () => {
  const navigate = useNavigate();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    navigate(`/inventory?make=${make}&minYear=${minYear}&maxPrice=${maxPrice}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-30 mt-12 md:-mt-10 lg:-mt-16">
      <div className="glass-panel p-4 md:p-6 rounded-2xl shadow-2xl bg-white/80 dark:bg-[#0a0a0a]/80 border border-gray-200 dark:border-white/10 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Brand Select */}
          <div className="relative group">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block pl-1">Marcă</label>
            <div className="relative">
              <select 
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#121212]">Toate Mărcile</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand} className="bg-white dark:bg-[#121212]">{brand}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Model Input (Simplified for mock) */}
          <div className="relative group">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block pl-1">Model</label>
            <input 
              type="text"
              placeholder="Ex: X5, Panamera..."
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg p-3 focus:outline-none focus:border-gold-500 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>

          {/* Year Select */}
          <div className="relative group">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block pl-1">An Min.</label>
            <div className="relative">
              <select 
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#121212]">Oricare</option>
                <option value="2024" className="bg-white dark:bg-[#121212]">2024</option>
                <option value="2023" className="bg-white dark:bg-[#121212]">2023</option>
                <option value="2022" className="bg-white dark:bg-[#121212]">2022</option>
                <option value="2021" className="bg-white dark:bg-[#121212]">2021</option>
                <option value="2020" className="bg-white dark:bg-[#121212]">2020</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Price Select */}
          <div className="relative group">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block pl-1">Preț Max.</label>
            <div className="relative">
              <select 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-lg p-3 pr-10 appearance-none focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="" className="bg-white dark:bg-[#121212]">Nelimitat</option>
                <option value="50000" className="bg-white dark:bg-[#121212]">50.000 €</option>
                <option value="75000" className="bg-white dark:bg-[#121212]">75.000 €</option>
                <option value="100000" className="bg-white dark:bg-[#121212]">100.000 €</option>
                <option value="150000" className="bg-white dark:bg-[#121212]">150.000 €</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-full h-[46px] bg-gold-500 hover:bg-gold-600 text-black font-bold uppercase tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Search size={18} />
              Caută
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchWidget;
