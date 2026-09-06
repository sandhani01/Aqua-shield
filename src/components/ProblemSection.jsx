import React from 'react';
import { 
  CloudRain, 
  Trash2, 
  Waves, 
  HelpCircle, 
  UserX, 
  AlertTriangle, 
  ArrowDown, 
  Biohazard, 
  EyeOff, 
  Skull 
} from 'lucide-react';

export default function ProblemSection() {
  const steps = [
    {
      id: 1,
      title: "Heavy Rain",
      subtitle: "Precipitation & Flash Runoff",
      icon: CloudRain,
      desc: "Torrential monsoon downpours generate high-velocity surface stormwater runoff, sweeping debris from streets into underground channels.",
      badge: "TRIGGER",
      color: "border-sky-500/40 text-sky-400 bg-sky-950/20"
    },
    {
      id: 2,
      title: "Drain Blockage",
      subtitle: "Debris Choke Accumulation",
      icon: Trash2,
      desc: "Plastic bags, construction silt, timber, and domestic garbage coalesce at pipe joints and culvert narrowing points, forming an impenetrable dam.",
      badge: "BOTTLENECK",
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20"
    },
    {
      id: 3,
      title: "Flooded / Dark Passage",
      subtitle: "Subterranean Impoundment",
      icon: Waves,
      desc: "Water backs up behind the obstruction, completely inundating long underground stretches in pitch darkness with zero natural illumination.",
      badge: "ENVIRONMENT",
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/20"
    },
    {
      id: 4,
      title: "Unknown Conditions",
      subtitle: "Hidden Lethal Hazards",
      icon: HelpCircle,
      desc: "Nobody knows the water depth, pipe structural collapse status, accumulated toxic gases (H2S/CH4), or whether water pressure will suddenly burst.",
      badge: "UNCERTAINTY",
      color: "border-purple-500/40 text-purple-400 bg-purple-950/20"
    },
    {
      id: 5,
      title: "Worker Exposure",
      subtitle: "Unacceptable Human Risk",
      icon: UserX,
      desc: "Sanitation workers are sent in blindly with makeshift ropes or rods, exposed to deadly toxic fumes, submerged sharp rebar, and drowning traps.",
      badge: "CRITICAL RISK",
      color: "border-red-500/50 text-red-400 bg-red-950/30"
    }
  ];

  const hazards = [
    {
      icon: Biohazard,
      title: "Toxic Gas Accumulation",
      desc: "Anaerobic breakdown of organic sludge produces hydrogen sulfide (H2S) and methane (CH4), capable of causing unconsciousness within seconds."
    },
    {
      icon: EyeOff,
      title: "Zero Optical Visibility",
      desc: "Stormwater turbidity and suspended clay particles render standard handheld flashlights useless beyond 10–20 cm."
    },
    {
      icon: Skull,
      title: "Sudden Hydrodynamic Bursts",
      desc: "Debris dams impound thousands of liters of pressurized stormwater that can unexpectedly rupture and sweep a human worker downline."
    }
  ];

  return (
    <section id="problem" className="relative py-20 md:py-28 bg-[#070b16] border-t border-cyan-950/80">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none"></div>
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-mono uppercase mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>SECTION 01 // CRITICAL HUMAN SAFETY HAZARD</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Why Drain Inspection Needs a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">First Responder</span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            After heavy rainfall, drainage passages can become blocked by plastic, garbage, leaves, mud and construction debris. The blockage may be located deep inside a narrow flooded passage, making direct inspection difficult.
          </p>
        </div>

        {/* Visual Process Flow: Rain -> Blockage -> Flooded Passage -> Unknown Conditions -> Worker Exposure */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              The Cascading Danger Sequence (Pre-Inspection Chain)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex flex-col">
                  <div className={`flex-1 p-5 rounded-xl border ${step.color} backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg`}>
                    
                    {/* Step Number Watermark */}
                    <span className="absolute top-2 right-3 text-4xl font-black font-mono opacity-10 text-white">
                      0{step.id}
                    </span>

                    {/* Badge */}
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider mb-3 bg-black/40 border border-white/10 uppercase">
                      {step.badge}
                    </div>

                    {/* Icon */}
                    <div className="mb-3">
                      <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/10">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-base font-bold text-white font-heading mb-1">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mb-2">
                      {step.subtitle}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Down Arrow for mobile / Right Arrow for desktop */}
                  {idx < steps.length - 1 && (
                    <div className="my-2 md:my-0 md:absolute md:top-1/2 md:-right-3 md:-translate-y-1/2 z-20 flex justify-center text-slate-500">
                      <div className="p-1 rounded-full bg-[#050811] border border-slate-700 shadow">
                        <ArrowDown className="w-3.5 h-3.5 md:-rotate-90 text-cyan-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner: The Real Problem */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0d1527] to-red-950/40 border-2 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)] text-center my-10">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase bg-red-950/80 px-3 py-1 rounded-full border border-red-700/60 inline-block mb-3">
              THE REAL PROBLEM
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-heading leading-snug">
              “Workers may need to approach an unknown flooded environment before knowing what is inside or where the blockage is.”
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Without preliminary unmanned exploration, sanitation teams enter blind—risking lives for simple exploratory reconnaissance.
            </p>
          </div>
        </div>

        {/* Hazard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {hazards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-red-500/40 transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
