
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import CarCard from '../components/CarCard';
import { BRANDS } from '../constants';
import { useCars } from '../context/CarContext';
import { useTheme } from '../context/ThemeContext';

// Robust Brand Logo Component using CSS Masks for perfect coloring
const BrandLogo = ({ brand }: { brand: string }) => {
  const [isError, setIsError] = useState(false);

  // Precise mapping for SimpleIcons slugs
  const getSlug = (b: string) => {
    const map: Record<string, string> = {
      'Mercedes-Benz': 'mercedes',
      'Land Rover': 'landrover',
      'Range Rover': 'landrover',
      'Jaguar': 'jaguar',
      'Volkswagen': 'volkswagen',
      'BMW': 'bmw',
      'Porsche': 'porsche',
      'Audi': 'audi',
      'Tesla': 'tesla',
      'Volvo': 'volvo',
      'Skoda': 'skoda',
      'Dacia': 'dacia',
      'Toyota': 'toyota',
      'Ford': 'ford',
      'Mustang': 'ford',
      'Renault': 'renault',
      'Citroën': 'citroen',
      'Alfa Romeo': 'alfaromeo',
      'Maserati': 'maserati',
      'Aston Martin': 'astonmartin',
      'Rolls-Royce': 'rollsroyce',
      'McLaren': 'mclaren'
    };
    return map[b] || b.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const slug = getSlug(brand);
  const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${slug}.svg`;

  if (isError) {
    // Fallback Text Badge
    return (
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-full group-hover:bg-gold-500 transition-colors duration-300">
         <span className="text-xl font-bold text-gray-400 group-hover:text-black transition-colors">
           {brand.substring(0, 1).toUpperCase()}
         </span>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Hidden image to trigger onError if CDN fails */}
      <img 
        src={iconUrl}
        alt=""
        className="hidden"
        onError={() => setIsError(true)}
      />
      
      {/* CSS Mask Layer */}
      <div 
        className="w-12 h-12 bg-gray-900 dark:bg-white group-hover:bg-gold-500 transition-colors duration-300"
        style={{
          maskImage: `url(${iconUrl})`,
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          maskSize: 'contain',
          WebkitMaskImage: `url(${iconUrl})`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          WebkitMaskSize: 'contain'
        }}
      />
    </div>
  );
};

const Home: React.FC = () => {
  const { cars } = useCars();
  const hotDeals = cars.filter(c => c.isHotDeal).slice(0, 4);
  const [heroImage, setHeroImage] = useState("https://i.imgur.com/00Ys6FS.png");
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter out specific brands from the homepage logo display
  const brandsToExclude = ['BYD', 'Cupra', 'Lexus', 'Dodge', 'SsangYong'];
  const displayBrands = BRANDS.filter(brand => !brandsToExclude.includes(brand));

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent z-10" />
          <img 
            src={heroImage} 
            alt="Luxury Car" 
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite] transform transition-transform duration-[20s] hover:scale-110"
            style={{ animation: 'none' }} 
            onError={() => {
              setHeroImage("https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop");
            }}
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl px-4 pt-28 md:pt-0 md:mt-[-60px]">
          <h2 
            className="text-gold-500 font-black tracking-[0.2em] uppercase text-3xl md:text-5xl mb-6 animate-fade-in-up"
            style={{ textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 0 30px rgba(197,160,89,0.4)' }}
          >
            Autoparc RolCris
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Găsește Mașina <br/> Visurilor Tale
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto drop-shadow-lg shadow-black/50">
            Calitate Premium. Transparență Totală. O selecție exclusivistă de automobile verificate pentru cei care nu acceptă compromisuri.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/inventory" className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(197,160,89,0.4)]">
              Vezi Stocul Disponibil
            </Link>
          </div>
        </div>
      </section>

      {/* Search Widget Overlay */}
      <SearchWidget />

      {/* Special Offers Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">Oferte Speciale</h2>
              <div className="h-1 w-24 bg-gold-500 rounded-full" />
            </div>
            <Link to="/inventory" className="hidden md:flex items-center gap-2 text-gold-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Vezi toate ofertele <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {hotDeals.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/inventory" className="inline-flex items-center gap-2 text-gold-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Vezi toate ofertele <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 bg-white dark:bg-[#121212] border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Garanție Extinsă', desc: 'Garanție 12 luni pentru orice autoturism.' },
            { title: 'Verificare Tehnică', desc: 'Inspecție tehnică amănunțită realizată de experți.' },
            { title: 'Finanțare Rapidă', desc: 'Aprobare pe loc doar cu buletinul.' }
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0">
                <CheckCircle className="text-gold-500" size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold-500/5 to-transparent pointer-events-none" />
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">Mărci de Top</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Exploră stocul nostru diversificat de branduri premium. Alege marca preferată pentru a vedea oferta disponibilă.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {displayBrands.map(brand => (
                <Link 
                  key={brand}
                  to={`/inventory?make=${brand}`}
                  className="group glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 hover:border-gold-500 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] transition-all duration-300 hover:-translate-y-1 h-32"
                >
                  <BrandLogo brand={brand} />
                  
                  <span className="font-bold text-gray-900 dark:text-white text-xs text-center group-hover:text-gold-500 transition-colors">
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
