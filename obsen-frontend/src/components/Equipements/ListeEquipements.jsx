import React from 'react';
import BoutonAccessible from '../UI/BoutonAccessible';

export default function ListeEquipements({ equipements, auSupprimer, auModifier, auSelectionner }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">IP</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Couche</th>
              <th className="px-6 py-4">Métriques</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
            {equipements.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  Aucun équipement enregistré dans le parc pour le moment.
                </td>
              </tr>
            ) : (
              equipements.map((equipement) => {
                const estEnSurcharge = equipement.metriques.cpu > 80;
                return (
                  <tr 
                    key={equipement.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {equipement.nom}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{equipement.ip}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 font-medium">
                        {equipement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        equipement.categorie === 'Hardware' 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' 
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
                      }`}>
                        {equipement.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[11px] font-semibold">
                        <span className={estEnSurcharge ? 'text-rose-500' : 'text-slate-500'}>
                          CPU: {equipement.metriques.cpu}%
                        </span>
                        <span className="text-slate-400">
                          RAM: {equipement.metriques.ram}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${estEnSurcharge ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></span>
                        {estEnSurcharge ? 'Surcharge' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-1.5">
                      <BoutonAccessible 
                        variante="secondaire" 
                        onClick={() => auSelectionner(equipement)}
                      >
                        Superviser
                      </BoutonAccessible>
                      <button 
                        type="button"
                        onClick={() => auModifier(equipement)}
                        className="px-3 py-2 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 transition-all"
                      >
                        Modifier
                      </button>
                      <BoutonAccessible 
                        variante="danger" 
                        onClick={() => auSupprimer(equipement.id)}
                      >
                        Supprimer
                      </BoutonAccessible>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}