import React, { useState, useEffect } from 'react';

// --- ICONES SVG ---
const IconTerminal = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconCpu = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconCheck = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconSparkles = () => <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const IconAlert = () => <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconPlay = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>;
const IconEye = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconDownload = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconShield = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default function AssistantIA() {
  // --- ÉTATS SYSTÈME ---
  const [counters, setCounters] = useState({ incidents: 2, audits: 1, archives: 2 });
  const [selectedEquipment, setSelectedEquipment] = useState('ALL');
  const [isMuted, setIsMuted] = useState(false);

  // Base de logs d'infrastructure
  const [logs, setLogs] = useState([
    { id: 1, time: '16:27:38', type: 'SUCCESS', equipement: 'SERVEUR', msg: 'Télémétrie Spring Boot récupérée avec succès.' },
    { id: 2, time: '16:26:43', type: 'SUCCESS', equipement: 'SERVEUR', msg: 'Télémétrie Spring Boot récupérée avec succès.' },
    { id: 3, time: '16:25:10', type: 'ERROR', equipement: 'DB', msg: 'POSTGRES_ERR: Connection pool exhausted on postgresql://db-obsen.local:5432 (12/12 active sessions).', reportType: 'PERFORMANCE_AUDIT', payload: '{"active_connections": 12, "max_connections": 12, "waiting_clients": 8, "db_name": "production_obsen"}', playbook: ['Vider les connexions SQL inactives (SRE_KILL_IDLE)', 'Augmenter le pool à 20 (SCALE_POOL_UP)', 'Redémarrer le pool db-obsen'] },
    { id: 4, time: '16:26:15', type: 'ERROR', equipement: 'API', msg: 'API_TIMEOUT_ERR: Gateway SenePay took longer than 5000ms to respond.', reportType: 'NETWORK_LATENCY', payload: '{"endpoint": "/v1/charge", "timeout_ms": 5000, "provider": "SenePay", "network_route": "gateway-sn-4"}', playbook: ['Activer le disjoncteur (CIRCUIT_BREAKER_ON)', 'Basculer temporairement sur PayDunya (FAILOVER_ROUTE)', 'Notifier l\'équipe externe SenePay'] },
    { id: 5, time: '16:12:45', type: 'SUCCESS', equipement: 'SERVEUR', msg: 'Télémétrie Spring Boot récupérée avec succès.' }
  ]);

  // États de l'assistant de diagnostic LLM
  const [selectedError, setSelectedError] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, ready, resolved
  const [llmResponse, setLlmResponse] = useState(null);
  const [executedSteps, setExecutedSteps] = useState({});
  const [terminalOutput, setTerminalOutput] = useState([]);

  // États d'archives & d'audits fusionnés
  const [archivedIncidents, setArchivedIncidents] = useState([
    { 
      id: "AUD-1002",
      type: "AUDIT",
      msg: "Rapport d'Audit Global de Conformité d'Infrastructure", 
      resolvedAt: "11:00:15", 
      equipement: "ALL",
      operator: "SRE-Audit-System",
      steps: ["SYS_SCAN", "SLA_VERIFY"],
      fullReport: `==================================================
RAPPORT DE SÉCURITÉ ET D'AUDIT CRITIQUE [AUD-1002]
==================================================
Date d'exécution : 2026-07-16 11:00:15
Cible de l'audit : Système Global (SERVEUR, DB, API)
Auditeur SRE     : SRE-Audit-System
Statut           : CONFORME AVEC RECOMMANDATIONS

SYNTHÈSE DE CONFORMITÉ :
- Serveurs de calcul  : 100% opérationnels. Temps de réponse de l'OS < 25ms.
- Bases de données    : Taux de saturation temporaire résolu.
- API & Connecteurs   : SLA SenePay à surveiller (quelques timeouts observés).

RECOMMANDATION :
Planifier une augmentation préventive du pool de connexion SQL de prod.`
    },
    { 
      id: "ARC-9942",
      type: "INCIDENT",
      msg: "Restauration réussie après incident base de données.", 
      resolvedAt: "10:15:30", 
      equipement: "DB",
      operator: "SRE-Ops-01",
      steps: ["KILL_IDLE_CONNS", "RESET_POOL"],
      fullReport: `==================================================
RAPPORT D'INCIDENT TECHNIQUE [ARC-9942]
==================================================
Date de clôture : 2026-07-16 10:15:30
Équipement      : DB (postgresql://db-obsen.local)
Opérateur SRE   : SRE-Ops-01
Statut Audit    : CONFORME - PROTOCOLE RESPECTÉ

DIAGNOSTIC (RCA) :
Saturation critique du pool de connexions SQL. Blocage du thread pool.

RÉSOLUTION APPLIQUÉE :
1. Purge forcée des processus dormants (KILL_IDLE_CONNS)
2. Redémarrage propre du pilote d'interconnexion (RESET_POOL)`
    }
  ]);

  // Modale pour visualiser le rapport détaillé d'une archive
  const [activeReportView, setActiveReportView] = useState(null);

  const errorLogs = logs.filter(log => log.type === 'ERROR');
  const equipments = ['ALL', 'SERVEUR', 'DB', 'API'];

  const triggerBeep = () => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (errorLogs.length > 0) {
      triggerBeep();
      const interval = setInterval(() => triggerBeep(), 6000);
      return () => clearInterval(interval);
    }
  }, [errorLogs, isMuted]);

  // --- ENGINE DE DIAGNOSTIC IA ---
  const handleDiagnose = (errorLog) => {
    setSelectedError(errorLog);
    setAnalysisStatus('analyzing');
    setExecutedSteps({});
    setTerminalOutput([`[SYS] Initialisation du diagnostic IA pour l'incident #${errorLog.id}...`]);
    
    setTimeout(() => {
      let customAnalysis = '';
      if (errorLog.reportType === 'PERFORMANCE_AUDIT') {
        customAnalysis = `[RAPPORT DE PERFORMANCE ET AUDIT DE CHARGE]\n--------------------------------------------------\nANALYSE RACINE : Débordement de pile réseau lié à une fuite de descripteurs de fichiers.\nIMPACT MESURÉ  : Perte de paquets de 14.2% sur le segment db-obsen.local.\nCOMPORTEMENT   : Goulot d'étranglement détecté sur la couche d'accès JPA/Hibernate.`;
      } else if (errorLog.reportType === 'NETWORK_LATENCY') {
        customAnalysis = `[RAPPORT DE ROUTAGE ET DE LATENCE API]\n--------------------------------------------------\nANALYSE RACINE : Instabilité sur le transit transcontinental ou échec DNS chez le fournisseur tiers.\nIMPACT MESURÉ  : Timeout critique sur les transactions de paiement sortantes.\nCOMPORTEMENT   : Latence moyenne d'appel supérieure à 5000ms.`;
      } else {
        customAnalysis = `[RAPPORT TECHNIQUE STANDARD]\n--------------------------------------------------\nANALYSE RACINE : Erreur non caractérisée détectée sur le nœud d'infrastructure.\nIMPACT MESURÉ  : Ralentissement mineur des tâches secondaires.`;
      }

      setLlmResponse({
        rapport: `RAPPORT D'ANALYSE IA - SRE COPILOT\n==================================================\nÉquipement affecté : [${errorLog.equipement}]\nErreur capturée    : ${errorLog.msg}\n\n${customAnalysis}\n\nSévérité : CRITIQUE (Niveau 1)`,
        solutions: errorLog.playbook || ['Exécuter REBOOT_HARD_RECONSTRUCTION']
      });
      setAnalysisStatus('ready');
      setTerminalOutput(prev => [...prev, `[IA] Rapport de diagnostic généré. Playbook de secours chargé dans le tampon.`]);
    }, 1250);
  };

  const executeSolutionStep = (step, index) => {
    if (executedSteps[index]) return;
    setTerminalOutput(prev => [...prev, `[EXEC] Lancement : ${step}...`]);
    
    setTimeout(() => {
      setExecutedSteps(prev => ({ ...prev, [index]: true }));
      setTerminalOutput(prev => [
        ...prev, 
        `[SUCCESS] '${step}' exécuté. Code retour : 0`,
        `[SYS] Stabilisation progressive constatée sur ${selectedError.equipement}.`
      ]);
    }, 800);
  };

  // --- ARCHIVAGE INCIDENT & RAPPORT D'AUDIT LIÉ ---
  const handleArchiveIncident = () => {
    const stepsArray = Object.keys(executedSteps).map(key => llmResponse.solutions[key]);
    const archiveId = `ARC-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString('fr-FR');

    const fullAuditReport = `==================================================
RAPPORT DE SÉCURITÉ ET D'AUDIT TECHNIQUE [${archiveId}]
==================================================
Généré le       : ${now}
Équipement      : ${selectedError.equipement}
Opérateur SRE   : SRE-Ops-System
Statut Audit    : CONFORME - TOUTES LES ÉTAPES EXÉCUTÉES AVEC SUCCÈS

RÉSUMÉ DE L'INCIDENT :
${selectedError.msg}

RÉPONSE D'URGENCE (PLAYBOOK) APPLIQUÉE :
${stepsArray.map((step, idx) => `${idx + 1}. ${step} [VALIDE]`).join('\n')}

MÉTROLOGIE POST-RÉSOLUTION :
- Intégrité de la structure : 100%
- Temps de réponse : Réduit aux spécifications normales de production.`;

    const newArchive = {
      id: archiveId,
      type: "INCIDENT",
      msg: selectedError.msg,
      resolvedAt: new Date().toLocaleTimeString('fr-FR'),
      equipement: selectedError.equipement,
      operator: "SRE-Ops-System",
      steps: stepsArray,
      fullReport: fullAuditReport
    };

    setArchivedIncidents(prev => [newArchive, ...prev]);
    setLogs(prev => prev.filter(l => l.id !== selectedError.id));
    
    setCounters(prev => ({
      ...prev,
      incidents: Math.max(0, prev.incidents - 1),
      archives: prev.archives + 1,
    }));

    setAnalysisStatus('resolved');
  };

  // --- NOUVEAUTÉ : LANCER UN AUDIT GLOBAL (ARCHIVABLE COMME RAPPORT) ---
  const triggerGlobalAudit = () => {
    setAnalysisStatus('analyzing');
    setTerminalOutput([`[SYS-AUDIT] Initialisation du scan d'audit global...`]);

    setTimeout(() => {
      const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toLocaleString('fr-FR');
      
      const globalReport = `==================================================
RAPPORT D'AUDIT GLOBAL DE L'INFRASTRUCTURE [${auditId}]
==================================================
Généré le       : ${now}
Cible           : Équipements de production (SERVEUR, DB, API)
Auditeur        : SRE-LLM-Copilot
Statut          : RECOMMANDATIONS INTÉGRÉES

DIAGNOSTIC SUR LES COMPOSANTS EN PRODUCTION :
- SERVEURS : Aucune anomalie système détectée. CPU à 12%, Mémoire libre à 64%.
- DATABASES : Le pool de connexions est actuellement sous haute surveillance.
- APIS EXTÉRIEURES : Latence transitoire mesurée sur le point de terminaison SenePay.

RECOMMANDATIONS DE SÉCURITÉ :
1. Configurer un auto-scale d'instance pour le segment API en cas de congestion de trafic.
2. Programmer une vidange automatique périodique des connexions dormantes sur la DB.`;

      const newAuditArchive = {
        id: auditId,
        type: "AUDIT",
        msg: "Rapport d'Audit Global - État de l'infrastructure",
        resolvedAt: new Date().toLocaleTimeString('fr-FR'),
        equipement: "ALL",
        operator: "SRE-LLM-Copilot",
        steps: ["FULL_SYSTEM_SCAN", "LATENCY_TEST"],
        fullReport: globalReport
      };

      setArchivedIncidents(prev => [newAuditArchive, ...prev]);
      setCounters(prev => ({
        ...prev,
        audits: prev.audits + 1,
        archives: prev.archives + 1
      }));

      // On simule que l'audit est complété et prêt dans le terminal
      setTerminalOutput(prev => [
        ...prev,
        `[SUCCESS] Scan de conformité achevé.`,
        `[IA] Rapport d'audit ${auditId} enregistré et inséré dans le registre d'archives.`
      ]);
      setAnalysisStatus('idle');
      
      // On ouvre immédiatement la modale pour qu'il puisse voir le rapport
      setActiveReportView(newAuditArchive);
    }, 1500);
  };

  const downloadReportFile = (archive) => {
    const element = document.createElement("a");
    const file = new Blob([archive.fullReport], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${archive.id}_Report.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetConsole = () => {
    setSelectedError(null);
    setLlmResponse(null);
    setExecutedSteps({});
    setTerminalOutput([]);
    setAnalysisStatus('idle');
  };

  const filteredLogs = selectedEquipment === 'ALL' 
    ? logs 
    : logs.filter(log => log.equipement === selectedEquipment);

  return (
    <div className="bg-[#05080f] text-slate-300 font-mono min-h-screen p-6 space-y-6 relative">

      {/* ================= MODALE VISUALISATION DE RAPPORT (INCIDENTS ET AUDITS) ================= */}
      {activeReportView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-slate-950 p-4 border-b border-slate-900 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-400">
                {activeReportView.type === "AUDIT" ? "🛡️" : "🔍"} RAPPORT {activeReportView.type} DETILLÉ ({activeReportView.id})
              </span>
              <button 
                onClick={() => setActiveReportView(null)}
                className="text-slate-500 hover:text-slate-200 text-sm font-bold"
              >
                ✕ Fermer
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-black/40">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {activeReportView.fullReport}
              </pre>
            </div>
            <div className="bg-slate-950 p-4 border-t border-slate-900 flex justify-end gap-2">
              <button 
                onClick={() => downloadReportFile(activeReportView)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <IconDownload /> Télécharger (.txt)
              </button>
              <button 
                onClick={() => setActiveReportView(null)}
                className="bg-slate-900 border border-slate-850 hover:bg-slate-800 px-4 py-2 rounded text-[11px] font-bold"
              >
                Quitter la vue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BANDEAU D'ALERTE CRITIQUE SRE ================= */}
      {errorLogs.length > 0 && (
        <div className="bg-rose-950/40 border-2 border-rose-600/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <span className="text-rose-500"><IconAlert /></span>
            <div>
              <h1 className="text-sm font-black text-rose-400 uppercase tracking-wider">Alerte active : {errorLogs.length} anomalies critiques détectées</h1>
              <p className="text-[10px] text-slate-400">Une intervention sur l'un des playbooks recommandés est requise pour préserver la SLA.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="px-3 py-1 bg-rose-900/40 border border-rose-700/50 hover:bg-rose-900 rounded text-[9px] font-bold text-rose-300 transition-all uppercase"
            >
              {isMuted ? '🔊 Activer le son' : '🔇 Silencer'}
            </button>
            <span className="text-[10px] bg-rose-500 text-slate-950 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest animate-ping">CRITIQUE</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= COLONNE GAUCHE : Moteur de Diagnostic & Console de Résolution ================= */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <IconCpu /> Diagnostic & Remédiation IA
          </h2>
          
          {/* Compteurs SRE */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`bg-[#0a0f1d] border p-3 rounded-lg text-[10px] uppercase font-bold transition-all ${errorLogs.length > 0 ? 'border-rose-900 text-rose-400' : 'border-slate-800 text-slate-500'}`}>
              incidents ({errorLogs.length})
            </div>
            <div className="bg-[#0a0f1d] border border-slate-800 p-3 rounded-lg text-[10px] uppercase font-bold text-indigo-400">
              audits ({counters.audits})
            </div>
            <div className="bg-[#0a0f1d] border border-slate-800 p-3 rounded-lg text-[10px] uppercase font-bold text-emerald-500">
              archives ({counters.archives})
            </div>
          </div>

          {/* Chatbox SRE & Console d'Exécution */}
          <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-5 shadow-xl relative min-h-[460px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${analysisStatus === 'analyzing' ? 'bg-indigo-500 animate-ping' : 'bg-emerald-500'}`}></span>
                    Console Obsen Copilot IA
                  </h3>
                  <p className="text-[9px] text-slate-500">Moteur d'atténuation actif</p>
                </div>
                <span className="text-[9px] bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded text-indigo-400 font-bold uppercase">LLM v4.2</span>
              </div>

              {/* État initial : En attente */}
              {analysisStatus === 'idle' && (
                <div className="text-center py-16 space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-lg">
                    🧠
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Aucun incident chargé</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Sélectionnez une anomalie dans le panneau de droite ou lancez un audit préventif pour auditer l'ensemble du système d'infrastructure.
                  </p>
                  <div className="pt-4">
                    <button 
                      onClick={triggerGlobalAudit}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-[10px] font-black uppercase flex items-center gap-1.5 mx-auto transition-colors"
                    >
                      <IconShield /> Lancer un audit global
                    </button>
                  </div>
                </div>
              )}

              {/* Analyse en cours */}
              {analysisStatus === 'analyzing' && (
                <div className="text-center py-20 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="text-[10px] text-indigo-400 animate-pulse font-bold uppercase">Génération du rapport IA...</p>
                  <p className="text-[9px] text-slate-600 font-mono">Analyse approfondie de la conformité du réseau...</p>
                </div>
              )}

              {/* Rapport généré & Actions interactives */}
              {(analysisStatus === 'ready') && llmResponse && (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#05080f] border border-slate-800 p-3 rounded-lg">
                    <pre className="text-[9px] text-indigo-300 whitespace-pre-wrap leading-relaxed">{llmResponse.rapport}</pre>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Plan de Résolution Recommandé :</span>
                    <div className="space-y-1.5">
                      {llmResponse.solutions.map((sol, index) => {
                        const isDone = executedSteps[index];
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center justify-between p-2 rounded border transition-all ${
                              isDone 
                                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400' 
                                : 'bg-[#05080f] border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="text-[10px] font-semibold">{index + 1}. {sol}</span>
                            <button
                              onClick={() => executeSolutionStep(sol, index)}
                              disabled={isDone}
                              className={`text-[9px] px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                                isDone 
                                  ? 'bg-emerald-950 text-emerald-400 cursor-not-allowed' 
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              }`}
                            >
                              {isDone ? '✓ OK' : <span className="flex items-center gap-1"><IconPlay /> Appliquer</span>}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Terminal de commande interne */}
                  <div className="bg-black/80 rounded-lg p-3 border border-slate-850 font-mono h-[110px] overflow-y-auto">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1 mb-1 font-bold">Terminal Exécution SRE</p>
                    {terminalOutput.map((line, i) => (
                      <p key={i} className="text-[9px] text-slate-400 leading-normal">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Résolution complétée */}
              {analysisStatus === 'resolved' && (
                <div className="text-center py-16 space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500 flex items-center justify-center text-emerald-400">
                    <IconCheck />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-400 font-bold uppercase">Alerte résolue & Archive injectée</p>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                      L'incident a été archivé sous forme de rapport d'audit et historique complet.
                    </p>
                  </div>
                  <button 
                    onClick={resetConsole}
                    className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-1.5 rounded text-[10px] font-bold hover:bg-slate-800"
                  >
                    Réinitialiser la console
                  </button>
                </div>
              )}
            </div>

            {/* Footer de validation */}
            {analysisStatus === 'ready' && (
              <div className="mt-4 pt-3 border-t border-slate-900/60 flex gap-2">
                <button 
                  onClick={handleArchiveIncident}
                  disabled={Object.keys(executedSteps).length !== llmResponse.solutions.length}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 py-2 rounded text-[10px] font-black transition-all uppercase flex items-center justify-center gap-1.5"
                >
                  <IconCheck /> Archiver avec Rapport d'Audit
                </button>
                <button 
                  onClick={resetConsole}
                  className="px-3 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 rounded text-[10px] font-bold"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Registre des Archives Historiques & Rapports d'Audits */}
          <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
              📂 Registre Unique d'Archives & Audits ({archivedIncidents.length})
            </h3>
            <div className="max-h-[190px] overflow-y-auto space-y-2 text-[9px]">
              {archivedIncidents.map((arch, i) => (
                <div key={i} className="bg-slate-950 border border-slate-900/60 p-3 rounded flex justify-between items-center gap-2 hover:border-slate-800 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold uppercase tracking-wider text-[8px] px-1.5 py-0.5 rounded border ${
                        arch.type === "AUDIT" 
                          ? "bg-indigo-950/80 text-indigo-400 border-indigo-900/40" 
                          : "bg-emerald-950/40 text-emerald-400 border-emerald-900/30"
                      }`}>
                        {arch.id}
                      </span>
                      <span className="text-slate-500">{arch.resolvedAt}</span>
                    </div>
                    <p className="text-slate-300 font-medium">{arch.msg}</p>
                    <p className="text-slate-500 text-[8px]">Index : {arch.steps.join(' ➔ ')}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveReportView(arch)}
                      className="bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 p-1.5 rounded transition-all flex items-center gap-1.5"
                      title="Visualiser le rapport d'audit"
                    >
                      <IconEye /> <span className="hidden sm:inline">Visualiser</span>
                    </button>
                    <button
                      onClick={() => downloadReportFile(arch)}
                      className="bg-indigo-950 text-indigo-400 border border-indigo-900/40 hover:bg-indigo-900/30 p-1.5 rounded transition-all flex items-center gap-1.5"
                      title="Télécharger le rapport brut (.txt)"
                    >
                      <IconDownload /> <span className="hidden sm:inline">Télécharger</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= COLONNE DROITE : Surveillance par Équipement & Terminal de Logs ================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Sélecteur de Ressources / Équipements */}
          <div className="bg-[#0a0f1d] border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-2">Filtrer par équipement :</p>
              <div className="flex flex-wrap gap-1.5">
                {equipments.map((eq) => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`text-[10px] px-3 py-1.5 rounded transition-all ${
                      selectedEquipment === eq 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400'
                    }`}
                  >
                    {eq} {eq === 'ALL' ? `(${logs.length})` : `(${logs.filter(l => l.equipement === eq).length})`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Bouton d'Audit Global Déplacé en haut à droite */}
            <button 
              onClick={triggerGlobalAudit}
              className="bg-slate-950 hover:bg-slate-900 border border-indigo-900/60 hover:border-indigo-500 text-indigo-400 hover:text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-2 shrink-0 self-end mb-0.5"
            >
              <IconShield /> Audit Global System
            </button>
          </div>

          {/* SECTION ANOMALIES ACTIVES (Capture d'erreur immédiate) */}
          <div className="bg-[#0a0f1d] border-2 border-rose-950/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-900/20">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                ⚠️ Anomalies Non Résolues ({errorLogs.length})
              </h3>
              <span className="text-[8px] bg-rose-950 border border-rose-800 text-rose-400 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Temps Réel</span>
            </div>
            
            <div className="space-y-2">
              {errorLogs.length === 0 ? (
                <p className="text-[10px] text-emerald-400 italic">Aucune anomalie active. Tout est nominal.</p>
              ) : (
                errorLogs.map((error) => (
                  <div 
                    key={error.id} 
                    onClick={() => handleDiagnose(error)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedError?.id === error.id
                        ? 'bg-indigo-950/30 border-indigo-500 text-slate-100 shadow-lg'
                        : 'bg-rose-950/10 border-rose-950 hover:border-rose-900 text-slate-300 hover:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-rose-400">[{error.equipement}] • ID #{error.id}</span>
                      <button className="bg-indigo-600 text-white hover:bg-indigo-500 px-2.5 py-1 rounded font-bold text-[9px] transition-all flex items-center gap-1">
                        <IconSparkles /> Analyser et Résoudre
                      </button>
                    </div>
                    <p className="text-[10px] mt-2 break-words font-semibold">{error.msg}</p>
                    {error.payload && (
                      <pre className="mt-2 text-[8px] bg-black/60 p-2 rounded text-slate-400 overflow-x-auto border border-slate-900">
                        {error.payload}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TERMINAL DE TÉLÉMÉTRIE FLUX GÉNÉRAL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
                <IconTerminal /> Flux d'infrastructure ({selectedEquipment})
              </h3>
              <button 
                onClick={() => setLogs([])} 
                className="text-[9px] text-slate-500 hover:text-rose-400 border border-slate-850 px-2.5 py-1 rounded bg-slate-950 transition-all"
              >
                Effacer le flux
              </button>
            </div>

            <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-4 h-[280px] overflow-y-auto space-y-2 font-mono scrollbar-thin">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs">
                  Aucun log pour l'équipement "{selectedEquipment}".
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => log.type === 'ERROR' && handleDiagnose(log)}
                    className={`text-[10px] flex items-start gap-2 py-1.5 border-b border-slate-950 last:border-0 rounded px-1.5 transition-colors ${
                      log.type === 'ERROR' ? 'hover:bg-rose-950/20 cursor-pointer' : 'hover:bg-slate-950/30'
                    }`}
                  >
                    <span className="text-slate-600 select-none">{log.time}</span>
                    <span className="text-indigo-400 font-bold select-none">[{log.equipement}]</span>
                    <span className={`font-bold px-1 rounded text-[8px] uppercase ${
                      log.type === 'ERROR' ? 'bg-rose-950/80 text-rose-400 border border-rose-900/30' : 
                      log.type === 'SUCCESS' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/20' : 
                      'bg-slate-800 text-slate-400'
                    }`}>{log.type}</span>
                    <span className="text-slate-300 break-all">{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}