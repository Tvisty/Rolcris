
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const [logoError, setLogoError] = useState(false);
  const { seasonalTheme } = useTheme();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/smautoparc/?locale=ro_RO' },
    { icon: Instagram, href: 'https://www.instagram.com/autoparc.rolcris/?fbclid=IwY2xjawPYdBlleHRuA2FlbQIxMABzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeRebHfifSibEdwgpxHKpT29l_Zb458aJrneJ0enkV74NOF54KFlT3WlfFe0Y_aem_Cpdc61MWFBQDd_qXdFKbfg#' }
  ];

  return (
    <footer className={`bg-white dark:bg-[#050505] border-t pt-16 pb-24 transition-colors duration-300 ${seasonalTheme === 'valentine' ? 'border-pink-500/20' : 'border-gray-200 dark:border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  {seasonalTheme === 'valentine' && (
                     <Heart className="absolute -top-3 -right-3 text-pink-500 fill-pink-500/20 animate-pulse" size={20} />
                  )}
                  {!logoError ? (
                    <img 
                      src="https://i.imgur.com/e7JOUNo.png" 
                      alt="RolCris Autoparc" 
                      referrerPolicy="no-referrer"
                      className="h-20 md:h-24 w-auto object-contain mb-4"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="flex flex-col mb-6">
                      <span className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-wide">ROLCRIS</span>
                      <span className={`text-sm font-semibold tracking-[0.2em] ${seasonalTheme === 'valentine' ? 'text-pink-500' : 'text-gold-500'}`}>AUTOPARC</span>
                    </div>
                  )}
                </div>
                
                {/* Partner Badge */}
                <img 
                  src="https://i.imgur.com/cOPZm14.png" 
                  alt="Partner Badge" 
                  className="h-16 w-auto object-contain mb-4"
                />
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Lider în vânzări auto premium și de lux. Oferim transparență, garanție și servicii de finanțare personalizate pentru mașina visurilor tale.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target={href !== '#' ? "_blank" : undefined}
                  rel={href !== '#' ? "noopener noreferrer" : undefined}
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white transition-all ${seasonalTheme === 'valentine' ? 'hover:bg-pink-500' : 'hover:bg-gold-500'} hover:text-black`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 font-display">Navigare Rapidă</h3>
            <ul className="space-y-3">
              {[
                { name: 'Acasă', path: '/' },
                { name: 'Stoc Auto', path: '/inventory' },
                { name: 'Servicii', path: '/services' },
                { name: 'Despre Noi', path: '/about' },
                { name: 'Finanțare', path: '/finance' },
                { name: 'Contact', path: '/contact' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className={`text-gray-600 dark:text-gray-400 transition-colors text-sm ${seasonalTheme === 'valentine' ? 'hover:text-pink-500' : 'hover:text-gold-500'}`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6 font-display">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className={seasonalTheme === 'valentine' ? "text-pink-500 mt-1 shrink-0" : "text-gold-500 mt-1 shrink-0"} size={18} />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-semibold block">Autoparc 1:</span>
                  Satu Mare, B-dul Lucian Blaga 347, Jud. Satu Mare
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className={seasonalTheme === 'valentine' ? "text-pink-500 mt-1 shrink-0" : "text-gold-500 mt-1 shrink-0"} size={18} />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-semibold block">Autoparc 2:</span>
                  Seini, Piața Unirii 2, Jud. Maramureș
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className={seasonalTheme === 'valentine' ? "text-pink-500 mt-1 shrink-0" : "text-gold-500 mt-1 shrink-0"} size={18} />
                <div className="text-sm">
                  <span className="text-gray-900 dark:text-white font-semibold block">Autoparc 3:</span>
                  Tășnad, Str. N. Bălcescu 19, Jud. Satu Mare
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <Phone className={seasonalTheme === 'valentine' ? "text-pink-500 shrink-0" : "text-gold-500 shrink-0"} size={18} />
                <span className="text-sm">0740 513 713</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className={seasonalTheme === 'valentine' ? "text-pink-500 shrink-0" : "text-gold-500 shrink-0"} size={18} />
                <span className="text-sm">autoparcrolcris@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            <Link to="/admin" className="hover:text-gray-400 transition-colors cursor-default">©</Link> 2024 Autoparc RolCris. Toate drepturile rezervate.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs">Termeni și Condiții</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs">Politica de Confidențialitate</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
