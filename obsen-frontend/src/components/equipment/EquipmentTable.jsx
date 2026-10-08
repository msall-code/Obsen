import React from 'react';
import { Edit2, Server, CheckCircle2, XCircle, HardDrive } from 'lucide-react';

export function EquipmentTable({ equipments, loading, onRefresh, onEdit }) {
    if (loading) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-3"></div>
                <p className="text-xs">Chargement de l'inventaire en cours...</p>
            </div>
        );
    }

    if (!equipments || equipments.length === 0) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 space-y-3">
                <Server className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Aucun équipement enregistré</p>
                <p className="text-xs text-slate-500">Utilisez le bouton "Nouvel Équipement" ou "Initialiser Démo" pour remplir le tableau.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nœud / Hostname</th>
                            <th className="p-4">Catégorie</th>
                            <th className="p-4">Fabricant & Modèle</th>
                            <th className="p-4">Adresse IP</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                        {equipments.map((eq) => (
                            <tr key={eq.id} className="hover:bg-slate-800/40 transition">
                                <td className="p-4 font-bold text-emerald-400">{eq.id}</td>
                                <td className="p-4 font-sans font-semibold text-white">{eq.nodeName}</td>
                                <td className="p-4 font-sans">
                                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-300">
                                        {eq.category}
                                    </span>
                                </td>
                                <td className="p-4 font-sans text-slate-400">
                                    {eq.fabricant || 'N/A'} {eq.modele ? `- ${eq.modele}` : ''}
                                </td>
                                <td className="p-4 text-slate-300">{eq.ipAddress || '—'}</td>
                                <td className="p-4 font-sans">
                                    {eq.statutOperationnel === 'ACTIF' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-semibold">
                                            <CheckCircle2 className="w-3 h-3" /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-semibold">
                                            <XCircle className="w-3 h-3" /> Inactif
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right font-sans">
                                    <button
                                        onClick={() => onEdit(eq)}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                                        title="Modifier"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Ligne indispensable pour résoudre l'erreur : "does not provide an export named 'default'"
export default EquipmentTable;