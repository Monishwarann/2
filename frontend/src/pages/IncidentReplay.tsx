import React, { useEffect, useRef } from 'react';
import { useMineStore } from '../stores/mineStore';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export const IncidentReplay: React.FC = () => {
  const {
    replayFrames,
    isReplaying,
    replayIndex,
    startReplay,
    stopReplay,
    setReplayIndex,
    accidentTriggered
  } = useMineStore();

  const playIntervalRef = useRef<any | null>(null);

  // Handle auto-playing of frames
  useEffect(() => {
    if (isReplaying) {
      playIntervalRef.current = setInterval(() => {
        if (replayIndex < replayFrames.length - 1) {
          setReplayIndex(replayIndex + 1);
        } else {
          stopReplay();
        }
      }, 800);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isReplaying, replayIndex, replayFrames.length, setReplayIndex, stopReplay]);

  const currentFrame = replayFrames[replayIndex];

  return (
    <div className="p-6 space-y-6 flex-1 overflow-y-auto font-sans">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-wider font-mono text-[#E8F4FD]">
          AI Incident Replay Console
        </h2>
        <p className="text-xs text-mine-textMuted uppercase mt-1">
          Historical event tracing, timeline scrubbing, and post-accident decision investigations
        </p>
      </div>

      {replayFrames.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center font-mono max-w-xl mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 text-mine-amber mx-auto animate-bounce" />
          <h3 className="font-bold text-[#E8F4FD] uppercase">No Incident History Recorded</h3>
          <p className="text-xs text-mine-textMuted leading-relaxed">
            The event log is currently empty. To record safety logs, go to the top bar dashboard controls, click <b>"Engage Simulation"</b> and click <b>"Trigger Accident"</b> to simulate toxic propagation frames.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 items-start">
          
          {/* Main timeline visualizer */}
          <div className="col-span-2 space-y-6">
            
            {/* 2D Mini Map Frame */}
            <div className="glass-card rounded-xl p-5 relative overflow-hidden flex flex-col justify-between aspect-video bg-black/40 border border-[rgba(0,212,255,0.15)]">
              
              <div className="absolute inset-0 grid-bg opacity-30" />

              {/* Title Overlay */}
              <div className="flex justify-between items-center z-10 font-mono text-xs border-b border-[rgba(0,212,255,0.1)] pb-2 mb-2">
                <span className="text-[#E8F4FD] font-bold">REPLAY SNAPSHOT</span>
                <span className="text-mine-cyan font-semibold">Frame: {replayIndex + 1} / {replayFrames.length}</span>
              </div>

              {/* Position Nodes representation */}
              <div className="relative flex-1 w-full">
                {currentFrame && Object.entries(currentFrame.workerPositions).map(([workerId, pos]) => {
                  let color = 'bg-[#00E676] shadow-glowGreen';
                  if (pos.status === 'Critical') color = 'bg-[#FF3B30] shadow-glowRed';
                  else if (pos.status === 'Evacuating') color = 'bg-orange-500';

                  return (
                    <div
                      key={workerId}
                      className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 ${color}`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      title={`Worker ${workerId}`}
                    />
                  );
                })}
              </div>

              {/* Frame Telemetry Status bar */}
              {currentFrame && (
                <div className="p-3 bg-black/80 rounded border border-[rgba(0,212,255,0.1)] text-[10px] font-mono text-mine-textMuted z-10 flex justify-between">
                  <span>Timestamp: {currentFrame.timestamp}</span>
                  <span>Active Alarms: {currentFrame.activeAlarms.length > 0 ? currentFrame.activeAlarms.join(', ') : 'None'}</span>
                </div>
              )}

            </div>

            {/* Playback Controls and Timeline Slider */}
            <div className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isReplaying ? (
                    <button
                      onClick={stopReplay}
                      className="px-4 py-2 bg-orange-700 hover:bg-orange-600 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 text-white"
                    >
                      <Pause className="w-4 h-4" />
                      Pause Replay
                    </button>
                  ) : (
                    <button
                      onClick={startReplay}
                      className="px-4 py-2 bg-[#00D4FF] hover:bg-cyan-400 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 text-black shadow-glowCyan"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      Play Replay
                    </button>
                  )}

                  <button
                    onClick={() => setReplayIndex(0)}
                    className="p-2 bg-[#1B263B] text-mine-textMuted hover:text-white rounded border border-[rgba(0,212,255,0.1)]"
                    title="Rewind to start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs font-mono text-mine-textMuted">
                  Scrubber: Frame {replayIndex + 1}
                </div>
              </div>

              {/* Scrubber slider */}
              <input
                type="range"
                min={0}
                max={replayFrames.length - 1}
                value={replayIndex}
                onChange={(e) => setReplayIndex(Number(e.target.value))}
                className="w-full bg-[#132235] h-2 rounded-lg appearance-none cursor-pointer focus:outline-none accent-mine-cyan"
              />

            </div>

          </div>

          {/* Incident events log */}
          <div className="col-span-1 space-y-4">
            
            <div className="glass-card rounded-xl p-5 space-y-4 font-mono text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-mine-cyan border-b border-[rgba(0,212,255,0.1)] pb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Safety Incident Log
              </h3>

              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {accidentTriggered ? (
                  <>
                    <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg">
                      <span className="text-[10px] text-mine-red font-bold uppercase block mb-1">T + 12s - Evac Route Engaged</span>
                      DEDP dynamic calculations pushed safe routes directly to helmet vibration motors.
                    </div>
                    <div className="p-2.5 bg-orange-950/40 border border-orange-500/30 rounded-lg">
                      <span className="text-[10px] text-orange-400 font-bold uppercase block mb-1">T + 8s - CMARI Consensus</span>
                      Helmets locally resolved toxic gas plume expansion vector to be heading East.
                    </div>
                    <div className="p-2.5 bg-yellow-950/30 border border-yellow-500/20 rounded-lg">
                      <span className="text-[10px] text-mine-amber font-bold uppercase block mb-1">T + 4s - Fall Detected</span>
                      Worker W-103 accelerometer reported vertical drop event in West Shaft.
                    </div>
                  </>
                ) : null}

                <div className="p-2.5 bg-green-950/20 border border-green-500/20 rounded-lg text-mine-green">
                  <span className="text-[10px] font-bold uppercase block mb-1">T + 0s - System Synced</span>
                  All 10 helmet agents report baseline parameters. Mesh communication health optimal.
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 font-mono text-xs text-mine-textMuted bg-[rgba(5,11,24,0.4)] border border-[rgba(0,212,255,0.08)] flex items-center gap-3">
              <Cpu className="w-8 h-8 text-mine-cyan shrink-0" />
              <div>
                <span className="font-bold text-[#E8F4FD] block">Inference Replay Spec</span>
                Replays full network configurations, packet logs, and telemetry states for mining incident investigations.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
