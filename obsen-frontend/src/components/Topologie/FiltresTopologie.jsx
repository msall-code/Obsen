import React from 'react';

export default function FiltresTopologie({ categorieFiltre, auChangerFiltre }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-wrap gap-2 items-center justify-between">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Filtrage de la carte
      </span>
      <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => auChangerFiltre('TOUT')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            categorieFiltre === 'TOUT'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Tout afficher
        </button>
        <button
          type="button"
          onClick={() => auChangerFiltre('Hardware')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            categorieFiltre === 'Hardware'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          🖥️ Matériel
        </button>
        <button
          type="button"
          onClick={() => auChangerFiltre('Software')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${
            categorieFiltre === 'Software'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          ⚙️ Logiciel / Services
        </button>
      </div>
    </div>
  );
}