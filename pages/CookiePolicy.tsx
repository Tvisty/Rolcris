import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Cookie, Settings } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const { seasonalTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#050505]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <div className={`inline-flex items-center justify-center p-4 rounded-xl mb-6 ${seasonalTheme === 'valentine' ? 'bg-pink-500/10 text-pink-500' : 'bg-gold-500/10 text-gold-500'}`}>
            <Cookie size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Politica de Cookie-uri
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-gray-300">Ultima actualizare:</strong> 4 noiembrie 2026
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/5 space-y-10 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-400">
          <section className="border-b border-gray-100 dark:border-white/5 pb-8">
            <p>
              Prezenta Politică de Cookie-uri se aplică site-ului{' '}
              <a
                href="https://autoparcrolcris.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gold-500 hover:underline"
              >
                www.autoparcrolcris.ro
              </a>
              , operat de <strong className="text-gray-900 dark:text-white">ROL CRIS AUTO SRL</strong>, având codul unic de înregistrare (CUI){' '}
              <strong className="text-gray-900 dark:text-white">RO17623860</strong>, număr de ordine în Registrul Comerțului{' '}
              <strong className="text-gray-900 dark:text-white">J30/667/2005</strong> (EUID: ROONRC.J2005000667303), cu sediul și puncte de lucru în Satu Mare (Bulevardul Lucian Blaga 347A), Baia Mare, Seini, Tășnad și Marghita (denumită în continuare „Noi” sau „Operatorul”).
            </p>
          </section>

          <section className="border-b border-gray-100 dark:border-white/5 pb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              1. Ce sunt cookie-urile?
            </h2>
            <p>
              Un „Internet Cookie” este un fișier de mici dimensiuni, format din litere și cifre, care va fi stocat pe computerul, terminalul mobil sau alte echipamente ale unui utilizator de pe care se accesează internetul. Cookie-ul este instalat prin solicitarea emisă de un web-server unui browser (ex: Chrome, Safari, Edge) și este complet „pasiv” (nu conține programe software, viruși sau spyware și nu poate accesa informațiile de pe hard disk-ul utilizatorului).
            </p>
          </section>

          <section className="border-b border-gray-100 dark:border-white/5 pb-8 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">
                2. Cum și de ce folosim cookie-uri?
              </h2>
              <p className="mb-4">
                Folosim cookie-uri pentru a face site-ul nostru mai ușor de utilizat și pentru a-ți oferi o experiență de navigare adaptată preferințelor tale (de exemplu, pentru a vizualiza stocul auto și moto, a filtra corect mașinile, a folosi asistentul virtual sau pentru a reține opțiunile tale).
              </p>
              <p>Folosim următoarele categorii de cookie-uri pe site-ul nostru:</p>
            </div>

            <div className="space-y-5 pl-2 md:pl-4 border-l-2 border-gold-500/40">
              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">
                  A. Cookie-uri strict necesare (Esențiale)
                </h3>
                <p>
                  Aceste cookie-uri sunt indispensabile pentru funcționarea corectă a site-ului. Ele permit navigarea în pagini, utilizarea filtrelor din stocul auto, funcționarea asistentului virtual și a sistemului de consimțământ. Fără acestea, site-ul nu ar putea funcționa optim. Acestea nu necesită consimțământul tău prealabil.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">
                  B. Cookie-uri de statistică și analiză
                </h3>
                <p>
                  Ne ajută să înțelegem cum interacționează vizitatorii cu site-ul Autoparc RolCris (de exemplu, ce pagini sau mașini din stoc sunt cele mai vizitate), colectând informații în mod anonim. Aceste cookie-uri se activează{' '}
                  <strong className="text-gray-900 dark:text-white">doar dacă îți exprimi acordul</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">
                  C. Cookie-uri de marketing și publicitate
                </h3>
                <p>
                  Sunt utilizate pentru a urmări utilizatorii pe site-uri în scopul afișării de reclame relevante și antrenante pentru utilizator (campanii pe rețelele sociale sau motoare de căutare legate de ofertele noastre auto). Aceste cookie-uri se activează{' '}
                  <strong className="text-gray-900 dark:text-white">doar cu consimțământul tău expres</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-gray-100 dark:border-white/5 pb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-6">
              3. Ce cookie-uri folosim în mod concret?
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-xs sm:text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Categorie</th>
                    <th className="p-4 font-bold">Furnizor / Denumire</th>
                    <th className="p-4 font-bold">Scopul utilizării</th>
                    <th className="p-4 font-bold">Durata de viață</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-sm">
                  <tr className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">Strict necesare</td>
                    <td className="p-4 text-gray-800 dark:text-gray-200">Cookie de Consimțământ (propriu)</td>
                    <td className="p-4">Reține opțiunea ta privind acceptarea sau refuzarea modulelor cookie pe site.</td>
                    <td className="p-4 whitespace-nowrap">6 - 12 luni</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">Strict necesare</td>
                    <td className="p-4 text-gray-800 dark:text-gray-200">Sesiune Site / Chat Virtual</td>
                    <td className="p-4">Asigură funcționarea corectă a filtrelor auto și a asistentului virtual pe pagină.</td>
                    <td className="p-4 whitespace-nowrap">Pe durata sesiunii</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">Statistică</td>
                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      Google Analytics (<code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono">_ga</code>,{' '}
                      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono">_gid</code>)
                    </td>
                    <td className="p-4">Măsoară traficul pe site și analizează modul în care vizitatorii folosesc paginile de stoc auto.</td>
                    <td className="p-4 whitespace-nowrap">24 ore - 2 ani</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">Marketing</td>
                    <td className="p-4 text-gray-800 dark:text-gray-200">Meta Pixel / Google Ads</td>
                    <td className="p-4">Măsoară eficiența campaniilor publicitare și livrează reclame adaptate intereselor tale auto.</td>
                    <td className="p-4 whitespace-nowrap">3 - 13 luni</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-b border-gray-100 dark:border-white/5 pb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              4. Cum îți poți exprima sau retrage consimțământul?
            </h2>
            <ul className="list-disc pl-6 space-y-3 mb-6">
              <li>
                <strong className="text-gray-900 dark:text-white">Direct pe site:</strong> La prima vizită, poți alege să accepți toate cookie-urile, să le refuzi pe cele opționale sau să le personalizezi. Poți modifica oricând aceste opțiuni accesând linkul{' '}
                <strong className="text-gray-900 dark:text-white">„Setări Cookie-uri”</strong> din subsolul (footer-ul) site-ului.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Din setările browserului:</strong> Poți bloca sau șterge cookie-urile direct din setările browserului tău (Chrome, Safari, Firefox, Edge etc.).
              </li>
            </ul>
            <button
              type="button"
              onClick={openCookieSettings}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-sm transition-all shadow-md"
            >
              <Settings size={16} />
              Deschide Setări Cookie-uri
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              5. Contact
            </h2>
            <p className="mb-4">
              Pentru orice întrebări sau clarificări legate de această Politică de Cookie-uri sau de prelucrarea datelor cu caracter personal pe site-ul nostru, ne poți contacta:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-gray-900 dark:text-white">E-mail:</strong>{' '}
                <a href="mailto:autoparcrolcris@gmail.com" className="text-gold-500 hover:underline">
                  autoparcrolcris@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Telefon:</strong>{' '}
                <a href="tel:0740513713" className="text-gold-500 hover:underline">
                  0740 513 713
                </a>
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Locații / Parcuri auto:</strong> Satu Mare (Bulevardul Lucian Blaga 347A), Baia Mare, Seini, Tășnad și Marghita.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
