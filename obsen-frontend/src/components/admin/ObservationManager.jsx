import React, { useState, useEffect } from 'react';
import {
  getObservationsApi, createObservationApi,
  updateObservationApi, deleteObservationApi, updateObservationStatusApi
} from '../api/observation';
import {
  Eye, PlusCircle, MapPin, Calendar, Hash,
  CheckCircle2, XCircle, Clock, Trash2, Edit3, RefreshCw, Filter, FileText
} from 'lucide-react';

export default function ObservationManager() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modale de création / édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObs, setEditingObs] = useState(null);
  const [formData, setFormData] = useState({
    especeId: '',
    siteId: '',
    dateObservation: new Date().toISOString().split('T')[0],
    nombre: 1,
    remarques: '',
    latitude: '',
    longitude: ''
  });

  const loadObservations = async () => {
    setLoading(true);
    try {
      const res = await getObservationsApi();
      setObservations(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des observations :", err);
      setError("Impossible de charger la liste des observations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadObservations();
  }, []);

  const handleOpenModal = (obs = null) => {
    if (obs) {
      setEditingObs(obs);
      setFormData({
        especeId: obs.especeId || '',
        siteId: obs.siteId || '',
        dateObservation: obs.dateObservation ? obs.dateObservation.split('T')[0] : '',
        nombre: obs.nombre || 1,
        remarques: obs.remarques || '',
        latitude: obs.latitude || '',
        longitude: obs.longitude || ''
      });
    } else {
      setEditingObs(null);
      setFormData({
        especeId: '',
        siteId: '',
        dateObservation: new Date().toISOString().split('T')[0],
        nombre: 1,
        remarques: '',
        latitude: '',
        longitude: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingObs) {
        await updateObservationApi(editingObs.id, formData);
      } else {
        await createObservationApi(formData);
      }
      setIsModalOpen(false);
      await loadObservations();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      alert("Erreur lors de l'enregistrement de l'observation.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateObservationStatusApi(id, newStatus);
      await loadObservations();
    } catch (err) {
      console.error("Erreur de changement de statut :", err);
      alert("Erreur lors de la modification du statut.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette observation ?")) {
      try {
        await deleteObservationApi(id);
        await loadObservations();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const filteredObservations = observations.filter(obs => {
    if (filterStatus === 'ALL') return true;
    return obs.statut === filterStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'VALIDEE':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Validée</span>;
      case 'REJETEE':
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Rejetée</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> En attente</span>;
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-slate-400 flex items-center justify-center space-x-2">
        <RefreshCw className="animate-spin" />
        <span>Chargement des observations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">{error}</div>}

      {/* EN-TÊTE ET ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="text-emerald-400 w-6 h-6" />
            Gestion des Observations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consultez, ajoutez et modérez les observations de la faune/flore.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouvelle Observation</span>
        </button>
      </div>

      {/* FILTRES */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <span className="text-xs text-slate-400 font-medium mr-2">Statut :</span>
        {['ALL', 'EN_ATTENTE', 'VALIDEE', 'REJETEE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === status 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {status === 'ALL' ? 'Tous' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* TABLEAU DES OBSERVATIONS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase border-b border-slate-800">
                <th className="p-4">Espèce & Site</th>
                <th className="p-4">Date</th>
                <th className="p-4">Comptage</th>
                <th className="p-4">Localisation</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {filteredObservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-slate-500 text-sm">
                    Aucune observation trouvée.
                  </td>
                </tr>
              ) : (
                filteredObservations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-semibold text-white">Espèce #{obs.especeId}</div>
                      <div className="text-xs text-slate-400">Site #{obs.siteId}</div>
                      {obs.remarques && (
                        <div className="text-xs text-slate-500 mt-1 italic line-clamp-1">{obs.remarques}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {obs.dateObservation}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-emerald-400">
                      <span className="inline-flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-500" />
                        {obs.nombre}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {obs.latitude && obs.longitude ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {obs.latitude}, {obs.longitude}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(obs.statut)}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleStatusChange(obs.id, 'VALIDEE')}
                        title="Valider"
                        className="p-1.5 text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(obs.id, 'REJETEE')}
                        title="Rejeter"
                        className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(obs)}
                        title="Éditer"
                        className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(obs.id)}
                        title="Supprimer"
                        className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DE CRÉATION / ÉDITION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              {editingObs ? 'Saisir une modification' : 'Nouvelle Observation'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">ID Espèce *</label>
                  <input
                    type="text" required
                    value={formData.especeId}
                    onChange={(e) => setFormData({ ...formData, especeId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">ID Site *</label>
                  <input
                    type="text" required
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Date *</label>
                  <input
                    type="date" required
                    value={formData.dateObservation}
                    onChange={(e) => setFormData({ ...formData, dateObservation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre d'indiv. *</label>
                  <input
                    type="number" min="1" required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Latitude</label>
                  <input
                    type="text" placeholder="14.6937"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Longitude</label>
                  <input
                    type="text" placeholder="-17.4441"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Remarques / Notes</label>
                <textarea
                  rows="3"
                  value={formData.remarques}
                  onChange={(e) => setFormData({ ...formData, remarques: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}