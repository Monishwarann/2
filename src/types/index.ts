export type UserRole = 'Admin' | 'Supervisor' | 'Worker' | 'Rescue';

export type WorkerStatus = 'Active' | 'Evacuating' | 'Safe' | 'Danger' | 'Critical';

export interface Worker {
  id: string;
  name: string;
  role: UserRole;
  zone: string;
  status: WorkerStatus;
  
  // Health telemetry
  heartRate: number;
  spo2: number;
  bodyTemp: number; // °C
  
  // Predictors (ACRSA Extensions)
  fatigueScore: number; // 0 - 100%
  stressScore: number; // 0 - 100%
  heatExhaustionProbability: number; // 0 - 100%
  collapseProbability: number; // 0 - 100%
  
  // Position
  x: number;
  y: number;
  z: number;
  orientation: number; // degrees
  motionState: 'Walking' | 'Crawling' | 'Standing' | 'Inactive' | 'Fall Detected';
}

export interface Helmet {
  id: string;
  workerId: string;
  
  // Environmental telemetry
  coLevel: number; // ppm
  methaneLevel: number; // % LEL (Lower Explosive Limit)
  airQualityIndex: number; // AQI
  ambientTemp: number; // °C
  ambientHumidity: number; // %
  
  // Device stats
  batteryPercent: number;
  batteryHoursRemaining: number; // AI predicted
  batteryReplacementDays: number; // AI predicted
  signalStrength: number; // dBm (-100 to -30)
  helmetHealth: number; // 0 - 100%
  
  // Mesh Network / CMARI Features
  collaborationScore: number; // 0 - 100% (mesh efficiency)
  neighboringHelmets: string[]; // Neighboring helmet IDs in range
  meshLatencyMs: number;
}

export type RobotStatus = 'Idle' | 'Autonomous Rescue' | 'Navigating' | 'Low Battery' | 'Offline';

export interface RescueRobot {
  id: string;
  name: string;
  status: RobotStatus;
  batteryPercent: number;
  oxygenSupplyPercent: number;
  coLevel: number; // Sensor on robot
  robotHealth: number; // 0 - 100%
  targetWorkerId?: string;
  
  // Navigation coordinates
  x: number;
  y: number;
  z: number;
  routeCoordinates: [number, number][]; // Path coordinates
  estimatedArrivalTime: number; // seconds
}

export interface ACRSAPrediction {
  workerId: string;
  riskScore: number; // 0 - 100%
  riskCategory: 'Low' | 'Medium' | 'High' | 'Extreme';
  confidenceScore: number; // 0 - 100%
  
  // Explainable Emergency Intelligence (EEI)
  reasoning: string[];
  contributingFactors: {
    factor: string;
    percentage: number; // e.g. 35% contribution
  }[];
}

export type DEDPState = 'NORMAL' | 'MONITORING' | 'ALERT' | 'EVACUATION' | 'RESCUE' | 'RECOVERY';

export interface DEDPStatus {
  activeState: DEDPState;
  consensusConfidence: number; // 0 - 100%
  edgeLeaderId: string; // Current helmet acting as node manager
  meshOfflineConsensus: boolean; // protocol works even without cloud connection
  activeProtocolTriggers: string[];
  recommendedResources: string[];
}

export interface HazardMapCell {
  x: number;
  y: number;
  gasConcentration: number; // 0 - 100%
  temperature: number; // °C
  fireProbability: number; // 0 - 100%
  isSafeZone: boolean;
  isDynamicSafeZone: boolean; // AI calculated
  workerDensity: number;
}

export interface ReplayFrame {
  timestamp: string;
  workerPositions: Record<string, { x: number, y: number, status: WorkerStatus }>;
  gasConcentrations: Record<string, { co: number, methane: number }>;
  activeAlarms: string[];
}

export interface FederatedClient {
  helmetId: string;
  datasetSize: number; // Number of samples collected locally
  localLoss: number;
  accuracy: number;
  connectionType: 'Mesh' | 'WiFi' | 'LTE';
  weightsAggregationStatus: 'Synced' | 'Stale' | 'Training';
}

export interface PredictiveMaintenanceAlert {
  id: string;
  deviceId: string;
  deviceType: 'Helmet' | 'Sensor' | 'Robot' | 'Gateway';
  parameter: 'Battery Degradation' | 'Sensor Drift' | 'Comm Interruption' | 'Actuator Wear';
  criticality: 'Info' | 'Warning' | 'Urgent';
  predictedFailureTime: string;
  recommendation: string;
}
