import React, { useEffect } from 'react';
import { useMineStore } from '../../stores/mineStore';
import { Play, Pause, AlertTriangle, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    isSimulating,
    startSimulation,
    stopSimulation,
    tick,
    accidentTriggered,
    triggerAccident,
    resetSystem,
    protocol,
    helmets,
    workers
  } = useMineStore();

  // Run simulation tick if simulation is active
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, tick]);

  // Compute stats
  const activeHelmets = helmets.filter(h => h.batteryPercent > 0).length;
  const avgMeshCollaboration = Math.round(
    helmets.reduce((acc, curr) => acc + curr.collaborationScore, 0) / helmets.length
  );
  
  // DEDP Theme styling
  const stateColorMap: Record<string, string> = {
    NORMAL: 'text-[#00E676] bg-[rgba(0,230,118,0.1)] border-[#00E676]',
    MONITORING: 'text-[#FFB800] bg-[rgba(255,184,0,0.1)] border-[#FFB800]',
    ALERT: 'text-orange-500 bg-orange-950 border-orange-500',
    EVACUATION: 'text-red-500 bg-red-950 border-red-500 animate-pulse',
    RESCUE: 'text-red-600 bg-red-950 border-red-600 animate-ping',
    RECOVERY: 'text-blue-400 bg-blue-950 border-blue-400'
  };

  return (
    <header className="h-20 glass-panel border-b border-[rgba(0,212,255,0.15)] px-8 flex items-center justify-between shrink-0">
      
      {/* Dynamic Alarm / Title Panel */}
      <div className="flex items-center gap-4">
        {accidentTriggered ? (
          <div className="flex items-center gap-3 bg-[rgba(255,59,48,0.1)] border border-red-600 px-4 py-2 rounded-lg text-mine-red font-bold text-sm animate-pulse glow-red">
            <AlertTriangle className="w-5 h-5" />
            <span>DEDP ACTIVE: GAS EXPOSURE & WORKER COLLAPSE RESOLVING</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] px-4 py-2 rounded-lg text-mine-cyan text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Underground Mesh Network Synced</span>
          </div>
        )}

        {/* DEDP Protocol State indicator */}
        <div className={`px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider ${stateColorMap[protocol.activeState] || 'border-gray-500'}`}>
          DEDP STATE: {protocol.activeState}
        </div>
      </div>

      {/* Simulator Control Panel */}
      <div className="flex items-center gap-6">
        
        {/* Core telemetry counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[rgba(255,255,255,0.02)] px-3 py-1.5 rounded border border-[rgba(255,255,255,0.05)]">
            <span className="text-[#8BA5BC]">Mesh Collaboration: </span>
            <span className="text-[#00D4FF] font-bold">{avgMeshCollaboration}%</span>
          </div>
          <div className="bg-[rgba(255,255,255,0.02)] px-3 py-1.5 rounded border border-[rgba(255,255,255,0.05)]">
            <span className="text-[#8BA5BC]">Active Helmets: </span>
            <span className="text-[#00E676] font-bold">{activeHelmets}/{helmets.length}</span>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-[rgba(0,212,255,0.15)]" />

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {isSimulating ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-2 bg-[#1B263B] text-[#E8F4FD] hover:bg-[#25324D] px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-[rgba(0,212,255,0.1)]"
            >
              <Pause className="w-4 h-4 text-orange-400" />
              Pause Map
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 bg-[#00D4FF] text-black hover:bg-cyan-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-glowCyan"
            >
              <Play className="w-4 h-4 fill-black" />
              Engage Simulation
            </button>
          )}

          <button
            onClick={triggerAccident}
            disabled={accidentTriggered}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              accidentTriggered 
                ? 'bg-transparent text-[#8BA5BC] border-transparent cursor-not-allowed' 
                : 'bg-red-700 hover:bg-red-600 text-white border-red-500 shadow-glowRed'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Trigger Accident
          </button>

          <button
            onClick={resetSystem}
            className="p-2 bg-[#1B263B] hover:bg-[#25324D] text-[#8BA5BC] hover:text-[#E8F4FD] rounded-lg border border-[rgba(0,212,255,0.1)] transition-all"
            title="Reset telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
