import React, { useState, useEffect } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Bot, Play, ShieldAlert, Cpu, Eye } from 'lucide-react';

export const RescueRobotControl: React.FC = () => {
  const { robots, workers } = useMineStore();
  const [selectedRobotId, setSelectedRobotId] = useState<string>('R-102');
  const [noiseOffset, setNoiseOffset] = useState(0);

  // Simulate video noise flickering for tech aesthetics
  useEffect(() => {
    const int = setInterval(() => {
      setNoiseOffset(prev => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(int);
  }, []);

  const selectedRobot = robots.find(r => r.id === selectedRobotId);
  const targetWorker = selectedRobot?.targetWorkerId 
    ? workers.find(w => w.id === selectedRobot.targetWorkerId) 
    : workers.find(w => w.status === 'Critical'); // Fallback default

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          Rescue Robot Operations Center
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Autonomous navigation routing, telemetry monitoring, and remote optical payloads
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        
        {/* Fleet Grid */}
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {robots.map(r => {
              const isSelected = selectedRobotId === r.id;
              const statusColor = r.status === 'Autonomous Rescue' ? 'text-orange-400' : 'text-[#00E676]';
              const borderTheme = isSelected ? 'border-[#00D4FF] shadow-glowCyan' : 'border-[rgba(0,212,255,0.15)]';

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRobotId(r.id)}
                  className={`glass-card rounded-xl p-4 space-y-4 cursor-pointer hover:border-[rgba(0,212,255,0.3)] transition-all border ${borderTheme}`}
                >
                  <div className="flex justify-between items-center border-b border-[rgba(0,212,255,0.08)] pb-2">
                    <div>
                      <h4 className="font-bold text-[#E8F4FD] font-mono text-xs">{r.name}</h4>
                      <span className="text-[9px] text-mine-textMuted font-mono uppercase">{r.id}</span>
                    </div>
                    <Bot className="w-5 h-5 text-mine-cyan" />
                  </div>

                  <div className="space-y-2 text-[10px] font-mono text-mine-textMuted">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-bold uppercase ${statusColor}`}>{r.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className="text-[#E8F4FD] font-bold">{Math.round(r.batteryPercent)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Robot Health:</span>
                      <span className="text-mine-cyan font-bold">{r.robotHealth}%</span>
                    </div>
                    {r.oxygenSupplyPercent > 0 && (
                      <div className="flex justify-between">
                        <span>O₂ Payload:</span>
                        <span className="text-mine-green font-bold">{r.oxygenSupplyPercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Camera Feed Simulation */}
          <div className="glass-card rounded-xl p-5 flex flex-col relative overflow-hidden bg-black aspect-video border border-[rgba(0,212,255,0.15)]">
            
            {/* Visual scanlines overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/10 to-transparent bg-[length:100%_4px] pointer-events-none" />
            
            {/* Video overlay diagnostics */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-green-400 space-y-1 z-10 bg-black/60 p-2 border border-green-500/20 rounded">
              <div>DEVICE: REMOTE_OPTICAL_{selectedRobotId}</div>
              <div>RESOLUTION: 720P IR SCAN</div>
              <div>BATTERY: {selectedRobot?.batteryPercent.toFixed(0)}%</div>
              <div>CO LEVEL: {selectedRobot?.coLevel.toFixed(1)} ppm</div>
            </div>

            {/* Target overlay indicator */}
            {selectedRobot?.status === 'Autonomous Rescue' && targetWorker && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center font-mono text-[11px] text-mine-red border border-red-500 bg-black/80 px-4 py-2 rounded-lg animate-pulse glow-red">
                <span>LOCK TARGET: {targetWorker.name.toUpperCase()} ({targetWorker.id})</span>
                <span className="block text-[9px] mt-0.5 text-mine-textMuted">
                  ETA: {selectedRobot.estimatedArrivalTime}s | Dist: {(selectedRobot.estimatedArrivalTime * 2)}m
                </span>
              </div>
            )}

            {/* Simulated green visual scene */}
            <div className="flex-1 w-full h-full border border-green-900/30 bg-green-950/10 rounded flex items-center justify-center relative overflow-hidden">
              
              {/* Overlay animated noise grain */}
              <div className="absolute inset-0 opacity-10 bg-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22><rect width=%222%22 height=%222%22 fill=%22%23fff%22/></svg>')] pointer-events-none" />

              <div className="text-center font-mono text-xs text-green-500 flex flex-col items-center">
                <Eye className="w-8 h-8 animate-pulse mb-2 text-green-400" />
                <span className="tracking-widest uppercase">FEED ACTIVE (INFRARED NIGHT-VISION)</span>
                <span className="text-[9px] text-green-600 mt-1">Noise offset calibration: {noiseOffset}</span>
              </div>

            </div>

          </div>

        </div>

        {/* Robot operations controls panel */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <Play className="w-4 h-4 fill-mine-cyan" />
              Mission Directives
            </h3>

            <div className="space-y-2">
              <button
                disabled={selectedRobot?.status === 'Autonomous Rescue'}
                className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  selectedRobot?.status === 'Autonomous Rescue'
                    ? 'bg-transparent text-mine-textMuted border-transparent cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-500 shadow-glowAmber hover:from-orange-500 hover:to-amber-500'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Engage Autonomous Route
              </button>

              <button className="w-full py-2.5 bg-[#1B263B] text-mine-cyan hover:bg-[#25324D] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-[rgba(0,212,255,0.15)] flex items-center justify-center gap-2">
                Deploy Oxygen Cylinder Payload
              </button>
              
              <button className="w-full py-2.5 bg-[#1B263B] text-[#E8F4FD] hover:bg-[#25324D] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-[rgba(0,212,255,0.05)] flex items-center justify-center gap-2">
                Execute Return to Dock (RTL)
              </button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 font-mono text-xs text-mine-textMuted space-y-3 bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <h4 className="text-[10px] font-bold text-mine-cyan uppercase">Navigation AI Specs</h4>
            <div className="flex gap-2.5 items-start">
              <Cpu className="w-6 h-6 text-mine-cyan shrink-0" />
              <div>
                RRT* (Rapidly-exploring Random Tree) path optimization routes autonomously through shafts by querying current SIHM toxic grid indices to avoid gas zones.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
