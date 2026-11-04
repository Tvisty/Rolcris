import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings, X, Check, Shield } from 'lucide-react';

interface CookieConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const CONSENT_STORAGE_KEY = 'rolcris_cookie_consent';
export const GA_MEASUREMENT_ID = 'G-3PN5C8DRSF';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    [key: string]: any;
  }
}

export const syncGoogleAnalyticsConsent = (consent: { analytics: boolean; marketing: boolean }) => {
  if (typeof window === 'undefined') return;

  // Toggle GA disable flag
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = !consent.analytics;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
  }

  if (consent.analytics) {
    // Load gtag.js script dynamically only after user grants analytics consent
    const existingScript = document.getElementById('ga-gtag-script');
    if (!existingScript) {
      window.gtag('consent', 'default', {
        analytics_storage: 'granted',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied'
      });
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        page_path: window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname
      });

      const script = document.createElement('script');
      script.id = 'ga-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    } else {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied'
      });
    }
  } else {
    // Revoke consent if gtag was previously initialized
    if (document.getElementById('ga-gtag-script')) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  }
};

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!saved) {
      setIsVisible(true);
    } else {
      try {
        const parsed: CookieConsentState = JSON.parse(saved);
        const hasAnalytics = Boolean(parsed.analytics);
        const hasMarketing = Boolean(parsed.marketing);
        setAnalytics(hasAnalytics);
        setMarketing(hasMarketing);
        syncGoogleAnalyticsConsent({ analytics: hasAnalytics, marketing: hasMarketing });
      } catch {
        setIsVisible(true);
      }
    }

    const handleOpenSettings = () => {
      const current = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (current) {
        try {
          const parsed: CookieConsentState = JSON.parse(current);
          setAnalytics(Boolean(parsed.analytics));
          setMarketing(Boolean(parsed.marketing));
        } catch {
          // ignore
        }
      }
      setShowCustomize(true);
      setIsVisible(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const saveConsent = (consent: { analytics: boolean; marketing: boolean }) => {
    const payload: CookieConsentState = {
      essential: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    syncGoogleAnalyticsConsent(consent);
    setIsVisible(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
  };

  const handleRejectOptional = () => {
    saveConsent({ analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent({ analytics, marketing });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] p-4 md:p-6 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-gray-200 dark:border-gold-500/30 rounded-2xl shadow-2xl p-5 md:p-6 transition-all">
        {!showCustomize ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-500 flex items-center justify-center shrink-0 mt-0.5">
                <Cookie size={22} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-1">
                  Respectăm confidențialitatea ta
                </p>
                <p>
                  Folosim cookie-uri strict necesare pentru funcționarea site-ului și, doar cu acordul tău, cookie-uri de statistică și marketing pentru a-ți oferi o experiență personalizată. Detalii în{' '}
                  <Link
                    to="/cookie-policy"
                    className="text-gold-500 font-semibold hover:underline"
                  >
                    Politica de Cookie-uri
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black text-xs sm:text-sm font-bold shadow-lg shadow-gold-500/20 transition-all"
              >
                Acceptă toate
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold transition-all"
              >
                Doar necesare
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:border-gold-500 hover:text-gold-500 text-xs sm:text-sm font-semibold transition-all"
              >
                <Settings size={15} />
                Personalizează
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Shield className="text-gold-500" size={20} />
                <h3 className="text-base sm:text-lg font-display font-bold text-gray-900 dark:text-white">
                  Setări Preferințe Cookie-uri
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white"
                aria-label="Înapoi"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              {/* Strictly Necessary */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">Strict necesare</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gold-500/20 text-gold-500">
                      Mereu active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Indispensabile pentru navigare, filtrele din stocul auto, asistentul virtual și salvarea consimțământului.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <label className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col justify-between gap-2 cursor-pointer hover:border-gold-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">Statistică și analiză</span>
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="w-4 h-4 accent-gold-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ne ajută să înțelegem în mod anonim ce mașini și pagini sunt cele mai vizitate (Google Analytics).
                  </p>
                </div>
              </label>

              {/* Marketing */}
              <label className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col justify-between gap-2 cursor-pointer hover:border-gold-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">Marketing și publicitate</span>
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="w-4 h-4 accent-gold-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Utilizate pentru afișarea de oferte auto relevante pe rețelele sociale și motoarele de căutare (Meta Pixel / Google Ads).
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-white/10">
              <Link
                to="/cookie-policy"
                onClick={() => setIsVisible(false)}
                className="text-xs text-gold-500 hover:underline font-semibold"
              >
                Citește Politica de Cookie-uri completă →
              </Link>
              <div className="flex flex-wrap items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  Refuză opționale
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black text-xs sm:text-sm font-bold transition-all"
                >
                  <Check size={15} />
                  Salvează preferințele
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-black text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  Acceptă toate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
