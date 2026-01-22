
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Car, Sun, Moon, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, seasonalTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Acasă', path: '/' },
    { name: 'Stoc Auto', path: '/inventory' },
    { name: 'Servicii', path: '/services' },
    { name: 'Finanțare', path: '/finance' },
    { name: 'Licitații', path: '/auctions' },
    { name: 'Despre Noi', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group relative">
          
          {/* Seasonal Decoration: Valentine */}
          {seasonalTheme === 'valentine' && (
            <div className="absolute -top-3 -right-3 z-10 animate-pulse">
               <Heart className="text-pink-500 fill-pink-500/50" size={24} />
            </div>
          )}

          {!logoError ? (
            <>
              {/* Subtle Glow Effect behind logo */}
              <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full ${seasonalTheme === 'valentine' ? 'bg-pink-500/30' : 'bg-gold-500/20'}`} />
              <img 
                src="https://i.imgur.com/e7JOUNo.png" 
                alt="RolCris Autoparc" 
                referrerPolicy="no-referrer"
                className="relative h-16 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  setLogoError(true);
                }}
              />
            </>
          ) : (
            <>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transform rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-[0_0_15px_rgba(197,160,89,0.5)] ${seasonalTheme === 'valentine' ? 'bg-pink-500 shadow-pink-500/50' : 'bg-gold-500'}`}>
                <Car className="text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-display font-bold tracking-wide leading-none ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'}`}>ROLCRIS</span>
                <span className={`text-xs font-semibold tracking-[0.2em] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${seasonalTheme === 'valentine' ? 'text-pink-400' : 'text-gold-500'}`}>AUTOPARC</span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-base font-black tracking-wide transition-all duration-300 relative group/link 
                ${isActive(link.path)
                  ? (seasonalTheme === 'valentine' ? 'text-pink-500' : 'text-gold-500')
                  : (isScrolled ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white' : 'text-white hover:text-gold-400')
                }`}
              style={{
                textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)'
              }}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${seasonalTheme === 'valentine' ? 'bg-pink-500' : 'bg-gold-500'} ${isActive(link.path) ? 'w-full' : 'w-0 group-hover/link:w-full'}`} />
            </Link>
          ))}
        </div>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10'}`}
             style={{
               filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))'
             }}
           >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
             onClick={toggleTheme}
             className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white'}`}
             style={{
               filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))'
             }}
           >
             {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
           </button>

          <button 
            className={`${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'} hover:text-gold-500 transition-colors`}
            style={{
               filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))'
             }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-fade-in-down">
           {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-bold p-3 rounded-lg border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors ${isActive(link.path) ? (seasonalTheme === 'valentine' ? 'text-pink-500 bg-pink-500/5' : 'text-gold-500 bg-gold-500/5') : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-2">
                {link.name}
              </div>
            </Link>
          ))}
          <a href="tel:+40740513713" className={`flex items-center justify-center gap-2 text-black py-3 rounded-lg font-bold mt-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] ${seasonalTheme === 'valentine' ? 'bg-pink-500' : 'bg-gold-500'}`}>
            <Phone size={20} />
            Sună Dealerul
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
