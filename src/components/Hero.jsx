import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Shield, Radio } from 'lucide-react';

export default function Hero() {
  const metrics = [
    {
      value: "₹8,250",
      label: "Prototype Cost",
      sub: "Target: ₹7,000–₹10,000"
    },
    {
      value: "27 m",
      label: "Tested Detection",
      sub: "Encoder Localized (±2cm)"
    },
    {
      value: "5",
      label: "Sensor Systems",
      sub: "Autonomous Edge Fusion"
    },
    {
      value: "100%",
      label: "Controlled Return",
      sub: "Fail-Safe Tether & Anchor"
    }
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#050811] overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tagline / Category */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>FIRST-RESPONSE ROBOT FOR FLOODED DRAINS</span>
        </div>

        {/* Hero Title: 56–72px */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 font-heading">
          AQUA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">-SHIELD</span>
        </h1>

        {/* Core Hook Statement */}
        <div className="mb-6">
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
            “Before a worker enters a flooded drain, <span className="text-cyan-400 underline decoration-cyan-500/50 underline-offset-8">AQUA-SHIELD enters first</span>.”
          </p>
        </div>

        {/* Short 2-Line Explanation (18-19px Body Font) */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          A low-cost autonomous inspection capsule that enters dangerous flooded drainage passages, detects blockages and environmental hazards, and safely returns before human intervention.
        </p>

        {/* CTAs: 2 Prominent Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/robot"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-base font-extrabold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105"
          >
            <Radio className="w-5 h-5 mr-2" />
            <span>OPEN LIVE ROBOT</span>
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-white text-base font-bold transition-all hover:bg-slate-800"
          >
            <span>SEE HOW IT WORKS</span>
            <ArrowRight className="w-5 h-5 ml-2 text-cyan-400" />
          </a>
        </div>

        {/* 4 LARGE PROOF METRICS (PROMINENT & EASY TO SCAN) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-800/80">
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0a1226]/80 to-[#060b18]/90 border border-slate-800 hover:border-cyan-500/40 transition-all text-center shadow-lg"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-cyan-400 mb-1 tracking-tight">
                {m.value}
              </div>
              <div className="text-base sm:text-lg font-bold text-white mb-1">
                {m.label}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {m.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
