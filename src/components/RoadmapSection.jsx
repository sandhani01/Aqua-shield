import React, { useState } from 'react';
import { roadmapPhases } from '../data/roadmapPhases';
import { Milestone, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function RoadmapSection() {
  const [expandedPhase, setExpandedPhase] = useState(0); // Phase 1 open by default

  return (
    <section id="roadmap" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Milestone className="w-4 h-4 text-cyan-400" />
            <span>PROGRESSION PIPELINE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            DEVELOPMENT ROADMAP
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            From our current Smart India Hackathon student prototype to an enterprise municipal stormwater fleet.
          </p>
        </div>

        {/* 6-Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmapPhases.map((phase, idx) => {
            const isExpanded = expandedPhase === idx;
            return (
              <div
                key={phase.phase}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-lg ${
                  phase.active
                    ? 'bg-gradient-to-b from-[#0e1d38] to-[#081224] border-cyan-400 ring-1 ring-cyan-400/40'
                    : 'bg-gradient-to-b from-[#091122] to-[#060b18] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-full ${
                        phase.active
                          ? 'bg-cyan-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {phase.phase}
                      </span>
                      {phase.active && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-semibold">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>CURRENT STAGE</span>
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs font-mono text-slate-400">
                      {phase.status}
                    </span>
                  </div>

                  {/* Phase Title */}
                  <h3 className="text-xl font-bold text-white mb-2 font-heading tracking-wide">
                    {phase.title}
                  </h3>

                  {/* Target Cost */}
                  <div className="text-sm font-mono font-semibold text-cyan-300 mb-4">
                    {phase.cost}
                  </div>

                  {/* Key Milestones */}
                  <div className="space-y-2">
                    {/* Always show the first milestone */}
                    <div className="flex items-start text-sm text-slate-200">
                      <CheckCircle2 className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${
                        phase.active ? 'text-cyan-400' : 'text-slate-500'
                      }`} />
                      <span className="leading-snug">{phase.milestones[0]}</span>
                    </div>

                    {/* Show more if expanded */}
                    {isExpanded && phase.milestones.slice(1).map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start text-sm text-slate-300 pt-1.5 animate-fadeIn">
                        <CheckCircle2 className={`w-4 h-4 mr-2 flex-shrink-0 mt-0.5 ${
                          phase.active ? 'text-cyan-400' : 'text-slate-600'
                        }`} />
                        <span className="leading-snug">{m}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer / Toggle */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">
                    {phase.badge}
                  </span>

                  <button
                    onClick={() => setExpandedPhase(isExpanded ? -1 : idx)}
                    className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono font-medium transition-colors"
                  >
                    <span>{isExpanded ? 'Less' : `+${phase.milestones.length - 1} more`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
