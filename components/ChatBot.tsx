
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useCars } from '../context/CarContext';

// Define the interface for the message structure
interface Message {
  role: 'user' | 'model';
  text: string;
}

// Static Knowledge Base derived from the website pages
const WEBSITE_KNOWLEDGE_BASE = `
--- DESPRE NOI (ABOUT US) ---
- Nume Companie: Autoparc RolCris.
- Istoric: Activăm din 2005 în Satu Mare (peste 20 de ani de experiență).
- Reputație: Peste 5000+ clienți mulțumiți.
- Filozofie: Transparență totală, calitate garantată, nu vindem doar mașini, ci siguranță.

--- LOCAȚII ȘI CONTACT ---
1. Satu Mare: B-dul Lucian Blaga 347, Jud. Satu Mare.
2. Seini: Piața Unirii 2, Jud. Maramureș.
3. Tășnad: Str. N. Bălcescu 19, Jud. Satu Mare.
- Telefon General: 0740 513 713 (Răspundem și pe WhatsApp).
- Email: contact@autoparcrolcris.ro
- Program: Luni - Vineri (09:00 - 18:00), Sâmbătă (09:00 - 14:00), Duminică (Închis).

--- SERVICII OFERITE ---
1. Service Propriu: Autorizat RAR, reparații mecanice/electrice, diagnoză computerizată.
2. Cosmetică & Detailing: Polish profesional, protecție ceramică, curățare tapițerie, tratament ozon.
3. Vulcanizare & Roți: Schimb anvelope, echilibrare, geometrie 3D, Hotel de anvelope.
4. Acte Auto: Înmatriculări, numere roșii (provizorii) pe loc, contracte vânzare-cumpărare, asigurări RCA/CASCO.
5. Garanție: Oferim 12 luni garanție pentru autoturisme.
6. Verificare: Mașinile trec printr-o inspecție tehnică în 360 de puncte.

--- FINANȚARE (LEASING & CREDIT) ---
- Parteneri: BT Leasing, Unicredit, BCR Leasing, Porsche Bank, Impuls.
- Condiții Generale:
  - Avans: Flexibil, între 15% și 80%.
  - Perioadă: Între 12 și 60 de luni (1-5 ani).
  - Aprobare: Rapidă, adesea pe loc sau online.
- Documente Persoane Fizice: Buletin (Carte de identitate), Adeverință venit (3 luni) sau talon pensie.
- Documente Persoane Juridice (Firme): CUI, Act constitutiv, Ultimul bilanț contabil, Balanțe recente, Hotărâre AGA.

--- OFERTE SPECIALE ---
- Căutați mașini marcate cu "HOT DEAL" sau "Ofertă Specială" în inventar.
`;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Salut! Sunt Cris, asistentul virtual Autoparc RolCris. Cu ce te pot ajuta astăzi?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Track which intents have already been booked in this session to prevent duplicates
  const [bookedIntents, setBookedIntents] = useState<Set<string>>(new Set());
  
  // Track customer info to avoid asking repeatedly
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Access car inventory and booking function
  const { cars, addBooking } = useCars();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- Gemini Setup ---
  
  const createLeadTool = {
    functionDeclarations: [
      {
        name: "createLead",
        description: "Use this function ONLY when the user explicitly confirms they want to book a test drive, service, or get a financing offer AND provides their Name and Phone Number.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            customerName: {
              type: Type.STRING,
              description: "The full name of the customer."
            },
            customerPhone: {
              type: Type.STRING,
              description: "The phone number of the customer."
            },
            carOfInterest: {
              type: Type.STRING,
              description: "The make and model of the car they are interested in. If it is a general service, detailing, or finance request without a specific car, set this to 'N/A'."
            },
            intent: {
              type: Type.STRING,
              description: "The specific intent of the user. Choose STRICTLY from: 'test_drive', 'finance', 'service', 'detailing', 'question'."
            }
          },
          required: ["customerName", "customerPhone"]
        }
      }
    ]
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY;
      
      // Strict check for API Key placeholder
      if (!apiKey || apiKey.includes('PASTE_YOUR')) {
        console.error("CRITICAL ERROR: API Key is invalid or missing. Check your .env file.");
        setMessages(prev => [...prev, { role: 'model', text: 'Eroare Configurare: Cheia API lipsește. Te rog verifică fișierul .env.' }]);
        setIsTyping(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const inventoryContext = cars.length > 0 
        ? cars.map(c => 
            `- ${c.make} ${c.model} (${c.year}): ${c.price} EUR. ${c.isHotDeal ? '[HOT DEAL]' : ''}`
          ).join('\n')
        : "Momentan nu am acces la lista de mașini în timp real, dar te pot ajuta cu informații generale.";

      const systemInstruction = `
        You are Cris, the expert AI sales assistant for "Autoparc RolCris".
        
        YOUR KNOWLEDGE BASE:
        ${WEBSITE_KNOWLEDGE_BASE}

        CURRENT CAR INVENTORY (Use ONLY if specific cars are requested):
        ${inventoryContext}

        KNOWN CUSTOMER CONTEXT:
        ${customerInfo ? `Name: ${customerInfo.name}, Phone: ${customerInfo.phone} (ALREADY PROVIDED - DO NOT ASK AGAIN)` : "Customer details not yet known."}

        CRITICAL RULES FOR RESPONSES:
        1. **BE CONCISE:** Keep answers short (max 2-3 sentences). Do NOT write paragraphs.
        2. **NO DUMPING:** Do **NOT** list the entire inventory. If asked for "test drive" or "what cars do you have", ASK for their preferences (Brand, Budget, SUV/Sedan) instead of listing everything.
        3. **CLARITY:** If the user wants a test drive generally, ask: "Pentru care mașină doriți test drive?"
        4. **CONFIRMATION:** When you have the Car + Name + Phone, ask for a simple confirmation ("Da"). If they say "Da", trigger the 'createLead' tool immediately.
        5. **LANGUAGE:** Respond in Romanian.

        TOOL USAGE RULES:
        - Call 'createLead' ONLY after you have Name + Phone + Intent confirmed.
        - After calling the tool, the system will handle the confirmation message.
      `;

      const historyMessages = messages.slice(-20); // Keep context slightly shorter for performance
      const history = historyMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const currentContent = {
        role: 'user',
        parts: [{ text: userMessage }]
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, currentContent],
        config: {
          systemInstruction: systemInstruction,
          tools: [createLeadTool],
          temperature: 0.6, // Lower temperature for more focused answers
        }
      });

      let botResponseText = response.text;
      const functionCalls = response.functionCalls;
      let functionExecuted = false;

      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          if (call.name === 'createLead') {
            const { customerName, customerPhone, carOfInterest, intent } = call.args as any;
            
            // --- MEMORIZE CUSTOMER ---
            if (!customerInfo) {
               setCustomerInfo({ name: customerName, phone: customerPhone });
            }

            // --- DUPLICATE CHECK ---
            if (bookedIntents.has(intent)) {
               // If already booked, just reply with text
               if (!botResponseText) botResponseText = "Am notat deja această cerere. Te mai pot ajuta cu altceva?";
               continue; 
            }

            // Map intent to a readable label for the Admin Panel
            let mapIntent = 'General';
            if (intent === 'test_drive') mapIntent = 'Test Drive';
            if (intent === 'finance') mapIntent = 'Finanțare';
            if (intent === 'service') mapIntent = 'Service';
            if (intent === 'detailing') mapIntent = 'Detailing';
            if (intent === 'question') mapIntent = 'Info';

            // Clean up car name if N/A
            const displayCarName = (!carOfInterest || carOfInterest === 'N/A' || carOfInterest === 'General/Service/Finanțare') 
              ? 'Nespecificat' 
              : carOfInterest;

            let image = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop';
            if (intent === 'service') image = 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop';
            if (intent === 'detailing') image = 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop';
            if (intent === 'finance') image = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop';

            await addBooking({
              id: '', 
              carId: 'AI_LEAD',
              carName: displayCarName,
              carImage: image, 
              customerName: customerName,
              customerPhone: customerPhone,
              date: new Date().toISOString(),
              status: 'pending',
              createdAt: Date.now(),
              type: mapIntent
            });
            
            setBookedIntents(prev => new Set(prev).add(intent));
            functionExecuted = true;
          }
        }
      }

      // Logic to handle empty text response when function calls are made
      if (functionExecuted) {
         // If a function was executed, override any potential confusion with a clear success message
         setMessages(prev => [...prev, { role: 'model', text: "Perfect! Am înregistrat cererea ta. Un coleg te va contacta în curând pentru confirmare." }]);
      } else {
         // Standard text response
         setMessages(prev => [...prev, { role: 'model', text: botResponseText || "Nu am înțeles, poți reformula?" }]);
      }

    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Îmi pare rău, am întâmpinat o eroare de conexiune. Te rog să încerci din nou." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button Wrapper */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center group
            ${isOpen ? 'bg-gray-800 text-white' : 'bg-gold-500 text-black'}
          `}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <MessageSquare size={28} fill="currentColor" />
          )}
          
          <span className={`max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold ${isOpen ? '' : 'ml-0 group-hover:ml-3'}`}>
            {isOpen ? '' : 'Chat cu Cris'}
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] z-[60] flex flex-col rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right shadow-2xl border border-gold-500/20 glass-panel bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
            <Bot size={24} className="text-black" />
          </div>
          <div>
            <h3 className="text-white font-bold font-display">Cris - Asistent Virtual</h3>
            <p className="text-gold-500 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/40 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-white/10' : 'bg-gold-500/20'}`}>
                {msg.role === 'user' ? <User size={16} className="text-gray-600 dark:text-gray-300"/> : <Bot size={16} className="text-gold-500"/>}
              </div>
              
              <div 
                className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gold-500 text-black rounded-tr-none' 
                    : 'bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-gold-500"/>
              </div>
              <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-white/5">
                <Loader2 size={16} className="animate-spin text-gold-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Scrie un mesaj..."
              className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white outline-none focus:border-gold-500 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gold-500 text-black hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Cris poate face greșeli. Verifică informațiile importante.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
