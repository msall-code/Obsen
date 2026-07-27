import React from 'react';

export default function BoutonAccessible({ children, onClick, type = 'button', variante = 'primaire', ...props }) {
  const stylesDeBase = "px-4 py-2 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantes = {
    primaire: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondaire: "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-500",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${stylesDeBase} ${variantes[variante]}`}
      {...props}
    >
      {children}
    </button>
  );
}