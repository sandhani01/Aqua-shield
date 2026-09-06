import React from 'react';
import { roadmapPhases } from '../data/roadmapPhases';
import { 
  GitMerge, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Rocket 
} from 'lucide-react';

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 13 // FUTURE DEVELOPMENT ROADMAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Engineering <span className="text-cyan-400">Roadmap</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From our current Smart India Hackathon student prototype to an enterprise municipal stormwater fleet platform.
          </p>
        </div>

        {/* 6-Phase Vertical / Grid Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapPhases.map((phase, idx) => (
            <div
              key={phase.phase}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                phase.active
                  ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900/90 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)] relative'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded ${
                    phase.active
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {phase.phase}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    phase.active
                      ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}>
                    {phase.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white font-heading mb-1">
                  {phase.title}
                </h3>
                <div className="text-xs font-mono text-cyan-400 mb-4">
                  {phase.cost}
                </div>

                {/* Milestones List */}
                <ul className="space-y-2 text-xs">
                  {phase.milestones.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5 ${
                        phase.active ? 'text-cyan-400' : 'text-slate-600'
                      }`} />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Tag */}
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{phase.badge}</span>
                {phase.active && (
                  <span className="text-cyan-400 font-bold flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1 animate-ping"></span>
                    ACTIVE TESTING
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
