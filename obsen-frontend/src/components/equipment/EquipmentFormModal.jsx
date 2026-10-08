import React, { useState, useEffect } from 'react';
import { createEquipment, updateEquipment } from '../../api/equipment';
import {
    X, Server, Cpu, Wifi, Zap, Code2, PlusCircle, CheckCircle, AlertCircle
} from 'lucide-react';

export default function EquipmentFormModal({ isOpen, onClose, onSuccess, initialData = null }) {
    const [category, setCategory] = useState('COMPUTE');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Champs communs
    const [formData, setFormData] = useState({
        id: '',
        nodeName: '',
        fabricant: '',
        modele: '',
        ipAddress: '',
        macAddress: '',
        role: '',
        statutOperationnel: 'ACTIF'
    });

    // Spécifications spécifiques par catégorie
    const [specs, setSpecs] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || '',
                nodeName: initialData.nodeName || '',
                fabricant: initialData.fabricant || '',
                modele: initialData.modele || '',
                ipAddress: initialData.ipAddress || '',
                macAddress: initialData.macAddress || '',
                role: initialData.role || '',
                statutOperationnel: initialData.statutOperationnel || 'ACTIF'
            });
            setCategory(initialData.category || 'COMPUTE');
            setSpecs(initialData.specifications || {});
        } else {
            resetForm('COMPUTE');
        }
    }, [initialData, isOpen]);

    const resetForm = (cat) => {
        setCategory(cat);
        setError(null);
        setFormData({
            id: '',
            nodeName: '',
            fabricant: '',
            modele: '',
            ipAddress: '',
            macAddress: '',
            role: '',
            statutOperationnel: 'ACTIF'
        });

        // Valeurs par défaut selon la catégorie choisie
        switch (cat) {
            case 'COMPUTE':
                setSpecs({ type: 'SERVEUR_PHYSIQUE', os: 'Ubuntu Server', cpuCores: 16, ramGb: 32, diskGb: 1000 });
                break;
            case 'NETWORK':
                setSpecs({ type: 'SWITCH_CORE', portsCount: 24, speedGbps: 1, interfacesCount: 4, wanSpeedMbps: 100 });
                break;
            case 'ELECTRICAL':
                setSpecs({ type: 'ONDULEUR', nominalVA: 3000, nominalVoltage: 230, batteryCapAh: 100, maxPowerWatts: 3000 });
                break;
            case 'SOFTWARE':
                setSpecs({ type: 'API_BACKEND', framework: 'Spring Boot', port: 8080, healthEndpoint: '/actuator/health' });
                break;
            default:
                setSpecs({});
        }
    };

    const handleCategoryChange = (newCategory) => {
        resetForm(newCategory);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSpecChange = (field, value) => {
        setSpecs(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const payload = {
            ...formData,
            category,
            specifications: specs
        };

        try {
            if (initialData && initialData.id) {
                await updateEquipment(initialData.id, payload);
            } else {
                await createEquipment(payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de l'équipement :", err);
            setError(err?.response?.data?.message || "Erreur lors de l'enregistrement de l'équipement.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">

                {/* EN-TÊTE DU FORMULAIRE */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Server className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {initialData ? "Modifier l'Équipement" : "Initialiser un Nouvel Équipement"}
                            </h2>
                            <p className="text-xs text-slate-400">Inscrivez un composant dans l'inventaire OBSEN</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ERREUR EVENTUELLE */}
                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* SÉLECTEUR DE CATÉGORIE (TABS) */}
                    {!initialData && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                1. Sélectionner la Catégorie
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { id: 'COMPUTE', label: 'Compute', icon: Cpu },
                                    { id: 'NETWORK', label: 'Réseau', icon: Wifi },
                                    { id: 'ELECTRICAL', label: 'Électricité', icon: Zap },
                                    { id: 'SOFTWARE', label: 'Software', icon: Code2 }
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isActive = category === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleCategoryChange(item.id)}
                                            className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                                                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* INFORMATIONS GÉNÉRALES RÉSEAU / IDENTITÉ */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            2. Informations Générales & Identité Réseau
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Identifiant Unique (ID) *</label>
                                <input
                                    type="text" required
                                    placeholder="ex: EQ-SRV-R710-01"
                                    disabled={!!initialData}
                                    value={formData.id}
                                    onChange={(e) => handleInputChange('id', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Nom du Nœud / Hostname *</label>
                                <input
                                    type="text" required
                                    placeholder="ex: PowerEdge-R710-Proxmox"
                                    value={formData.nodeName}
                                    onChange={(e) => handleInputChange('nodeName', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Fabricant / Marque</label>
                                <input
                                    type="text"
                                    placeholder="ex: Dell, HP, APC, Cisco"
                                    value={formData.fabricant}
                                    onChange={(e) => handleInputChange('fabricant', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Modèle</label>
                                <input
                                    type="text"
                                    placeholder="ex: PowerEdge R710, Smart-UPS"
                                    value={formData.modele}
                                    onChange={(e) => handleInputChange('modele', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Adresse IP</label>
                                <input
                                    type="text"
                                    placeholder="192.168.1.10"
                                    value={formData.ipAddress}
                                    onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Adresse MAC</label>
                                <input
                                    type="text"
                                    placeholder="52:54:00:12:34:56"
                                    value={formData.macAddress}
                                    onChange={(e) => handleInputChange('macAddress', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs text-slate-400 mb-1">Rôle dans l'Infrastructure OBSEN</label>
                            <input
                                type="text"
                                placeholder="ex: Serveur Proxmox pour clients externes"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* SPÉCIFICATIONS TECHNIQUES DYNAMIQUES */}
                    <div className="border-t border-slate-800 pt-4">
                        <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                            3. Spécifications Techniques ({category})
                        </label>

                        {/* COMPUTE FORM */}
                        {category === 'COMPUTE' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Type d'Équipement</label>
                                    <select
                                        value={specs.type || 'SERVEUR_PHYSIQUE'}
                                        onChange={(e) => handleSpecChange('type', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="SERVEUR_PHYSIQUE">Serveur Physique</option>
                                        <option value="WORKSTATION">Workstation (Desktop)</option>
                                        <option value="LAPTOP">Laptop / Portable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Système d'Exploitation (OS)</label>
                                    <input
                                        type="text"
                                        placeholder="Ubuntu Server, Proxmox VE, Windows 10"
                                        value={specs.os || ''}
                                        onChange={(e) => handleSpecChange('os', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Nombre de Cœurs CPU</label>
                                    <input
                                        type="number" min="1"
                                        value={specs.cpuCores || 1}
                                        onChange={(e) => handleSpecChange('cpuCores', parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">RAM totale (Go)</label>
                                    <input
                                        type="number" min="1"
                                        value={specs.ramGb || 1}
                                        onChange={(e) => handleSpecChange('ramGb', parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* NETWORK FORM */}
                        {category === 'NETWORK' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Type d'Équipement Réseau</label>
                                    <select
                                        value={specs.type || 'SWITCH_CORE'}
                                        onChange={(e) => handleSpecChange('type', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="SWITCH_CORE">Switch Cœur / Distribution</option>
                                        <option value="FIREWALL_ROUTER">Routeur / Firewall</option>
                                        <option value="WIFI_AP">Point d'Accès Wi-Fi</option>
                                        <option value="MODEM_SONATEL">Modem / Box Sonatel</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Nombre de Ports</label>
                                    <input
                                        type="number" min="1"
                                        value={specs.portsCount || 24}
                                        onChange={(e) => handleSpecChange('portsCount', parseInt(e.target.value) || 1)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ELECTRICAL FORM */}
                        {category === 'ELECTRICAL' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Type d'Équipement Électrique</label>
                                    <select
                                        value={specs.type || 'ONDULEUR'}
                                        onChange={(e) => handleSpecChange('type', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="ONDULEUR">Onduleur (UPS)</option>
                                        <option value="PANNEAU_SOLAIRE">Panneaux Solaires / Hybride</option>
                                        <option value="GROUPE_ELECTROGENE">Groupe Électrogène</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Puissance Nominale (VA / Watts)</label>
                                    <input
                                        type="number"
                                        value={specs.nominalVA || 3000}
                                        onChange={(e) => handleSpecChange('nominalVA', parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* SOFTWARE FORM */}
                        {category === 'SOFTWARE' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Framework / Techno</label>
                                    <input
                                        type="text" placeholder="Spring Boot, React, Node.js"
                                        value={specs.framework || ''}
                                        onChange={(e) => handleSpecChange('framework', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Endpoint Healthcheck</label>
                                    <input
                                        type="text" placeholder="/actuator/health"
                                        value={specs.healthEndpoint || ''}
                                        onChange={(e) => handleSpecChange('healthEndpoint', e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACTIONS BOUTONS */}
                    <div className="flex justify-end items-center space-x-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition flex items-center space-x-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <span>Enregistrement...</span>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Enregistrer l'Équipement</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}