import React, { useState, useEffect } from 'react';
import ChampFormulaire from '../UI/ChampFormulaire';
import BoutonAccessible from '../UI/BoutonAccessible';
import { validerAdresseIP } from '../../services/calculateurs';

export default function FormulaireGestion({ auSoumettre, equipementEnEdition, auAnnulerEdition }) {
  const [nom, setNom] = useState('');
  const [ip, setIp] = useState('');
  const [type, setType] = useState('Serveur');
  const [categorie, setCategorie] = useState('Hardware');
  const [erreur, setErreur] = useState('');

  // Nouveaux champs spécifiques GLPI / CMDB
  const [glpiId, setGlpiId] = useState('');
  const [fabricant, setFabricant] = useState('');
  const [numSerie, setNumSerie] = useState('');
  const [versionSoftware, setVersionSoftware] = useState('');
  const [editeur, setEditeur] = useState('');

  useEffect(() => {
    if (equipementEnEdition) {
      setNom(equipementEnEdition.nom || '');
      setIp(equipementEnEdition.ip || '');
      setType(equipementEnEdition.type || 'Serveur');
      setCategorie(equipementEnEdition.categorie || 'Hardware');
      setGlpiId(equipementEnEdition.glpiId || '');
      setFabricant(equipementEnEdition.detailsCmdb?.fabricant || '');
      setNumSerie(equipementEnEdition.detailsCmdb?.numSerie || '');
      setVersionSoftware(equipementEnEdition.detailsCmdb?.versionSoftware || '');
      setEditeur(equipementEnEdition.detailsCmdb?.editeur || '');
      setErreur('');
    } else {
      reinitialiser();
    }
  }, [equipementEnEdition]);

  const reinitialiser = () => {
    setNom('');
    setIp('');
    setType('Serveur');
    setCategorie('Hardware');
    setGlpiId('');
    setFabricant('');
    setNumSerie('');
    setVersionSoftware('');
    setEditeur('');
    setErreur('');
  };

  const genererMetriqueSecurisee = () => {
    const table = new Uint32Array(1);
    crypto.getRandomValues(table);
    return table[0] % 100;
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    setErreur('');

    if (!nom.trim() || !ip.trim()) {
      setErreur("Tous les champs obligatoires (*) doivent être remplis.");
      return;
    }

    if (!validerAdresseIP(ip)) {
      setErreur("L'adresse IP saisie est invalide.");
      return;
    }

    // Consolidation des données conditionnelles
    const detailsCmdb = categorie === 'Hardware' 
      ? { fabricant, numSerie } 
      : { versionSoftware, editeur };

    auSoumettre({
      id: equipementEnEdition ? equipementEnEdition.id : crypto.randomUUID(),
      nom,
      ip,
      type,
      categorie,
      glpiId: glpiId || null, // Liaison optionnelle
      detailsCmdb,
      statut: 'Actif',
      metriques: equipementEnEdition ? equipementEnEdition.metriques : {
        cpu: genererMetriqueSecurisee(),
        ram: genererMetriqueSecurisee(),
      },
      derniereSynchroGlpi: new Date().toISOString()
    });

    reinitialiser();
    if (equipementEnEdition) auAnnulerEdition();
  };

  return (
    <form onSubmit={gererSoumission} className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          {equipementEnEdition ? '✏️ Modifier l\'Équipement' : '➕ Enregistrer (Liaison GLPI)'}
        </h3>
        {equipementEnEdition && (
          <button type="button" onClick={auAnnulerEdition} className="text-xs text-rose-500 hover:underline">
            Annuler
          </button>
        )}
      </div>

      {erreur && <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg">⚠️ {erreur}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChampFormulaire label="Nom de l'équipement *" id="nom-eq" value={nom} onChange={(e) => setNom(e.target.value)} required />
        <ChampFormulaire label="Adresse IP *" id="ip-eq" value={ip} onChange={(e) => setIp(e.target.value)} required />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cat-eq" className="text-xs font-semibold text-slate-500 uppercase">Catégorie</label>
          <select id="cat-eq" value={categorie} onChange={(e) => setCategorie(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs">
            <option value="Hardware">Hardware (Matériel)</option>
            <option value="Software">Software (Application/OS)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="type-eq" className="text-xs font-semibold text-slate-500 uppercase">Type</label>
          <select id="type-eq" value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs">
            {categorie === 'Hardware' ? (
              <>
                <option value="Serveur">Serveur</option>
                <option value="Routeur">Routeur</option>
                <option value="Switch">Switch</option>
              </>
            ) : (
              <>
                <option value="OS">Système d'exploitation</option>
                <option value="Database">Base de données</option>
                <option value="WebService">Service Web</option>
              </>
            )}
          </select>
        </div>

        <ChampFormulaire label="ID GLPI (Optionnel)" id="glpi-id" placeholder="Ex: 42" value={glpiId} onChange={(e) => setGlpiId(e.target.value)} />
      </div>

      {/* Rendu Conditionnel dynamique basé sur la catégorie */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase">Spécifications CMDB</h4>
        
        {categorie === 'Hardware' ? (
          <div className="grid grid-cols-2 gap-3">
            <ChampFormulaire label="Fabricant" id="fab" placeholder="Cisco, Dell..." value={fabricant} onChange={(e) => setFabricant(e.target.value)} />
            <ChampFormulaire label="Numéro de Série" id="sn" placeholder="SN-982X-XYZ" value={numSerie} onChange={(e) => setNumSerie(e.target.value)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ChampFormulaire label="Éditeur" id="edit" placeholder="Apache, Oracle, RedHat..." value={editeur} onChange={(e) => setEditeur(e.target.value)} />
            <ChampFormulaire label="Version" id="ver" placeholder="v1.2.4-stable" value={versionSoftware} onChange={(e) => setVersionSoftware(e.target.value)} />
          </div>
        )}
      </div>

      <BoutonAccessible type="submit" variante={equipementEnEdition ? "secondaire" : "primaire"} className="w-full">
        {equipementEnEdition ? '💾 Sauvegarder et Pousser vers GLPI' : '🚀 Ajouter et Synchroniser'}
      </BoutonAccessible>
    </form>
  );
}