import React from 'react';
import { useCases } from '../data/useCases';
import { 
  CloudRain, 
  ShieldAlert, 
  Truck, 
  Factory, 
  Building2, 
  HardHat, 
  ArrowRight, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

const iconMap = {
  CloudRain,
  ShieldAlert,
  Truck,
  Factory,
  Building2,
  HardHat
};

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 10 // REAL-WORLD DEPLOYMENT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Field Applications & <span className="text-cyan-400">Deployment Scenarios</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            From urban monsoon storm channels to low-clearance highway culverts, AQUA-SHIELD delivers rapid unmanned reconnaissance across diverse drainage environments.
          </p>
        </div>

        {/* 6 Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => {
            const Icon = iconMap[uc.icon] || CloudRain;
            return (
              <div
                key={uc.id}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      CASE 0{uc.id}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white font-heading mb-1 group-hover:text-cyan-300 transition-colors">
                    {uc.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/80 mb-4">
                    {uc.subtitle}
                  </div>

                  {/* Problem -> Action -> Benefit Flow */}
                  <div className="space-y-3 text-xs">
                    
                    {/* Problem */}
                    <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40">
                      <div className="text-[10px] font-mono text-red-400 font-bold uppercase mb-0.5">
                        PROBLEM
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {uc.problem}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-0.5">
                        AQUA-SHIELD ACTION
                      </div>
                      <p className="text-slate-300 leading-snug">
                        {uc.action}
                      </p>
                    </div>

                    {/* Benefit */}
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-0.5">
                        TANGIBLE BENEFIT
                      </div>
                      <p className="text-slate-200 leading-snug font-medium">
                        {uc.benefit}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>UNMANNED RECONNAISSANCE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
