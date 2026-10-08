import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Cpu, HardDrive, Thermometer,
  RefreshCw, AlertTriangle, CheckCircle2, Server,
  Clock, Zap, ArrowDown, ArrowUp, Pause, Play
} from 'lucide-react';
import { getEquipments } from '../api/equipment';

// Générateur pseudo-aléatoire sécurisé (Fix S6582 & S2245)
const getRandomNumber = () => {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
  }
  return 0.5; // Valeur par défaut déterministe pour éviter Math.random() (S2245)
};

// Fonctions d'aide pour la lisibilité et l'isolation des règles
const getHealthBadge = (healthStatus) => {
  if (healthStatus === 'CRITICAL') {
    return (
      <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-full flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> CRITIQUE
      </span>
    );
  }
  if (healthStatus === 'WARNING') {
    return (
      <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full flex items-center gap-1">
        <Zap className="w-3 h-3" /> WARNING
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
      <CheckCircle2 className="w-3 h-3" /> HEALTHY
    </span>
  );
};

const getCpuProgressColor = (cpuUsage) => {
  if (cpuUsage > 85) return 'bg-red-500';
  if (cpuUsage > 70) return 'bg-amber-500';
  return 'bg-blue-500';
};

const getCardBorderClass = (healthStatus) => {
  if (healthStatus === 'CRITICAL') return 'border-red-500/40 bg-red-950/10';
  if (healthStatus === 'WARNING') return 'border-amber-500/30';
  return 'border-slate-800';
};

export default function DashboardPage() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const generateTelemetryData = (eqList) => {
    return eqList.map((eq) => {
      const baseCpu = eq.category === 'COMPUTE' ? 45 : 20;
      const baseRam = eq.category === 'COMPUTE' ? 60 : 35;
      const baseTemp = eq.category === 'ELECTRICAL' ? 38 : 42;

      const cpuUsage = Math.min(100, Math.max(5, Math.floor(baseCpu + (getRandomNumber() * 30 - 15))));
      const ramUsage = Math.min(100, Math.max(10, Math.floor(baseRam + (getRandomNumber() * 20 - 10))));
      const temperature = Math.min(90, Math.max(25, Math.floor(baseTemp + (getRandomNumber() * 10 - 5))));
      const rxSpeed = (getRandomNumber() * 450 + 50).toFixed(1);
      const txSpeed = (getRandomNumber() * 300 + 30).toFixed(1);
      const latency = Math.floor(getRandomNumber() * 15 + 2);

      let healthStatus = 'HEALTHY';
      if (cpuUsage > 85 || temperature > 75) {
        healthStatus = 'CRITICAL';
      } else if (cpuUsage > 70 || temperature > 60) {
        healthStatus = 'WARNING';
      }

      return {
        ...eq,
        telemetry: {
          cpuUsage,
          ramUsage,
          temperature,
          rxSpeed,
          txSpeed,
          latency,
          healthStatus,
          uptime: '14d 06h 32m'
        }
      };
    });
  };

  const fetchTelemetry = useCallback(async () => {
    try {
      const data = await getEquipments();
      const enrichedData = generateTelemetryData(data || []);
      setEquipments(enrichedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Erreur lors de la récupération de la télémétrie :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTelemetry();
  }, [fetchTelemetry]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setEquipments((prev) => generateTelemetryData(prev));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredEquipments = selectedEquipmentId === 'ALL'
    ? equipments
    : equipments.filter((e) => e.id === selectedEquipmentId);

  const totalEquipments = equipments.length;
  const criticalCount = equipments.filter((e) => e.telemetry?.healthStatus === 'CRITICAL').length;
  const warningCount = equipments.filter((e) => e.telemetry?.healthStatus === 'WARNING').length;
  const healthyCount = totalEquipments - criticalCount - warningCount;

  const avgCpu = totalEquipments > 0
    ? Math.round(equipments.reduce((acc, e) => acc + (e.telemetry?.cpuUsage || 0), 0) / totalEquipments)
    : 0;

  const avgRam = totalEquipments > 0
    ? Math.round(equipments.reduce((acc, e) => acc + (e.telemetry?.ramUsage || 0), 0) / totalEquipments)
    : 0;

  // Fix S3800: Retourne systématiquement un tableau d'éléments JSX pour maintenir la cohérence de type
  const renderContent = () => {
    if (loading) {
      return [
        <div key="loading-state" className="col-span-full text-center p-12 text-slate-500 flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Acquisition des données télémétriques...</span>
        </div>
      ];
    }

    if (filteredEquipments.length === 0) {
      return [
        <div key="empty-state" className="col-span-full text-center p-12 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
          Aucun équipement disponible pour la télémétrie.
        </div>
      ];
    }

    return filteredEquipments.map((eq) => {
      const t = eq.telemetry || {};

      return (
        <div
          key={eq.id}
          className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition hover:border-slate-700 ${getCardBorderClass(t.healthStatus)}`}
        >
          {/* Header Carte */}
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-slate-400 font-bold">{eq.id}</span>
              <h3 className="text-base font-bold text-white">{eq.nodeName}</h3>
              <p className="text-[11px] text-slate-500">{eq.category} • {eq.ipAddress || 'Pas d\'IP'}</p>
            </div>
            {getHealthBadge(t.healthStatus)}
          </div>

          {/* Métriques Charge CPU & RAM */}
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-400" /> Charge CPU</span>
                <span className="font-mono font-bold text-slate-200">{t.cpuUsage}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getCpuProgressColor(t.cpuUsage)}`}
                  style={{ width: `${t.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-purple-400" /> Mémoire RAM</span>
                <span className="font-mono font-bold text-slate-200">{t.ramUsage}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${t.ramUsage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Métriques Réseau & Température */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-slate-500 text-[10px] flex items-center gap-1 mb-1">
                <Thermometer className="w-3 h-3 text-amber-400" /> Température
              </div>
              <div className={`font-mono font-bold ${t.temperature > 70 ? 'text-red-400' : 'text-slate-200'}`}>
                {t.temperature} °C
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
              <div className="text-slate-500 text-[10px] flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Ping / Latence
              </div>
              <div className="font-mono font-bold text-slate-200">
                {t.latency} ms
              </div>
            </div>
          </div>

          {/* Débit Réseau RX / TX (Fix S6772) */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>
                {t.rxSpeed}
                {' '}
                <span className="text-[10px] text-slate-500">Mbps</span>
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-blue-400">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>
                {t.txSpeed}
                {' '}
                <span className="text-[10px] text-slate-500">Mbps</span>
              </span>
            </div>
          </div>

          {/* Footer Carte */}
          <div className="text-[10px] text-slate-500 flex justify-between items-center pt-1">
            <span>Uptime : {t.uptime}</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Flux Live
            </span>
          </div>

        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6">

      {/* EN-TÊTE DU DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Supervision Télémétrie
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Surveillance métriques en temps réel</span>
                <span>•</span>
                <span className="font-mono text-slate-500">
                  Dernier flux : {lastUpdated.toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLES TÉLÉMÉTRIE */}
        <div className="flex items-center gap-3">
          <select
            value={selectedEquipmentId}
            onChange={(e) => setSelectedEquipmentId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="ALL">Tous les équipements ({totalEquipments})</option>
            {equipments.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.id} ({eq.nodeName})
              </option>
            ))}
          </select>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
          >
            {autoRefresh ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRefresh ? "Temps réel ACTIF" : "PAUSE"}</span>
          </button>

          <button
            onClick={() => void fetchTelemetry()}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition"
            title="Rafraîchir maintenant"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI GLOBAL DU PARC */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Total & Santé */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>État Général du Lab</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalEquipments} <span className="text-xs font-normal text-slate-500">nœuds</span></div>
          <div className="flex items-center gap-2 text-[11px] pt-1">
            <span className="text-emerald-400 font-medium">{healthyCount} OK</span>
            {warningCount > 0 && <span className="text-amber-400 font-medium">• {warningCount} Warn</span>}
            {criticalCount > 0 && <span className="text-red-400 font-medium">• {criticalCount} Crit</span>}
          </div>
        </div>

        {/* Usage CPU Moyen */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>CPU Moyen</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{avgCpu}%</div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 ${getCpuProgressColor(avgCpu)}`}
              style={{ width: `${avgCpu}%` }}
            ></div>
          </div>
        </div>

        {/* RAM Moyenne */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Mémoire RAM</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{avgRam}%</div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${avgRam}%` }}
            ></div>
          </div>
        </div>

        {/* Alertes Actives */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Alertes Télémétriques</span>
            <AlertTriangle className={`w-4 h-4 ${criticalCount > 0 ? 'text-red-400 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {criticalCount + warningCount}
          </div>
          <p className="text-[11px] text-slate-500">
            {criticalCount > 0 ? `${criticalCount} urgence(s) détectée(s)` : "Aucun incident majeur"}
          </p>
        </div>

      </div>

      {/* CARTES TÉLÉMÉTRIQUES PAR ÉQUIPEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderContent()}
      </div>

    </div>
  );
}