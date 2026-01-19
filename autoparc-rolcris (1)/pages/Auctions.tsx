
import React, { useState, useEffect } from 'react';
import { useCars } from '../context/CarContext';
import { Auction } from '../types';
import { Clock, Gavel, AlertCircle, CheckCircle, Trophy, History, Calendar, Gauge, Fuel } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper for countdown
const CountdownTimer = ({ endTime, onExpire }: { endTime: number; onExpire?: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const left = endTime - now;
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  if (timeLeft <= 0) return <span className="text-red-500 font-bold">Expirat</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Critical time styling (< 1 min)
  const isCritical = hours === 0 && minutes === 0;

  return (
    <div className={`font-mono text-xl md:text-2xl font-bold flex gap-2 ${isCritical ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
      <div className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
        {String(hours).padStart(2, '0')}h
      </div>
      <span className="self-center">:</span>
      <div className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
        {String(minutes).padStart(2, '0')}m
      </div>
      <span className="self-center">:</span>
      <div className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
        {String(seconds).padStart(2, '0')}s
      </div>
    </div>
  );
};

const AuctionCard: React.FC<{ auction: Auction }> = ({ auction }) => {
  const { placeBid } = useCars();
  const [bidAmount, setBidAmount] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const minBid = auction.currentBid + 50; // Minimum increment step

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(bidAmount);
    
    if (amount < minBid) {
      setMessage({ type: 'error', text: `Oferta minimă este ${minBid} €` });
      return;
    }
    if (!name || !phone) {
      setMessage({ type: 'error', text: "Numele și telefonul sunt obligatorii." });
      return;
    }

    const result = await placeBid(auction.id, {
      bidderName: name,
      bidderPhone: phone,
      amount: amount,
      timestamp: Date.now()
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setBidAmount('');
      setIsBidding(false);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const isActive = auction.status === 'active' && Date.now() < auction.endTime;
  const lastBidder = auction.bids.length > 0 ? auction.bids[auction.bids.length - 1] : null;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row">
      {/* Image Side */}
      <div className="w-full md:w-1/3 relative h-64 md:h-auto">
        <img 
          src={auction.carImage} 
          alt={`${auction.carMake} ${auction.carModel}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-gold-500 text-black px-3 py-1 rounded font-bold text-xs uppercase flex items-center gap-1 shadow-lg">
          <Gavel size={12} /> Licitație Activă
        </div>
        {auction.extensionCount > 0 && (
          <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-bold text-xs uppercase shadow-lg">
            Extins (+10 min) {auction.extensionCount}/3
          </div>
        )}
      </div>

      {/* Content Side */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white mb-2">{auction.carMake} {auction.carModel}</h3>
               {/* Car Details Badges */}
               <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                    <Calendar size={12} className="text-gold-500" /> {auction.carYear}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                    <Gauge size={12} className="text-gold-500" /> {auction.carMileage.toLocaleString()} km
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                    <Fuel size={12} className="text-gold-500" /> {auction.carFuel}
                  </span>
               </div>
               {auction.carDescription && (
                 <p className="text-sm text-gray-500 line-clamp-2">{auction.carDescription}</p>
               )}
             </div>
             {isActive ? (
                <div className="flex flex-col items-end">
                   <span className="text-xs text-gray-500 uppercase font-bold mb-1">Timp Rămas</span>
                   <CountdownTimer endTime={auction.endTime} />
                </div>
             ) : (
                <span className="bg-gray-200 dark:bg-white/10 text-gray-500 px-3 py-1 rounded font-bold">Terminat</span>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
            <div>
               <p className="text-xs text-gray-500 uppercase font-bold mb-1">Preț Curent</p>
               <p className="text-3xl font-display font-bold text-gold-500">{auction.currentBid.toLocaleString()} €</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-500 uppercase font-bold mb-1">Ultima Ofertă</p>
               {lastBidder ? (
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">{lastBidder.bidderName}</p>
                   <p className="text-xs text-gray-500">{new Date(lastBidder.timestamp).toLocaleTimeString()}</p>
                 </div>
               ) : (
                 <p className="text-gray-400 italic">Fără oferte</p>
               )}
            </div>
          </div>
        </div>
        
        {isActive && (
          <div>
             {message && (
               <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                 {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                 {message.text}
               </div>
             )}

             {!isBidding ? (
               <button 
                 onClick={() => setIsBidding(true)}
                 className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
               >
                 <Gavel size={20} /> Plasează Ofertă
               </button>
             ) : (
               <form onSubmit={handleBid} className="space-y-3 bg-gray-100 dark:bg-white/5 p-4 rounded-xl animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="font-bold text-gray-900 dark:text-white">Plasează oferta ta</h4>
                     <button type="button" onClick={() => setIsBidding(false)} className="text-xs text-gray-500 hover:text-white">Anulează</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <input 
                       type="text" 
                       placeholder="Nume" 
                       required 
                       value={name}
                       onChange={e => setName(e.target.value)}
                       className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-500 text-gray-900 dark:text-white"
                     />
                     <input 
                       type="tel" 
                       placeholder="Telefon" 
                       required 
                       value={phone}
                       onChange={e => setPhone(e.target.value)}
                       className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-gold-500 text-gray-900 dark:text-white"
                     />
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder={`Minim ${minBid} €`} 
                      required 
                      min={minBid}
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-3 font-bold text-gray-900 dark:text-white outline-none focus:border-gold-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">€</span>
                  </div>
                  <button type="submit" className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors">
                    Confirmă Ofertă
                  </button>
               </form>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const Auctions: React.FC = () => {
  const { auctions, isLoading } = useCars();
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  const activeAuctions = auctions.filter(a => a.status === 'active' && Date.now() < a.endTime);
  const completedAuctions = auctions.filter(a => a.status === 'completed' || a.status === 'cancelled' || Date.now() >= a.endTime);

  const displayedAuctions = filter === 'active' ? activeAuctions : completedAuctions;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#0a0a0a]">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full mb-6">
          <Gavel className="text-gold-500" size={18} />
          <span className="text-gold-500 font-bold text-xs uppercase tracking-[0.2em]">Licitații Online</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6">
          Oferte Exclusive <span className="text-gold-500">Live</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Participă la licitațiile noastre pentru autoturisme premium verificate. Prinde oferta înainte ca timpul să expire!
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Filter Tabs */}
        <div className="flex justify-center mb-10 gap-4">
           <button 
             onClick={() => setFilter('active')}
             className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${filter === 'active' ? 'bg-gold-500 text-black shadow-lg' : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
           >
             <Clock size={18} /> Active ({activeAuctions.length})
           </button>
           <button 
             onClick={() => setFilter('completed')}
             className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${filter === 'completed' ? 'bg-gold-500 text-black shadow-lg' : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
           >
             <History size={18} /> Finalizate
           </button>
        </div>

        {/* List */}
        <div className="space-y-8">
           {isLoading ? (
             <div className="text-center py-20">Se încarcă licitațiile...</div>
           ) : displayedAuctions.length > 0 ? (
             displayedAuctions.map(auction => (
               <AuctionCard key={auction.id} auction={auction} />
             ))
           ) : (
             <div className="text-center py-20 glass-panel rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5">
                <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nicio licitație găsită</h3>
                <p className="text-gray-500">Momentan nu există licitații în această categorie.</p>
             </div>
           )}
        </div>
        
        {/* Rules Section */}
        <div className="mt-20 glass-panel p-8 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10">
           <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white mb-6">Regulament Licitații</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold shrink-0">1</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Extindere Automată</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Dacă se plasează o ofertă în ultimul minut, timpul se prelungește automat cu 10 minute (maxim 3 ori).</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold shrink-0">2</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Ofertare Validă</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Fiecare ofertă trebuie să fie cu cel puțin 50€ mai mare decât prețul curent.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold shrink-0">3</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Câștigătorul</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Cel care are oferta cea mai mare la expirarea timpului va fi contactat pentru finalizarea achiziției.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Auctions;
