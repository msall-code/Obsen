// obsen-frontend/src/vues/Equipements/VueGestionParc.jsx
import React, { useState, useEffect } from "react";
import FormulaireGestion from "../../components/Equipements/FormulaireGestion";
import ListeEquipements from "../../components/Equipements/ListeEquipements";

export default function VueGestionParc({ auSelectionner }) {
  const [equipements, setEquipements] = useState([]);
  const [equipementEnEdition, setEquipementEnEdition] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [messageAction, setMessageAction] = useState("");

  const rafraichirInventaire = async () => {
    setChargement(true);
    try {
      const reponse = await fetch("http://localhost:8081/api/equipements"); 
      const donnees = await reponse.json();
      setEquipements(donnees);
    } catch (error_) {
      console.error("Erreur de synchronisation GLPI :", error_);
      setEquipements([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    rafraichirInventaire();
  }, []);

  const gererSoumissionEquipement = async (nouvelEquipement) => {
    try {
      const methode = equipementEnEdition ? "PUT" : "POST";
      const url = equipementEnEdition 
        ? `http://localhost:8081/api/equipements/${nouvelEquipement.id}`
        : "http://localhost:8081/api/equipements";

      setMessageAction("🔄 Synchronisation avec GLPI en cours...");

      const reponse = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelEquipement),
      });

      if (reponse.ok) {
        setMessageAction("🎉 Réussi ! Mis à jour dans OBSEN et synchronisé dans GLPI.");
        setEquipementEnEdition(null);
        rafraichirInventaire();
      } else {
        setMessageAction("⚠️ Erreur lors de la mise à jour de la CMDB.");
      }
    } catch (error_) {
      console.error("Échec de la soumission :", error_);
      setMessageAction("❌ Impossible de joindre l'orchestrateur n8n/Backend.");
    }
    setTimeout(() => setMessageAction(""), 4000);
  };

  const gererSuppression = async (id) => {
    if (!window.confirm("Supprimer cet équipement de la supervision et de GLPI ?")) return;
    try {
      const reponse = await fetch(`http://localhost:8081/api/equipements/${id}`, { method: "DELETE" });
      if (reponse.ok) {
        setMessageAction("🗑️ Équipement retiré du parc.");
        rafraichirInventaire();
      }
    } catch (error_) {
      console.error("Échec de la suppression :", error_);
      setMessageAction("❌ Erreur de suppression.");
    }
    setTimeout(() => setMessageAction(""), 3000);
  };

  const total = equipements.length;
  const hardwareCount = equipements.filter(e => e.categorie === 'Hardware').length;
  const softwareCount = equipements.filter(e => e.categorie === 'Software').length;
  const glpiLinked = equipements.filter(e => e.glpiId).length;

  return (
    <div className="space-y-6 text-left p-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Équipements Totaux</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{total}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Matériels (Hardware)</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{hardwareCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-indigo-500 uppercase">Logiciels (Software)</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{softwareCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-emerald-500 uppercase">Couverture GLPI</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">
            {total > 0 ? Math.round((glpiLinked / total) * 100) : 0}%
          </p>
        </div>
      </div>

      {messageAction && (
        <div className="p-3 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold">
          {messageAction}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              📋 Inventaire Unifié GLPI & Monitoring
            </h3>
            <button 
              onClick={rafraichirInventaire}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200"
            >
              🔄 Forcer la relecture
            </button>
          </div>

          {chargement ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">Interrogation des bases via n8n...</p>
          ) : (
            <ListeEquipements 
              equipements={equipements}
              auSupprimer={gererSuppression}
              auModifier={(eq) => setEquipementEnEdition(eq)}
              auSelectionner={auSelectionner}
            />
          )}
        </div>

        <div className="space-y-4">
          <FormulaireGestion 
            auSoumettre={gererSoumissionEquipement}
            equipementEnEdition={equipementEnEdition}
            auAnnulerEdition={() => setEquipementEnEdition(null)}
          />
        </div>
      </div>
    </div>
  );
}