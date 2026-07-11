import { Worker, Helmet, RescueRobot, DEDPStatus, HazardMapCell, FederatedClient, PredictiveMaintenanceAlert } from '../types';
import { calculateACRSA, predictWorkerFatigue, predictCommFailure } from './acrsa';
import { updateCMARINetwork } from './cmari';
import { runDEDPEngine } from './dedp';
import { updateSIHM, HazardPlume } from './sihm';

const WORKER_NAMES = [
  'Arjun Sharma', 'Vikram Patel', 'Rajesh Kumar', 'Amit Singh', 'Sneha Reddy',
  'Priya Sharma', 'Rohan Das', 'Karan Johar', 'Neha Gupta', 'Sanjay Dutt'
];

export function getInitialData(): {
  workers: Worker[];
  helmets: Helmet[];
  robots: RescueRobot[];
  protocol: DEDPStatus;
  cells: HazardMapCell[];
  plumes: HazardPlume[];
  clients: FederatedClient[];
  alerts: PredictiveMaintenanceAlert[];
} {
  const workers: Worker[] = WORKER_NAMES.map((name, i) => {
    // Distribute workers across tunnels
    const zones = ['Tunnel 1', 'Tunnel 2', 'Tunnel 3', 'East Shaft', 'West Shaft'];
    const zone = zones[i % zones.length];
    
    // Starting coordinates based on zone
    let x = 10 + i * 8;
    let y = 20;
    if (zone === 'Tunnel 2') y = 50;
    if (zone === 'Tunnel 3') y = 80;
    if (zone === 'East Shaft') { x = 75; y = 30 + (i * 5); }
    if (zone === 'West Shaft') { x = 25; y = 30 + (i * 5); }

    return {
      id: `W-${100 + i}`,
      name,
      role: i === 0 ? 'Supervisor' : i === 9 ? 'Rescue' : 'Worker',
      zone,
      status: 'Active',
      heartRate: 72 + Math.floor(Math.random() * 15),
      spo2: 98 + Math.floor(Math.random() * 2),
      bodyTemp: 36.6 + (Math.random() * 0.4),
      fatigueScore: 10 + Math.floor(Math.random() * 15),
      stressScore: 15 + Math.floor(Math.random() * 10),
      heatExhaustionProbability: 2 + Math.floor(Math.random() * 5),
      collapseProbability: 0,
      x,
      y,
      z: -50,
      orientation: Math.floor(Math.random() * 360),
      motionState: 'Walking'
    };
  });

  const helmets: Helmet[] = workers.map((w, i) => ({
    id: `H-${200 + i}`,
    workerId: w.id,
    coLevel: 2.0 + (Math.random() * 3.0),
    methaneLevel: 0.05 + (Math.random() * 0.1),
    airQualityIndex: 45 + Math.floor(Math.random() * 15),
    ambientTemp: 23.5 + (Math.random() * 1.5),
    ambientHumidity: 62 + Math.floor(Math.random() * 10),
    batteryPercent: 92 - (i * 3),
    batteryHoursRemaining: 12.5 - (i * 0.4),
    batteryReplacementDays: 120 - i * 5,
    signalStrength: -45 - Math.floor(Math.random() * 20),
    helmetHealth: 96 + Math.floor(Math.random() * 4),
    collaborationScore: 95,
    neighboringHelmets: [],
    meshLatencyMs: 8 + Math.floor(Math.random() * 12)
  }));

  const robots: RescueRobot[] = [
    {
      id: 'R-101',
      name: 'Sentinel Alpha (Heavy Rescue)',
      status: 'Idle',
      batteryPercent: 88,
      oxygenSupplyPercent: 100,
      coLevel: 1.2,
      robotHealth: 98,
      x: 50,
      y: 20,
      z: -50,
      routeCoordinates: [],
      estimatedArrivalTime: 0
    },
    {
      id: 'R-102',
      name: 'Ranger Scout Beta (Gas Mapper)',
      status: 'Idle',
      batteryPercent: 94,
      oxygenSupplyPercent: 0, // Scout, no O2 payload
      coLevel: 1.5,
      robotHealth: 100,
      x: 25,
      y: 50,
      z: -50,
      routeCoordinates: [],
      estimatedArrivalTime: 0
    },
    {
      id: 'R-103',
      name: 'Lifeline Carrier Gamma (Stretcher)',
      status: 'Idle',
      batteryPercent: 85,
      oxygenSupplyPercent: 100,
      coLevel: 0.9,
      robotHealth: 95,
      x: 75,
      y: 80,
      z: -50,
      routeCoordinates: [],
      estimatedArrivalTime: 0
    }
  ];

  const plumes: HazardPlume[] = [
    { sourceX: 15, sourceY: 20, intensity: 0, radius: 15, type: 'Gas' }, // Inactive Gas pocket
    { sourceX: 85, sourceY: 80, intensity: 0, radius: 20, type: 'Fire' }  // Inactive Fire pocket
  ];

  const protocol: DEDPStatus = {
    activeState: 'NORMAL',
    consensusConfidence: 98,
    edgeLeaderId: 'H-200',
    meshOfflineConsensus: false,
    activeProtocolTriggers: [],
    recommendedResources: ['Standard safety monitoring operational']
  };

  const { cells } = updateSIHM(workers, helmets, plumes);

  const clients: FederatedClient[] = helmets.map((h, i) => ({
    helmetId: h.id,
    datasetSize: 120 + i * 20,
    localLoss: 0.08 - (i * 0.005),
    accuracy: 97.4 + (i * 0.1),
    connectionType: i % 3 === 0 ? 'Mesh' : i % 3 === 1 ? 'WiFi' : 'LTE',
    weightsAggregationStatus: 'Synced'
  }));

  const alerts: PredictiveMaintenanceAlert[] = [];

  return {
    workers,
    helmets,
    robots,
    protocol,
    cells,
    plumes,
    clients,
    alerts
  };
}

export function simulateNextStep(
  workers: Worker[],
  helmets: Helmet[],
  robots: RescueRobot[],
  plumes: HazardPlume[],
  currentProtocol: DEDPStatus,
  timeSec: number,
  accidentTriggered: boolean
): {
  workers: Worker[];
  helmets: Helmet[];
  robots: RescueRobot[];
  protocol: DEDPStatus;
  cells: HazardMapCell[];
  plumes: HazardPlume[];
  alerts: PredictiveMaintenanceAlert[];
} {
  // 1. Manage Plume intensity changes over time when accident is active
  const updatedPlumes = plumes.map(p => {
    if (accidentTriggered) {
      // Elevate hazard intensities
      const targetIntensity = p.type === 'Gas' ? 85 : 90;
      const step = 4;
      const intensity = Math.min(p.intensity + step, targetIntensity);
      const radius = Math.min(p.radius + 1, p.type === 'Gas' ? 35 : 28);
      return { ...p, intensity, radius };
    } else {
      // Natural background fluctuations
      return { ...p, intensity: Math.max(0, p.intensity - 2) };
    }
  });

  // 2. Update worker walking coordinates (simulate paths in tunnels)
  const updatedWorkers = workers.map((w, idx) => {
    // If worker falls or is critical, they stop moving
    if (accidentTriggered && idx === 3) {
      // Simulate Worker 3 (Rajesh Kumar) collapse
      const pulseRate = w.heartRate > 155 ? w.heartRate - 1 : Math.min(w.heartRate + 2, 160);
      const spo2Level = Math.max(w.spo2 - 1, 84);
      
      const fatigueData = predictWorkerFatigue({
        ...w,
        heartRate: pulseRate,
        spo2: spo2Level,
        motionState: 'Fall Detected'
      });

      return {
        ...w,
        motionState: 'Fall Detected' as const,
        status: 'Critical' as const,
        heartRate: pulseRate,
        spo2: spo2Level,
        bodyTemp: Math.min(w.bodyTemp + 0.1, 39.2),
        fatigueScore: fatigueData.fatigue,
        stressScore: fatigueData.stress,
        heatExhaustionProbability: fatigueData.heatExhaustion,
        collapseProbability: fatigueData.collapse,
        orientation: w.orientation + 180 % 360
      };
    }

    // Default walking behavior
    let dx = (Math.random() - 0.5) * 4;
    let dy = (Math.random() - 0.5) * 2;

    // Constrain worker coordinates to stay inside the tunnel layout
    let x = w.x + dx;
    let y = w.y + dy;

    if (w.zone === 'Tunnel 1') {
      y = 20 + (Math.random() - 0.5) * 4;
      if (x < 10) x = 10;
      if (x > 90) x = 90;
    } else if (w.zone === 'Tunnel 2') {
      y = 50 + (Math.random() - 0.5) * 4;
      if (x < 10) x = 10;
      if (x > 90) x = 90;
    } else if (w.zone === 'Tunnel 3') {
      y = 80 + (Math.random() - 0.5) * 4;
      if (x < 10) x = 10;
      if (x > 90) x = 90;
    } else if (w.zone === 'East Shaft') {
      x = 75 + (Math.random() - 0.5) * 4;
      if (y < 20) y = 20;
      if (y > 80) y = 80;
    } else if (w.zone === 'West Shaft') {
      x = 25 + (Math.random() - 0.5) * 4;
      if (y < 20) y = 20;
      if (y > 80) y = 80;
    }

    // Dynamic health changes
    let heartRate = w.heartRate + (Math.random() - 0.5) * 4;
    heartRate = Math.max(65, Math.min(130, heartRate));

    let spo2 = w.spo2 + (Math.random() - 0.5) * 0.4;
    spo2 = Math.max(95, Math.min(100, spo2));

    const updatedW = {
      ...w,
      x,
      y,
      heartRate: Math.round(heartRate),
      spo2: Math.round(spo2),
      motionState: 'Walking' as const
    };

    // Calculate fatigue metrics
    const fatigueData = predictWorkerFatigue(updatedW);
    updatedW.fatigueScore = fatigueData.fatigue;
    updatedW.stressScore = fatigueData.stress;
    updatedW.heatExhaustionProbability = fatigueData.heatExhaustion;
    updatedW.collapseProbability = fatigueData.collapse;

    // Check status
    if (currentProtocol.activeState === 'EVACUATION') {
      updatedW.status = 'Evacuating';
    } else {
      updatedW.status = 'Active';
    }

    return updatedW;
  });

  // 3. Update helmet environmental sensor inputs (relative to distance from plumes)
  const updatedHelmets = helmets.map((h, i) => {
    const w = updatedWorkers.find(worker => worker.id === h.workerId);
    if (!w) return h;

    let targetCO = 1.5;
    let targetMethane = 0.05;
    let targetTemp = 24.5;
    let targetHumidity = 65;

    updatedPlumes.forEach(p => {
      const dx = w.x - p.sourceX;
      const dy = w.y - p.sourceY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < p.radius) {
        const factor = 1 - (dist / p.radius);
        if (p.type === 'Gas') {
          targetCO += p.intensity * 2.2 * factor; // Up to 180ppm
          targetMethane += (p.intensity / 20) * factor; // Up to 4.5%
        } else {
          targetTemp += p.intensity * 0.7 * factor; // Up to 80C
          targetHumidity -= p.intensity * 0.4 * factor; // Dry heat
        }
      }
    });

    // Battery drainage (every tick)
    const newBattery = Math.max(0, h.batteryPercent - 0.02);
    const newBatteryHours = Math.max(0, newBattery * 0.15); // e.g. 15 hours full charge
    const newReplacementDays = Math.max(1, h.batteryReplacementDays - (Math.random() < 0.01 ? 1 : 0));

    // Comm link fluctuation
    let baseSignal = -50 - (w.y > 60 ? 15 : 0) - (w.x < 30 ? 10 : 0);
    if (accidentTriggered && i === 3) {
      baseSignal = -92; // simulate failure on critical worker
    }
    const signalStrength = baseSignal - Math.floor(Math.random() * 5);

    return {
      ...h,
      coLevel: Number((h.coLevel + (targetCO - h.coLevel) * 0.1).toFixed(1)),
      methaneLevel: Number((h.methaneLevel + (targetMethane - h.methaneLevel) * 0.1).toFixed(2)),
      ambientTemp: Number((h.ambientTemp + (targetTemp - h.ambientTemp) * 0.1).toFixed(1)),
      ambientHumidity: Math.round(h.ambientHumidity + (targetHumidity - h.ambientHumidity) * 0.1),
      batteryPercent: Number(newBattery.toFixed(2)),
      batteryHoursRemaining: Number(newBatteryHours.toFixed(1)),
      batteryReplacementDays: newReplacementDays,
      signalStrength,
      neighboringHelmets: [] // Recomputed during CMARI network mapping
    };
  });

  // Apply CMARI to calculate mesh linkages and collaboration scores
  const { links, collaborationScores } = updateCMARINetwork(updatedWorkers, updatedHelmets);
  updatedHelmets.forEach(h => {
    h.collaborationScore = collaborationScores[h.id] || 90;
  });

  // 4. Update Rescue Robots navigation
  const updatedRobots = robots.map(r => {
    // If critical event triggered, direct Robot 102 (Sentinel Heavy Rescue) to राजेश कुमार W-103
    if (accidentTriggered && r.id === 'R-102') {
      const targetWorker = updatedWorkers.find(worker => worker.id === 'W-103');
      if (targetWorker) {
        // Move robot step-by-step towards target
        const dx = targetWorker.x - r.x;
        const dy = targetWorker.y - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
          const stepX = (dx / dist) * 5;
          const stepY = (dy / dist) * 3;
          return {
            ...r,
            status: 'Autonomous Rescue' as const,
            x: Number((r.x + stepX).toFixed(1)),
            y: Number((r.y + stepY).toFixed(1)),
            estimatedArrivalTime: Math.round(dist / 2),
            batteryPercent: Math.max(0, r.batteryPercent - 0.1)
          };
        } else {
          return {
            ...r,
            status: 'Autonomous Rescue' as const,
            x: targetWorker.x,
            y: targetWorker.y,
            estimatedArrivalTime: 0
          };
        }
      }
    }
    
    // Idle walk for robots
    return {
      ...r,
      batteryPercent: Math.max(0, r.batteryPercent - 0.01)
    };
  });

  // 5. Update Hazard Grid Cells via SIHM Diffusion vectors
  const { cells } = updateSIHM(updatedWorkers, updatedHelmets, updatedPlumes);

  // 6. Execute DEDP consensus loop
  const nextProtocol = runDEDPEngine(updatedWorkers, updatedHelmets, currentProtocol);

  // 7. Accumulate maintenance alerts
  const alerts: PredictiveMaintenanceAlert[] = [];
  updatedHelmets.forEach(h => {
    const alert = predictCommFailure(h);
    if (alert) alerts.push(alert);

    // Battery maintenance warning
    if (h.batteryPercent < 20) {
      alerts.push({
        id: `alert-batt-${h.id}`,
        deviceId: h.id,
        deviceType: 'Helmet',
        parameter: 'Battery Degradation',
        criticality: 'Warning',
        predictedFailureTime: '2 hours',
        recommendation: 'Scheduled hot-swap replacement on current shift exit'
      });
    }
  });

  return {
    workers: updatedWorkers,
    helmets: updatedHelmets,
    robots: updatedRobots,
    protocol: nextProtocol,
    cells,
    plumes: updatedPlumes,
    alerts
  };
}
