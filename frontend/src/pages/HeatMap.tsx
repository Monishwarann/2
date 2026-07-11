import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Map, ArrowRight, ShieldCheck, Thermometer, Wind } from 'lucide-react';

export const HeatMap: React.FC = () => {
  const { cells, workers } = useMineStore();
  const [filterType, setFilterType] = useState<'Gas' | 'Temp' | 'Density'>('Gas');

  // Helper to color cell based on selected filter
  const getCellColor = (cell: any) => {
    if (filterType === 'Gas') {
      const val = cell.gasConcentration;
      if (val === 0) return 'rgba(0, 212, 255, 0.05)';
      return `rgba(0, 212, 255, ${Math.min(0.1 + val / 100, 0.85)})`;
    } else if (filterType === 'Temp') {
      const val = cell.temperature;
      // Normal is 24C, max is 80C
      const ratio = Math.max(0, Math.min((val - 24) / 56, 1));
      if (ratio === 0) return 'rgba(255, 184, 0, 0.05)';
      return `rgba(255, 59, 48, ${0.1 + ratio * 0.75})`;
    } else {
      const density = cell.workerDensity;
      if (density === 0) return 'rgba(0, 230, 118, 0.02)';
      return `rgba(0, 230, 118, ${Math.min(0.2 + density * 0.25, 0.85)})`;
    }
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
            SIHM Swarm Intelligence Hazard Map
          </h2>
          <p className="text-xs text-mine-textMuted uppercase mt-1">
            Volumetric hazard diffusion grids, swarm gradient vectors, and dynamic escape corridor analysis
          </p>
        </div>

        {/* Filter switches */}
        <div className="flex items-center gap-2 bg-[#0D1B2A] border border-[rgba(0,212,255,0.15)] p-1 rounded-lg">
          <button
            onClick={() => setFilterType('Gas')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
              filterType === 'Gas' ? 'bg-[#00D4FF] text-black' : 'text-mine-textMuted hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            GAS PLUME
          </button>
          <button
            onClick={() => setFilterType('Temp')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
              filterType === 'Temp' ? 'bg-orange-500 text-white shadow-glowAmber' : 'text-mine-textMuted hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            THERMAL
          </button>
          <button
            onClick={() => setFilterType('Density')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
              filterType === 'Density' ? 'bg-[#00E676] text-black shadow-glowGreen' : 'text-mine-textMuted hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            DENSITY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 items-start">
        
        {/* 2D Tunnel Grid Canvas */}
        <div className="col-span-3 glass-card rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
          
          {/* Tech Grid overlay backdrop */}
          <div className="absolute inset-0 grid-bg opacity-40" />

          {/* Grid Layout Container representing tunnels */}
          <div className="relative w-full max-w-[620px] aspect-square border border-[rgba(0,212,255,0.1)] bg-[rgba(5,11,24,0.6)] rounded-lg p-6">
            
            {/* Legend indicators */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-mine-textMuted space-y-1 z-10 bg-[rgba(5,11,24,0.9)] p-2 border border-[rgba(0,212,255,0.1)] rounded">
              <div>Tunnel Height Profile: -50m Level</div>
              <div>SIHM Gradient scale: 0.1m/s per cell</div>
            </div>

            {/* Grid of Cells */}
            <div className="grid grid-cols-10 grid-rows-10 gap-1.5 h-full w-full">
              {Array.from({ length: 100 }).map((_, index) => {
                const cellX = (index % 10) * 10 + 5;
                const cellY = Math.floor(index / 10) * 10 + 5;
                
                // Find matching cell from store coordinates
                const matchedCell = cells.find(c => c.x === cellX && c.y === cellY);

                if (!matchedCell) {
                  // Solid rock block (not a tunnel)
                  return (
                    <div key={index} className="bg-transparent border border-[rgba(255,255,255,0.01)]" />
                  );
                }

                // Decide borders or shapes
                let cellBorder = 'border border-[rgba(0,212,255,0.15)]';
                let content: React.ReactNode = null;

                if (matchedCell.isSafeZone) {
                  cellBorder = 'border-2 border-mine-green bg-mine-green/20';
                  content = <div className="text-[9px] font-bold text-mine-green animate-pulse">SAFE</div>;
                } else if (matchedCell.isDynamicSafeZone) {
                  cellBorder = 'border-2 border-dashed border-[#00D4FF] bg-cyan-950/20';
                  content = <div className="text-[9px] font-bold text-mine-cyan animate-pulse">DYNC</div>;
                } else {
                  // Draw arrow markers representing hazard propagation vectors (SIHM gradient vectors)
                  if (matchedCell.gasConcentration > 15) {
                    content = (
                      <ArrowRight 
                        className="w-3.5 h-3.5 text-mine-cyan anim-mesh-link" 
                        style={{ transform: 'rotate(25deg)' }} 
                      />
                    );
                  }
                }

                return (
                  <div
                    key={index}
                    className={`rounded transition-all duration-300 flex items-center justify-center relative overflow-hidden ${cellBorder}`}
                    style={{ backgroundColor: getCellColor(matchedCell) }}
                  >
                    {content}
                    
                    {/* Hover tooltip detailing stats */}
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/90 flex flex-col justify-center items-center text-[7px] font-mono text-[#E8F4FD] cursor-help p-0.5">
                      <span>X:{matchedCell.x} Y:{matchedCell.y}</span>
                      <span>Gas:{matchedCell.gasConcentration}%</span>
                      <span>T:{matchedCell.temperature}°C</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* SIHM algorithm parameters pane */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              SIHM Consensus Parameters
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-mine-textMuted block text-[10px] uppercase">Decentralized Gradient Solver</span>
                <span className="text-[#E8F4FD]">Gaussian Diffusion Matrix (10x10 Grid)</span>
              </div>
              <div>
                <span className="text-mine-textMuted block text-[10px] uppercase">Swarm Voting Threshold</span>
                <span className="text-[#E8F4FD]">Delta Concentration &gt; 1.5 ppm/m</span>
              </div>
              <div>
                <span className="text-mine-textMuted block text-[10px] uppercase">Mesh Gradient Sync Rate</span>
                <span className="text-[#00D4FF]">500 ms (mesh nodes direct exchange)</span>
              </div>
              <div>
                <span className="text-mine-textMuted block text-[10px] uppercase">Diffusion Propagation Angle</span>
                <span className="text-[#00D4FF]">24.8° East (Seismic Crack vector alignment)</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3 text-xs font-mono text-mine-textMuted bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <span className="text-mine-cyan font-bold text-[10px] block uppercase mb-1">IEEE Research Novelty</span>
            Unlike typical static threshold alert grids, MineGuardian X SIHM maps the actual volumetric toxic gas plume propagation by letting helmets locally vote on flow direction vector gradients.
          </div>

        </div>

      </div>

    </div>
  );
};
