import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-white/5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-8 md:p-12">
        <h1 className="text-3xl font-bold mb-2">Politică de Confidențialitate</h1>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">Ultima actualizare: 14 Mai 2026</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">1. Informații Generale</h2>
            <p className="mb-3">
              Site-ul www.autoparcrolcris.ro este operat de societatea ROL CRIS AUTO SRL, cu sediul în România, identificată prin:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Cod Unic de Înregistrare (CUI): RO17623860</li>
              <li>Număr de Înregistrare (EUID): ROONRC.J2005000667303</li>
            </ul>
            <p>
              Ne angajăm să protejăm confidențialitatea vizitatorilor noștri și să procesăm datele cu caracter personal în conformitate cu Regulamentul (UE) 2016/679 (GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">2. Ce date colectăm?</h2>
            <p className="mb-3">Colectăm informații în următoarele situații:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Interacțiune directă:</strong> Nume, prenume, număr de telefon și e-mail atunci când ne contactați pentru detalii despre un autoturism, rezervări sau vizionări.</li>
              <li><strong>Navigare online:</strong> Adresa IP, locația aproximativă și date despre dispozitivul utilizat, colectate prin modulele cookie pentru a asigura buna funcționare a site-ului.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">3. Scopul prelucrării datelor</h2>
            <p className="mb-3">Folosim datele dumneavoastră strict pentru:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Răspunsul la solicitările de ofertă și întrebări despre parcul auto.</li>
              <li>Organizarea procesului de vânzare-cumpărare (pregătirea actelor).</li>
              <li>Îmbunătățirea securității site-ului și analiza traficului pentru a vă oferi o experiență mai bună.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">4. Temeiul juridic</h2>
            <p className="mb-3">Prelucrarea datelor se realizează în baza:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consimțământului dumneavoastră:</strong> Acordat în momentul în care ne trimiteți un mesaj sau ne sunați.</li>
              <li><strong>Executării unui contract:</strong> Pașii necesari pentru achiziția unui vehicul din parcul nostru.</li>
              <li><strong>Obligațiilor legale:</strong> Arhivarea documentelor fiscale conform legii române.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">5. Destinatarii datelor</h2>
            <p className="mb-3">Datele dumneavoastră sunt confidențiale. Acestea pot fi transmise doar către:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Angajații autorizați ai ROL CRIS AUTO SRL.</li>
              <li>Furnizori de servicii esențiale (hosting site, contabilitate).</li>
              <li>Instituții publice, dacă legea ne obligă în acest sens.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">6. Drepturile dumneavoastră (conform GDPR)</h2>
            <p className="mb-3">În calitate de vizitator/client, aveți următoarele drepturi:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dreptul de acces:</strong> Să cereți o copie a datelor pe care le deținem.</li>
              <li><strong>Dreptul la rectificare:</strong> Să cereți corectarea informațiilor greșite.</li>
              <li><strong>Dreptul la ștergere:</strong> Să solicitați eliminarea datelor dumneavoastră din baza noastră de date.</li>
              <li><strong>Dreptul la opoziție:</strong> Să vă opuneți prelucrării datelor în scopuri de marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">7. Securitatea datelor</h2>
            <p>
              Am implementat măsuri tehnice și organizatorice pentru a proteja datele împotriva accesului neautorizat, pierderii sau distrugerii.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gold-600 dark:text-gold-500">8. Contact</h2>
            <p>
              Pentru orice întrebări referitoare la protecția datelor, ne puteți contacta direct prin metodele puse la dispoziție pe site-ul www.autoparcrolcris.ro.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
