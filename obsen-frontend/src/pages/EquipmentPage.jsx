import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Server, AlertCircle } from 'lucide-react';
import EquipmentTable from '../components/equipment/EquipmentTable';
import {
    getAllEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    INITIAL_EQUIPMENT_INVENTORY
} from '../api/equipment';

export default function EquipmentPage() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);

    const [formData, setFormData] = useState({
        id: '',
        nodeName: '',
        category: 'COMPUTE',
        status: 'ACTIVE',
        ipAddress: '',
        macAddress: '',
        location: '',
        lastMaintenance: ''
    });

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllEquipments();
            if (Array.isArray(data) && data.length > 0) {
                setEquipments(data);
            } else {
                setEquipments(INITIAL_EQUIPMENT_INVENTORY);
            }
        } catch (err) {
            console.error("Erreur de chargement des équipements:", err);
            setError("Impossible de charger les équipements.");
            setEquipments(INITIAL_EQUIPMENT_INVENTORY);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchInventory();
    }, [fetchInventory]);

    const handleOpenModal = (equipment = null) => {
        if (equipment) {
            setEditingEquipment(equipment);
            setFormData(equipment);
        } else {
            setEditingEquipment(null);
            setFormData({
                id: `EQ-${String(equipments.length + 1).padStart(3, '0')}`,
                nodeName: '',
                category: 'COMPUTE',
                status: 'ACTIVE',
                ipAddress: '',
                macAddress: '',
                location: '',
                lastMaintenance: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipment(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingEquipment) {
                await updateEquipment(formData.id, formData);
            } else {
                await createEquipment(formData);
            }
            await fetchInventory();
            handleCloseModal();
        } catch (err) {
            console.error("Erreur lors de l'enregistrement :", err);
            setError("Échec de l'enregistrement de l'équipement.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
            try {
                await deleteEquipment(id);
                await fetchInventory();
            } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                setError("Impossible de supprimer cet équipement.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                        <Server className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Gestion des Équipements</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Inventaire et suivi matériel du laboratoire OBSEN
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchInventory}
                        className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition"
                        title="Rafraîchir la liste"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un Équipement</span>
                    </button>
                </div>
            </div>

            {/* Message d'erreur éventuel */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table d'affichage */}
            <EquipmentTable
                equipments={equipments}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            {/* Modal Création / Modification */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
                        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                            {editingEquipment ? "Modifier l'équipement" : "Nouveau matériel"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-400 mb-1">Identifiant</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={formData.id}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!editingEquipment}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1">Nom du Nœud</label>
                                    <input
                                        type="text"
                                        name="nodeName"
                                        value={formData.nodeName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="ex: SRV-OBSEN-02"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-400 mb-1">Catégorie</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="COMPUTE">COMPUTE (Serveur)</option>
                                        <option value="NETWORK">NETWORK (Réseau)</option>
                                        <option value="ELECTRICAL">ELECTRICAL (Énergie)</option>
                                        <option value="STORAGE">STORAGE (Stockage)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1">Statut</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="ACTIVE">ACTIVE (Actif)</option>
                                        <option value="WARNING">WARNING (Avertissement)</option>
                                        <option value="INACTIVE">INACTIVE (Hors-ligne)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-400 mb-1">Adresse IP</label>
                                    <input
                                        type="text"
                                        name="ipAddress"
                                        value={formData.ipAddress}
                                        onChange={handleInputChange}
                                        placeholder="192.168.1.X"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1">Adresse MAC</label>
                                    <input
                                        type="text"
                                        name="macAddress"
                                        value={formData.macAddress}
                                        onChange={handleInputChange}
                                        placeholder="00:1A:2B:3C:4D:5E"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-1">Emplacement Physique</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="ex: Salle A - Baie 03"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
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
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-semibold"
                                >
                                    {submitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}