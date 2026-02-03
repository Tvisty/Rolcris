
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
          <div className="absolute bottom-6 left-4 md:bottom-10 md:left-8 z-50 animate-bounce pointer-events-auto" style={{ animationDuration: '2s' }}>
              <div 
                className="group cursor-pointer relative"
                onClick={() => setShowPrizeModal(true)}
              >
                {/* Large 2D Heart Emoji - Smaller on mobile (5xl) vs desktop (8xl) */}
                <span role="img" aria-label="Prize Heart" className="text-5xl md:text-8xl filter drop-shadow-2xl select-none transform transition-transform group-hover:scale-110 block">
                  💖
                </span>
                
                {/* "Click Me" Indicator - Adjusted position for mobile */}
                <div className="absolute -top-4 -right-10 md:-top-6 md:-right-12 bg-white text-pink-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg animate-pulse whitespace-nowrap border border-pink-100 transform rotate-12">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md animate-fade-in">
           <div className="relative bg-white w-full max-w-xl rounded-[2rem] border-4 border-pink-200 p-6 md:p-8 shadow-[0_0_100px_rgba(236,72,153,0.6)] flex flex-col items-center text-center overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              {/* Background Ambient Effects */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-50 via-white to-pink-50 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl animate-pulse delay-700" />
              
              <button 
                onClick={() => setShowPrizeModal(false)}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-pink-100 p-2 rounded-full text-pink-600 hover:bg-pink-200 hover:scale-110 transition-all z-30 shadow-sm"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>

              {/* Main Image - Enlarged & Enhanced */}
              <div className="relative z-20 w-full mb-4 md:mb-8 group mt-2 shrink-0">
                 <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-pink-100 bg-white transform transition-all duration-700 hover:scale-[1.02] hover:rotate-1">
                    <img 
                      src={holidayPrize.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Prize" 
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain block max-h-[30vh] md:max-h-[50vh]"
                    />
                    
                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                 </div>
                 
                 {/* Floating 3D Emojis */}
                 <div className="absolute -top-6 -right-6 animate-bounce z-30 drop-shadow-xl text-3xl md:text-5xl">
                    🎁
                 </div>
                 <div className="absolute -bottom-6 -left-4 animate-bounce delay-1000 z-30 drop-shadow-xl text-3xl md:text-5xl">
                    ✨
                 </div>
              </div>

              <div className="space-y-4 md:space-y-6 relative z-20 w-full shrink-0">
                 <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest border border-pink-200 shadow-sm transform -translate-y-2">
                    <Gift size={14} className="md:w-4 md:h-4" /> Surpriză de Valentine's
                 </div>
                 
                 <h2 className="text-2xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 drop-shadow-sm leading-tight">
                   {holidayPrize.title || "Premiu Special"}
                 </h2>
                 
                 <p className="text-gray-600 text-sm md:text-lg leading-relaxed max-w-sm mx-auto">
                   {holidayPrize.description || "Te așteptăm în showroom pentru a descoperi surpriza pregătită special pentru tine!"}
                 </p>

                 <div className="pt-2 w-full pb-2 md:pb-0">
                    <button 
                      onClick={() => {
                        if (holidayPrize.buttonLink) {
                            window.open(holidayPrize.buttonLink, '_blank');
                        }
                        setShowPrizeModal(false);
                      }}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-2xl shadow-xl shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 md:gap-3"
                    >
                      <Heart size={20} className="md:w-6 md:h-6" fill="currentColor" />
                      <span className="text-lg md:text-xl">Vreau Premiul!</span>
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
