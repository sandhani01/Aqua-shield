import React from 'react';
import { ShieldCheck, Zap, Coins, Cpu, Award } from 'lucide-react';

export default function ComparisonSection() {
  const pillars = [
    {
      id: "safer",
      title: "SAFER",
      tagline: "Keep workers out of dangerous passages.",
      desc: "Zero human exposure to toxic H2S/CH4 sewer gas pockets, structural collapse, or high-pressure flood bursts.",
      icon: ShieldCheck,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
    },
    {
      id: "faster",
      title: "FASTER",
      tagline: "Locate blockages before manual inspection.",
      desc: "Rotary encoder pinpoints exact downline blockage coordinates (e.g. 27.0 m) in under 4 minutes.",
      icon: Zap,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/20"
    },
    {
      id: "cheaper",
      title: "CHEAPER",
      tagline: "Target prototype cost: ₹7,000–₹10,000.",
      desc: "Built for ₹8,250 using accessible off-the-shelf parts, replacing ₹15L+ imported crawler rigs.",
      icon: Coins,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20"
    },
    {
      id: "scalable",
      title: "SCALABLE",
      tagline: "Designed using commercially available components.",
      desc: "COTS hardware and open ESP32 architecture ensure municipal teams can assemble, repair, and deploy fleets locally.",
      icon: Cpu,
      color: "border-blue-500/40 text-blue-400 bg-blue-950/20"
    }
  ];

  return (
    <section id="impact" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>VALUE PROPOSITION &amp; IMPACT</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            WHY AQUA-SHIELD?
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal">
            Four core engineering advantages that protect worker lives and streamline municipal drain maintenance.
          </p>
        </div>

        {/* 4 Large Columns (Prominent & Clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.id}
                className="p-8 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xl group"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-inner ${p.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2 font-heading tracking-wide">
                    {p.title}
                  </h3>

                  <p className="text-base font-bold text-cyan-300 mb-3 leading-snug">
                    {p.tagline}
                  </p>

                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
