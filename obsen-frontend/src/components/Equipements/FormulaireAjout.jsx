import React, { useState } from 'react';
import ChampFormulaire from '../UI/ChampFormulaire';
import BoutonAccessible from '../UI/BoutonAccessible';

export default function FormulaireAjout({ auAjouter }) {
  const [nom, setNom] = useState('');
  const [ip, setIp] = useState('');
  const [type, setType] = useState('Routeur');
  const [categorie, setCategorie] = useState('Hardware');

  const soumettre = (e) => {
    e.preventDefault();
    if (!nom || !ip) return;

    auAjouter({
      id: crypto.randomUUID(), // Résout S2245 (Identifiant unique sécurisé)
      nom,
      ip,
      type,
      categorie,
      statut: 'Actif',
      metriques: {
        cpu: Math.floor(Math.random() * 100),
        ram: Math.floor(Math.random() * 100),
      }
    });

    setNom('');
    setIp('');
  };

  return (
    <form onSubmit={soumettre} className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Nouvel Équipement</h3>
      
      <ChampFormulaire
        label="Nom de l'équipement"
        id="nom-equipement"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="ex: Routeur-Core-01"
        required
      />

      <ChampFormulaire
        label="Adresse IP"
        id="ip-equipement"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="ex: 192.168.1.1"
        required
      />

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="type-equipement" className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
          <select
            id="type-equipement"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm"
          >
            <option value="Routeur">Routeur</option>
            <option value="Switch">Switch</option>
            <option value="Serveur">Serveur</option>
            <option value="Pare-feu">Pare-feu</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="categorie-equipement" className="text-sm font-medium text-slate-700 dark:text-slate-300">Catégorie</label>
          <select
            id="categorie-equipement"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm"
          >
            <option value="Hardware">Matériel (Hardware)</option>
            <option value="Software">Logiciel (Software)</option>
          </select>
        </div>
      </div>

      <div className="mt-2">
        <BoutonAccessible type="submit" variante="primaire" className="w-full">
          Ajouter au parc
        </BoutonAccessible>
      </div>
    </form>
  );
}