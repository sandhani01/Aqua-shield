import React from 'react';
import { Waves, Trash2, UserX, AlertTriangle } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      id: "flooding",
      title: "FLOODING",
      subtitle: "Murky water, sudden flow and hidden hazards",
      icon: Waves,
      desc: "Flash stormwater surges create submerged, turbulent conditions where visibility drops to zero and water pressure backs up rapidly.",
      accent: "border-sky-500/40 text-sky-400 bg-sky-950/20"
    },
    {
      id: "blockages",
      title: "BLOCKAGES",
      subtitle: "Plastic, silt, debris and sediment obstruct drainage",
      icon: Trash2,
      desc: "Household trash, plastic sacks, and construction silt form impenetrable underground dams that choke conduit aperture up to 85%.",
      accent: "border-amber-500/40 text-amber-400 bg-amber-950/20"
    },
    {
      id: "human-risk",
      title: "HUMAN RISK",
      subtitle: "Workers may have to enter confined, unstable passages",
      icon: UserX,
      desc: "Sending sanitation workers blindly into toxic, contaminated pipes risks fatal asphyxiation from toxic gases and drowning traps.",
      accent: "border-red-500/40 text-red-400 bg-red-950/20"
    }
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>THE REAL-WORLD PROBLEM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            THE PROBLEM
          </h2>

          <p className="text-xl sm:text-2xl font-bold text-slate-200 leading-snug">
            “Workers should not be the first responders inside flooded drains.”
          </p>
        </div>

        {/* 3 Large Visual Blocks (Prominent & Clean) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.id}
                className="p-8 rounded-2xl bg-gradient-to-b from-[#0a1224] to-[#060c18] border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-inner ${p.accent}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-2xl font-black tracking-wide text-white mb-2 font-heading">
                    {p.title}
                  </h3>

                  <p className="text-base font-bold text-slate-300 mb-3 leading-snug">
                    {p.subtitle}
                  </p>

                  <p className="text-base text-slate-400 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Strong Bottom Statement (Judge Callout) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-red-950/40 border border-red-500/40 text-center shadow-lg">
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-relaxed">
            “Today, inspection often begins with a <span className="text-red-400 underline decoration-red-500/50 underline-offset-8">human entering the danger zone</span>.”
          </p>
        </div>

      </div>
    </section>
  );
}
