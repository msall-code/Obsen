import React, { useState } from "react";
import AssistantIA from "./components/IA/AssistantIA";
import VueTopologieParc from "./vues/VueTopologieParc";
import VueGestionParc from "./vues/VueGestionParc";

export default function App() {
  // Changement de l'onglet par défaut pour atterrir sur la Gestion du Parc
  const [ongletActif, setOngletActif] = useState("gestion"); // "gestion", "topologie", "ia"
  
  const [equipements, setEquipements] = useState([
    { id: "eq-1", nom: "obsen-api", type: "Serveur", ip: "192.168.1.50", statut: "Actif", metriques: { cpu: 98, ram: 92 } },
    { id: "eq-2", nom: "db-obsen.local", type: "Serveur", ip: "192.168.1.60", statut: "Actif", metriques: { cpu: 45, ram: 97 } },
  ]);
  const [equipementSelectionne, setEquipementSelectionne] = useState(null);

  // Passerelle IA -> Topologie
  const selectionnerDepuisIA = (nomEquipement) => {
    const eq = equipements.find(e => e.nom.toLowerCase().includes(nomEquipement.toLowerCase()));
    if (eq) {
      setEquipementSelectionne(eq);
      setOngletActif("topologie"); // Redirection automatique vers la topologie visuelle !
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      
      {/* Navigation Principale dans le nouvel ordre : Gestion -> Topo -> IA */}
      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-3">
        <button 
          onClick={() => setOngletActif("gestion")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
            ongletActif === "gestion" 
              ? "text-slate-100 border-b-2 border-slate-200" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          📋 Gestion du Parc
        </button>
        <button 
          onClick={() => setOngletActif("topologie")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
            ongletActif === "topologie" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🕸️ Topologie & Grafana
        </button>
        <button 
          onClick={() => setOngletActif("ia")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
            ongletActif === "ia" 
              ? "text-emerald-400 border-b-2 border-emerald-500" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          🤖 Assistant IA SRE
        </button>
      </div>

      {/* Affichage des composants selon l'onglet actif */}
      <div className="mt-4">
        {ongletActif === "gestion" && (
          <VueGestionParc 
            equipements={equipements}
            auAjouter={(nouveau) => setEquipements(prev => [...prev, nouveau])}
            auSelectionner={(eq) => {
              setEquipementSelectionne(eq);
              setOngletActif("topologie"); // Redirection vers le cockpit au clic sur inspecter
            }}
          />
        )}

        {ongletActif === "topologie" && (
          <VueTopologieParc 
            equipements={equipements}
            equipementSelectionne={equipementSelectionne}
            auSelectionner={setEquipementSelectionne}
            auModifier={(eqModifie) => setEquipements(prev => prev.map(e => e.id === eqModifie.id ? eqModifie : e))}
            auSupprimer={(id) => setEquipements(prev => prev.filter(e => e.id !== id))}
          />
        )}

        {ongletActif === "ia" && (
          <AssistantIA auSelectionnerEquipement={selectionnerDepuisIA} />
        )}
      </div>
    </div>
  );
}