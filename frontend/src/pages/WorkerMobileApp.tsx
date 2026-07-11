import React, { useState } from 'react';
import { useMineStore } from '../stores/mineStore';
import { calculateACRSA } from '../engine/acrsa';
import { 
  PhoneCall, ShieldAlert, Cpu, Heart, AlertTriangle, 
  User, CheckCircle, Navigation, Radio, Settings, 
  History, Volume2, Mic, Eye 
} from 'lucide-react';

export const WorkerMobileApp: React.FC = () => {
  const { workers, helmets, triggerAccident, accidentTriggered } = useMineStore();
  
  // Mobile active screen: 1 to 14
  const [mobileScreen, setMobileScreen] = useState<number>(2); // Start at Worker Dashboard
  const [voiceLog, setVoiceLog] = useState<string>('Standby. Click speak.');

  // Target Rajesh Kumar (W-103) as the default simulated worker profile
  const workerObj = workers.find(w => w.id === 'W-103') || workers[3];
  const helmetObj = helmets.find(h => h.workerId === workerObj?.id) || helmets[3];
  const acrsaObj = (workerObj && helmetObj) ? calculateACRSA(workerObj, helmetObj, []) : null;

  // Speak command simulation
  const speakCommand = (command: string) => {
    setVoiceLog(`Speaking: "${command}"`);
    
    setTimeout(() => {
      let response = "";
      if (command === 'SOS' || command === 'Help') {
        triggerAccident();
        response = "SOS triggered. Emergency distress packet broadcasted via CMARI mesh. Standby.";
      } else if (command === 'Show Safe Route') {
        response = "Nav route loaded: Proceed to East shaft connector at 75m marker.";
      } else {
        response = `Methane concentration is ${helmetObj?.methaneLevel || 0.05}% LEL. Safe.`;
      }
      setVoiceLog(`AI response: "${response}"`);
      
      // Simulate Speech Synthesis (read out loud)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  };

  // Render the inner phone screen based on active screen ID
  const renderPhoneContent = () => {
    switch (mobileScreen) {
      case 1: // Login
        return (
          <div className="p-4 space-y-4 font-mono text-xs flex flex-col justify-center h-full">
            <h4 className="text-center font-bold text-mine-cyan text-sm">MINEGUARDIAN MOBILE</h4>
            <div className="space-y-3 bg-[#132235] p-4 rounded-lg border border-[rgba(0,212,255,0.1)]">
              <div>
                <label className="text-[9px] text-mine-textMuted block">WORKER ID</label>
                <input type="text" value={workerObj?.id} disabled className="w-full bg-[#0D1B2A] border border-[rgba(0,212,255,0.15)] p-2 rounded text-xs text-[#E8F4FD]" />
              </div>
              <button onClick={() => setMobileScreen(2)} className="w-full bg-[#00D4FF] text-black font-bold py-2 rounded text-center">LOGIN</button>
            </div>
          </div>
        );

      case 2: // Worker Dashboard
        return (
          <div className="space-y-4 p-4 font-mono text-xs overflow-y-auto h-full">
            <div className="flex justify-between items-center border-b border-[rgba(0,212,255,0.1)] pb-2">
              <span className="font-bold text-[#E8F4FD]">DASHBOARD</span>
              <span className="text-[9px] text-mine-green font-bold">● MESH CONNECTED</span>
            </div>

            {/* Risk gauge circle */}
            <div className="p-4 bg-[#132235] rounded-xl text-center space-y-2 border border-[rgba(0,212,255,0.1)]">
              <span className="text-[10px] text-mine-textMuted block">ACRSA RISK LEVEL</span>
              <div className="w-20 h-20 rounded-full border-4 border-mine-cyan flex items-center justify-center mx-auto text-sm font-bold text-[#E8F4FD]">
                {acrsaObj?.riskScore || 12}%
              </div>
              <span className="text-[10px] text-mine-cyan block uppercase">{acrsaObj?.riskCategory || 'Low'} Risk</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div onClick={() => setMobileScreen(3)} className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)] cursor-pointer">
                <span className="text-mine-textMuted block">GAS MONITOR</span>
                <span className="text-mine-cyan font-bold">{helmetObj?.coLevel} ppm</span>
              </div>
              <div onClick={() => setMobileScreen(4)} className="bg-[#132235] p-3 rounded-lg border border-[rgba(0,212,255,0.05)] cursor-pointer">
                <span className="text-mine-textMuted block">HEART RATE</span>
                <span className="text-mine-cyan font-bold">{workerObj?.heartRate} bpm</span>
              </div>
            </div>

            <button 
              onClick={() => {
                triggerAccident();
                setMobileScreen(11);
              }} 
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-glowRed animate-pulse"
            >
              <ShieldAlert className="w-4.5 h-4.5" />
              SOS DISTRESS TRIGGER
            </button>
          </div>
        );

      case 3: // Live Gas Monitoring
        return (
          <div className="p-4 space-y-4 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">GAS MONITORS</h4>
            <div className="space-y-2.5">
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.1)]">
                <span className="text-[10px] text-mine-textMuted block">METHANE (CH₄)</span>
                <span className="text-sm font-bold text-[#00D4FF]">{helmetObj?.methaneLevel}% LEL</span>
              </div>
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.1)]">
                <span className="text-[10px] text-mine-textMuted block">CARBON MONOXIDE (CO)</span>
                <span className="text-sm font-bold text-mine-red">{helmetObj?.coLevel} ppm</span>
              </div>
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.05)] text-mine-textMuted">
                Ambient Temp: {helmetObj?.ambientTemp} °C
                <br />
                Humidity: {helmetObj?.ambientHumidity}%
              </div>
            </div>
          </div>
        );

      case 4: // Health Monitoring
        return (
          <div className="p-4 space-y-4 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">BIOMETRIC MONITOR</h4>
            <div className="space-y-3">
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.1)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-mine-textMuted block">HEART RATE</span>
                  <span className="text-sm font-bold text-[#E8F4FD]">{workerObj?.heartRate} bpm</span>
                </div>
                <Heart className="w-6 h-6 text-mine-red fill-mine-red animate-pulse" />
              </div>
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.1)]">
                <span className="text-[10px] text-mine-textMuted block">BLOOD OXYGEN (SpO₂)</span>
                <span className="text-sm font-bold text-mine-cyan">{workerObj?.spo2}%</span>
              </div>
            </div>
          </div>
        );

      case 5: // AI Risk Prediction
        return (
          <div className="p-4 space-y-4 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">ACRSA COGNITION</h4>
            <div className="space-y-2.5">
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.05)]">
                <span className="text-[10px] text-mine-textMuted block">STRESS FACTOR</span>
                <span className="font-bold text-[#E8F4FD]">{workerObj?.stressScore}%</span>
              </div>
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.05)]">
                <span className="text-[10px] text-mine-textMuted block">FATIGUE INDEX</span>
                <span className="font-bold text-[#E8F4FD]">{workerObj?.fatigueScore}%</span>
              </div>
              <div className="bg-[#132235] p-3 rounded border border-[rgba(0,212,255,0.05)]">
                <span className="text-[10px] text-mine-textMuted block">HEAT EXHAUSTION</span>
                <span className="font-bold text-[#E8F4FD]">{workerObj?.heatExhaustionProbability}%</span>
              </div>
            </div>
          </div>
        );

      case 6: // Smart Alerts
        return (
          <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">SMART ALERTS</h4>
            {accidentTriggered ? (
              <div className="p-3 bg-red-950/40 border border-red-500 rounded-lg text-red-300">
                ⚠️ CRITICAL GAS breache detected in Tunnel 1. Engage Evac route immediately.
              </div>
            ) : (
              <div className="p-3 bg-green-950/20 border border-green-500 rounded-lg text-mine-green">
                ✓ All telemetry normal. Baseline synced.
              </div>
            )}
          </div>
        );

      case 7: // AI Safety Assistant
        return (
          <div className="p-4 flex flex-col justify-between h-full font-mono text-xs">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">AI ASSISTANT</h4>
            <div className="flex-1 bg-[#0D1B2A] border border-[rgba(0,212,255,0.1)] my-3 rounded p-2.5 space-y-2 text-[10px] text-mine-textMuted">
              <div><b>AI:</b> Hello worker, how can I assist you?</div>
            </div>
            <div className="flex gap-1.5">
              <input type="text" placeholder="Type query..." disabled className="flex-1 bg-[#132235] border border-[rgba(0,212,255,0.15)] p-2 rounded text-[10px]" />
              <button className="bg-mine-cyan text-black px-3 rounded text-[10px] font-bold">SEND</button>
            </div>
          </div>
        );

      case 8: // Voice Assistant (Simulates Worker Speech commands)
        return (
          <div className="p-4 space-y-4 font-mono text-xs text-center flex flex-col justify-center h-full">
            <Volume2 className="w-8 h-8 text-mine-cyan mx-auto animate-pulse" />
            <h4 className="font-bold text-[#E8F4FD]">HELMET VOICE CONTROL</h4>
            
            <div className="p-3 bg-[#132235] border border-[rgba(0,212,255,0.1)] rounded text-[10px] text-mine-textMuted text-left">
              {voiceLog}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button onClick={() => speakCommand('SOS')} className="p-2 bg-red-950 text-red-300 border border-red-500 rounded font-bold uppercase flex items-center justify-center gap-1">
                <Mic className="w-3.5 h-3.5" />
                "SOS"
              </button>
              <button onClick={() => speakCommand('Show Safe Route')} className="p-2 bg-[#1B263B] text-mine-cyan border border-[rgba(0,212,255,0.15)] rounded font-bold uppercase flex items-center justify-center gap-1">
                <Mic className="w-3.5 h-3.5" />
                "Route"
              </button>
            </div>
          </div>
        );

      case 9: // Evacuation Navigation (AR HUD Overlay Simulation)
        return (
          <div className="p-4 space-y-4 font-mono text-xs flex flex-col justify-between h-full relative overflow-hidden bg-black text-center">
            
            {/* Visual HUD canvas backdrop */}
            <div className="absolute inset-0 bg-repeat opacity-15 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22><circle cx=%225%22 cy=%225%22 r=%221%22 fill=%22%23fff%22/></svg>')] pointer-events-none" />

            <div className="z-10 font-bold text-green-400 text-[10px] uppercase border-b border-green-500/20 pb-2">
              AR EVAC HUD ACTIVE
            </div>

            {accidentTriggered ? (
              <div className="z-10 space-y-2">
                <Navigation className="w-10 h-10 text-green-400 mx-auto animate-bounce" />
                <span className="text-green-300 font-bold block">↑ PROCEED STRAIGHT (25m)</span>
                <span className="text-[9px] text-green-500 block uppercase">EXIT: EAST SHAFT PORTAL</span>
              </div>
            ) : (
              <div className="z-10 space-y-1">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <span className="text-green-500 block">SHAFT CLEAR</span>
                <span className="text-[9px] text-green-600 block">No active hazards. Standby.</span>
              </div>
            )}

            <div className="z-10 text-[9px] text-green-600 font-mono">
              O₂ payload remaining: 98%
            </div>

          </div>
        );

      case 10: // Helmet Network
        return (
          <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">MESH NEIGHBORS</h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-[#132235] border border-[rgba(0,212,255,0.05)] rounded flex justify-between">
                <span>Helmet H-201</span>
                <span className="text-mine-green font-bold">✓ Sync 98%</span>
              </div>
              <div className="p-2.5 bg-[#132235] border border-[rgba(0,212,255,0.05)] rounded flex justify-between">
                <span>Helmet H-204</span>
                <span className="text-mine-green font-bold">✓ Sync 92%</span>
              </div>
            </div>
          </div>
        );

      case 11: // SOS Emergency
        return (
          <div className="p-4 space-y-4 font-mono text-xs text-center flex flex-col justify-center h-full bg-red-950/20">
            <AlertTriangle className="w-12 h-12 text-mine-red mx-auto animate-bounce" />
            <h4 className="font-bold text-mine-red text-sm uppercase">SOS PACKETS BROADCASTING</h4>
            <p className="text-[10px] text-mine-textMuted leading-relaxed">
              Decentralized mesh node broadcast active. Emergency decision algorithm routing Sentinel robot to your position.
            </p>
            <button onClick={() => setMobileScreen(2)} className="bg-[#132235] border border-[rgba(255,255,255,0.15)] py-2 rounded text-[10px]">CANCEL SOS</button>
          </div>
        );

      case 12: // Incident History
        return (
          <div className="p-4 space-y-3 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">INCIDENT LOGS</h4>
            <div className="space-y-2">
              <div className="p-2 bg-[#132235] border border-[rgba(255,255,255,0.05)] rounded">
                <span className="text-[8px] text-mine-textMuted block">02:14:05</span>
                Mild battery depletion alert synced.
              </div>
            </div>
          </div>
        );

      case 13: // Profile
        return (
          <div className="p-4 space-y-4 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">WORKER PROFILE</h4>
            <div className="space-y-2.5">
              <div className="bg-[#132235] p-3 rounded">
                <span className="text-[9px] text-mine-textMuted block">NAME</span>
                <span className="font-bold text-[#E8F4FD]">{workerObj?.name}</span>
              </div>
              <div className="bg-[#132235] p-3 rounded">
                <span className="text-[9px] text-mine-textMuted block">ZONE PROFILE</span>
                <span className="font-bold text-[#E8F4FD]">{workerObj?.zone}</span>
              </div>
            </div>
          </div>
        );

      case 14: // Settings
        return (
          <div className="p-4 space-y-4 font-mono text-xs overflow-y-auto h-full">
            <h4 className="font-bold border-b border-[rgba(0,212,255,0.1)] pb-2 text-[#E8F4FD]">SETTINGS</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#132235] p-3 rounded">
                <span>Helmet Haptic Vibrations</span>
                <span className="text-mine-green font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center bg-[#132235] p-3 rounded">
                <span>Language Voicepack</span>
                <span className="text-mine-cyan font-bold">ENGLISH (EN)</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans flex flex-col">
      
      {/* Header Info */}
      <div className="shrink-0">
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          Worker Handset & HUD Simulator
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Interactive simulation of the 14-screen worker mobile experience, speech synthesizers, and AR HUD overlays
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 items-stretch flex-1 min-h-0">
        
        {/* Smartphone Simulator Frame */}
        <div className="col-span-2 flex justify-center items-center p-4">
          
          <div className="w-[280px] h-[550px] glass-card-premium border-[8px] border-[#00D4FF]/40 rounded-[36px] shadow-glowCyan overflow-hidden flex flex-col justify-between relative">
            
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-[#00D4FF] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20 flex justify-center items-center">
              <div className="w-10 h-1 bg-black rounded-full" />
            </div>

            {/* Smartphone screen viewport content */}
            <div className="flex-1 pt-6 pb-4 bg-[#0D1B2A]/50 backdrop-blur-md relative overflow-hidden">
              {renderPhoneContent()}
            </div>

            {/* Phone Home Button */}
            <div className="h-10 bg-[#050B18] flex items-center justify-center border-t border-[rgba(0,212,255,0.08)]">
              <button 
                onClick={() => setMobileScreen(2)} 
                className="w-5 h-5 rounded-full border border-mine-cyan flex items-center justify-center hover:bg-cyan-950 transition-colors"
                title="Go to home dashboard"
              />
            </div>

          </div>

        </div>

        {/* 14 screen navigation guide console */}
        <div className="col-span-2 space-y-4">
          
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan font-mono border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              14 Mobile Screens Guide
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button onClick={() => setMobileScreen(1)} className={`p-2 rounded text-left border ${mobileScreen === 1 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>1. Worker Login Portal</button>
              <button onClick={() => setMobileScreen(2)} className={`p-2 rounded text-left border ${mobileScreen === 2 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>2. Worker Dashboard Home</button>
              <button onClick={() => setMobileScreen(3)} className={`p-2 rounded text-left border ${mobileScreen === 3 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>3. Live Gas Monitoring</button>
              <button onClick={() => setMobileScreen(4)} className={`p-2 rounded text-left border ${mobileScreen === 4 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>4. Live Health telemetry</button>
              <button onClick={() => setMobileScreen(5)} className={`p-2 rounded text-left border ${mobileScreen === 5 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>5. AI Risk Predictions</button>
              <button onClick={() => setMobileScreen(6)} className={`p-2 rounded text-left border ${mobileScreen === 6 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>6. Smart Vibration Alerts</button>
              <button onClick={() => setMobileScreen(7)} className={`p-2 rounded text-left border ${mobileScreen === 7 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>7. Mobile AI Q&A Assistant</button>
              <button onClick={() => setMobileScreen(8)} className={`p-2 rounded text-left border ${mobileScreen === 8 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>8. Voice Commands console</button>
              <button onClick={() => setMobileScreen(9)} className={`p-2 rounded text-left border ${mobileScreen === 9 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>9. AR HUD Evac Navigation</button>
              <button onClick={() => setMobileScreen(10)} className={`p-2 rounded text-left border ${mobileScreen === 10 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>10. Mesh Helmet Network</button>
              <button onClick={() => setMobileScreen(11)} className={`p-2 rounded text-left border ${mobileScreen === 11 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>11. SOS Panic Trigger</button>
              <button onClick={() => setMobileScreen(12)} className={`p-2 rounded text-left border ${mobileScreen === 12 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>12. Incident Flag History</button>
              <button onClick={() => setMobileScreen(13)} className={`p-2 rounded text-left border ${mobileScreen === 13 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>13. Worker Profile page</button>
              <button onClick={() => setMobileScreen(14)} className={`p-2 rounded text-left border ${mobileScreen === 14 ? 'bg-mine-cyan text-black border-mine-cyan' : 'bg-[#132235] text-mine-textMuted border-[rgba(0,212,255,0.08)]'}`}>14. Language & Haptic Settings</button>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-3 text-xs font-mono text-mine-textMuted bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)]">
            <span className="text-mine-cyan font-bold text-[10px] block uppercase flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-mine-cyan" />
              Integrated Speech Engine
            </span>
            <p>
              Voice Assistant triggers standard web speech utterance components. If active on your browser, clicking the voice command indicators will synthesize audible speech confirmations directly to the user!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
