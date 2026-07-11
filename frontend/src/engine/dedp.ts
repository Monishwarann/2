import { DEDPState, DEDPStatus, Worker, Helmet } from '../types';

export function runDEDPEngine(
  workers: Worker[],
  helmets: Helmet[],
  currentProtocol: DEDPStatus
): DEDPStatus {
  const triggers: string[] = [];
  const resources: string[] = [];
  let nextState: DEDPState = 'NORMAL';

  // Check telemetry thresholds
  const highRiskWorkers = workers.filter(w => w.status === 'Critical' || w.status === 'Danger');
  const falls = workers.filter(w => w.motionState === 'Fall Detected');
  const highMethaneCount = helmets.filter(h => h.methaneLevel > 2.0).length;
  const highCOCount = helmets.filter(h => h.coLevel > 50).length;
  
  // Decide next state
  if (falls.length > 0) {
    nextState = 'RESCUE';
    triggers.push(`Accelerometer Fall Event triggered for worker ${falls[0].name}`);
    resources.push('Deploy Medical Emergency Stretcher');
    resources.push('Assign Autonomous Robot fleet navigation tracking');
  } else if (highMethaneCount > 2 || highCOCount > 2) {
    nextState = 'EVACUATION';
    triggers.push(`Collective Gas Hazard detected (${highMethaneCount} mesh node methane clusters, ${highCOCount} CO clusters)`);
    resources.push('Activate Extraction Air Ventilation Blowers');
    resources.push('Mobilize Incident Response Rescue Team');
    resources.push('Deploy Emergency Oxygen cylinders to East Shaft');
  } else if (highRiskWorkers.length > 0) {
    nextState = 'ALERT';
    triggers.push(`Worker ${highRiskWorkers[0].name} risk score exceeds ACRSA critical threshold`);
    resources.push('Push haptic notification vibration alert to supervisor app');
  } else if (helmets.some(h => h.coLevel > 15 || h.methaneLevel > 0.8)) {
    nextState = 'MONITORING';
    triggers.push('Elevated environmental gas levels reported in tunnels');
  }

  // Handle manual escalation inputs from previous iterations
  if (currentProtocol.activeState === 'EVACUATION' && nextState !== 'RESCUE') {
    // Keep evacuation state active until workers are safe
    const activeEvacuations = workers.some(w => w.status === 'Evacuating' || w.status === 'Danger');
    if (activeEvacuations) {
      nextState = 'EVACUATION';
      triggers.push('Evacuation execution in progress - tracking worker escape vectors');
    }
  }

  // Recommended Resource additions based on state
  switch (nextState) {
    case 'RESCUE':
      resources.push('Dispatch Rescue Squad Alpha');
      resources.push('Deploy Rescue Robot R-102 (autonomous navigation vector active)');
      break;
    case 'EVACUATION':
      resources.push('Evacuate Tunnels 1 and 3');
      resources.push('Assemble emergency medical ambulance at surface portal');
      break;
    case 'ALERT':
      resources.push('Send voice alert communication confirmation');
      break;
    case 'MONITORING':
      resources.push('Increase environmental telemetry sampling frequency to 10Hz');
      break;
    default:
      resources.push('Standard operating environment standby active');
  }

  // Determine mesh offline consensus: simulate network loss
  // If WAN signal goes offline, edge helmets negotiate consensus locally
  const networkFailing = helmets.every(h => h.signalStrength < -85);

  return {
    activeState: nextState,
    consensusConfidence: nextState === 'NORMAL' ? 98 : 94,
    edgeLeaderId: helmets[0]?.id || 'Helmet-01',
    meshOfflineConsensus: networkFailing,
    activeProtocolTriggers: triggers,
    recommendedResources: [...new Set(resources)]
  };
}
