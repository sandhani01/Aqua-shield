import React, { useState } from 'react';
import { 
  CloudRain, 
  Waves, 
  Navigation, 
  Factory, 
  GraduationCap, 
  HardHat, 
  MapPin, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function UseCasesSection() {
  const [expandedCard, setExpandedCard] = useState(null);

  const applications = [
    {
      id: "urban-drains",
      emoji: "🌧",
      title: "URBAN DRAINS",
      oneLiner: "Detect monsoon blockages before workers enter.",
      icon: CloudRain,
      details: "Pinpoints trash accumulation at underground junction boxes, allowing municipal suction trucks to position directly above without digging entire avenues."
    },
    {
      id: "post-flood",
      emoji: "🌊",
      title: "POST-FLOOD INSPECTION",
      oneLiner: "Inspect sediment, debris and structural conditions.",
      icon: Waves,
      details: "Surveys post-cyclone silt deposition and conduit joint fractures in submerged channels to evaluate flood discharge readiness."
    },
    {
      id: "highway-culverts",
      emoji: "🛣",
      title: "HIGHWAY CULVERTS",
      oneLiner: "Inspect narrow water passages inaccessible to humans.",
      icon: Navigation,
      details: "Enters sub-meter culvert conduits passing beneath multi-lane national highways to inspect silt choke dams without closing road lanes."
    },
    {
      id: "industrial-drainage",
      emoji: "🏭",
      title: "INDUSTRIAL DRAINAGE",
      oneLiner: "Reduce exposure to hazardous effluent environments.",
      icon: Factory,
      details: "Evaluates chemical sludge and industrial discharge runoffs, protecting workers from acute hazardous chemical and fume exposure."
    },
    {
      id: "campus-drainage",
      emoji: "🏫",
      title: "CAMPUS DRAINAGE",
      oneLiner: "Affordable preventive inspection for institutions.",
      icon: GraduationCap,
      details: "Enables universities, hospitals, and tech parks to conduct periodic preventive stormwater channel scans for under ₹10,000 per unit."
    },
    {
      id: "construction-runoff",
      emoji: "🏗",
      title: "CONSTRUCTION RUNOFF",
      oneLiner: "Detect silt and debris blockages before they harden.",
      icon: HardHat,
      details: "Detects cementitious runoff, aggregate wash, and timber obstructions before they cure into permanent conduit chokes."
    }
  ];

  return (
    <section id="applications" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>DEPLOYMENT SCENARIOS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            FIELD APPLICATIONS
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal">
            A versatile inspection platform engineered for critical municipal and infrastructure channels.
          </p>
        </div>

        {/* Clean 2x3 Visual Grid (Exact Requirement: ICON, TITLE, ONE-LINE USE CASE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => {
            const isExpanded = expandedCard === app.id;
            return (
              <div 
                key={app.id}
                className="p-7 rounded-2xl bg-gradient-to-b from-[#091122] to-[#050a16] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {app.emoji}
                    </span>
                    <span className="text-xs font-mono text-slate-500">MUNICIPAL READY</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-2 font-heading tracking-wide">
                    {app.title}
                  </h3>

                  <p className="text-base text-slate-300 leading-relaxed font-normal mb-4">
                    {app.oneLiner}
                  </p>
                </div>

                <div>
                  {isExpanded && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 mb-3 leading-relaxed">
                      {app.details}
                    </div>
                  )}

                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : app.id)}
                    className="inline-flex items-center text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                  >
                    <span>{isExpanded ? "Hide details" : "View details"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
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
