import React, { useState } from "react";

export default function VueTopologieParc({ 
  equipements = [], 
  equipementSelectionne, 
  auSelectionner, 
  auModifier, 
  auSupprimer 
}) {
  const [enModeEdition, setEnModeEdition] = useState(false);
  const [formState, setFormState] = useState(null);
  const [timeRange, setTimeRange] = useState('now-5m');

  const activerEdition = (eq) => {
    setFormState({ ...eq });
    setEnModeEdition(true);
  };

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const soumettreModification = (e) => {
    e.preventDefault();
    if (auModifier) auModifier(formState);
    if (auSelectionner) auSelectionner(formState); 
    setEnModeEdition(false);
  };

  const executerSuppression = (id) => {
    if (window.confirm("🚨 Supprimer cet équipement de la topologie ?")) {
      if (auSupprimer) auSupprimer(id);
      if (auSelectionner) auSelectionner(null);
      setEnModeEdition(false);
    }
  };

  const cpuVal = equipementSelectionne && equipementSelectionne.metriques && equipementSelectionne.metriques.cpu != null ? equipementSelectionne.metriques.cpu : 12;
  const ramVal = equipementSelectionne && equipementSelectionne.metriques && equipementSelectionne.metriques.ram != null ? equipementSelectionne.metriques.ram : 38;

  // --- REQUÊTAGE DYNAMIQUE DE L'IFRAME GRAFANA ---
  // Remplace "ton-uid-dashboard-ici" par l'UID généré par Grafana lorsque tu crées ton dashboard
  const BASE_GRAFANA_URL = "http://localhost:3005/d-solo/ton-uid-dashboard-ici/obsen-metrics?orgId=1&kiosk=tv";

  const obtenirUrlIframe = () => {
  if (!equipementSelectionne) return "";

  let panelId = 1; // Ton panel par défaut
  if (equipementSelectionne.type === "Serveur") panelId = 2;
  if (equipementSelectionne.type === "Routeur") panelId = 3;

  // 🔥 AJOUT : On passe une variable "var-hostname" à Grafana via l'URL !
  const hostname = equipementSelectionne.nom; 

  return `${BASE_GRAFANA_URL}&panelId=${panelId}&from=${timeRange}&to=now&var-hostname=${hostname}`;
};
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* 1. CARTE DE TOPOLOGIE INTERACTIVE (2/3 de l'écran) */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[550px]">
        <div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
            <h3 className="text-sm font-bold text-slate-200">🕸️ Topologie Réseau Active</h3>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 text-slate-400 rounded font-mono">
              {equipements.length} nœuds connectés
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
            {equipements.map((eq) => {
              const estSelectionne = equipementSelectionne?.id === eq.id;
              const estActif = eq.statut === "Actif" || eq.statut === "Disponible";

              return (
                <button
                  key={eq.id}
                  type="button"
                  onClick={() => {
                    auSelectionner(eq);
                    setEnModeEdition(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    estSelectionne
                      ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 scale-[1.02]"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${estActif ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                  <span className="text-2xl block mb-2">
                    {eq.type === "Serveur" ? "🖥️" : eq.type === "Routeur" ? "🔌" : "📦"}
                  </span>
                  <h4 className="font-bold text-xs text-slate-200 truncate">{eq.nom}</h4>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">{eq.ip || "0.0.0.0"}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bus Réseau */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
          <p className="text-[10px] text-slate-500 font-mono">BUS RÉSEAU CONTEXTUEL :</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
            {equipements.map((eq, i) => (
              <React.Fragment key={`bus-${eq.id}`}>
                <span 
                  className={`cursor-pointer hover:text-blue-400 ${equipementSelectionne?.id === eq.id ? "text-blue-400 font-bold" : ""}`}
                  onClick={() => auSelectionner(eq)}
                >
                  {eq.nom}
                </span>
                {i < equipements.length - 1 && <span className="text-slate-700">⚡</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LE COCKPIT ACTIONS & LOGS D'IFRAMES GRAFANA REAL-TIME (1/3 de l'écran) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[550px]">
        {!equipementSelectionne ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-500 space-y-3 m-auto">
            <span className="text-4xl animate-bounce">📊</span>
            <p className="text-xs font-bold text-slate-300">Cockpit Analytique Vide</p>
            <p className="text-[10px] max-w-xs leading-relaxed text-slate-500">
              Sélectionnez un composant d'infrastructure pour instancier son Iframe Grafana dédié et ses métriques de télémétrie.
            </p>
          </div>
        ) : (
          <div className="space-y-4 h-full flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Entête Équipement */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    {equipementSelectionne.type || "Nœud"}
                  </span>
                  <h3 className="text-base font-black text-slate-100 mt-1 truncate max-w-[180px]">{equipementSelectionne.nom}</h3>
                  <code className="text-[10px] text-slate-400 font-mono block bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/65 mt-1 w-fit">{equipementSelectionne.ip}</code>
                </div>
                
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => activerEdition(equipementSelectionne)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => executerSuppression(equipementSelectionne.id)}
                    className="p-1.5 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 rounded border border-rose-900/30 text-xs transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Formulaire d'Édition rapide */}
              {enModeEdition && formState ? (
                <form onSubmit={soumettreModification} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Édition Rapide</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="nom"
                      required
                      placeholder="Nom de la machine"
                      value={formState.nom || ""}
                      onChange={gererChangement}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="ip"
                      required
                      placeholder="Adresse IP"
                      value={formState.ip || ""}
                      onChange={gererChangement}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 text-[10px]">
                    <button type="button" onClick={() => setEnModeEdition(false)} className="text-slate-500 hover:text-slate-400 px-2 py-1">Annuler</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded">Mettre à jour</button>
                  </div>
                </form>
              ) : (
                /* 🚀 VRAIE IFRAME PROVENANT DE GRAFANA PROD */
                <div className="space-y-4">
                  
                  {/* Selecteur Temporel pour piloter l'Iframe */}
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-mono font-bold">INTERVALLE MONITORING</span>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                    >
                      <option value="now-5m">5 dernières minutes</option>
                      <option value="now-15m">15 dernières minutes</option>
                      <option value="now-1h">1 dernière heure</option>
                    </select>
                  </div>

                  {/* Conteneur de l'Iframe Réelle Grafana */}
                  <div className="relative w-full h-44 bg-slate-950 rounded-lg border border-slate-850 overflow-hidden shadow-inner group">
                    <iframe 
                      src={obtenirUrlIframe()}
                      className="w-full h-full border-none absolute inset-0 z-10"
                      title={`Grafana Stream Analytics - ${equipementSelectionne.nom}`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                    {/* Placeholder d'arrière plan en cas de chargement ou d'arret du conteneur */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-[10px] font-mono">
                      Connexion au flux Grafana (Port :3005)...
                    </div>
                  </div>

                  {/* Widgets Complémentaires de Télémétrie Instantanée */}
                  <div className="space-y-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Télémétrie Instantanée</p>
                    
                    {/* Jauge CPU */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-semibold">Charge Processeur (CPU)</span>
                        <span className={`font-bold ${cpuVal > 80 ? 'text-rose-400' : 'text-blue-400'}`}>{cpuVal}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cpuVal}%` }} 
                          className={`h-full rounded-full transition-all duration-700 ${
                            cpuVal > 80 ? 'bg-rose-500' : cpuVal > 60 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Jauge RAM */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-semibold">Mémoire Vive (RAM)</span>
                        <span className="text-purple-400 font-bold">{ramVal}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${ramVal}%` }} 
                          className="h-full bg-purple-500 rounded-full transition-all duration-700"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            <div className="text-[9px] text-slate-600 font-mono text-center pt-2 border-t border-slate-850 flex justify-between items-center">
              <span>UUID: {equipementSelectionne.id?.toString().slice(0, 8)}...</span>
              <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded text-[8px] font-bold">REAL-TIME LINK</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}