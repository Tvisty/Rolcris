import React, { useEffect } from 'react';
import { Wrench, Sparkles, Wallet, CircleDot, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: 'service',
      title: 'Service Propriu',
      icon: Wrench,
      description: 'Dispunem de un service auto ultra-modern, autorizat RAR, dotat cu echipamente de ultimă generație pentru diagnosticare și reparații. Echipa noastră de mecanici specializați asigură întreținerea corectă a autoturismului dumneavoastră, de la revizii periodice până la reparații complexe de motor și transmisie.',
      features: ['Diagnosticare computerizată', 'Reparații mecanice și electrice', 'Revizii periodice', 'Garanție pentru manoperă și piese'],
      image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'detailing',
      title: 'Cosmetică & Detailing',
      icon: Sparkles,
      description: 'Redăm strălucirea de showroom a mașinii tale. Folosim produse premium și tehnici avansate pentru curățarea în profunzime a interiorului și protecția exteriorului. Serviciile noastre de detailing includ polish profesional, protecție ceramică și tratamente pentru piele, asigurând un aspect impecabil și o valoare de revânzare crescută.',
      features: ['Polish profesional caroserie', 'Aplicare protecție ceramică', 'Curățare injecție-extracție tapiterie', 'Tratament ozonificare'],
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'finance',
      title: 'Finanțare Auto',
      icon: Wallet,
      description: 'Transformăm procesul de achiziție într-o experiență simplă și rapidă. Colaborăm cu principalele instituții bancare și IFN-uri din România pentru a oferi soluții de finanțare personalizate, atât pentru persoane fizice (Credit Auto), cât și pentru persoane juridice (Leasing Financiar). Aprobarea se poate obține rapid, de multe ori chiar în aceeași zi.',
      features: ['Avans flexibil de la 15%', 'Perioadă de până la 60 de luni', 'Dobânzi preferențiale', 'Aprobare rapidă online'],
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'tires',
      title: 'Vulcanizare & Roți',
      icon: CircleDot,
      description: 'Siguranța dumneavoastră este prioritatea noastră. Oferim servicii complete de vulcanizare, schimb de anvelope, echilibrare roți și geometrie 3D. Deținem un stoc variat de anvelope noi și second-hand premium, precum și jante de aliaj pentru diverse mărci auto. Hotelul de anvelope vă scapă de grija depozitării între sezoane.',
      features: ['Schimb anvelope turisme și SUV', 'Echilibrare computerizată', 'Geometrie roți 3D', 'Hotel anvelope'],
      image: 'https://images.unsplash.com/photo-1598084991519-c90900bf996c?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'paperwork',
      title: 'Intermedieri Acte Auto',
      icon: FileText,
      description: 'Scăpați de birocrație și de cozile interminabile. Ne ocupăm noi de tot procesul de înmatriculare, transcriere sau radiere a autoturismului. Oferim consultanță completă pentru redactarea contractelor, obținerea numerelor provizorii (roșii) și definitive, precum și încheierea polițelor de asigurare RCA și CASCO la cele mai bune prețuri.',
      features: ['Înmatriculări auto complete', 'Redactare contracte vânzare-cumpărare', 'Numere provizorii pe loc', 'Asigurări RCA și CASCO'],
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=2026&auto=format&fit=crop'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-12 transition-colors duration-300">
      
      {/* Hero Header */}
      <section className="px-4 max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
          Servicii <span className="text-gold-500">Premium</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          La Autoparc RolCris, oferim mai mult decât mașini. Oferim un ecosistem complet de servicii auto integrate, menite să vă asigure confortul și siguranța la cele mai înalte standarde.
        </p>
      </section>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 space-y-24 mb-24">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            
            {/* Visual Side */}
            <div className="w-full lg:w-1/2 relative group animate-fade-in">
              <div className={`absolute top-6 ${index % 2 === 1 ? 'left-6' : 'right-6'} w-full h-full border-2 border-gold-500/20 rounded-2xl z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2`} />
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200 dark:bg-white/5">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="bg-gold-500 w-12 h-12 rounded-xl flex items-center justify-center text-black mb-4 shadow-lg shadow-gold-500/20">
                    <service.icon size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 space-y-6 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                {service.title}
              </h2>
              <div className="h-1 w-20 bg-gold-500 rounded-full" />
              
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {service.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-gold-500 shrink-0 mt-1" size={18} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 font-bold border-b-2 border-gold-500 hover:border-gold-600 transition-colors pb-1"
                >
                  Programează o vizită <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CTA Section */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="glass-panel p-12 rounded-3xl bg-gray-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="Background" 
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <ShieldCheck className="mx-auto text-gold-500 mb-6" size={64} />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Tot ce ai nevoie într-un singur loc</h2>
            <p className="text-gray-300 text-lg mb-8">
              Fie că dorești să cumperi o mașină, să o repari pe cea actuală sau să îi redai strălucirea, echipa RolCris este aici pentru tine.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 px-10 rounded-xl transition-all shadow-xl hover:scale-105"
            >
              Contactează-ne Acum
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;