import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-yellow-400"
      title="Changer le thème"
    >
      {theme === 'dark' ? (
        <>
          <span className="text-base">☀️</span>
          <span className="text-slate-200">Clair</span>
        </>
      ) : (
        <>
          <span className="text-base">🌙</span>
          <span className="text-slate-800">Sombre</span>
        </>
      )}
    </button>
  );
}