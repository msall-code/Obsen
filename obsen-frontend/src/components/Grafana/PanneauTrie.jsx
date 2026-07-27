import React from 'react';

export default function PanneauTrie({ intervalleSelectionne, auChangerIntervalle }) {
  const intervalles = [
    { valeur: '1h', label: 'Dernière heure' },
    { valeur: '6h', label: 'Dernières 6 heures' },
    { valeur: '24h', label: 'Dernières 24 heures' },
    { valeur: '7d', label: '7 derniers jours' }
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="select-intervalle" className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Plage :
      </label>
      <select
        id="select-intervalle"
        value={intervalleSelectionne}
        onChange={(e) => auChangerIntervalle(e.target.value)}
        className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs font-medium"
      >
        {intervalles.map((int) => (
          <option key={int.valeur} value={int.valeur}>
            {int.label}
          </option>
        ))}
      </select>
    </div>
  );
}