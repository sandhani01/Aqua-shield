import React from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';

export default function ResearchGapSection() {
  return (
    <section id="research-gap" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 14 // ACADEMIC & ENGINEERING CONTEXT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            What We Learned from <span className="text-cyan-400">Existing Systems</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Honest engineering positioning based on extensive literature review of industrial pipeline crawlers and municipal sewer maintenance equipment.
          </p>
        </div>

        {/* Two-Column Technical Gap Analysis */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Left: What Existing Systems Already Do (Honest Acknowledgement) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 uppercase mb-3">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>STATE OF THE ART REVIEW</span>
              </div>

              <h3 className="text-xl font-bold text-white font-heading mb-4">
                What Existing Inspection Systems Already Demonstrate
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed mb-4 italic">
                “Existing sewer and pipe inspection robots already demonstrate robotic inspection using cameras, sensors and autonomous/remote operation.”
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Industrial crawlers (such as CUES, IBAK, and Inuktun) prove that tracked vehicles and pan-tilt cameras can record structural defects and root intrusions in dry or partially filled sewers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Robotic inspection technology exists; the challenge lies in accessibility and timing.
            </div>
          </div>

          {/* Right: The Identified Gap AQUA-SHIELD Solves */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-cyan-950/50 to-slate-900/80 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 uppercase mb-3">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span>IDENTIFIED RESEARCH GAP</span>
              </div>

              <h3 className="text-xl font-bold text-white font-heading mb-4">
                The Critical Human-Safety Gap
              </h3>

              <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-sm text-cyan-200 font-semibold leading-relaxed mb-4">
                “Identified Gap: Existing systems mainly inspect the drain; AQUA-SHIELD goes one step further by locating the blockage, assessing operating conditions and providing fail-safe recovery before human intervention.”
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <strong>First-Responder Timing:</strong> Deployed in emergency flash flood conditions when manual scouting is too dangerous.
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <strong>Multi-Transducer Fusion:</strong> Replaces subjective video inspection with hard sensor metrics (flow velocity + current draw + inclination).
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <strong>Zero-Risk Recovery:</strong> Active servo anchor prevents equipment loss during sudden storm drain inundation.
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              Human workers enter only after preliminary reconnaissance is certified complete.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
