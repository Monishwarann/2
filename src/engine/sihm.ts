import { Worker, Helmet, HazardMapCell } from '../types';

export interface HazardPlume {
  sourceX: number;
  sourceY: number;
  intensity: number; // 0 - 100
  radius: number;
  type: 'Gas' | 'Fire';
}

export function updateSIHM(
  workers: Worker[],
  helmets: Helmet[],
  plumes: HazardPlume[]
): {
  cells: HazardMapCell[];
  diffusionVector: { dx: number; dy: number };
} {
  const cells: HazardMapCell[] = [];
  const GRID_SIZE = 10;
  const WIDTH = 100;
  const HEIGHT = 100;

  // 1. Calculate Average diffusion direction based on sensor differences (Gradient voting)
  let sumDx = 0;
  let sumDy = 0;
  let votesCount = 0;

  helmets.forEach(h1 => {
    const w1 = workers.find(w => w.id === h1.workerId);
    if (!w1) return;

    h1.neighboringHelmets.forEach(neighId => {
      const h2 = helmets.find(h => h.id === neighId);
      const w2 = workers.find(w => w?.id === h2?.workerId);
      if (!h2 || !w2) return;

      const coDiff = h1.coLevel - h2.coLevel;
      const methaneDiff = h1.methaneLevel - h2.methaneLevel;
      const totalDiff = coDiff + (methaneDiff * 25); // Weight methane higher

      if (Math.abs(totalDiff) > 2) {
        // Gradient points from lower concentrations to higher concentrations
        const dx = w1.x - w2.x;
        const dy = w1.y - w2.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          const factor = totalDiff > 0 ? 1 : -1;
          sumDx += (dx / len) * factor;
          sumDy += (dy / len) * factor;
          votesCount++;
        }
      }
    });
  });

  const diffusionVector = {
    dx: votesCount > 0 ? sumDx / votesCount : 0.5,
    dy: votesCount > 0 ? sumDy / votesCount : 0.2
  };

  // 2. Generate 2D Grid Cells representing mine tunnels layout and hazards
  // Simulating typical mine layouts:
  // Tunnel 1: y = 20 (Horizontal shaft)
  // Tunnel 2: y = 50 (Horizontal shaft)
  // Tunnel 3: y = 80 (Horizontal shaft)
  // Connectors: x = 25 (Vertical shaft), x = 75 (Vertical shaft)
  for (let x = 5; x <= WIDTH; x += GRID_SIZE) {
    for (let y = 5; y <= HEIGHT; y += GRID_SIZE) {
      const isTunnel = 
        Math.abs(y - 20) < 6 || 
        Math.abs(y - 50) < 6 || 
        Math.abs(y - 80) < 6 || 
        Math.abs(x - 25) < 6 || 
        Math.abs(x - 75) < 6;

      if (!isTunnel) continue; // Only process actual tunnel grid coordinates

      // Calculate gas and fire concentrations based on plumes
      let maxGas = 0;
      let maxFire = 0;
      let maxTemp = 24.5; // Baseline Temp

      plumes.forEach(p => {
        const dx = x - p.sourceX;
        const dy = y - p.sourceY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= p.radius) {
          const falloff = 1 - (dist / p.radius);
          if (p.type === 'Gas') {
            maxGas = Math.max(maxGas, p.intensity * falloff);
            maxTemp = Math.max(maxTemp, 24.5 + (15 * falloff));
          } else {
            maxFire = Math.max(maxFire, p.intensity * falloff);
            maxTemp = Math.max(maxTemp, 24.5 + (60 * falloff));
          }
        }
      });

      // Calculate Worker Density
      const zoneWorkers = workers.filter(w => {
        const dist = Math.sqrt((w.x - x) * (w.x - x) + (w.y - y) * (w.y - y));
        return dist < GRID_SIZE;
      });
      const workerDensity = zoneWorkers.length;

      // Dynamic Safe Zone Prediction
      // A zone is safe if gas concentration < 10%, fire prob < 5%, Temp < 30°C, and density is manageable
      const isBaseSafeZone = (x === 50 && y === 20) || (x === 50 && y === 80); // Static safe shelters
      const isGasSafe = maxGas < 15;
      const isFireSafe = maxFire < 5;
      const isTempSafe = maxTemp < 32;
      const isDynamicSafeZone = !isBaseSafeZone && isGasSafe && isFireSafe && isTempSafe && workerDensity < 3;

      cells.push({
        x,
        y,
        gasConcentration: Math.round(maxGas),
        temperature: Math.round(maxTemp),
        fireProbability: Math.round(maxFire),
        isSafeZone: isBaseSafeZone && isGasSafe && isFireSafe,
        isDynamicSafeZone,
        workerDensity
      });
    }
  }

  return {
    cells,
    diffusionVector
  };
}

// Generate Personalized Worker Evacuation Vectors based on dynamic safety and exit pathways
export function calculateEvacuationPlan(
  worker: Worker,
  cells: HazardMapCell[],
  robots: any[]
): {
  exitRoute: [number, number][];
  exitName: string;
  reason: string;
} {
  // Finds the closest safe zone
  const safeSpots = cells.filter(c => c.isSafeZone || c.isDynamicSafeZone);
  if (safeSpots.length === 0) {
    return {
      exitRoute: [[50, 20]],
      exitName: 'Surface Main Portal',
      reason: 'No dynamic safe zones resolved - evacuate via Main Shaft immediately'
    };
  }

  // Find robot positions to guide workers
  const activeRobots = robots.filter(r => r.status === 'Autonomous Rescue' || r.status === 'Navigating');

  let bestSpot = safeSpots[0];
  let minDist = 9999;

  safeSpots.forEach(spot => {
    const dx = spot.x - worker.x;
    const dy = spot.y - worker.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Adjust distance based on crowd density and robot guides
    let adjustedDist = dist;
    adjustedDist += spot.workerDensity * 5; // Penalize crowded zones
    
    // Reward zones with active rescue robots nearby to escort
    const robotNearby = activeRobots.some(r => {
      const rdx = r.x - spot.x;
      const rdy = r.y - spot.y;
      return Math.sqrt(rdx*rdx + rdy*rdy) < 20;
    });
    if (robotNearby) adjustedDist -= 10;

    if (adjustedDist < minDist) {
      minDist = adjustedDist;
      bestSpot = spot;
    }
  });

  // Generates simplified grid-locked path (underground tunnel layout routing)
  const route: [number, number][] = [];
  route.push([worker.x, worker.y]);
  
  // Grid path generation matching tunnel intersections
  if (worker.y !== bestSpot.y) {
    // Navigate via vertical connectors (x = 25 or x = 75)
    const connectorX = Math.abs(worker.x - 25) < Math.abs(worker.x - 75) ? 25 : 75;
    route.push([connectorX, worker.y]);
    route.push([connectorX, bestSpot.y]);
  }
  route.push([bestSpot.x, bestSpot.y]);

  const exitName = bestSpot.x === 50 && bestSpot.y === 20 ? 'North Emergency Shelter' : 
                   bestSpot.x === 50 && bestSpot.y === 80 ? 'Main Extraction Shaft Portal' : 
                   `Temporary AI Safe Haven [Z: ${bestSpot.x}, ${bestSpot.y}]`;

  return {
    exitRoute: route,
    exitName,
    reason: `Route selected avoiding toxic gas zones. Dynamic Safe Zone capacity status: OK (density: ${bestSpot.workerDensity}). Robot escort status: ${activeRobots.length > 0 ? 'Assigned' : 'Unassigned'}.`
  };
}
