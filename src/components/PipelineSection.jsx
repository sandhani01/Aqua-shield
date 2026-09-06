import React, { useState } from 'react';
import { pipelineStages } from '../data/pipelineStages';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Compass, 
  Sliders,
  ChevronRight
} from 'lucide-react';

export default function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto playback loop for demo mode
  React.useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % pipelineStages.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = pipelineStages[activeStep];

  return (
    <section id="pipeline" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 03 // HOW IT WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            8-Stage Autonomous <span className="text-cyan-400">Inspection Pipeline</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Click through any stage below to inspect the real-time sensor processing, subsystem engagement, and deterministic safety checks that occur underground.
          </p>

          {/* Autoplay Controls */}
          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 transition-colors shadow"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Pause Auto Tour
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Auto-Cycle Stages
                </>
              )}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setActiveStep(0); }}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset to Stage 1
            </button>
          </div>
        </div>

        {/* 8-Stage Interactive Horizontal Stepper */}
        <div className="mb-10 overflow-x-auto pb-4 pt-2">
          <div className="flex items-center justify-between min-w-[760px] relative px-4">
            
            {/* Connecting Progress Line */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-800 -z-0"></div>
            <div 
              className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500 -z-0"
              style={{ width: `${(activeStep / (pipelineStages.length - 1)) * 92}%` }}
            ></div>

            {pipelineStages.map((stage, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => { setIsPlaying(false); setActiveStep(idx); }}
                  className="relative z-10 flex flex-col items-center group focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-400 text-slate-950 scale-125 ring-4 ring-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.7)]'
                      : isPassed
                      ? 'bg-cyan-950 border-2 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-2 border-slate-700 text-slate-500 group-hover:border-slate-500'
                  }`}>
                    {stage.step}
                  </div>
                  <span className={`mt-3 text-[11px] font-mono tracking-wider transition-colors ${
                    isActive ? 'text-cyan-300 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {stage.title.split('. ')[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Display Panel */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0d1629] to-[#070d1a] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                {current.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {current.title}
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              SUBTITLE: <span className="text-cyan-400">{current.subtitle}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            {current.description}
          </p>

          {/* Action Prompt Banner */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 mb-6">
            <div className="flex items-center space-x-2 text-xs text-cyan-300 font-mono">
              <Activity className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>STAGE ACTION PROMPT:</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              {current.actionPrompt}
            </p>
          </div>

          {/* Subsystems & Telemetry Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Active Telemetry Focus */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>ACTIVE TELEMETRY STREAM</span>
              </div>
              <p className="text-xs font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded border border-slate-800/80">
                {current.telemetryFocus}
              </p>
            </div>

            {/* Active Hardware Modules */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>ENGAGED HARDWARE SUBSYSTEMS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.hardwareActive.map((hw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-[10px] font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-cyan-400" />
                    {hw}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Scrubber Buttons */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              disabled={activeStep === 0}
              onClick={() => { setIsPlaying(false); setActiveStep(prev => Math.max(0, prev - 1)); }}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 hover:border-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-slate-300"
            >
              ← Prev Stage
            </button>
            <div className="text-xs font-mono text-slate-400">
              Stage {activeStep + 1} of 8
            </div>
            <button
              disabled={activeStep === pipelineStages.length - 1}
              onClick={() => { setIsPlaying(false); setActiveStep(prev => Math.min(pipelineStages.length - 1, prev + 1)); }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next Stage →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
