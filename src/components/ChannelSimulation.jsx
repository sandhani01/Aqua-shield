import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Anchor,
  CheckCircle2,
  Compass,
  Activity
} from 'lucide-react';

export default function ChannelSimulation() {
  const [position, setPosition] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState('forward');

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition((prev) => {
          if (direction === 'forward') {
            if (prev >= 27.0) {
              setDirection('return');
              return 27.0;
            }
            return +(prev + 0.6).toFixed(1);
          } else {
            if (prev <= 0) {
              setIsPlaying(false);
              setDirection('forward');
              return 0.0;
            }
            return +(prev - 0.7).toFixed(1);
          }
        });
      }, 140);
    }
    return () => clearInterval(interval);
  }, [isPlaying, direction]);

  const isAtBlockage = position >= 26.4;
  const isReturning = direction === 'return';
  const percentage = Math.min(92, Math.max(4, (position / 30) * 88 + 4));

  return (
    <section id="channel-demo" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Exact Requirement: LIVE 30-METRE TEST) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>HERO PROOF // PHYSICAL BENCHMARK</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            LIVE 30-METRE TEST
          </h2>

          <p className="text-xl sm:text-2xl font-bold text-slate-200">
            “Watch AQUA-SHIELD detect a blockage and return safely.”
          </p>
        </div>

        {/* Big Telemetry Ribbon: 0 m → 27 m → 0 m */}
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-[#0a1226] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-lg font-mono">
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-slate-400">TELEMETRY CYCLE:</span>
            <span className="text-lg font-black text-cyan-400">0 m → 27.0 m → 0 m</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (position >= 27.0 && direction === 'forward') {
                  setDirection('return');
                } else if (position <= 0 && direction === 'return') {
                  setDirection('forward');
                }
                setIsPlaying(!isPlaying);
              }}
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2 fill-slate-950" /> Pause Test
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 fill-slate-950" /> {position >= 27.0 ? "Run Return (27m → 0m)" : "Run Live Test (0m → 27m → 0m)"}
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setDirection('forward');
                setPosition(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1.5 inline" /> Reset
            </button>
          </div>
        </div>

        {/* Large Prominent 30-Metre Testbed Cutaway (Significant Screen Space) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#091122] to-[#050a16] border-2 border-slate-700/80 shadow-2xl mb-8">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 font-mono text-sm">
            <div className="flex items-center space-x-3 text-slate-200">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Current Distance: <strong className="text-white text-xl font-bold font-mono">{position.toFixed(1)} m</strong> / 30.0 m</span>
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isAtBlockage
                  ? 'bg-red-950 text-red-300 border border-red-600 animate-pulse'
                  : isReturning
                  ? 'bg-sky-950 text-sky-300 border border-sky-600'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {isAtBlockage ? '⚠️ BLOCKAGE DETECTED (27.0 m)' : isReturning ? '🔄 CONTROLLED RETURN ACTIVE' : 'ADVANCING DOWNLINE'}
              </span>
            </div>
          </div>

          {/* Large Testbed Graphic (Height 260px) */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-[#040813] border-y-4 border-slate-700 overflow-hidden my-4">
            
            {/* Water Inundation Level */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-950/40 via-cyan-900/20 to-transparent border-t border-cyan-800/40"></div>

            {/* Distance Milestones */}
            <div className="absolute inset-0 flex justify-between px-6 pointer-events-none">
              <div className="h-full border-r border-dashed border-slate-800 flex flex-col justify-between py-3 text-xs font-mono text-slate-400">
                <span>0 m</span>
                <span className="font-bold text-cyan-400">Entrance</span>
              </div>
              <div className="h-full border-r border-dashed border-slate-800/60 flex flex-col justify-between py-3 text-xs font-mono text-slate-500">
                <span>10 m</span>
                <span>Clear</span>
              </div>
              <div className="h-full border-r border-dashed border-slate-800/60 flex flex-col justify-between py-3 text-xs font-mono text-slate-500">
                <span>20 m</span>
                <span>Caution</span>
              </div>
              <div className="h-full border-r-2 border-red-500 flex flex-col justify-between py-3 text-xs font-mono text-red-400">
                <span className="font-bold">27.0 m</span>
                <span className="font-bold text-red-400">BLOCKAGE</span>
              </div>
              <div className="h-full flex flex-col justify-between py-3 text-xs font-mono text-slate-600">
                <span>30 m</span>
                <span>End</span>
              </div>
            </div>

            {/* Silt & Trash Dam Blockage Graphic at 27.0m */}
            <div className="absolute right-[8%] bottom-4 top-10 w-14 bg-gradient-to-t from-red-950 via-amber-950 to-transparent rounded-t border-l-2 border-red-500 flex flex-col items-center justify-center p-1 z-10 shadow-2xl">
              <span className="text-[9px] font-mono text-red-300 font-black text-center leading-tight">
                BLOCKAGE 27m
              </span>
            </div>

            {/* Moving Physical 4-Wheel Capsule */}
            <div
              style={{ left: `${percentage}%` }}
              className="absolute bottom-12 -translate-x-1/2 z-20 transition-all duration-150 ease-linear"
            >
              <div className="relative flex items-center">
                {/* 4-Wheel Chassis with Transparent Dome */}
                <div className={`w-20 h-10 rounded-xl border-2 flex items-center justify-between px-2 relative shadow-2xl ${
                  isAtBlockage
                    ? 'bg-red-950 border-red-500 shadow-[0_0_20px_#ef4444]'
                    : isReturning
                    ? 'bg-sky-950 border-sky-400 shadow-[0_0_20px_#38bdf8]'
                    : 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_#06b6d4]'
                }`}>
                  {/* Transparent Dome Front */}
                  <div className="w-3.5 h-6 rounded-r-full bg-cyan-400/40 border border-cyan-300 absolute -right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  </div>
                  
                  {/* 4 Protected Wheels */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-2.5 bg-slate-950 border border-slate-600 rounded-sm"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-2.5 bg-slate-950 border border-slate-600 rounded-sm"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-2.5 bg-slate-950 border border-slate-600 rounded-sm"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-2.5 bg-slate-950 border border-slate-600 rounded-sm"></div>

                  <span className="text-[8px] font-mono font-black text-white pl-1">AQUA-SHIELD</span>
                </div>

                {/* Titanium Bed Anchor Locked */}
                {isAtBlockage && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-amber-400 flex flex-col items-center">
                    <Anchor className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* When reaches 27m: Large Result Box */}
          {isAtBlockage && (
            <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-center animate-pulse mt-4">
              <span className="text-xl sm:text-2xl font-black font-mono text-red-300 block">
                BLOCKAGE DETECTED — 27.0 m
              </span>
              <span className="text-sm font-mono text-slate-200">
                Rotary Encoder confirms exact position • Motor Current spikes to 1.8 A (High Load)
              </span>
            </div>
          )}

        </div>

        {/* 3 Proof Checklists (Exact Requirement: ✓ Detection, ✓ Decision, ✓ Controlled Return) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <div className="p-5 rounded-2xl bg-[#091122] border border-emerald-500/30 flex items-start space-x-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-lg font-bold text-white block mb-1">
                ✓ Detection Validated
              </span>
              <p className="text-base text-slate-300 leading-relaxed">
                Optical camera + ACS712 current sensor reliably confirm blockage location at 27.0 m without guessing.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091122] border border-emerald-500/30 flex items-start space-x-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-lg font-bold text-white block mb-1">
                ✓ Decision Automated
              </span>
              <p className="text-base text-slate-300 leading-relaxed">
                ESP32 cuts drive power within 20ms of stall to avoid motor burnout and protect hardware.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#091122] border border-emerald-500/30 flex items-start space-x-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-lg font-bold text-white block mb-1">
                ✓ Controlled Return
              </span>
              <p className="text-base text-slate-300 leading-relaxed">
                Mechanical bed anchor locks against stormwater rush, and the 30m tether winches the capsule safely home.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
