import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Scale } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const { seasonalTheme } = useTheme();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#050505]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <div className={`inline-flex items-center justify-center p-4 rounded-xl mb-6 ${seasonalTheme === 'valentine' ? 'bg-pink-500/10 text-pink-500' : 'bg-gold-500/10 text-gold-500'}`}>
            <Scale size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            TERMENI ȘI CONDIȚII
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            www.autoparcrolcris.ro
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/5 space-y-10 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">
          
          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl">
            <ul className="space-y-2">
              <li><strong className="text-gray-900 dark:text-gray-300">Operator:</strong> ROL CRIS AUTO SRL</li>
              <li><strong className="text-gray-900 dark:text-gray-300">CUI:</strong> RO17623860</li>
              <li><strong className="text-gray-900 dark:text-gray-300">EUID:</strong> ROONRC.J2005000667303</li>
            </ul>
          </div>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">1. Introducere</h2>
            <p>
              Folosirea acestui site (vizitarea sau solicitarea de informații) implică acceptarea deplină a acestor termeni și condiții. Vă recomandăm să citiți cu atenție secțiunile următoare. ROL CRIS AUTO SRL își rezervă dreptul de a modifica aceste prevederi fără o notificare prealabilă.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">2. Obiectul Site-ului</h2>
            <p>
              Site-ul www.autoparcrolcris.ro este un site de prezentare a parcului auto administrat de ROL CRIS AUTO SRL. Informațiile afișate au scop informativ și vizează promovarea autoturismelor disponibile la vânzare, serviciile de consultanță și eventualele facilități de finanțare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">3. Acuratețea Informațiilor</h2>
            <p>
              Depunem eforturi constante pentru ca datele tehnice, dotările și prețurile mașinilor să fie corecte. Totuși, pot apărea erori umane sau omisiuni. Prețurile și disponibilitatea mașinilor afișate pe site nu constituie o obligație contractuală fermă până la semnarea unui contract de vânzare-cumpărare și verificarea fizică a vehiculului.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">4. Proprietate Intelectuală</h2>
            <p>
              Întreg conținutul site-ului (text, imagini, logo-uri, design) este proprietatea exclusivă a ROL CRIS AUTO SRL. Copierea, reproducerea sau utilizarea acestora în scopuri comerciale fără acordul scris al proprietarului este strict interzisă și se pedepsește conform legilor în vigoare.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">5. Utilizarea Site-ului</h2>
            <p>
              Utilizatorul se obligă să folosească site-ul într-o manieră care să nu aducă prejudicii tehnice sau de imagine firmei. Este interzisă utilizarea formularelor de contact pentru mesaje de tip SPAM sau publicitate neautorizată.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">6. Limitarea Răspunderii</h2>
            <p>
              ROL CRIS AUTO SRL nu răspunde pentru eventuale daune provocate de utilizarea defectuoasă a site-ului sau pentru întreruperi temporare ale disponibilității acestuia cauzate de furnizorii de servicii de internet sau mentenanță.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">7. Litigii și Legea Aplicabilă</h2>
            <p>
              Orice litigiu apărut în legătură cu utilizarea acestui site va fi soluționat pe cale amiabilă. În cazul în care acest lucru nu este posibil, competența revine instanțelor judecătorești române din raza sediului social al firmei. De asemenea, consumatorii au dreptul de a apela la procedurile de soluționare alternativă a litigiilor prin intermediul ANPC.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">8. Contact</h2>
            <p>
              Pentru orice întrebări referitoare la termeni și condiții, ne puteți contacta prin intermediul datelor afișate în secțiunea Contact a site-ului.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
