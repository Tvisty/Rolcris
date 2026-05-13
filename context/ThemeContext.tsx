
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
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
      // Default to light if not found
      return (saved === 'light' || saved === 'dark') ? saved : 'light';
    } catch {
      return 'light';
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

  // Sync Seasonal Theme & Prize from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (!error && data) {
           const config = data.find(d => d.id === 'config')?.data;
           if(config && config.theme) {
               setSeasonalThemeState(config.theme as SeasonalTheme);
           }
           const prize = data.find(d => d.id === 'prize')?.data;
           if(prize) {
               setHolidayPrize(prize as HolidayPrize);
           } else {
               setHolidayPrize({
                 isEnabled: false,
                 image: '',
                 title: '',
                 description: ''
               });
           }
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
    };
    
    fetchSettings();
    
    const channel = supabase.channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, payload => {
         fetchSettings();
      })
      .subscribe();

    return () => {
       supabase.removeChannel(channel);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setSeasonalTheme = async (newTheme: SeasonalTheme) => {
    setSeasonalThemeState(newTheme); // Optimistic update
    try {
      await supabase.from('settings').upsert({ id: 'config', data: { theme: newTheme }});
    } catch (e) {
      console.error("Failed to save theme:", e);
    }
  };

  const saveHolidayPrize = async (prize: HolidayPrize) => {
    setHolidayPrize(prize); // Optimistic
    try {
      await supabase.from('settings').upsert({ id: 'prize', data: prize });
    } catch (e) {
      console.error("Failed to save prize:", e);
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
