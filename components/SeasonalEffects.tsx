
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-900/30 backdrop-blur-md animate-fade-in">
           <div className="relative bg-white w-full max-w-md rounded-3xl border-4 border-pink-100 p-6 shadow-[0_0_50px_rgba(236,72,153,0.3)] flex flex-col items-center text-center overflow-hidden animate-fade-in-up">
              
              {/* Background Glow - White/Pink Theme */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-50 to-white pointer-events-none" />
              
              <button 
                onClick={() => setShowPrizeModal(false)}
                className="absolute top-4 right-4 bg-pink-100 p-2 rounded-full text-pink-500 hover:bg-pink-200 transition-all z-30"
              >
                <X size={20} />
              </button>

              {/* Main Image - Auto Size / No Black */}
              <div className="relative z-20 w-full mb-6">
                 <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-pink-100 bg-white">
                    <img 
                      src={holidayPrize.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Prize" 
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain block"
                    />
                 </div>
                 
                 {/* Decorative Badge */}
                 <div className="absolute -top-3 -right-3 animate-pulse z-30 drop-shadow-md">
                    <Sparkles className="text-yellow-400" size={36} fill="currentColor" />
                 </div>
              </div>

              <div className="space-y-4 relative z-20 w-full">
                 <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-pink-200 shadow-sm">
                    <Gift size={14} /> Surpriză de Valentine's
                 </div>
                 
                 <h2 className="text-3xl font-display font-bold text-gray-900">
                   {holidayPrize.title || "Premiu Special"}
                 </h2>
                 
                 <p className="text-gray-600 leading-relaxed text-base">
                   {holidayPrize.description || "Te așteptăm în showroom pentru a descoperi surpriza pregătită special pentru tine!"}
                 </p>

                 <div className="pt-4 w-full">
                    <button 
                      onClick={() => setShowPrizeModal(false)}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Heart size={20} fill="currentColor" />
                      <span className="text-lg">Vreau Premiul!</span>
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
