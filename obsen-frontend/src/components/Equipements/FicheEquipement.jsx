import React, { useState } from 'react';
import BoutonAccessible from '../UI/BoutonAccessible';

export default function FicheEquipement({ equipement, auFermer, auLancerDiagnosticIA }) {
  const [chatInput, setChatInput] = useState('');
  const [historiqueChat, setHistoriqueChat] = useState([
    { id: "msg-1", auteur: 'ia', message: `Bonjour ! Je suis l'assistant OBSEN-IA. Prêt pour l'audit de ${equipement?.nom}.` }
  ]);
  const [iaEnCours, setIaEnCours] = useState(false);

  if (!equipement) return null;

  const cpuPourcent = equipement.metriques?.cpu || 0;
  const ramPourcent = equipement.metriques?.ram || 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-md flex flex-col gap-5 text-left">
      
      {/* Header & Statut Sync GLPI */}
      <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {equipement.categorie}
            </span>
            {equipement.glpiId ? (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1">
                🔗 GLPI ID: {equipement.glpiId}
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 px-2 py-0.5 rounded">
                ⚠️ Non lié GLPI
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white mt-1">{equipement.nom}</h3>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{equipement.ip}</p>
        </div>
        <button type="button" onClick={auFermer} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-md">✕</button>
      </div>

      {/* BLOC DASHBOARD : Visualisation Directe des métriques */}
      <div className="p-4 bg-slate-950 text-slate-200 rounded-xl space-y-3 font-mono shadow-inner">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">📊 Live Dashboard (Telemetry)</h4>
        
        {/* CPU Tracker */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Utilization CPU</span>
            <span className={cpuPourcent > 80 ? "text-rose-500 font-bold" : "text-emerald-400"}>{cpuPourcent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${cpuPourcent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${cpuPourcent}%` }}></div>
          </div>
        </div>

        {/* RAM Tracker */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Memory RAM</span>
            <span className="text-sky-400">{ramPourcent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${ramPourcent}%` }}></div>
          </div>
        </div>
      </div>

      {/* Spécifications Issues de la CMDB GLPI */}
      <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
        {equipement.categorie === 'Hardware' ? (
          <>
            <div><span className="text-slate-400 block">Fabricant</span><strong className="text-slate-800 dark:text-slate-200">{equipement.detailsCmdb?.fabricant || 'Inconnu'}</strong></div>
            <div><span className="text-slate-400 block">N° de Série</span><strong className="text-slate-800 dark:text-slate-200 font-mono">{equipement.detailsCmdb?.numSerie || 'N/A'}</strong></div>
          </>
        ) : (
          <>
            <div><span className="text-slate-400 block">Éditeur / Auteur</span><strong className="text-slate-800 dark:text-slate-200">{equipement.detailsCmdb?.editeur || 'Inconnu'}</strong></div>
            <div><span className="text-slate-400 block">Version Active</span><strong className="text-slate-800 dark:text-slate-200 font-mono">{equipement.detailsCmdb?.versionSoftware || 'N/A'}</strong></div>
          </>
        )}
      </div>

      {/* Diagnostic & Chat IA */}
      <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/10">
        <h4 className="text-xs font-bold text-blue-950 dark:text-blue-300 flex items-center gap-1.5 uppercase">✨ Diagnostic Obsen-IA</h4>
        <p className="text-xs text-blue-800 dark:text-blue-400 mt-1 leading-relaxed">
          {cpuPourcent > 80 ? "ALERTE : Anomalie détectée. Surcharge CPU détectée. Liaison ticket GLPI recommandée." : "Paramètres nominaux. Matériel stable."}
        </p>
      </div>

      {/* Bouton Audit complet */}
      <BoutonAccessible variante="primaire" onClick={() => auLancerDiagnosticIA(equipement)} className="w-full text-xs">
        Lancer un rapport d'audit IA complet
      </BoutonAccessible>
    </div>
  );
}