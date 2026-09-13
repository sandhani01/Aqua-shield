import React from 'react';
import { ArrowRight, Compass, Eye, MapPin, Gauge, RotateCcw } from 'lucide-react';

export default function PipelineSection() {
  const steps = [
    {
      num: "01",
      title: "DEPLOY",
      desc: "Capsule enters the flooded passage before workers.",
      icon: Compass,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/30"
    },
    {
      num: "02",
      title: "INSPECT",
      desc: "Camera + LED reveal hidden conditions and debris.",
      icon: Eye,
      color: "border-sky-500/40 text-sky-400 bg-sky-950/30"
    },
    {
      num: "03",
      title: "LOCATE",
      desc: "Encoder estimates exact distance to the obstruction.",
      icon: MapPin,
      color: "border-blue-500/40 text-blue-400 bg-blue-950/30"
    },
    {
      num: "04",
      title: "ASSESS",
      desc: "Sensor fusion evaluates flow, current and motion.",
      icon: Gauge,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/30"
    },
    {
      num: "05",
      title: "RETURN",
      desc: "System stops, anchors and safely retrieves the capsule.",
      icon: RotateCcw,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL SEQUENCE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            HOW IT WORKS
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal">
            A clear 5-step autonomous flow from entrance launch to safe operator retrieval.
          </p>
        </div>

        {/* 5-Step Visual Flow with Connecting Arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-md group">
                
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400">
                      STEP {s.num}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-black text-white mb-2 font-heading tracking-wide">
                    {s.title}
                  </h3>

                  {/* Single Sentence Explanation (Max 1 sentence) */}
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                {/* Connecting arrow for desktop screens */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-[#070b16] border border-slate-700 text-cyan-400 shadow-md">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
