import { Worker, Helmet, ACRSAPrediction, PredictiveMaintenanceAlert } from '../types';

export function calculateACRSA(worker: Worker, helmet: Helmet, neighbors: Helmet[]): ACRSAPrediction {
  const reasoning: string[] = [];
  const factors: { factor: string; percentage: number }[] = [];

  // 1. Gas Contributions
  const coLevel = helmet.coLevel;
  const methaneLevel = helmet.methaneLevel;
  
  let coContribution = 0;
  if (coLevel > 50) {
    coContribution = Math.min((coLevel / 200) * 100, 100);
    reasoning.push(`Critical Carbon Monoxide detected (${coLevel.toFixed(1)} ppm)`);
  } else if (coLevel > 25) {
    coContribution = (coLevel / 50) * 40;
    reasoning.push(`Elevated Carbon Monoxide level (${coLevel.toFixed(1)} ppm)`);
  }

  let methaneContribution = 0;
  if (methaneLevel > 2.0) {
    methaneContribution = Math.min((methaneLevel / 5.0) * 100, 100);
    reasoning.push(`Explosive Methane concentration near LEL limit (${methaneLevel.toFixed(2)}%)`);
  } else if (methaneLevel > 1.0) {
    methaneContribution = (methaneLevel / 2.0) * 50;
    reasoning.push(`Elevated Methane level (${methaneLevel.toFixed(2)}%)`);
  }

  // 2. Health telemetry contributions (Heart Rate, SpO2, Fatigue, Collapse)
  let healthContribution = 0;
  
  // SpO2 drops
  if (worker.spo2 < 90) {
    healthContribution += 40;
    reasoning.push(`Severe SpO₂ hypoxemia drop detected (${worker.spo2}%)`);
  } else if (worker.spo2 < 94) {
    healthContribution += 20;
    reasoning.push(`Mild SpO₂ drop detected (${worker.spo2}%)`);
  }

  // Heart rate anomalies
  if (worker.heartRate > 150) {
    healthContribution += 25;
    reasoning.push(`Tachycardia heart rate anomaly (${worker.heartRate} bpm)`);
  } else if (worker.heartRate < 50) {
    healthContribution += 25;
    reasoning.push(`Bradycardia heart rate anomaly (${worker.heartRate} bpm)`);
  }

  // Motion Collapse
  if (worker.motionState === 'Fall Detected') {
    healthContribution += 50;
    reasoning.push('Worker vertical fall event triggered via MPU6050 accelerometer');
  } else if (worker.motionState === 'Inactive' && healthContribution > 20) {
    healthContribution += 30;
    reasoning.push('Worker collapse alert: prolonged horizontal inactivity with anomalous vitals');
  }

  // Fatigue and stress indexes
  if (worker.fatigueScore > 75) {
    healthContribution += 15;
    reasoning.push(`High biological fatigue score (${worker.fatigueScore.toFixed(0)}%)`);
  }
  if (worker.heatExhaustionProbability > 70) {
    healthContribution += 20;
    reasoning.push(`Dangerous risk of thermal heat exhaustion (${worker.heatExhaustionProbability.toFixed(0)}%)`);
  }

  // 3. Collaborative mesh indicators (Neighbor telemetry contribution - CMARI aspect)
  let neighborContribution = 0;
  const dangerousNeighbors = neighbors.filter(n => n.coLevel > 35 || n.methaneLevel > 1.5);
  if (dangerousNeighbors.length > 0) {
    neighborContribution = Math.min(dangerousNeighbors.length * 20, 60);
    reasoning.push(`${dangerousNeighbors.length} adjacent mesh helmet agents reports gas hazard clusters nearby`);
  }

  // 4. Device and communication anomalies
  let deviceContribution = 0;
  if (helmet.signalStrength < -85) {
    deviceContribution += 10;
    reasoning.push(`Degraded RF mesh link signal quality (${helmet.signalStrength} dBm)`);
  }
  if (helmet.helmetHealth < 60) {
    deviceContribution += 15;
    reasoning.push(`Internal helmet sensor module fault reported (health ${helmet.helmetHealth}%)`);
  }

  // Aggregate weighted score
  // ACRSA Equation: Risk = w1*CO + w2*CH4 + w3*Health + w4*Mesh Neighbors + w5*RF Quality
  let totalScore = (coContribution * 0.25) + (methaneContribution * 0.3) + (healthContribution * 0.25) + (neighborContribution * 0.12) + (deviceContribution * 0.08);
  totalScore = Math.min(Math.max(totalScore, 0), 100);

  // If fall detected, elevate risk immediately
  if (worker.motionState === 'Fall Detected') {
    totalScore = Math.max(totalScore, 85);
  }

  // Categorize
  let riskCategory: 'Low' | 'Medium' | 'High' | 'Extreme' = 'Low';
  if (totalScore >= 80) riskCategory = 'Extreme';
  else if (totalScore >= 50) riskCategory = 'High';
  else if (totalScore >= 25) riskCategory = 'Medium';

  // Construct factor breakdown (EEI)
  const sumContributions = coContribution + methaneContribution + healthContribution + neighborContribution + deviceContribution;
  if (sumContributions > 0) {
    if (coContribution > 0) {
      factors.push({ factor: 'Carbon Monoxide Gas', percentage: Math.round((coContribution / sumContributions) * totalScore) });
    }
    if (methaneContribution > 0) {
      factors.push({ factor: 'Methane Gas (CH4)', percentage: Math.round((methaneContribution / sumContributions) * totalScore) });
    }
    if (healthContribution > 0) {
      factors.push({ factor: 'Worker Vitals & Motion', percentage: Math.round((healthContribution / sumContributions) * totalScore) });
    }
    if (neighborContribution > 0) {
      factors.push({ factor: 'Neighbor Agent Consensuses', percentage: Math.round((neighborContribution / sumContributions) * totalScore) });
    }
    if (deviceContribution > 0) {
      factors.push({ factor: 'Mesh Link & Battery', percentage: Math.round((deviceContribution / sumContributions) * totalScore) });
    }
  } else {
    factors.push({ factor: 'Baseline environmental noise', percentage: Math.max(totalScore, 2) });
  }

  // Sort factors descending
  factors.sort((a, b) => b.percentage - a.percentage);

  // Confidence is high if signal is good and neighbors agree
  let confidenceScore = 99 - Math.max(0, -30 - helmet.signalStrength) - (helmet.helmetHealth < 80 ? 15 : 0);
  confidenceScore = Math.min(Math.max(confidenceScore, 65), 98);

  if (reasoning.length === 0) {
    reasoning.push('All parameters within baseline safety constraints.');
  }

  return {
    workerId: worker.id,
    riskScore: Math.round(totalScore),
    riskCategory,
    confidenceScore: Math.round(confidenceScore),
    reasoning,
    contributingFactors: factors
  };
}

export function predictWorkerFatigue(worker: Worker): {
  fatigue: number;
  stress: number;
  heatExhaustion: number;
  collapse: number;
} {
  // Simulates worker fatigue calculations using heart rate (HR), temperature (Temp) and SpO2
  const hrVal = worker.heartRate;
  const tempVal = worker.bodyTemp;
  const spo2Val = worker.spo2;

  // Fatigue score grows with high HR and core Temp
  let fatigue = 10;
  if (hrVal > 110) fatigue += (hrVal - 110) * 0.8;
  if (tempVal > 37.5) fatigue += (tempVal - 37.5) * 15;
  fatigue = Math.min(fatigue, 100);

  // Stress score is responsive to fast HR changes and SpO2 drops
  let stress = 15;
  if (hrVal > 120) stress += (hrVal - 120) * 0.7;
  if (spo2Val < 95) stress += (95 - spo2Val) * 8;
  stress = Math.min(stress, 100);

  // Heat exhaustion based on core temp and body exertion
  let heatExhaustion = 5;
  if (tempVal > 38.0) {
    heatExhaustion += (tempVal - 38.0) * 45;
  }
  if (hrVal > 130) heatExhaustion += 15;
  heatExhaustion = Math.min(heatExhaustion, 100);

  // Collapse probability is extremely elevated with low SpO2, high heat exhaustion, and inactivity
  let collapse = 0;
  if (worker.motionState === 'Fall Detected') {
    collapse = 100;
  } else {
    if (spo2Val < 90) collapse += 30;
    if (heatExhaustion > 75) collapse += 25;
    if (hrVal > 160) collapse += 20;
    if (worker.motionState === 'Inactive') collapse += 15;
    collapse = Math.min(collapse, 95);
  }

  return {
    fatigue: Math.round(fatigue),
    stress: Math.round(stress),
    heatExhaustion: Math.round(heatExhaustion),
    collapse: Math.round(collapse)
  };
}

export function predictCommFailure(helmet: Helmet): PredictiveMaintenanceAlert | null {
  const meshLinkQuality = helmet.collaborationScore;
  const signal = helmet.signalStrength;
  const battery = helmet.batteryPercent;

  if (battery < 15 && signal < -85) {
    return {
      id: `alert-comm-${helmet.id}`,
      deviceId: helmet.id,
      deviceType: 'Helmet',
      parameter: 'Comm Interruption',
      criticality: 'Urgent',
      predictedFailureTime: '6 minutes',
      recommendation: 'Instruct worker to relocate near Tunnel 2 Gateway or replace Battery pack immediately'
    };
  }
  if (meshLinkQuality < 50) {
    return {
      id: `alert-comm-degrade-${helmet.id}`,
      deviceId: helmet.id,
      deviceType: 'Helmet',
      parameter: 'Comm Interruption',
      criticality: 'Warning',
      predictedFailureTime: '18 minutes',
      recommendation: 'Evaluate routing nodes in current zone for local RF interference or high packet loss'
    };
  }

  return null;
}
