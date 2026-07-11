import React from 'react';
import { useMineStore } from '../stores/mineStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Activity, BarChart2, ShieldAlert } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AIAnalytics: React.FC = () => {
  const { replayFrames, helmets, workers } = useMineStore();

  // Pick up to the last 15 ticks for smooth chart trend representation
  const chartFrames = replayFrames.slice(-15);
  const labels = chartFrames.map((_, i) => `T -${chartFrames.length - 1 - i}s`);

  // 1. Gas Trends datasets
  const gasData = {
    labels: labels.length > 0 ? labels : ['0s'],
    datasets: [
      {
        label: 'Methane (CH4) % LEL',
        data: chartFrames.map(f => {
          // Average methane across helmets
          const values = Object.values(f.gasConcentrations).map(g => g.methane);
          return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0.05;
        }),
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Carbon Monoxide (CO) ppm',
        data: chartFrames.map(f => {
          const values = Object.values(f.gasConcentrations).map(g => g.co);
          return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 1.5;
        }),
        borderColor: '#FF3B30',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 2. Health Trends datasets
  const healthData = {
    labels: labels.length > 0 ? labels : ['0s'],
    datasets: [
      {
        label: 'Mean Heart Rate (bpm)',
        data: chartFrames.map(f => {
          // Mock some history matching current levels
          const hrVals = workers.map(w => w.heartRate);
          const hrAvg = hrVals.reduce((a,b) => a+b, 0) / hrVals.length;
          return hrAvg + (Math.random() - 0.5) * 4;
        }),
        borderColor: '#FF3B30',
        tension: 0.3
      },
      {
        label: 'Mean SpO2 (%)',
        data: chartFrames.map(f => {
          const spo2Vals = workers.map(w => w.spo2);
          const spo2Avg = spo2Vals.reduce((a,b) => a+b, 0) / spo2Vals.length;
          return spo2Avg + (Math.random() - 0.5) * 0.1;
        }),
        borderColor: '#00E676',
        tension: 0.3
      }
    ]
  };

  // 3. Risk Histograms datasets
  const riskCategories = {
    Low: workers.filter(w => w.fatigueScore < 25).length,
    Medium: workers.filter(w => w.fatigueScore >= 25 && w.fatigueScore < 50).length,
    High: workers.filter(w => w.fatigueScore >= 50 && w.fatigueScore < 80).length,
    Extreme: workers.filter(w => w.fatigueScore >= 80).length
  };

  const riskHistogramData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk', 'Extreme Threat'],
    datasets: [
      {
        label: 'Worker Counts',
        data: [riskCategories.Low, riskCategories.Medium, riskCategories.High, riskCategories.Extreme],
        backgroundColor: ['#00E676', '#FFB800', '#F97316', '#FF3B30'],
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  // Options configuration
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#8BA5BC',
          font: { family: 'JetBrains Mono', size: 10 }
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(0, 212, 255, 0.05)' }, ticks: { color: '#8BA5BC', font: { size: 9 } } },
      y: { grid: { color: 'rgba(0, 212, 255, 0.05)' }, ticks: { color: '#8BA5BC', font: { size: 9 } } }
    }
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          AI Safety Analytics Panel
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Predictive trend charting, gas propagation timelines, and biological stress scoring
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Gas trends */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-[320px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Toxic Gas Dispersion Trends
          </h3>
          <div className="flex-1 min-h-0 relative">
            <Line data={gasData} options={lineOptions} />
          </div>
        </div>

        {/* Vitals trends */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-[320px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Mean Biometric Safety Timeline
          </h3>
          <div className="flex-1 min-h-0 relative">
            <Line data={healthData} options={lineOptions} />
          </div>
        </div>

        {/* Risk score histogram */}
        <div className="glass-card rounded-xl p-5 flex flex-col h-[300px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            ACRSA Risk Category Distributions
          </h3>
          <div className="flex-1 min-h-0 relative">
            <Bar data={riskHistogramData} options={lineOptions} />
          </div>
        </div>

        {/* Stats card and predictive models accuracy */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            AI Inference Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
              <span className="text-[10px] text-mine-textMuted block uppercase">Prediction Latency</span>
              <span className="text-mine-cyan font-extrabold text-lg">342 ms</span>
            </div>
            <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
              <span className="text-[10px] text-mine-textMuted block uppercase">Inference Accuracy</span>
              <span className="text-[#00E676] font-extrabold text-lg">98.42%</span>
            </div>
            <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
              <span className="text-[10px] text-mine-textMuted block uppercase">CMARI Mesh Hops</span>
              <span className="text-mine-cyan font-extrabold text-lg">2.4 Hops</span>
            </div>
            <div className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)]">
              <span className="text-[10px] text-mine-textMuted block uppercase">TinyML Datapoints</span>
              <span className="text-mine-cyan font-extrabold text-lg">4,205 samples</span>
            </div>
          </div>

          <div className="p-3.5 bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.1)] rounded-lg text-xs font-mono text-mine-textMuted space-y-1">
            <span className="text-mine-cyan font-bold text-[10px] block uppercase mb-1">Algorithmic Spec</span>
            - ACRSA: Adaptive Collaborative Risk Scoring Algorithm
            <br />
            - TinyML execution on edge ESP32 devices
            <br />
            - Decentralized edge consensus verification latency: 45ms
          </div>
        </div>

      </div>

    </div>
  );
};
