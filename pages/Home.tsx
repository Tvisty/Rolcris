
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [heroIndex, setHeroIndex] = useState(0);

  const heroSlides = [
    {
      id: 'buyback',
      image: '/buyback.webp',
      imageMobile: '/buyback-mobile.webp',
      alt: 'Buy-Back RolCris - Vii cu mașina veche, pleci cu una nouă',
      buttonText: 'Vezi Stoc Auto',
      buttonLink: '/inventory',
      badge: 'Buy-Back'
    },
    {
      id: 'finantare',
      image: '/finantare.webp',
      imageMobile: '/finantare-mobile.webp',
      alt: 'Finanțare Rapidă RolCris - Cumpără în rate cu Avans 0%',
      buttonText: 'Calculează Finanțarea',
      buttonLink: '/finance',
      badge: 'Finanțare Rapidă'
    },
    {
      id: 'garantie',
      image: '/garantie.webp',
      imageMobile: '/garantie-mobile.webp',
      alt: '12 Luni Garanție RolCris - Condu fără griji',
      buttonText: 'Contactează-ne',
      buttonLink: '/contact',
      badge: '12 Luni Garanție'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setHeroIndex(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setHeroIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Filter out specific brands from the homepage logo display
  const brandsToExclude = ['BYD', 'Cupra', 'Lexus', 'Dodge', 'SsangYong'];
  const displayBrands = BRANDS.filter(brand => !brandsToExclude.includes(brand));

  return (
    <div className="w-full">
      {/* Hero Section - Responsive Mobile & Desktop Banner */}
      <section className="relative w-full aspect-[9/16] min-h-[580px] max-h-[88dvh] sm:aspect-[16/10] md:aspect-[3168/1344] md:min-h-0 md:max-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0c1015] group">
        {/* Fullscreen Background Images */}
        <div className="absolute inset-0 w-full h-full z-0">
          {heroSlides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${heroIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <picture className="w-full h-full block">
                <source media="(max-width: 767px)" srcSet={slide.imageMobile} />
                <img 
                  src={slide.image} 
                  alt={slide.alt} 
                  fetchpriority={idx === 0 ? "high" : "auto"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover object-center select-none"
                />
              </picture>
            </div>
          ))}

          {/* Top gradient for navbar readability */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

          {/* Bottom subtle edge fade into Oferte Speciale */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c1015] via-[#0c1015]/40 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Side Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Slide-ul anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-gold-500 border border-white/10 hover:border-gold-500/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide-ul următor"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-gold-500 border border-white/10 hover:border-gold-500/50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronRight size={28} />
        </button>



        {/* Spacer to push controls to the bottom */}
        <div className="flex-1 pointer-events-none" />

        {/* Action Controls (Floating at the bottom of the hero) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 pb-5 sm:pb-12 text-center">
          
          {/* Dynamic Call To Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <Link 
              to={heroSlides[heroIndex].buttonLink} 
              key={`cta-btn-${heroIndex}`}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-black px-6 py-2.5 sm:px-10 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all transform hover:scale-105 shadow-[0_0_35px_rgba(197,160,89,0.4)] border border-gold-300/40 animate-fade-in-up"
            >
              <span>{heroSlides[heroIndex].buttonText}</span>
              <ArrowRight size={18} className="stroke-[2.5]" />
            </Link>

            {heroSlides[heroIndex].id !== 'buyback' && (
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-gold-500/50 px-5 py-2 sm:px-6 sm:py-4 rounded-xl font-semibold text-xs sm:text-base transition-all shadow-lg"
              >
                <span>Vezi Stoc Auto</span>
              </Link>
            )}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center items-center gap-2 sm:gap-2.5 mt-3 sm:mt-6">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setHeroIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  heroIndex === idx 
                    ? 'w-8 sm:w-10 bg-gold-500 shadow-[0_0_12px_rgba(197,160,89,0.6)]' 
                    : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}: ${slide.badge}`}
              />
            ))}
          </div>

        </div>

      </section>

      {/* Special Offers Section - Moved right after Hero */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10 md:mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">Oferte Speciale</h2>
              <div className="h-1 w-24 bg-gold-500 rounded-full" />
            </div>
            <Link to="/inventory" className="hidden md:flex items-center gap-2 text-gold-500 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">
              Vezi toate ofertele <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {hotDeals.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/inventory" className="inline-flex items-center gap-2 text-gold-500 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">
              Vezi toate ofertele <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Dealership Locations & Phone Numbers */}
      <section className="py-10 px-4 bg-white dark:bg-[#080b0e] border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block mb-1">Rețeaua Noastră</span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white">Locațiile Autoparc RolCris</h3>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 max-w-5xl mx-auto">
            {/* Satu Mare */}
            <div className="flex items-center justify-between sm:justify-start bg-gray-50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-full px-4 py-3 sm:py-2 hover:border-gold-500/50 transition-all shadow-md w-full sm:w-auto">
              <a href="https://www.google.com/maps?q=Rol+Cris,+Bulevardul+Lucian+Blaga+347A,+Satu+Mare" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold-500 transition-colors group">
                <MapPin size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm md:text-base">Satu Mare</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-white/20 mx-2"></div>
              <a href="tel:0740513713" className="flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-gold-500/20 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg sm:rounded-full transition-colors ml-4 sm:ml-0">
                <Phone size={14} className="text-gold-500" />
                <span className="font-bold sm:font-medium text-sm">0740 513 713</span>
              </a>
            </div>

            {/* Seini */}
            <div className="flex items-center justify-between sm:justify-start bg-gray-50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-full px-4 py-3 sm:py-2 hover:border-gold-500/50 transition-all shadow-md w-full sm:w-auto">
              <a href="https://www.google.com/maps?q=Piața+Unirii+2,+Seini" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold-500 transition-colors group">
                <MapPin size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm md:text-base">Seini</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-white/20 mx-2"></div>
              <a href="tel:0745042593" className="flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-gold-500/20 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg sm:rounded-full transition-colors ml-4 sm:ml-0">
                <Phone size={14} className="text-gold-500" />
                <span className="font-bold sm:font-medium text-sm">0745 042 593</span>
              </a>
            </div>

            {/* Tășnad */}
            <div className="flex items-center justify-between sm:justify-start bg-gray-50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-full px-4 py-3 sm:py-2 hover:border-gold-500/50 transition-all shadow-md w-full sm:w-auto">
              <a href="https://www.google.com/maps?q=Strada+Nicolae+Bălcescu+19,+Tășnad" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold-500 transition-colors group">
                <MapPin size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm md:text-base">Tășnad</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-white/20 mx-2"></div>
              <a href="tel:0745568886" className="flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-gold-500/20 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg sm:rounded-full transition-colors ml-4 sm:ml-0">
                <Phone size={14} className="text-gold-500" />
                <span className="font-bold sm:font-medium text-sm">0745 568 886</span>
              </a>
            </div>

            {/* Marghita */}
            <div className="flex items-center justify-between sm:justify-start bg-gray-50 dark:bg-black/50 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl sm:rounded-full px-4 py-3 sm:py-2 hover:border-gold-500/50 transition-all shadow-md w-full sm:w-auto">
              <a href="https://maps.app.goo.gl/zAQYuhevpt1sBHYK9" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gold-500 transition-colors group">
                <MapPin size={18} className="text-gold-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm md:text-base">Marghita</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-white/20 mx-2"></div>
              <a href="tel:0774955698" className="flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-gold-500/20 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg sm:rounded-full transition-colors ml-4 sm:ml-0">
                <Phone size={14} className="text-gold-500" />
                <span className="font-bold sm:font-medium text-sm">0774 955 698</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget */}
      <SearchWidget />

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
