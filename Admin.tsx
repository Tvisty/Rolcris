
import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, CheckCircle, FileText, Building2, User, ArrowRight, Wallet, Percent, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Finance: React.FC = () => {
  // Calculator State - Defaults updated to match your example (10990 / 0% / 60 months)
  const [vehiclePrice, setVehiclePrice] = useState(10990);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0);
  const [periodMonths, setPeriodMonths] = useState(60);
  // Adjusted interest rate to approx 13.4% to yield ~252 Euro for the 10990/60m/0% scenario
  const [interestRate] = useState(13.4); 

  // Calculation Logic
  const calculation = useMemo(() => {
    const downPaymentAmount = vehiclePrice * (downPaymentPercent / 100);
    const residualValueAmount = 0; // Removed residual value
    const financedAmount = vehiclePrice - downPaymentAmount;
    
    // Standard Leasing/Loan Formula
    const monthlyRate = interestRate / 100 / 12;
    const numerator = (financedAmount - (residualValueAmount / Math.pow(1 + monthlyRate, periodMonths))) * monthlyRate;
    const denominator = 1 - Math.pow(1 + monthlyRate, -periodMonths);
    
    const monthlyPayment = numerator / denominator;
    const totalCost = (monthlyPayment * periodMonths) + downPaymentAmount + residualValueAmount;

    return {
      downPaymentAmount,
      financedAmount,
      monthlyPayment,
      totalCost,
      residualValueAmount
    };
  }, [vehiclePrice, downPaymentPercent, periodMonths, interestRate]);

  const [activeTab, setActiveTab] = useState<'individual' | 'company'>('individual');

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="px-4 max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Finanțare <span className="text-gold-500">Premium</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Transformăm visul tău în realitate. Oferim soluții de finanțare flexibile, leasing și credit auto, personalizate pentru nevoile tale, cu aprobare rapidă.
        </p>
      </section>

      <div className="px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
        
        {/* Calculator Left Column */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 md:p-8 rounded-2xl h-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-500">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Calculator Rate</h2>
                <p className="text-xs text-gray-500">Estimare orientativă (Dobânzi între 10% - 14%)</p>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-10">
              
              {/* Vehicle Price */}
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <label className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Wallet size={16} /> Preț Autoturism (EUR)
                  </label>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg px-3 py-1 border border-transparent focus-within:border-gold-500 transition-colors">
                    <input 
                      type="number"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(Number(e.target.value))}
                      className="bg-transparent text-gray-900 dark:text-white font-bold text-right outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-500 font-bold">€</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="50000" 
                  step="50" // Changed step from 500 to 50
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 transition-all"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1.000 €</span>
                  <span>50.000 €</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Percent size={16} /> Avans ({downPaymentPercent}%)
                  </label>
                  <span className="text-gray-900 dark:text-white font-bold">{calculation.downPaymentAmount.toLocaleString()} €</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="80" 
                  step="5" 
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 transition-all"
                />
                 <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
                    <Calendar size={16} /> Perioadă ({periodMonths} luni)
                  </label>
                  <span className="text-gray-900 dark:text-white font-bold">{periodMonths / 12} Ani</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="60" 
                  step="12" 
                  value={periodMonths}
                  onChange={(e) => setPeriodMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-400 transition-all"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 An</span>
                  <span>5 Ani</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Results Right Column */}
        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-8 sticky top-28 shadow-[0_0_50px_rgba(197,160,89,0.05)]">
              <h3 className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs font-bold mb-6 border-b border-gray-200 dark:border-white/5 pb-4">Rezultat Simulare</h3>
              
              <div className="mb-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Rată Lunară Estimată</p>
                <div className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white flex items-start gap-1">
                  {Math.round(calculation.monthlyPayment).toLocaleString()} 
                  <span className="text-2xl text-gold-500 mt-2">€</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">*TVA inclus dacă este aplicabil</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Suma Finanțată</span>
                  <span className="text-gray-900 dark:text-white font-bold">{calculation.financedAmount.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Avans Total</span>
                  <span className="text-gray-900 dark:text-white font-bold">{calculation.downPaymentAmount.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total de Plată (Estimat)</span>
                  <span className="text-gray-900 dark:text-white font-bold">{Math.round(calculation.totalCost).toLocaleString()} €</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                 <Link to="/contact" className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 rounded-lg text-center transition-all flex items-center justify-center gap-2">
                    Solicită Ofertă
                    <ArrowRight size={18} />
                 </Link>
                 <Link to="/inventory" className="w-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold py-4 rounded-lg text-center transition-all">
                    Alege Mașina
                 </Link>
              </div>

              <p className="text-[10px] text-gray-500 dark:text-gray-600 mt-6 leading-tight text-center">
                *Această simulare are caracter strict informativ și nu reprezintă o ofertă contractuală. Dobânzile și condițiile pot varia în funcție de profilul clientului și de partenerul financiar ales.
              </p>
           </div>
        </div>

      </div>

      {/* Documents Section */}
      <section className="px-4 max-w-7xl mx-auto">
         <div className="flex justify-center mb-8 gap-4">
            <button 
              onClick={() => setActiveTab('individual')}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'individual' ? 'bg-gold-500 text-black' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <User size={18} /> Persoane Fizice
            </button>
            <button 
              onClick={() => setActiveTab('company')}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'company' ? 'bg-gold-500 text-black' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <Building2 size={18} /> Persoane Juridice
            </button>
         </div>

         <div className="glass-panel p-8 md:p-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212]/50">
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">Condiții & Documente Necesare</h3>
            
            {/* Added Eligibility Info Block */}
            <div className="mb-10 bg-gold-500/5 border border-gold-500/20 rounded-xl p-6">
              {activeTab === 'individual' ? (
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Posibilitate credit pentru persoane fizice (salariați, pensionari) cu vârsta cuprinsă între 18-75 ani.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Perioadă de creditare flexibilă, de la 12 până la 60 luni.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Condiții minime: 3 luni vechime la actualul angajator.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">Se acceptă persoane cu contract de muncă în străinătate.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">Credit online rapid, inclusiv pentru persoane cu istoric negativ.</span>
                  </li>
                </ul>
              ) : (
                <div className="text-center">
                   <p className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                     <CheckCircle className="text-gold-500" size={24} />
                     Finanțare leasing auto pentru persoane juridice.
                   </p>
                   <p className="text-gray-600 dark:text-gray-400">Oferim soluții de leasing financiar avantajoase, cu deduceri fiscale și rate personalizate pentru flota companiei tale.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'individual' ? (
                <>
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">Act de Identitate</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Copie după cartea de identitate (buletin).</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">Adeverință Venit</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Pe ultimele 3 luni sau talon de pensie.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">Cerere Finanțare</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Formular tipizat completat la sediu.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                   <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">CUI & Act Constitutiv</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Copii după certificatul de înregistrare.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">Bilanț contabil</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Ultimul bilanț anual depus + balanțe recente.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                    <FileText className="text-gold-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold mb-1">Hotărâre AGA</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Pentru aprobarea contractării leasingului.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Colaborăm cu toate instituțiile financiare majore din România pentru a-ți oferi cea mai bună dobândă.
              </p>
              <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">BT Leasing</span>
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Unicredit</span>
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">BCR Leasing</span>
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Porsche Bank</span>
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Impuls</span>
              </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Finance;
