import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, HardDrive, RefreshCw, ShieldCheck,
    X, AlertCircle, Server
} from 'lucide-react';
import EquipmentTable from '../components/equipment/EquipmentTable';
import {
    getEquipments,
    createEquipment,
    updateEquipment,
    batchCreateEquipments,
    INITIAL_EQUIPMENT_INVENTORY
} from '../api/equipment';

export default function EquipmentPage() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gestion de la modale d'ajout / modification
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        id: '',
        nodeName: '',
        category: 'COMPUTE',
        fabricant: '',
        modele: '',
        ipAddress: '',
        macAddress: '',
        role: '',
        statutOperationnel: 'ACTIF'
    });

    // Charger la liste des équipements
    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEquipments();
            setEquipments(data || []);
        } catch (err) {
            console.error("Erreur lors du chargement de l'inventaire :", err);
            setError("Impossible de charger la liste des équipements. Vérifiez votre connexion à l'API.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // Ouverture de la modale en mode Création
    const handleOpenCreateModal = () => {
        setEditingEquipment(null);
        setFormData({
            id: `EQ-${Math.floor(1000 + Math.random() * 9000)}`,
            nodeName: '',
            category: 'COMPUTE',
            fabricant: '',
            modele: '',
            ipAddress: '',
            macAddress: '',
            role: '',
            statutOperationnel: 'ACTIF'
        });
        setIsModalOpen(true);
    };

    // Ouverture de la modale en mode Édition
    const handleOpenEditModal = (equipment) => {
        setEditingEquipment(equipment);
        setFormData({
            id: equipment.id || '',
            nodeName: equipment.nodeName || '',
            category: equipment.category || 'COMPUTE',
            fabricant: equipment.fabricant || '',
            modele: equipment.modele || '',
            ipAddress: equipment.ipAddress || '',
            macAddress: equipment.macAddress || '',
            role: equipment.role || '',
            statutOperationnel: equipment.statutOperationnel || 'ACTIF'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipment(null);
    };

    // Soumission du formulaire (Création ou Mise à jour)
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingEquipment) {
                await updateEquipment(formData.id, formData);
            } else {
                await createEquipment(formData);
            }
            handleCloseModal();
            fetchInventory();
        } catch (err) {
            console.error("Erreur d'enregistrement :", err);
            alert("Erreur lors de l'enregistrement de l'équipement.");
        } finally {
            setSubmitting(false);
        }
    };

    // Injection rapide du jeu de données EVE-NG
    const handleSeedData = async () => {
        if (window.confirm("Voulez-vous injecter l'inventaire de démonstration OBSEN ?")) {
            setLoading(true);
            try {
                await batchCreateEquipments(INITIAL_EQUIPMENT_INVENTORY);
                await fetchInventory();
            } catch (err) {
                console.error("Erreur lors de l'injection :", err);
                setError("Erreur lors de l'injection des données.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">

            {/* EN-TÊTE DE LA PAGE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Inventaire Équipements
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Gestion centralisée du matériel et des nœuds réseau du lab OBSEN
                            </p>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSeedData}
                        disabled={loading}
                        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                        title="Injecter le jeu de données par défaut"
                    >
                        <HardDrive className="w-4 h-4 text-amber-400" />
                        <span className="hidden sm:inline">Initialiser Démo</span>
                    </button>

                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Nouvel Équipement</span>
                    </button>
                </div>
            </div>

            {/* MESSAGE D'ERREUR EVENTUEL */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between text-red-400 text-xs">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                    <button onClick={fetchInventory} className="underline hover:text-red-300">
                        Réessayer
                    </button>
                </div>
            )}

            {/* TABLEAU DES ÉQUIPEMENTS */}
            <EquipmentTable
                equipments={equipments}
                loading={loading}
                onRefresh={fetchInventory}
                onEdit={handleOpenEditModal}
            />

            {/* MODALE CRÉATION / ÉDITION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">

                        {/* Header Modale */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-base font-bold text-white">
                                    {editingEquipment ? `Modifier Equipement [${formData.id}]` : "Ajouter un Équipement"}
                                </h2>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Formulaire Modale */}
                        <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* ID Équipement */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">ID Equipement *</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!editingEquipment}
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-50"
                                    />
                                </div>

                                {/* Nom du Nœud */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Nom du Nœud / Hostname *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: core-router-01"
                                        value={formData.nodeName}
                                        onChange={(e) => setFormData({ ...formData, nodeName: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Catégorie */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Catégorie *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="COMPUTE">Compute</option>
                                        <option value="NETWORK">Réseau</option>
                                        <option value="ELECTRICAL">Électricité</option>
                                        <option value="SOFTWARE">Software</option>
                                    </select>
                                </div>

                                {/* Statut opérationnel */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Statut Opérationnel</label>
                                    <select
                                        value={formData.statutOperationnel}
                                        onChange={(e) => setFormData({ ...formData, statutOperationnel: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="ACTIF">Actif / Healthy</option>
                                        <option value="INACTIF">Inactif / Down</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fabricant */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Fabricant / Marque</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Cisco, Dell, Schneider"
                                        value={formData.fabricant}
                                        onChange={(e) => setFormData({ ...formData, fabricant: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                {/* Modèle */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Modèle</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Catalyst 9300 / PowerEdge"
                                        value={formData.modele}
                                        onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* IP Address */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Adresse IP</label>
                                    <input
                                        type="text"
                                        placeholder="ex: 192.168.10.1"
                                        value={formData.ipAddress}
                                        onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                                    />
                                </div>

                                {/* MAC Address */}
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Adresse MAC</label>
                                    <input
                                        type="text"
                                        placeholder="ex: 00:1A:2B:3C:4D:5E"
                                        value={formData.macAddress}
                                        onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Rôle */}
                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Rôle / Description</label>
                                <input
                                    type="text"
                                    placeholder="ex: Routeur de cœur de réseau du Lab"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Footer Modale */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold transition flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{editingEquipment ? "Mettre à jour" : "Créer l'équipement"}</span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}