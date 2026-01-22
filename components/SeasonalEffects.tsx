
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Heart, Sparkles, X, Gift } from 'lucide-react';

const SeasonalEffects: React.FC = () => {
  const { seasonalTheme, holidayPrize } = useTheme();
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  if (seasonalTheme !== 'valentine') return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
        
        {/* 1. Pink/Red Atmospheric Glow */}
        <div className="absolute inset-0 bg-pink-500/5 mix-blend-overlay"></div>
        
        {/* 2. Interactive Prize Trigger (Replaces Teddy Bear with 2D Heart) */}
        {holidayPrize?.isEnabled && (
          <div className="absolute bottom-10 left-8 z-50 animate-bounce pointer-events-auto" style={{ animationDuration: '2s' }}>
              <div 
                className="group cursor-pointer relative"
                onClick={() => setShowPrizeModal(true)}
              >
                {/* Large 2D Heart Emoji */}
                <span role="img" aria-label="Prize Heart" className="text-8xl filter drop-shadow-2xl select-none transform transition-transform group-hover:scale-110 block">
                  💖
                </span>
                
                {/* "Click Me" Indicator */}
                <div className="absolute -top-6 -right-12 bg-white text-pink-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse whitespace-nowrap border border-pink-100 transform rotate-12">
                   🎁 Apasă-mă!
                   <div className="absolute bottom-0 left-0 w-2 h-2 bg-white transform rotate-45 translate-y-1/2 -translate-x-1/2 ml-2"></div>
                </div>
              </div>
          </div>
        )}

        {/* 3. Bottom Right: Love Letter */}
        <div className="absolute bottom-10 right-24 md:right-32 z-50 animate-float-up pointer-events-auto" style={{ animationDuration: '4s' }}>
            <span role="img" aria-label="Love Letter" className="text-8xl transform rotate-12 block filter drop-shadow-2xl select-none hover:scale-110 transition-transform cursor-pointer">
              💌
            </span>
        </div>

        {/* 4. Falling Hearts Animation */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-fall-down"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-50px',
              animationDuration: `${5 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6
            }}
          >
            <Heart 
              fill="currentColor" 
              className={i % 2 === 0 ? "text-red-500" : "text-pink-400"} 
              size={Math.random() * 20 + 15} 
            />
          </div>
        ))}

        {/* 5. Side Sparkles */}
        {[...Array(6)].map((_, i) => (
            <div 
              key={`sparkle-${i}`}
              className="absolute animate-pulse text-pink-400"
              style={{
                left: i % 2 === 0 ? `${Math.random() * 5}%` : undefined,
                right: i % 2 !== 0 ? `${Math.random() * 5}%` : undefined,
                top: `${20 + i * 15}%`,
                animationDuration: '2s'
              }}
            >
              <Sparkles size={24} />
            </div>
        ))}
      </div>

      {/* PRIZE POPUP MODAL */}
      {showPrizeModal && holidayPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
           <div className="relative bg-white dark:bg-[#121212] w-full max-w-md rounded-3xl border-2 border-pink-500/30 p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
              
              <button 
                onClick={() => setShowPrizeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 transition-colors z-20"
              >
                <X size={28} />
              </button>

              <div className="w-48 h-48 rounded-2xl overflow-hidden mb-6 shadow-xl border border-pink-100 dark:border-white/10 relative z-10 bg-gray-50">
                 <img 
                   src={holidayPrize.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"} 
                   alt="Prize" 
                   className="w-full h-full object-cover"
                 />
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-500 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-pink-500/20">
                    <Gift size={14} /> Surpriză de Valentine's
                 </div>
                 
                 <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                   {holidayPrize.title || "Premiu Special"}
                 </h2>
                 
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                   {holidayPrize.description || "Te așteptăm în showroom pentru a descoperi surpriza pregătită special pentru tine!"}
                 </p>

                 <div className="pt-4">
                    <button 
                      onClick={() => setShowPrizeModal(false)}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-pink-500/30 transition-transform hover:scale-105 active:scale-95"
                    >
                      Super, Mulțumesc!
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default SeasonalEffects;
