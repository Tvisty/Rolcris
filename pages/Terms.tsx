import React from 'react';

const Terms = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-2">Termeni și Condiții</h1>
        
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Operator: ROL CRIS AUTO SRL</p>
          <p>CUI: RO17623860</p>
          <p>EUID: ROONRC.J2005000667303</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">1. Introducere</h2>
            <p>
              Folosirea acestui site (vizitarea sau solicitarea de informații) implică acceptarea deplină a acestor
              termeni și condiții. Vă recomandăm să citiți cu atenție secțiunile următoare. ROL CRIS AUTO SRL își
              rezervă dreptul de a modifica aceste prevederi fără o notificare prealabilă.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">2. Obiectul Site-ului</h2>
            <p>
              Site-ul www.autoparcrolcris.ro este un site de prezentare a parcului auto administrat de ROL CRIS
              AUTO SRL. Informațiile afișate au scop informativ și vizează promovarea autoturismelor disponibile la
              vânzare, serviciile de consultanță și eventualele facilități de finanțare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">3. Acuratețea Informațiilor</h2>
            <p>
              Depunem eforturi constante pentru ca datele tehnice, dotările și prețurile mașinilor să fie corecte. Totuși,
              pot apărea erori umane sau omisiuni. Prețurile și disponibilitatea mașinilor afișate pe site nu
              constituie o obligație contractuală fermă până la semnarea unui contract de vânzare-cumpărare și
              verificarea fizică a vehiculului.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">4. Proprietate Intelectuală</h2>
            <p>
              Întreg conținutul site-ului (text, imagini, logo-uri, design) este proprietatea exclusivă a ROL CRIS AUTO
              SRL. Copierea, reproducerea sau utilizarea acestora în scopuri comerciale fără acordul scris al
              proprietarului este strict interzisă și se pedepsește conform legilor în vigoare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">5. Utilizarea Site-ului</h2>
            <p>
              Utilizatorul se obligă să folosească site-ul într-o manieră care să nu aducă prejudicii tehnice sau de
              imagine firmei. Este interzisă utilizarea formularelor de contact pentru mesaje de tip SPAM sau
              publicitate neautorizată.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">6. Limitarea Răspunderii</h2>
            <p>
              ROL CRIS AUTO SRL nu răspunde pentru eventuale daune provocate de utilizarea defectuoasă a siteului sau pentru întreruperi temporare ale disponibilității acestuia cauzate de furnizorii de servicii de
              internet sau mentenanță.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">7. Litigii și Legea Aplicabilă</h2>
            <p>
              Orice litigiu apărut în legătură cu utilizarea acestui site va fi soluționat pe cale amiabilă. În cazul în care
              acest lucru nu este posibil, competența revine instanțelor judecătorești române din raza sediului social al
              firmei. De asemenea, consumatorii au dreptul de a apela la procedurile de soluționare alternativă a
              litigiilor prin intermediul ANPC.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">8. Contact</h2>
            <p>
              Pentru orice întrebări referitoare la termeni și condiții, ne puteți contacta prin intermediul datelor afișate
              în secțiunea Contact a site-ului.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
