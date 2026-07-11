import { Worker, Helmet } from '../types';

export interface CMARILink {
  source: string; // Helmet ID
  target: string; // Helmet ID
  distance: number;
  quality: number; // 0 - 100%
  packetSuccessRate: number; // 0 - 100%
}

export function updateCMARINetwork(
  workers: Worker[],
  helmets: Helmet[]
): {
  links: CMARILink[];
  collaborationScores: Record<string, number>;
} {
  const links: CMARILink[] = [];
  const collaborationScores: Record<string, number> = {};

  // Build helmet positional mapping
  const positions: Record<string, { x: number; y: number; z: number }> = {};
  workers.forEach(w => {
    positions[w.id] = { x: w.x, y: w.y, z: w.z };
  });

  // Calculate links based on distance threshold
  const MESH_RANGE = 30; // Max mesh range in units
  
  helmets.forEach((h1, i) => {
    let activePackets = 0;
    let successfulPackets = 0;

    const p1 = positions[h1.workerId];
    if (!p1) {
      collaborationScores[h1.id] = 80; // Baseline
      return;
    }

    helmets.forEach((h2, j) => {
      if (i >= j) return; // Prevent double calculation
      const p2 = positions[h2.workerId];
      if (!p2) return;

      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance <= MESH_RANGE) {
        // Link quality decreases with distance and helmet RF health degradation
        const quality = Math.max(0, 100 - (distance / MESH_RANGE) * 60 - (100 - Math.min(h1.helmetHealth, h2.helmetHealth)) * 0.4);
        
        // Simulating packet success rate
        const packetSuccessRate = Math.max(0, quality - (h1.signalStrength < -85 ? 10 : 0) - (h2.signalStrength < -85 ? 10 : 0));
        
        links.push({
          source: h1.id,
          target: h2.id,
          distance: Math.round(distance),
          quality: Math.round(quality),
          packetSuccessRate: Math.round(packetSuccessRate)
        });

        // Add neighbors
        if (!h1.neighboringHelmets.includes(h2.id)) h1.neighboringHelmets.push(h2.id);
        if (!h2.neighboringHelmets.includes(h1.id)) h2.neighboringHelmets.push(h1.id);
      }
    });

    // Score is proportional to connections and packet delivery rates
    const helmetLinks = links.filter(l => l.source === h1.id || l.target === h1.id);
    if (helmetLinks.length === 0) {
      // Isolated node - check direct signal
      const signalRatio = Math.max(0, 100 - Math.abs(-30 - h1.signalStrength) * 1.2);
      collaborationScores[h1.id] = Math.round(signalRatio * 0.7); // Penalize isolation
    } else {
      const sumSuccess = helmetLinks.reduce((acc, curr) => acc + curr.packetSuccessRate, 0);
      const avgSuccess = sumSuccess / helmetLinks.length;
      
      // Collaboration score factors: active packet exchanges + average link quality
      const connectivityFactor = Math.min(helmetLinks.length * 15, 30); // Max 30% for connectivity density
      const score = (avgSuccess * 0.7) + connectivityFactor;
      collaborationScores[h1.id] = Math.round(Math.min(score, 100));
    }
  });

  return {
    links,
    collaborationScores
  };
}

export function computeZoneGasAggregation(
  zone: string,
  helmets: Helmet[],
  workers: Worker[]
): {
  avgCO: number;
  maxCO: number;
  avgMethane: number;
  maxMethane: number;
} {
  // Finds all helmets associated with workers currently in this zone
  const zoneWorkerIds = workers.filter(w => w.zone === zone).map(w => w.id);
  const zoneHelmets = helmets.filter(h => zoneWorkerIds.includes(h.workerId));

  if (zoneHelmets.length === 0) {
    return { avgCO: 0, maxCO: 0, avgMethane: 0, maxMethane: 0 };
  }

  let totalCO = 0;
  let maxCO = 0;
  let totalMethane = 0;
  let maxMethane = 0;

  zoneHelmets.forEach(h => {
    totalCO += h.coLevel;
    if (h.coLevel > maxCO) maxCO = h.coLevel;
    totalMethane += h.methaneLevel;
    if (h.methaneLevel > maxMethane) maxMethane = h.methaneLevel;
  });

  return {
    avgCO: totalCO / zoneHelmets.length,
    maxCO,
    avgMethane: totalMethane / zoneHelmets.length,
    maxMethane
  };
}
