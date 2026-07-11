import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Settings, Users, ShieldAlert, Cpu } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { workers } = useMineStore();
  const [coLimit, setCoLimit] = useState(35);
  const [methaneLimit, setMethaneLimit] = useState(1.5);
  const [spo2Limit, setSpo2Limit] = useState(92);
  const [hrLimit, setHrLimit] = useState(140);

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          User & Alarm Threshold Configuration
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Roster role configurations, device mapping channels, and ACRSA alarm limits tuning
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        
        {/* Roster list */}
        <div className="col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)] bg-[rgba(255,255,255,0.01)] font-mono text-xs text-[#E8F4FD]">
            <h3 className="font-bold uppercase tracking-wider text-mine-cyan flex items-center gap-2">
              <Users className="w-4 h-4" />
              Role Roster & Assignments
            </h3>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.2)] text-mine-textMuted">
                <th className="p-4">Worker ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Console Role</th>
                <th className="p-4">Assigned Shaft Location</th>
                <th className="p-4 text-right">Device status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,212,255,0.04)]">
              {workers.map(w => (
                <tr key={w.id} className="hover:bg-[rgba(0,212,255,0.02)] transition-colors">
                  <td className="p-4 font-bold text-mine-cyan">{w.id}</td>
                  <td className="p-4 font-bold text-[#E8F4FD]">{w.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded bg-[#132235] text-[10px] text-mine-textMuted border border-[rgba(0,212,255,0.15)] uppercase">
                      {w.role}
                    </span>
                  </td>
                  <td className="p-4 text-mine-textMuted">{w.zone}</td>
                  <td className="p-4 text-right text-mine-green font-bold">ONLINE</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Threshold sliders tuner card */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Alarm Safety Thresholds
            </h3>

            <div className="space-y-4 font-mono text-xs">
              
              {/* Carbon Monoxide Limit */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-mine-textMuted">Carbon Monoxide (CO):</span>
                  <span className="text-mine-cyan font-bold">{coLimit} ppm</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={coLimit}
                  onChange={(e) => setCoLimit(Number(e.target.value))}
                  className="w-full bg-[#132235] h-1 roundedaccent-mine-cyan"
                />
              </div>

              {/* Methane Limit */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-mine-textMuted">Methane (CH₄):</span>
                  <span className="text-mine-cyan font-bold">{methaneLimit.toFixed(2)}% LEL</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4.0}
                  step={0.1}
                  value={methaneLimit}
                  onChange={(e) => setMethaneLimit(Number(e.target.value))}
                  className="w-full bg-[#132235] h-1 roundedaccent-mine-cyan"
                />
              </div>

              {/* SpO2 Low Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-mine-textMuted">Hypoxemia SpO₂ Limit:</span>
                  <span className="text-mine-cyan font-bold">{spo2Limit}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={96}
                  value={spo2Limit}
                  onChange={(e) => setSpo2Limit(Number(e.target.value))}
                  className="w-full bg-[#132235] h-1 roundedaccent-mine-cyan"
                />
              </div>

              {/* Heart Rate High Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-mine-textMuted">Tachycardia HR Limit:</span>
                  <span className="text-mine-cyan font-bold">{hrLimit} bpm</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={170}
                  value={hrLimit}
                  onChange={(e) => setHrLimit(Number(e.target.value))}
                  className="w-full bg-[#132235] h-1 roundedaccent-mine-cyan"
                />
              </div>

            </div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3 font-mono text-xs text-mine-textMuted bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <span className="text-mine-cyan font-bold text-[10px] block uppercase mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-mine-red" />
              Dynamic Tuning Alert
            </span>
            <p>
              Tuning these coefficients will alter the default alert profiles of CMARI helmet nodes via the edge mesh network broadcast protocol. Ensure compliance with safety standards before pushing updates.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
