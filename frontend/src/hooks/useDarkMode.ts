import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useDarkMode = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Tarayıcıdan tercih edilen temayı al
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Local storage'dan kayıtlı temayı al
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Kayıtlı tema varsa onu, yoksa sistem tercihini kullan
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Tema değiştiğinde HTML elementine class ekle/çıkar
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    // Temayı local storage'a kaydet
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};

export default useDarkMode; 