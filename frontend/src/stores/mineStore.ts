import { create } from 'zustand';
import { Worker, Helmet, RescueRobot, DEDPStatus, HazardMapCell, FederatedClient, PredictiveMaintenanceAlert, ACRSAPrediction, ReplayFrame } from '../types';
import { getInitialData, simulateNextStep } from '../engine/dataSimulator';
import { calculateACRSA } from '../engine/acrsa';
import { HazardPlume } from '../engine/sihm';

interface MineStore {
  // Live State
  workers: Worker[];
  helmets: Helmet[];
  robots: RescueRobot[];
  protocol: DEDPStatus;
  cells: HazardMapCell[];
  plumes: HazardPlume[];
  clients: FederatedClient[];
  alerts: PredictiveMaintenanceAlert[];
  
  // Custom Controls
  timeSec: number;
  accidentTriggered: boolean;
  isSimulating: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Incident Replay System
  replayFrames: ReplayFrame[];
  isReplaying: boolean;
  replayIndex: number;

  // AI Assistant History
  chatHistory: { sender: 'user' | 'assistant'; text: string; timestamp: string }[];

  // Actions
  initialize: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  tick: () => void;
  triggerAccident: () => void;
  resetSystem: () => void;
  
  // Replay Actions
  startReplay: () => void;
  stopReplay: () => void;
  setReplayIndex: (index: number) => void;

  // AI assistant interface
  askAssistant: (query: string) => void;
}

export const useMineStore = create<MineStore>((set, get) => ({
  workers: [],
  helmets: [],
  robots: [],
  protocol: {
    activeState: 'NORMAL',
    consensusConfidence: 100,
    edgeLeaderId: '',
    meshOfflineConsensus: false,
    activeProtocolTriggers: [],
    recommendedResources: []
  },
  cells: [],
  plumes: [],
  clients: [],
  alerts: [],
  
  timeSec: 0,
  accidentTriggered: false,
  isSimulating: false,
  currentPage: 'Twin',
  setCurrentPage: (page) => set({ currentPage: page }),
  
  replayFrames: [],
  isReplaying: false,
  replayIndex: 0,

  chatHistory: [
    { sender: 'assistant', text: 'System Online. Ready to assist. You can query helmet parameters, worker vitals, or predictive evacuation models.', timestamp: new Date().toLocaleTimeString() }
  ],

  initialize: () => {
    const data = getInitialData();
    set({
      ...data,
      timeSec: 0,
      accidentTriggered: false,
      isSimulating: false,
      currentPage: 'Twin',
      replayFrames: [],
      isReplaying: false,
      replayIndex: 0
    });
  },

  startSimulation: () => {
    if (get().isSimulating) return;
    set({ isSimulating: true, isReplaying: false });
  },

  stopSimulation: () => {
    set({ isSimulating: false });
  },

  tick: () => {
    const state = get();
    if (state.isReplaying) return;

    const nextTime = state.timeSec + 1;
    const nextData = simulateNextStep(
      state.workers,
      state.helmets,
      state.robots,
      state.plumes,
      state.protocol,
      nextTime,
      state.accidentTriggered
    );

    // Build replay frame snapshots
    const wPosSnapshot: Record<string, { x: number; y: number; status: any }> = {};
    nextData.workers.forEach(w => {
      wPosSnapshot[w.id] = { x: w.x, y: w.y, status: w.status };
    });

    const gasSnapshot: Record<string, { co: number; methane: number }> = {};
    nextData.helmets.forEach(h => {
      gasSnapshot[h.id] = { co: h.coLevel, methane: h.methaneLevel };
    });

    const activeAlarms = [...nextData.protocol.activeProtocolTriggers];
    nextData.alerts.forEach(a => activeAlarms.push(a.parameter));

    const newFrame: ReplayFrame = {
      timestamp: new Date().toLocaleTimeString(),
      workerPositions: wPosSnapshot,
      gasConcentrations: gasSnapshot,
      activeAlarms
    };

    // Buffer limit of 100 historical frames
    const newReplayFrames = [...state.replayFrames, newFrame].slice(-100);

    set({
      ...nextData,
      timeSec: nextTime,
      replayFrames: newReplayFrames
    });
  },

  triggerAccident: () => {
    set({ accidentTriggered: true });
    
    // Push chat update alerting supervisor of threat
    const timestamp = new Date().toLocaleTimeString();
    set(state => ({
      chatHistory: [
        ...state.chatHistory,
        { sender: 'assistant', text: '🔴 ALERT: Seismic anomaly detected. Simulating gas leak in Tunnel 1 and fire spread in Tunnel 3. CMARI agents are negotiating local consensus.', timestamp }
      ]
    }));
  },

  resetSystem: () => {
    const data = getInitialData();
    const timestamp = new Date().toLocaleTimeString();
    set({
      ...data,
      timeSec: 0,
      accidentTriggered: false,
      replayFrames: [],
      isReplaying: false,
      replayIndex: 0,
      chatHistory: [
        { sender: 'assistant', text: 'System reset completed. Core AI networks calibrated.', timestamp }
      ]
    });
  },

  startReplay: () => {
    set({ isReplaying: true, isSimulating: false, replayIndex: 0 });
  },

  stopReplay: () => {
    set({ isReplaying: false });
  },

  setReplayIndex: (index: number) => {
    set({ replayIndex: index });
  },

  askAssistant: (query: string) => {
    const cleanQuery = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString();
    
    let reply = "";
    
    // Parse keywords dynamically on live store variables
    if (cleanQuery.includes('risk') || cleanQuery.includes('danger') || cleanQuery.includes('highest')) {
      const workersList = get().workers;
      const helmetsList = get().helmets;
      
      const acrsaPredictions = workersList.map(w => {
        const h = helmetsList.find(helm => helm.workerId === w.id);
        const neighbors = helmetsList.filter(helm => h?.neighboringHelmets.includes(helm.id));
        return h ? calculateACRSA(w, h, neighbors) : null;
      }).filter(p => p !== null) as ACRSAPrediction[];

      const highestRisk = acrsaPredictions.sort((a, b) => b.riskScore - a.riskScore)[0];
      const targetWorker = workersList.find(w => w.id === highestRisk?.workerId);

      if (highestRisk && highestRisk.riskScore > 30) {
        reply = `Highest risk worker: ${targetWorker?.name} (Risk: ${highestRisk.riskScore}%). Category: ${highestRisk.riskCategory}. Key Factors: ${highestRisk.reasoning.join(', ')}.`;
      } else {
        reply = `All workers are currently in low risk states. Highest Risk detected is ${highestRisk?.riskScore}% (${targetWorker?.name}).`;
      }
    } 
    else if (cleanQuery.includes('gas') || cleanQuery.includes('trend')) {
      const avgCO = get().helmets.reduce((acc, curr) => acc + curr.coLevel, 0) / get().helmets.length;
      const avgCH4 = get().helmets.reduce((acc, curr) => acc + curr.methaneLevel, 0) / get().helmets.length;
      reply = `Mean environmental gas concentration across tunnels: Carbon Monoxide (CO) average = ${avgCO.toFixed(2)} ppm, Methane (CH4) average = ${avgCH4.toFixed(2)}% LEL. Local sensors reporting normally.`;
    }
    else if (cleanQuery.includes('evacuate') || cleanQuery.includes('exit') || cleanQuery.includes('safe')) {
      const safeCellsCount = get().cells.filter(c => c.isDynamicSafeZone).length;
      reply = `Dynamic Safe Zone calculation yields ${safeCellsCount} micro-safe spots active. Recommended evacuation exits: North Emergency Shelter, Shaft 2 Ventilation Portal. DEDP is actively mapping crowd vectors.`;
    } 
    else if (cleanQuery.includes('robot') || cleanQuery.includes('sentinel')) {
      const robotsCount = get().robots.length;
      const activeRobots = get().robots.filter(r => r.status !== 'Idle');
      reply = `${robotsCount} Autonomous Rescue Robots connected. ${activeRobots.length} robots are active. Sentinel Heavy Rescue R-102 stands by.`;
    }
    else {
      reply = "I parsed your safety query, but couldn't find matching keywords. You can ask: 'Who is at highest risk?', 'Show gas trend', or 'Which worker requires immediate evacuation?'";
    }

    set(state => ({
      chatHistory: [
        ...state.chatHistory,
        { sender: 'user', text: query, timestamp },
        { sender: 'assistant', text: reply, timestamp }
      ]
    }));
  }
}));
