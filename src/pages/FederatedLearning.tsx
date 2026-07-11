import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Cpu, RefreshCw, CheckCircle, Database } from 'lucide-react';

export const FederatedLearning: React.FC = () => {
  const { clients } = useMineStore();
  const [localClients, setLocalClients] = useState(clients);
  const [aggregating, setAggregating] = useState(false);
  const [globalAccuracy, setGlobalAccuracy] = useState(98.15);

  const triggerAggregation = () => {
    setAggregating(true);
    setTimeout(() => {
      // Complete aggregation simulation
      const updated = localClients.map(c => ({
        ...c,
        weightsAggregationStatus: 'Synced' as const,
        accuracy: Number((c.accuracy + 0.05).toFixed(2))
      }));
      setLocalClients(updated);
      setGlobalAccuracy(98.42);
      setAggregating(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          TinyML Federated Learning Console
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Decentralized model training, edge weights aggregation sync, and collaboration index audits
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        
        {/* Clients registry table */}
        <div className="col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[rgba(0,212,255,0.1)] flex justify-between items-center bg-[rgba(255,255,255,0.01)] font-mono text-xs">
            <h3 className="font-bold uppercase tracking-wider text-mine-cyan flex items-center gap-2">
              <Database className="w-4 h-4" />
              Active Mesh TinyML Clients
            </h3>
            <span>10 Nodes Connected</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(0,212,255,0.08)] bg-[rgba(0,0,0,0.2)] text-mine-textMuted">
                <th className="p-4">Helmet Client</th>
                <th className="p-4 text-center">Dataset Size</th>
                <th className="p-4 text-center">Local Loss</th>
                <th className="p-4 text-center">Accuracy</th>
                <th className="p-4 text-right">Aggregation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(0,212,255,0.04)]">
              {localClients.map(c => {
                const statusColor = c.weightsAggregationStatus === 'Synced' ? 'text-mine-green' : 'text-mine-amber';
                return (
                  <tr key={c.helmetId} className="hover:bg-[rgba(0,212,255,0.02)] transition-colors">
                    <td className="p-4 font-bold text-[#E8F4FD]">
                      {c.helmetId}
                      <span className="block text-[8px] text-mine-textMuted uppercase">MAPPED NODE TYPE: {c.connectionType}</span>
                    </td>
                    <td className="p-4 text-center text-mine-cyan font-bold">{c.datasetSize} samples</td>
                    <td className="p-4 text-center text-mine-textMuted">{c.localLoss.toFixed(3)}</td>
                    <td className="p-4 text-center text-mine-cyan font-bold">{c.accuracy.toFixed(1)}%</td>
                    <td className={`p-4 text-right font-bold ${statusColor}`}>{c.weightsAggregationStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Global model aggregation stats card */}
        <div className="col-span-1 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Global Consensus Weights
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-mine-textMuted">Aggregated Accuracy:</span>
                <span className="text-[#00E676] font-bold text-sm">{globalAccuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mine-textMuted">Last Aggregation:</span>
                <span className="text-[#E8F4FD]">Just Now</span>
              </div>

              {/* Action trigger */}
              <button
                onClick={triggerAggregation}
                disabled={aggregating}
                className="w-full py-2.5 bg-[#00D4FF] hover:bg-cyan-400 text-black font-mono font-bold uppercase rounded-lg text-[10px] tracking-wider transition-all flex items-center justify-center gap-2 shadow-glowCyan"
              >
                <RefreshCw className={`w-4 h-4 ${aggregating ? 'animate-spin' : ''}`} />
                {aggregating ? 'Triggering Sync...' : 'Trigger Weight Aggregation'}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3 font-mono text-xs text-mine-textMuted bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <span className="text-mine-cyan font-bold text-[10px] block uppercase mb-1">
              Consensus Logic SPEC
            </span>
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 text-mine-green shrink-0" />
              <div>
                Aggregates model weights (FedAvg algorithm) via decentralized mesh network coordination.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
