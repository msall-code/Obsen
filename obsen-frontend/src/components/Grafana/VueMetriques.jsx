import React from 'react';

export default function VueMetriques({ equipement }) {
  if (!equipement) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <span className="text-4xl mb-2">📊</span>
        <p className="text-sm font-medium">Sélectionnez un équipement pour visualiser ses télémétries réelles.</p>
      </div>
    );
  }

  // Simulation d'une URL Grafana d'Iframe dynamique
  const URL_GRAFANA_SIMULEE = `https://grafana.obsen.local/d-solo/rX920a/system-metrics?orgId=1&var-host=${equipement.nom}&panelId=4&theme=dark`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Supervision en Temps Réel : {equipement.nom}</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{equipement.ip} • Couche {equipement.categorie}</p>
        </div>
        <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-medium">
          Flux Grafana Actif
        </span>
      </div>

      {/* Remplacement du gros bloc complexe et des imbrications ternaires par un rendu de panneau clair */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Utilisation CPU</p>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{equipement.metriques.cpu}%</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${equipement.metriques.cpu}%` }}></div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Utilisation RAM</p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{equipement.metriques.ram}%</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${equipement.metriques.ram}%` }}></div>
          </div>
        </div>
      </div>

      {/* C'est ici que s'affichera notre Iframe Grafana finale */}
      <div className="h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 flex items-center justify-center text-slate-400 relative">
        {/* En test visuel, on met un placeholder propre, mais l'iframe est configurée */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-4 text-center">
          <span className="text-3xl mb-2 font-mono text-amber-500">Iframe Grafana</span>
          <p className="text-xs max-w-sm text-slate-400 font-mono">
            Source pointée vers : <br />
            <span className="text-slate-500 break-all text-[10px]">{URL_GRAFANA_SIMULEE}</span>
          </p>
        </div>
      </div>
    </div>
  );
}