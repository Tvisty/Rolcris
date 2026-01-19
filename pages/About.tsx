import React, { useEffect } from 'react';
import { Award, Users, Car, ShieldCheck, Clock, CheckCircle2, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Showroom" 
            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Award className="text-gold-500" size={18} />
            <span className="text-gold-500 font-bold text-xs uppercase tracking-[0.2em]">Din 2005 în Satu Mare</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-2xl animate-fade-in-up">
            20 ANI DE <br/> <span className="text-gold-500">EXPERIENȚĂ</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto drop-shadow-lg animate-fade-in-up delay-200">
            Liderul pieței auto premium din Satu Mare, oferind excelență și încredere de peste două decenii.
          </p>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div>
              <h2 className="text-gold-500 font-bold tracking-[0.2em] uppercase text-sm mb-2">Cine suntem</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                Dealer auto Satu Mare cu o viziune modernă.
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Suntem un parc auto autorizat în comerțul cu autoturisme, cu experiență în vânzări și activitate din 2005. Vă oferim posibilitatea de a achiziționa un autoturism cu modalități de plată flexibile, precum plata pe loc, prin transfer bancar sau printr-un sistem avantajos de rate, indiferent de vechimea autoturismului.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-4 border-gold-500 pl-4">
                <span className="block text-3xl font-bold text-gray-900 dark:text-white">2005</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">An Înființare</span>
              </div>
              <div className="border-l-4 border-gold-500 pl-4">
                <span className="block text-3xl font-bold text-gray-900 dark:text-white">5000+</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Clienți Mulțumiți</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in-right">
             <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold-500/30 rounded-2xl z-0" />
             <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" 
                  alt="Premium car front" 
                  className="w-full h-full object-cover"
                />
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold-500 rounded-2xl hidden md:flex items-center justify-center p-6 text-center shadow-xl">
                <p className="text-black font-bold font-display leading-tight">CALITATE <br/> GARANTATĂ</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-[#121212] border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Valorile Noastre</h2>
            <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="group glass-panel p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gold-500/50 transition-all duration-500 bg-gray-50/50 dark:bg-white/5">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Serviciu Clienți</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Echipa noastră de experți dedicată este mereu pregătită să ofere consultanță personalizată și să răspundă la nevoile și preferințele fiecărui client.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group glass-panel p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gold-500/50 transition-all duration-500 bg-gray-50/50 dark:bg-white/5">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                <Car size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gamă Variată</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Indiferent dacă cauți o mașină compactă pentru oraș sau un SUV spațios pentru aventuri în natură, selecția noastră captivantă îți oferă tot ceea ce ai nevoie.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group glass-panel p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gold-500/50 transition-all duration-500 bg-gray-50/50 dark:bg-white/5">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Transparență</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Suntem cunoscuți pentru transparența totală în procesul nostru de vânzare. Oferim informații detaliate despre istoricul vehiculelor și orice alt aspect relevant.
              </p>
            </div>

            {/* Value 4 */}
            <div className="group glass-panel p-8 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-gold-500/50 transition-all duration-500 bg-gray-50/50 dark:bg-white/5">
              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Calitate</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Fiecare mașină din selecția noastră a fost atent verificată și testată, astfel încât să vă oferim doar cele mai fiabile și durabile opțiuni de pe piață.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="rounded-2xl overflow-hidden shadow-2xl relative z-10 aspect-[4/3] bg-gray-200 dark:bg-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                  alt="Customer handshake" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1553444958-3d52d878d91c?q=80&w=1000&auto=format&fit=crop";
                  }}
                />
             </div>
             <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-64 border-4 border-gold-500/10 rounded-full z-0 pointer-events-none" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Filozofia Noastră</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              La Autoparc RolCris, nu vindem doar vehicule; vindem siguranță, performanță și o experiență de viață îmbunătățită. Considerăm că fiecare detaliu contează, de la prima strângere de mână până la garanția oferită după achiziție.
            </p>
            <ul className="space-y-4">
              {[
                'Peste 20 de ani de reputație impecabilă',
                'Colaborare cu parteneri financiari de top',
                'Sistem de rate flexibil și aprobare rapidă',
                'Fiecare vehicul trece prin 360 puncte de verificare'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-900 dark:text-gray-200 font-medium">
                  <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center text-black">
                    <CheckCircle2 size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Link to="/inventory" className="inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:scale-105">
                Vezi Stocul Curent
                <Car size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-gray-100 dark:bg-[#080808] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Unde ne găsiți</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Suntem prezenți în 3 locații strategice pentru a fi mai aproape de tine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: 'Satu Mare', addr: 'B-dul Lucian Blaga 347', tel: '0740 513 713', color: 'gold' },
              { city: 'Seini', addr: 'Piața Unirii 2', tel: '0745 123 456', color: 'gray' },
              { city: 'Tășnad', addr: 'Str. N. Bălcescu 19', tel: '0742 987 654', color: 'gray' },
            ].map((loc, i) => (
              <div key={i} className="bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 hover:border-gold-500/30 transition-all">
                <MapPin className="text-gold-500 mb-4" size={32} />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{loc.city}</h4>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{loc.addr}</p>
                <div className="flex flex-col gap-3">
                  <a href={`tel:${loc.tel}`} className="flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-gold-500 transition-colors">
                    <Phone size={16} className="text-gold-500" /> {loc.tel}
                  </a>
                  <a href="https://wa.me/40740513713" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-[#25D366] transition-colors">
                    <MessageSquare size={16} className="text-[#25D366]" /> WhatsApp Online
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;