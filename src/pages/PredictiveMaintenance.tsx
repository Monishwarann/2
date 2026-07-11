import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Settings, Battery, Signal, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PredictiveMaintenance: React.FC = () => {
  const { helmets, alerts } = useMineStore();
  const [calibrating, setCalibrating] = useState<string | null>(null);

  const runCalibration = (id: string) => {
    setCalibrating(id);
    setTimeout(() => {
      setCalibrating(null);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          Predictive Maintenance Dashboard
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Helmet battery lifecycle analytics, sensor drift indicators, and communication breakdown forecasting
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        
        {/* Helmet Devices List */}
        <div className="col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)] flex justify-between items-center bg-[rgba(255,255,255,0.01)] font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-mine-cyan">
              Helmet Hardware Diagnostics
            </h3>
            <span>{helmets.length} Devices Online</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.2)] text-mine-textMuted">
                <th className="p-4">Device ID</th>
                <th className="p-4 text-center">Remaining runtime</th>
                <th className="p-4 text-center">Battery Health</th>
                <th className="p-4 text-center">Signal RSSI</th>
                <th className="p-4 text-right">Self Calibrate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,212,255,0.04)]">
              {helmets.map(h => {
                let batColor = 'text-mine-green';
                if (h.batteryPercent < 25) batColor = 'text-mine-red font-bold';
                else if (h.batteryPercent < 50) batColor = 'text-mine-amber';

                return (
                  <tr key={h.id} className="hover:bg-[rgba(0,212,255,0.02)] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#E8F4FD]">{h.id}</div>
                      <div className="text-[9px] text-mine-textMuted uppercase">Worker link: {h.workerId}</div>
                    </td>
                    <td className={`p-4 text-center font-bold ${batColor}`}>
                      {h.batteryHoursRemaining.toFixed(1)} Hrs
                    </td>
                    <td className="p-4 text-center text-mine-cyan font-bold">
                      {h.batteryReplacementDays} Days
                    </td>
                    <td className="p-4 text-center text-mine-textMuted">
                      <span className="flex items-center justify-center gap-1">
                        <Signal className="w-3.5 h-3.5 text-mine-cyan" />
                        {h.signalStrength} dBm
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => runCalibration(h.id)}
                        disabled={calibrating === h.id}
                        className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider transition-all border ${
                          calibrating === h.id 
                            ? 'bg-[#132235] text-mine-cyan border-transparent' 
                            : 'bg-[#1B263B] text-[#E8F4FD] hover:bg-[#25324D] border-[rgba(0,212,255,0.1)]'
                        }`}
                      >
                        {calibrating === h.id ? 'Calibrating...' : 'Calibrate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Predictive alerts logger panel */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              AI Failure Forecasting
            </h3>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {alerts.length > 0 ? (
                alerts.map(a => {
                  let alertTheme = 'bg-red-950/40 border-red-500/50 text-red-300';
                  if (a.criticality === 'Warning') {
                    alertTheme = 'bg-orange-950/40 border-orange-500/30 text-orange-300';
                  }

                  return (
                    <div key={a.id} className={`p-3 border rounded-lg ${alertTheme}`}>
                      <span className="text-[10px] font-bold uppercase block mb-1">
                        ⚠️ PREDICTED FAILURE: {a.parameter}
                      </span>
                      <div className="space-y-1 text-[11px] leading-relaxed">
                        <div><b>Device:</b> {a.deviceId} ({a.deviceType})</div>
                        <div><b>Est. Failure Time:</b> {a.predictedFailureTime}</div>
                        <div className="text-[10px] text-mine-textMuted border-t border-[rgba(255,255,255,0.05)] pt-1 mt-1.5">
                          <b>Remediation:</b> {a.recommendation}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-[rgba(5,11,24,0.4)] border border-green-500/20 rounded-lg text-center text-mine-green flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 mb-2" />
                  <span>No predicted component failures detected. Standing by.</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 font-mono text-xs text-mine-textMuted space-y-3 bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <h4 className="text-[10px] font-bold text-mine-cyan uppercase">Sensor Calibrations</h4>
            <p>
              Integrated TinyML algorithms track drift anomalies on MQ-4 and MQ-7 sensors by comparing relative baseline readings across the collaborative mesh network.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
