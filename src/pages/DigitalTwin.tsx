import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMineStore } from '../stores/mineStore';
import { calculateACRSA } from '../engine/acrsa';
import { Box, Zap, MapPin, Activity, HelpCircle, AlertTriangle, Shield } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { workers, helmets, robots, cells, accidentTriggered, protocol } = useMineStore();

  // Keep refs for live variables to access inside the Three.js render loop without re-instantiating
  const workersRef = useRef(workers);
  const helmetsRef = useRef(helmets);
  const robotsRef = useRef(robots);
  const cellsRef = useRef(cells);

  useEffect(() => {
    workersRef.current = workers;
    helmetsRef.current = helmets;
    robotsRef.current = robots;
    cellsRef.current = cells;
  }, [workers, helmets, robots, cells]);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 500;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b18);
    scene.fog = new THREE.FogExp2(0x050b18, 0.007);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(50, 45, 95);
    camera.lookAt(50, 20, -50);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0f2236, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
    dirLight.position.set(50, 100, 50);
    scene.add(dirLight);

    // 5. Build Tunnels (Underground Shaft Geometry Representation)
    const tunnelGroup = new THREE.Group();

    // Material with custom wireframe overlay for tech aesthetics
    const tunnelMat = new THREE.MeshBasicMaterial({
      color: 0x0f2236,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });

    // Tunnel Cylinders
    const addTunnelSegment = (x1: number, y1: number, x2: number, y2: number, radius = 5) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const geom = new THREE.CylinderGeometry(radius, radius, length, 8, 4);
      
      const mesh = new THREE.Mesh(geom, tunnelMat);
      const wire = new THREE.Mesh(geom, wireMat);
      mesh.add(wire);

      // Rotate and position cylinder to align with points
      mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, -50);
      
      // Calculate rotation angle
      const angle = Math.atan2(dy, dx);
      mesh.rotation.z = angle - Math.PI / 2;
      
      tunnelGroup.add(mesh);
    };

    // Main horizontal galleries
    addTunnelSegment(10, 20, 90, 20); // Tunnel 1
    addTunnelSegment(10, 50, 90, 50); // Tunnel 2
    addTunnelSegment(10, 80, 90, 80); // Tunnel 3
    // Vertical interconnecting shafts
    addTunnelSegment(25, 20, 25, 80, 4); // West Shaft
    addTunnelSegment(75, 20, 75, 80, 4); // East Shaft

    scene.add(tunnelGroup);

    // 6. Safe Shelter Domes
    const shelterGeo = new THREE.SphereGeometry(6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const shelterMat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    
    // Shelter at (50, 20)
    const dome1 = new THREE.Mesh(shelterGeo, shelterMat);
    dome1.position.set(50, 20, -50);
    scene.add(dome1);

    // Shelter at (50, 80)
    const dome2 = new THREE.Mesh(shelterGeo, shelterMat);
    dome2.position.set(50, 80, -50);
    scene.add(dome2);

    // 7. Workers & Robots Object Pools inside Scene
    const workerMeshes: Record<string, THREE.Mesh> = {};
    const robotMeshes: Record<string, THREE.Mesh> = {};
    const gasPlumeMeshes: THREE.Mesh[] = [];

    // Sphere representation for entities
    const workerGeo = new THREE.SphereGeometry(1.8, 12, 12);
    const robotGeo = new THREE.BoxGeometry(2.5, 1.8, 2.5);

    // Dynamic Plume Sphere for gas diffusion representation
    const plumeGeo = new THREE.SphereGeometry(1, 16, 16);

    // 8. Render Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate shelters slightly
      dome1.rotation.y += 0.005;
      dome2.rotation.y += 0.005;

      // Update Workers
      const currentWorkers = workersRef.current;
      const currentHelmets = helmetsRef.current;
      
      currentWorkers.forEach(w => {
        const helmet = currentHelmets.find(h => h.workerId === w.id);
        const neighbors = currentHelmets.filter(h => helmet?.neighboringHelmets.includes(h.id));
        const acrsa = helmet ? calculateACRSA(w, helmet, neighbors) : null;
        
        let color = 0x00e676; // Safe (Green)
        if (acrsa) {
          if (acrsa.riskCategory === 'Extreme') color = 0xff3b30;
          else if (acrsa.riskCategory === 'High') color = 0xffb800;
          else if (acrsa.riskCategory === 'Medium') color = 0xffb800;
        }

        if (!workerMeshes[w.id]) {
          const mat = new THREE.MeshBasicMaterial({ color });
          const m = new THREE.Mesh(workerGeo, mat);
          m.position.set(w.x, w.y, w.z);
          scene.add(m);
          workerMeshes[w.id] = m;
        } else {
          const m = workerMeshes[w.id];
          m.position.set(w.x, w.y, w.z);
          (m.material as THREE.MeshBasicMaterial).color.setHex(color);
        }
      });

      // Update Robots
      const currentRobots = robotsRef.current;
      currentRobots.forEach(r => {
        let color = 0x00d4ff; // Scout/Default (Cyan)
        if (r.status === 'Autonomous Rescue') color = 0xffb800; // Active Rescue

        if (!robotMeshes[r.id]) {
          const mat = new THREE.MeshBasicMaterial({ color });
          const m = new THREE.Mesh(robotGeo, mat);
          m.position.set(r.x, r.y, r.z);
          scene.add(m);
          robotMeshes[r.id] = m;
        } else {
          const m = robotMeshes[r.id];
          m.position.set(r.x, r.y, r.z);
          (m.material as THREE.MeshBasicMaterial).color.setHex(color);
        }
      });

      // Update Gas Volumetric Dispersion (SIHM) overlay
      // Remove old plume meshes
      gasPlumeMeshes.forEach(mesh => scene.remove(mesh));
      gasPlumeMeshes.length = 0;

      // Render cells with high gas/temp
      const currentCells = cellsRef.current;
      currentCells.forEach(cell => {
        if (cell.gasConcentration > 15 || cell.fireProbability > 10) {
          const plumeColor = cell.fireProbability > cell.gasConcentration ? 0xff3b30 : 0x00d4ff;
          const scale = 1.0 + (Math.max(cell.gasConcentration, cell.fireProbability) / 20);
          
          const mat = new THREE.MeshBasicMaterial({
            color: plumeColor,
            transparent: true,
            opacity: 0.12,
            wireframe: true
          });
          
          const m = new THREE.Mesh(plumeGeo, mat);
          m.position.set(cell.x, cell.y, -50);
          m.scale.set(scale, scale, scale);
          scene.add(m);
          gasPlumeMeshes.push(m);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col overflow-y-auto">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
            3D Digital Twin Simulation
          </h2>
          <p className="text-xs text-mine-textMuted uppercase mt-1">
            Real-time WebGL visualization of shafts, worker heat maps, and robot escorts
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0D1B2A] px-4 py-2 rounded-lg border border-[rgba(0,212,255,0.15)] text-xs font-mono">
          <Zap className="w-4 h-4 text-mine-cyan" />
          <span>CMARI Vector Nodes: {workers.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1 min-h-[500px]">
        {/* ThreeJS Container */}
        <div className="col-span-3 glass-card rounded-xl relative overflow-hidden flex flex-col justify-end">
          
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Interactive Legend overlay */}
          <div className="absolute top-4 left-4 p-4 bg-[rgba(5,11,24,0.85)] border border-[rgba(0,212,255,0.15)] rounded-lg text-xs space-y-2.5 font-mono z-10">
            <h4 className="font-bold text-[#E8F4FD] border-b border-[rgba(0,212,255,0.1)] pb-1 mb-2">SYSTEM LEGEND</h4>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#00E676] inline-block shadow-glowGreen" />
              <span>Safe Worker (ACRSA &lt; 25)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFB800] inline-block shadow-glowAmber" />
              <span>Moderate Hazard (Risk &gt; 25)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B30] inline-block shadow-glowRed" />
              <span>Extreme Emergency Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-sm bg-[#00D4FF] inline-block shadow-glowCyan" />
              <span>Gas Diffusion Gradient (SIHM)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-gradient-to-tr from-yellow-500 to-amber-600 inline-block" />
              <span>Rescue Robot (Sentinel Series)</span>
            </div>
          </div>

          <div className="p-4 bg-[rgba(5,11,24,0.9)] border-t border-[rgba(0,212,255,0.15)] flex justify-between items-center z-10 font-mono text-[10px] text-mine-textMuted">
            <span>Camera focal coordinates: 50.00x, 20.00y, -50.00z</span>
            <span>Refreshes dynamically via 60FPS tick logic</span>
          </div>

        </div>

        {/* Side Console Panel */}
        <div className="col-span-1 flex flex-col gap-4">
          
          {/* Tunnel Safety Index Card */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Real-time Twin Stats
            </h3>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-mine-textMuted">Total Shaft Volume:</span>
                <span className="text-[#E8F4FD]">18,500 m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mine-textMuted">Avg Risk Index:</span>
                <span className="text-[#00D4FF]">
                  {(workers.reduce((acc, curr) => acc + curr.fatigueScore, 0) / workers.length).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mine-textMuted">Fire Probability:</span>
                <span className={accidentTriggered ? 'text-mine-red font-bold' : 'text-mine-green'}>
                  {accidentTriggered ? '82% LEL' : '0.04%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mine-textMuted">Mesh offline status:</span>
                <span className="text-mine-cyan">Standby Ready</span>
              </div>
            </div>
          </div>

          {/* Dynamic Safe Exits Card */}
          <div className="glass-card rounded-xl p-5 flex-1 space-y-4 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dynamic Evac Pathing
            </h3>
            
            {accidentTriggered ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-red-950/40 border border-red-500/50 rounded-lg text-red-300">
                    <span className="font-bold block uppercase text-[10px] text-red-400 font-mono mb-1">
                      ⚠️ West Tunnel Breach
                    </span>
                    Methane diffusion vector moving East. Evac route reassigned.
                  </div>
                  
                  <div className="p-2.5 bg-green-950/40 border border-green-500/50 rounded-lg text-green-300 font-mono text-[11px] space-y-1">
                    <span className="font-bold block uppercase text-[10px] text-green-400 mb-1">
                      ✅ Recommended Path:
                    </span>
                    1. Exit East Tunnel via Connector 75
                    <br />
                    2. Ascend to North Shelter
                  </div>
                </div>

                <div className="text-[10px] text-mine-textMuted font-mono">
                  DEDP Consensus weight: {protocol.consensusConfidence}%
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <HelpCircle className="w-8 h-8 text-mine-textMuted mb-2" />
                <p className="text-xs text-mine-textMuted font-mono">
                  All exit tunnels clear of active toxic gas clusters. Standby.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
