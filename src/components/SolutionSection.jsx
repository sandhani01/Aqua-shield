import React from 'react';
import { Eye, Gauge, AlertTriangle, Cpu, RotateCcw, ShieldCheck, Shield } from 'lucide-react';

export default function SolutionSection() {
  const capabilities = [
    {
      num: "01",
      title: "SEE",
      desc: "Wide-angle camera + concentric LED illumination reveal submerged conditions in pitch darkness.",
      icon: Eye,
      accent: "text-cyan-400 border-cyan-500/40 bg-cyan-950/20"
    },
    {
      num: "02",
      title: "MEASURE",
      desc: "IMU monitors tilt, current sensor reads motor drag, flow sensor reads surge, and encoder measures travel distance.",
      icon: Gauge,
      accent: "text-sky-400 border-sky-500/40 bg-sky-950/20"
    },
    {
      num: "03",
      title: "DETECT",
      desc: "Identifies severe debris dams, impounded silt, and hazardous hydrodynamic choke points downline.",
      icon: AlertTriangle,
      accent: "text-amber-400 border-amber-500/40 bg-amber-950/20"
    },
    {
      num: "04",
      title: "DECIDE",
      desc: "ESP32 edge computing combines multi-sensor telemetry to classify immediate safety state.",
      icon: Cpu,
      accent: "text-indigo-400 border-indigo-500/40 bg-indigo-950/20"
    },
    {
      num: "05",
      title: "RETURN",
      desc: "Mechanical bed anchor locks against rushes; 30m high-tensile tether spools capsule safely back.",
      icon: RotateCcw,
      accent: "text-emerald-400 border-emerald-500/40 bg-emerald-950/20"
    }
  ];

  return (
    <section id="solution" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>THE FIRST-RESPONSE SOLUTION</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            THE SOLUTION
          </h2>

          <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            “AQUA-SHIELD GOES FIRST.”
          </p>
        </div>

        {/* Visual Capsule Showcase + Capabilities Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Large Visual Representation of the Capsule (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-b from-[#091226] to-[#050b18] border-2 border-cyan-500/30 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mb-6">
              AQUA-SHIELD 4-WHEEL CAPSULE
            </div>

            {/* Stylized Physical Capsule Graphic with Dome and 4 Wheels */}
            <div className="relative w-64 h-40 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,229,255,0.4)] flex items-center justify-between px-4 my-4">
              
              {/* 4 Rugged DC Wheels */}
              <div className="absolute -top-4 -left-3 w-8 h-5 bg-slate-950 rounded border-2 border-slate-600 shadow-md"></div>
              <div className="absolute -top-4 -right-3 w-8 h-5 bg-slate-950 rounded border-2 border-slate-600 shadow-md"></div>
              <div className="absolute -bottom-4 -left-3 w-8 h-5 bg-slate-950 rounded border-2 border-slate-600 shadow-md"></div>
              <div className="absolute -bottom-4 -right-3 w-8 h-5 bg-slate-950 rounded border-2 border-slate-600 shadow-md"></div>

              {/* Transparent Viewing Dome with Camera + Dual LEDs */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-16 rounded-r-full bg-cyan-400/30 border-2 border-cyan-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff]"></div>
              </div>

              {/* Central Electronics Core */}
              <div className="w-full text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-black font-mono text-white tracking-wider">AQUA-SHIELD</span>
                </div>
                <div className="text-[11px] font-mono text-cyan-300">ESP32 Edge Fusion</div>
                <div className="text-[10px] font-mono text-slate-400">4 Geared DC Motors</div>
              </div>

            </div>

            <div className="text-center mt-4">
              <span className="text-xs font-mono text-slate-400">
                Waterproof Capsule • Dual LEDs • 30m Tether Reel
              </span>
            </div>

          </div>

          {/* 5 Key Capabilities - Clean List Beside Capsule (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <div 
                  key={c.num}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start space-x-4 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 font-mono font-black text-sm shadow-inner ${c.accent}`}>
                    {c.num}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-lg font-black text-white tracking-wide font-heading">
                        {c.title}
                      </span>
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
