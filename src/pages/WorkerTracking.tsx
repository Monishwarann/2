import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { calculateACRSA } from '../engine/acrsa';
import { Search, Heart, RefreshCw, Eye, ShieldAlert } from 'lucide-react';

export const WorkerTracking: React.FC = () => {
  const { workers, helmets, setReplayIndex, setCurrentPage } = useMineStore();
  const [search, setSearch] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  // Filter workers based on search query
  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.role.toLowerCase().includes(search.toLowerCase()) ||
    w.zone.toLowerCase().includes(search.toLowerCase())
  );

  const selectedWorker = workers.find(w => w.id === selectedWorkerId);
  const selectedHelmet = helmets.find(h => h.workerId === selectedWorkerId);
  const selectedNeighbors = helmets.filter(h => selectedHelmet?.neighboringHelmets.includes(h.id));
  const selectedACRSA = (selectedWorker && selectedHelmet) 
    ? calculateACRSA(selectedWorker, selectedHelmet, selectedNeighbors) 
    : null;

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header and Search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
            Worker Safety Tracking Console
          </h2>
          <p className="text-xs text-mine-textMuted uppercase mt-1">
            Real-time biometric monitoring, zone layout tracking, and edge ACRSA scoring
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-mine-textMuted" />
          <input
            type="text"
            placeholder="Search worker name, zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D1B2A] border border-[rgba(0,212,255,0.15)] rounded-lg py-2 pl-9 pr-4 text-xs text-[#E8F4FD] focus:outline-none focus:border-[#00D4FF] transition-all font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        
        {/* Roster list table */}
        <div className="col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)] flex justify-between items-center bg-[rgba(255,255,255,0.01)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono">
              Live Personnel Registry ({filteredWorkers.length})
            </h3>
            <span className="text-[10px] text-mine-textMuted font-mono">Telemetry updates at 1Hz</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.2)] text-mine-textMuted">
                <th className="p-4">Personnel</th>
                <th className="p-4">Assigned Shaft</th>
                <th className="p-4 text-center">Heart (HR)</th>
                <th className="p-4 text-center">SpO₂</th>
                <th className="p-4 text-center">Risk Index</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,212,255,0.04)]">
              {filteredWorkers.map(w => {
                const helmet = helmets.find(h => h.workerId === w.id);
                const neighbors = helmets.filter(h => helmet?.neighboringHelmets.includes(h.id));
                const acrsa = helmet ? calculateACRSA(w, helmet, neighbors) : null;

                // Color mappings
                let riskColor = 'text-mine-green';
                let riskBg = 'bg-mine-green/10';
                if (acrsa?.riskCategory === 'Extreme') {
                  riskColor = 'text-mine-red';
                  riskBg = 'bg-mine-red/10 border border-mine-red/20';
                } else if (acrsa?.riskCategory === 'High') {
                  riskColor = 'text-orange-400';
                  riskBg = 'bg-orange-400/10 border border-orange-400/20';
                } else if (acrsa?.riskCategory === 'Medium') {
                  riskColor = 'text-mine-amber';
                  riskBg = 'bg-mine-amber/10';
                }

                return (
                  <tr key={w.id} className="hover:bg-[rgba(0,212,255,0.02)] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#E8F4FD]">{w.name}</div>
                      <div className="text-[10px] text-mine-textMuted uppercase">{w.role} | {w.id}</div>
                    </td>
                    <td className="p-4 text-mine-textMuted">{w.zone}</td>
                    <td className="p-4 text-center font-bold">
                      <span className="flex items-center justify-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-mine-red fill-mine-red animate-pulse" />
                        {w.heartRate} bpm
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-mine-cyan">{w.spo2}%</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1.5 rounded-md text-[10px] font-bold ${riskColor} ${riskBg}`}>
                        {acrsa ? `${acrsa.riskScore}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedWorkerId(w.id)}
                        className="p-1.5 bg-[#1B263B] text-mine-cyan hover:bg-[#25324D] rounded border border-[rgba(0,212,255,0.1)] transition-all"
                        title="Open analysis details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Drill down worker safety detail panel */}
        <div className="col-span-1 space-y-4">
          {selectedWorker && selectedHelmet && selectedACRSA ? (
            <div className="glass-card rounded-xl p-5 space-y-5">
              {/* Profile Card */}
              <div className="border-b border-[rgba(0,212,255,0.1)] pb-4">
                <h3 className="text-sm font-bold text-[#E8F4FD] font-mono uppercase">{selectedWorker.name}</h3>
                <span className="text-[10px] text-mine-cyan uppercase font-mono tracking-wider">
                  Profile Details: {selectedWorker.id}
                </span>
              </div>

              {/* ACRSA scoring gauges */}
              <div className="space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-mine-textMuted">ACRSA Risk Rating:</span>
                  <span className="text-[#E8F4FD] font-bold">{selectedACRSA.riskScore}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-[#132235] h-2 rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      selectedACRSA.riskCategory === 'Extreme' ? 'bg-mine-red glow-red' : 
                      selectedACRSA.riskCategory === 'High' ? 'bg-orange-500' :
                      selectedACRSA.riskCategory === 'Medium' ? 'bg-mine-amber glow-amber' : 
                      'bg-mine-green'
                    }`}
                    style={{ width: `${selectedACRSA.riskScore}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-mine-textMuted">
                  <span>Confidence Index: {selectedACRSA.confidenceScore}%</span>
                  <span>Category: {selectedACRSA.riskCategory}</span>
                </div>
              </div>

              {/* Explainable Emergency Intelligence (EEI) factors list */}
              <div className="space-y-2 bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)] p-3.5 rounded-lg">
                <span className="text-[10px] font-bold text-mine-cyan uppercase font-mono tracking-wider block mb-2">
                  Explainable AI (EEI) Diagnosis
                </span>
                <ul className="text-xs text-mine-textMuted list-disc list-inside space-y-1 font-mono">
                  {selectedACRSA.reasoning.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Detailed metrics grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
                  <span className="text-[10px] text-mine-textMuted block">CARBON MONOXIDE</span>
                  <span className="text-mine-cyan font-bold">{selectedHelmet.coLevel} ppm</span>
                </div>
                <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
                  <span className="text-[10px] text-mine-textMuted block">METHANE (CH₄)</span>
                  <span className="text-mine-cyan font-bold">{selectedHelmet.methaneLevel}% LEL</span>
                </div>
                <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
                  <span className="text-[10px] text-mine-textMuted block">FATIGUE INDEX</span>
                  <span className="text-mine-cyan font-bold">{selectedWorker.fatigueScore}%</span>
                </div>
                <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
                  <span className="text-[10px] text-mine-textMuted block">COLLAPSE PROB.</span>
                  <span className="text-mine-cyan font-bold">{selectedWorker.collapseProbability}%</span>
                </div>
              </div>

              {/* Custom Action Trigger */}
              {selectedACRSA.riskScore > 35 && (
                <button
                  onClick={() => {
                    setCurrentPage('Replay');
                  }}
                  className="w-full py-2.5 bg-red-950 border border-red-500 text-red-300 hover:bg-red-900 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Investigate Incident Replay
                </button>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 text-center font-mono">
              <RefreshCw className="w-8 h-8 text-mine-textMuted mx-auto mb-3 animate-spin" />
              <p className="text-xs text-mine-textMuted uppercase">
                Select a worker from the registry to inspect bio-telemetry analytics and EEI factor maps.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
