import React from 'react';

// Résout S3358 : Dictionnaire à plat à la place des ternaires imbriqués
const OBTENIR_STYLE_STATUT = {
  Actif: "bg-emerald-500 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/20",
  Surcharge: "bg-rose-500 border-rose-300 dark:border-rose-700 shadow-rose-500/20",
  HorsLigne: "bg-slate-500 border-slate-300 dark:border-slate-700 shadow-slate-500/20"
};

export default function CarteReseau({ equipements, auSelectionner }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-inner min-h-[400px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🕸️</span> Cartographie Logique & Topologie
          </h3>
          <p className="text-xs text-slate-400">Représentation temps réel des liaisons physiques et applicatives</p>
        </div>
      </div>

      {/* Nodes container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 my-auto">
        {equipements.map((eq) => {
          // Résout S3358 : Choix propre de la classe
          const statutEquipement = eq.metriques?.cpu > 80 ? "Surcharge" : "Actif";
          const classeCouleur = OBTENIR_STYLE_STATUT[statutEquipement] || OBTENIR_STYLE_STATUT.HorsLigne;

          return (
            <button
              key={eq.id}
              type="button"
              onClick={() => auSelectionner(eq)}
              className="flex flex-col items-center p-4 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 transition-all text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Statut Dot */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg mb-3 text-white ${classeCouleur}`}>
                {eq.type === 'Serveur' ? '🖥️' : '🔌'}
              </div>
              <p className="text-xs font-bold text-slate-200 truncate w-full">{eq.nom}</p>
              <p className="text-[10px] font-mono text-slate-500 mt-1">{eq.ip}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 text-[10px] text-slate-400 justify-center border-t border-slate-800/50 pt-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Opérationnel</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Surcharge (&gt;80% CPU)</span>
      </div>
    </div>
  );
}