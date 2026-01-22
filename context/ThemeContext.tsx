
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SeasonalTheme, HolidayPrize } from '../types';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  seasonalTheme: SeasonalTheme;
  setSeasonalTheme: (theme: SeasonalTheme) => Promise<void>;
  holidayPrize: HolidayPrize | null;
  saveHolidayPrize: (prize: HolidayPrize) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('autoparc_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [seasonalTheme, setSeasonalThemeState] = useState<SeasonalTheme>('default');
  const [holidayPrize, setHolidayPrize] = useState<HolidayPrize | null>(null);

  useEffect(() => {
    localStorage.setItem('autoparc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Seasonal Theme & Prize from Firebase
  useEffect(() => {
    if (!db) return;

    try {
      const unsubscribeConfig = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.theme) {
            setSeasonalThemeState(data.theme as SeasonalTheme);
          }
        }
      });

      const unsubscribePrize = onSnapshot(doc(db, 'settings', 'prize'), (doc) => {
        if (doc.exists()) {
          setHolidayPrize(doc.data() as HolidayPrize);
        } else {
          // Default empty prize
          setHolidayPrize({
            isEnabled: false,
            image: '',
            title: '',
            description: ''
          });
        }
      });

      return () => {
        unsubscribeConfig();
        unsubscribePrize();
      };
    } catch (e) {
      console.error("Failed to sync settings:", e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setSeasonalTheme = async (newTheme: SeasonalTheme) => {
    setSeasonalThemeState(newTheme); // Optimistic update
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'config'), { theme: newTheme }, { merge: true });
      } catch (e) {
        console.error("Failed to save theme to Firebase:", e);
      }
    }
  };

  const saveHolidayPrize = async (prize: HolidayPrize) => {
    setHolidayPrize(prize); // Optimistic
    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'prize'), prize);
      } catch (e) {
        console.error("Failed to save prize:", e);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, seasonalTheme, setSeasonalTheme, holidayPrize, saveHolidayPrize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
