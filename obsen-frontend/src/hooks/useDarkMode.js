import { useState, useEffect } from 'react';

export function useDarkMode() {
  // Récupère le thème sauvegardé ou applique le thème sombre par défaut
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('obsen_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('obsen_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}