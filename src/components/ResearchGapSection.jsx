import React from 'react';
import { BookOpen, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export default function ResearchGapSection() {
  return (
    <section id="research-gap" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>RESEARCH &amp; ACADEMIC CONTEXT</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            THE RESEARCH GAP WE SOLVE
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Why existing pipeline robots fail in flash-flood emergencies, and what makes AQUA-SHIELD unique.
          </p>
        </div>

        {/* 3-Part Comparative Cards (Existing vs Limitation vs Solution) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Existing Systems */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono mb-4">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>STATE OF THE ART</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                Existing Industrial Systems
              </h3>

              <p className="text-base text-slate-300 leading-relaxed mb-6">
                Commercial sewer crawlers (CUES, IBAK, Inuktun) excel at scheduled CCTV structural audits inside dry, cleared conduits.
              </p>

              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2.5 mt-2 shrink-0"></span>
                  <span>Heavy 15–40 kg tractor chassis requiring truck cranes</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2.5 mt-2 shrink-0"></span>
                  <span>Costs ₹5,00,000 to ₹25,00,000+ per unit</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2.5 mt-2 shrink-0"></span>
                  <span>Primarily visual cameras with no hydrodynamic flow sensing</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs font-mono text-slate-500">
              Built for routine maintenance, not emergency disaster response.
            </div>
          </div>

          {/* Card 2: The Critical Limitation */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#1c0e12] to-[#0f0709] border border-rose-500/30 flex flex-col justify-between shadow-lg">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-mono mb-4">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>UNMET CHALLENGE</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                The Flash Flood Blindspot
              </h3>

              <p className="text-base text-rose-200/90 leading-relaxed mb-6">
                During sudden monsoon deluge, urban stormwater channels choke with debris. Municipalities cannot deploy heavy crawlers due to rapid flooding and risk of equipment loss.
              </p>

              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm italic leading-relaxed">
                “When drains flood, workers are forced to enter hazardous culverts blindly or wait days while streets remain submerged.”
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-900/40 text-xs font-mono text-rose-400">
              Result: Extreme human risk and municipal paralysis.
            </div>
          </div>

          {/* Card 3: AQUA-SHIELD Gap Solved */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#081f2a] to-[#051118] border-2 border-cyan-400/60 ring-1 ring-cyan-400/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold mb-4">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>OUR CONTRIBUTION</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 font-heading">
                AQUA-SHIELD Solution
              </h3>

              <p className="text-base text-cyan-100 leading-relaxed mb-6 font-medium">
                A rapid-deploy, lightweight reconnaissance capsule designed to pinpoint blockages within minutes before any human worker is put in danger.
              </p>

              <ul className="space-y-3 text-sm text-cyan-100">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>&lt; 2.5 kg Portable:</strong> 2-person team can launch within 60 seconds</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>Sensor Fusion:</strong> Current + Flow + IMU quantify hydraulic choke</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>Guaranteed Return:</strong> Active servo anchor + 30m mechanical tether</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mr-2.5 mt-0.5 shrink-0" />
                  <span><strong>Affordable:</strong> ₹8,250 prototype allows wide municipal adoption</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-cyan-800/60 text-xs font-mono text-cyan-300 font-bold">
              Worker safety verified before physical entry.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
