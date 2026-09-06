import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  Anchor, 
  Radio, 
  Zap, 
  Maximize2 
} from 'lucide-react';

export default function Hero() {
  const [activeCallout, setActiveCallout] = useState(null);

  const callouts = [
    {
      id: 'camera',
      title: 'Wide-Angle Front Camera',
      desc: '120° FOV low-light sensor provides direct optical visibility inside choked drains.',
      top: '51%',
      left: '32%',
      color: 'border-cyan-400 text-cyan-300'
    },
    {
      id: 'led-ring',
      title: 'High-Lumen LED Ring',
      desc: 'Concentric ring of ultra-bright LEDs cutting through turbid water and darkness.',
      top: '38%',
      left: '26%',
      color: 'border-cyan-300 text-cyan-200'
    },
    {
      id: 'body',
      title: 'Waterproof Cylindrical Body',
      desc: 'Pressure-tested 90mm OD acrylic housing with silicone double O-ring seals.',
      top: '30%',
      left: '42%',
      color: 'border-blue-400 text-blue-300'
    },
    {
      id: 'esp32',
      title: 'ESP32 Dual-Core Brain',
      desc: 'Real-time multi-sensor fusion, edge anomaly detection, and fail-safe logic.',
      top: '32%',
      left: '56%',
      color: 'border-sky-400 text-sky-200'
    },
    {
      id: 'battery',
      title: 'Li-ion Battery Pack',
      desc: 'Onboard power pack with BMS delivering 60 minutes autonomous mission run-time.',
      top: '63%',
      left: '60%',
      color: 'border-indigo-400 text-indigo-200'
    },
    {
      id: 'propulsion',
      title: 'Protected Propulsion',
      desc: 'Dual shrouded high-torque thrusters with intake grilles to prevent debris wrap.',
      top: '58%',
      left: '75%',
      color: 'border-cyan-400 text-cyan-300'
    },
    {
      id: 'tether',
      title: 'Tether Attachment',
      desc: '50kg tensile-rated safety line ensuring physical recovery and communication.',
      top: '18%',
      left: '66%',
      color: 'border-teal-400 text-teal-200'
    },
    {
      id: 'anchor',
      title: 'Folding Recovery Anchor',
      desc: 'Servo-actuated articulated anchor to lock against pipe walls during high flood flow.',
      top: '46%',
      left: '84%',
      color: 'border-amber-400 text-amber-300'
    }
  ];

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-radial-vignette">
      {/* Background Cyber-Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>SMART INDIA HACKATHON // FIRST-RESPONSE ENGINEERING</span>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
            <span className="text-emerald-400">●</span>
            <span>LOW-COST TARGET: ₹7,000–₹10,000</span>
          </div>
        </div>

        {/* Hero Typography */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-heading uppercase mb-2">
            AQUA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">‑SHIELD</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-300 font-heading tracking-wide mb-6">
            First-Response Drain Inspection & Safety Assessment System
          </p>

          <div className="relative inline-block my-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-100 font-heading italic">
              “Before a worker enters, we send the inspector.”
            </blockquote>
          </div>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A low-cost inspection capsule designed to enter flooded drainage passages first, locate blockages, assess operating conditions and return actionable inspection data before human intervention.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#solution"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] group"
            >
              <span>Explore AQUA-SHIELD</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#live-dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 text-slate-950 font-bold text-sm transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:shadow-[0_0_35px_rgba(0,240,255,0.75)] hover:scale-[1.02]"
            >
              <Activity className="w-4 h-4 mr-2 text-slate-950" />
              <span>View Live Dashboard</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">25.4 m</div>
              <div className="text-[11px] text-slate-400 font-medium">Pinpoint Localization</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">5 Sensors</div>
              <div className="text-[11px] text-slate-400 font-medium">Real-Time Fusion</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">&lt; ₹10,000</div>
              <div className="text-[11px] text-slate-400 font-medium">Affordable Prototype</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">100%</div>
              <div className="text-[11px] text-slate-400 font-medium">Fail-Safe Recoverability</div>
            </div>
          </div>
        </div>

        {/* 3D Engineering Capsule Illustration Display */}
        <div className="relative mt-12 max-w-5xl mx-auto">
          
          {/* Main Visual Frame */}
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(0,240,255,0.15)] group">
            
            {/* Corner Tech Brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/80 z-20 pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/80 z-20 pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/80 z-20 pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/80 z-20 pointer-events-none"></div>

            {/* Top HUD Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-2.5 bg-gradient-to-b from-[#050811]/90 to-transparent text-[11px] font-mono text-cyan-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM RENDER // AQUA-SHIELD CAPSULE PROTOTYPE</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-slate-400">
                <span>CHAMBER: SEALED ACRYLIC (IP TESTED)</span>
                <span>SERVO ANCHOR: ARMED</span>
              </div>
            </div>

            {/* Render Image */}
            <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden">
              <img
                src="/assets/aquashield_capsule.jpg"
                alt="AQUA-SHIELD Autonomous Flooded Drain Inspection Capsule 3D Engineering Render"
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-16 w-full animate-scanline pointer-events-none"></div>

              {/* Submerged Water Tint Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80 pointer-events-none"></div>

              {/* Interactive Callout Pins for Desktop */}
              <div className="hidden md:block">
                {callouts.map((pin) => (
                  <div
                    key={pin.id}
                    style={{ top: pin.top, left: pin.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
                    onMouseEnter={() => setActiveCallout(pin)}
                    onMouseLeave={() => setActiveCallout(null)}
                    onClick={() => setActiveCallout(activeCallout?.id === pin.id ? null : pin)}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-60"></span>
                      <div className={`w-4 h-4 rounded-full bg-[#050811] border-2 ${pin.color} shadow-[0_0_10px_rgba(0,240,255,0.8)] flex items-center justify-center`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-300"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Info Tooltip for Selected Callout */}
            {activeCallout && (
              <div className="hidden md:block absolute bottom-6 left-6 right-6 z-30 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/50 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <h4 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                      {activeCallout.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                    INTERACTIVE SPEC
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
                  {activeCallout.desc}
                </p>
              </div>
            )}
          </div>

          {/* Labeled Component Badges Grid for Mobile & Fast Reference */}
          <div className="mt-6">
            <div className="text-center mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Integrated Capsule Architecture (8 Key Subsystems)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {callouts.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center space-x-1.5 text-cyan-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
