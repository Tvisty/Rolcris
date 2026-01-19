import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "40740513713"; 
  const message = "Salut! Doresc mai multe detalii despre oferta Autoparc RolCris.";
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[60] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-[#25D366] text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] group"
      aria-label="Chat pe WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold ml-0 group-hover:ml-2">
        WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;