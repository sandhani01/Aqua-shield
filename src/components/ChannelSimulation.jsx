import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  ArrowRight,
  Anchor,
  Compass
} from 'lucide-react';

export default function ChannelSimulation() {
  const [position, setPosition] = useState(25.4); // Current position in meters
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState('forward'); // 'forward' or 'return'

  // Automated animation loop across the 30m channel
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition((prev) => {
          if (direction === 'forward') {
            if (prev >= 25.4) {
              // Reached blockage! Pause briefly, then return
              setDirection('return');
              return 25.4;
            }
            return +(prev + 0.5).toFixed(1);
          } else {
            if (prev <= 0) {
              // Reached return point!
              setIsPlaying(false);
              setDirection('forward');
              return 0.0;
            }
            return +(prev - 0.6).toFixed(1);
          }
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  const isAtBlockage = position >= 25.0;
  const isReturning = direction === 'return';

  // Calculate percentage along 30m pipe (0m = 4%, 30m = 96%)
  const percentage = Math.min(94, Math.max(4, (position / 30) * 90 + 4));

  return (
    <section id="channel-demo" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 08 // CONTROLLED CHANNEL DEMONSTRATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            30-Metre Inspection <span className="text-cyan-400">Demonstration</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Transparent side-view cutaway of our 20–30 m controlled testbed channel. Watch AQUA-SHIELD traverse flooded stormwater, detect the debris dam at 25.4 m, and safely reverse back to the entry point.
          </p>

          {/* Honest SIH Disclaimer Banner */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Info className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>Prototype target: controlled 20–30 m demonstration channel (Non-field-certified student prototype).</span>
          </div>

          {/* Playback Controls */}
          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={() => {
                if (position >= 25.4 && direction === 'forward') {
                  setDirection('return');
                } else if (position <= 0 && direction === 'return') {
                  setDirection('forward');
                }
                setIsPlaying(!isPlaying);
              }}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-1.5 fill-slate-950" /> Pause Traverse
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5 fill-slate-950" /> {position >= 25.4 ? "Run Return (25.4m → 0m)" : "Run Full Traverse (0m → 25.4m → 0m)"}
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setDirection('forward');
                setPosition(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 inline" /> Reset to Entry (0m)
            </button>
          </div>
        </div>

        {/* 30-Metre Transparent Pipe Cutaway Simulator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Top Status Indicators */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400 font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping"></span>
                CHANNEL: TRANSPARENT ACRYLIC TESTBED (400mm DIAMETER)
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">
                TRAVEL DISTANCE: <span className="text-white font-bold text-sm">{position.toFixed(1)} m</span> / 30.0 m
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                isAtBlockage
                  ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                  : isReturning
                  ? 'bg-blue-950 text-blue-300 border border-blue-500'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
              }`}>
                {isAtBlockage ? '🔴 BLOCKAGE REACHED (25.4m)' : isReturning ? '⚓ CONTROLLED TETHER RETRIEVAL' : '🟢 STEADY ADVANCE'}
              </span>
            </div>
          </div>

          {/* Pipe Channel Cutaway Graphic */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-[#070e1c] to-[#040813] border-y-4 border-slate-700 overflow-hidden shadow-inner my-4">
            
            {/* Water Inundation Level */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-950/70 via-blue-950/50 to-cyan-900/20 border-t border-cyan-500/30">
              {/* Subtle water ripple overlay */}
              <div className="w-full h-1 bg-cyan-400/20 animate-pulse"></div>
            </div>

            {/* Silt & Sediment Deposit on Pipe Invert */}
            <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#2a1a0a] to-[#120a02] border-t border-amber-900/40"></div>

            {/* Distance Milestone Vertical Grid Lines */}
            <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
              
              {/* 0m Entry Manhole */}
              <div className="h-full border-r border-dashed border-cyan-500/30 flex flex-col justify-between py-2 text-[10px] font-mono text-cyan-300">
                <span className="bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">ENTRY (0 m)</span>
                <span className="text-slate-500">MANHOLE</span>
              </div>

              {/* 5m */}
              <div className="h-full border-r border-dashed border-slate-800 flex flex-col justify-between py-2 text-[10px] font-mono text-slate-500">
                <span>5 m</span>
                <span>CLEAR</span>
              </div>

              {/* 10m */}
              <div className="h-full border-r border-dashed border-slate-800 flex flex-col justify-between py-2 text-[10px] font-mono text-slate-500">
                <span>10 m</span>
                <span>CLEAR</span>
              </div>

              {/* 20m Warning */}
              <div className="h-full border-r border-dashed border-amber-500/40 flex flex-col justify-between py-2 text-[10px] font-mono text-amber-400">
                <span className="bg-amber-950/80 px-1 py-0.5 rounded">20 m</span>
                <span className="text-amber-500">WARNING</span>
              </div>

              {/* 25.4m Blockage Line */}
              <div className="h-full border-r-2 border-dashed border-red-500 flex flex-col justify-between py-2 text-[10px] font-mono text-red-400">
                <span className="bg-red-950 px-1.5 py-0.5 rounded border border-red-600 font-bold animate-pulse">
                  25.4 m
                </span>
                <span className="text-red-400 font-bold">CHOKE DAM</span>
              </div>

              {/* 30m End */}
              <div className="h-full flex flex-col justify-between py-2 text-[10px] font-mono text-slate-600">
                <span>30 m</span>
                <span>TERMINUS</span>
              </div>

            </div>

            {/* Blockage Graphic at 25.4m */}
            <div className="absolute right-[12%] bottom-5 top-12 w-12 bg-gradient-to-l from-amber-950/90 via-red-950/80 to-amber-900/60 rounded-lg border-2 border-red-500/80 flex flex-col items-center justify-center p-1 shadow-[0_0_25px_rgba(239,68,68,0.5)] z-10">
              <ShieldAlert className="w-5 h-5 text-red-400 mb-1" />
              <div className="text-[9px] font-mono font-bold text-red-200 text-center leading-tight">
                DEBRIS CHOKE
              </div>
              <div className="text-[7px] font-mono text-amber-300 text-center mt-1">
                PLASTICS + SILT
              </div>
            </div>

            {/* AQUA-SHIELD Capsule Moving Node */}
            <div
              style={{ left: `${percentage}%` }}
              className="absolute bottom-10 -translate-x-1/2 z-20 transition-all duration-150 ease-linear"
            >
              <div className="relative flex items-center">
                
                {/* Forward Illumination Beam (only shines forward when moving forward) */}
                {!isReturning && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-32 h-20 bg-gradient-to-r from-cyan-400/40 via-cyan-300/10 to-transparent clip-path-beam pointer-events-none"></div>
                )}

                {/* Capsule Body */}
                <div className={`w-16 h-8 rounded-full border-2 flex items-center justify-between px-2 shadow-xl ${
                  isAtBlockage
                    ? 'bg-red-950/90 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                    : isReturning
                    ? 'bg-blue-950/90 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                    : 'bg-[#0a152d] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.6)]'
                }`}>
                  {/* Front Lens */}
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 border border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
                  </div>

                  {/* Body Label */}
                  <span className="text-[7px] font-mono font-bold text-white tracking-tighter">
                    AQ-S
                  </span>

                  {/* Rear Thrusters */}
                  <div className="w-1.5 h-3 bg-cyan-400/60 rounded-sm"></div>
                </div>

                {/* Deployed Anchor Graphic if at blockage */}
                {isAtBlockage && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 flex flex-col items-center">
                    <Anchor className="w-4 h-4 animate-bounce" />
                    <span className="text-[8px] font-mono bg-amber-950 px-1 rounded border border-amber-600">
                      ANCHOR
                    </span>
                  </div>
                )}

                {/* Tether Umbilical trailing behind to 0m */}
                <div 
                  className="absolute right-full top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-l from-cyan-400 via-cyan-500/50 to-transparent pointer-events-none"
                  style={{ width: `${(percentage / 100) * 800}px` }}
                ></div>

              </div>
            </div>

          </div>

          {/* Interactive Range Scrubber */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span>Manual Position Scrubber:</span>
              <input
                type="range"
                min="0"
                max="30"
                step="0.1"
                value={position}
                onChange={(e) => {
                  setIsPlaying(false);
                  setPosition(parseFloat(e.target.value));
                }}
                className="w-48 sm:w-64 accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-300 font-bold w-12">{position.toFixed(1)}m</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Traverse Sequence:</span>
              <span className="text-cyan-300 font-semibold">
                ENTRY (0m) → 5m → 10m → 20m → 25.4m (STOP) → RETURN (0m)
              </span>
            </div>
          </div>

          {/* Status Breakdown at 25.4m */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">OPTICAL TELEMETRY</div>
              <div className="text-xs font-bold text-white mt-1">
                {isAtBlockage ? "🔴 Debris dam visually confirmed by wide-angle camera" : "🟢 Water line clear, pipe wall intact"}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">MOTOR LOAD RESPONSE</div>
              <div className="text-xs font-bold text-white mt-1">
                {isAtBlockage ? "🔴 Current surged to 910 mA (Motor stall risk detected)" : "🟢 Baseline current 240 mA (Nominal cruising)"}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">DASHBOARD ACTION</div>
              <div className="text-xs font-bold text-white mt-1">
                {isAtBlockage ? "🔴 Blockage alert broadcasted; anchor engaged for retrieval" : "🟢 Telemetry streamed; inspection progress active"}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
