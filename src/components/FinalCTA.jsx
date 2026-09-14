import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Radio, CheckCircle2 } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-[#050811] border-t border-slate-800 overflow-hidden">

      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Brand Shield Badge */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 mb-8 shadow-xl shadow-cyan-950/40">
          <Shield className="w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 font-heading">
          AQUA<span className="text-cyan-400">-SHIELD</span>
        </h2>

        {/* Big Punchline Statement */}
        <p className="text-2xl sm:text-3xl font-bold text-slate-100 mb-6 max-w-3xl mx-auto font-heading leading-tight">
          “Before a worker enters the hazard corridor, we send the inspector.”
        </p>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          An autonomous, ₹8,250 first-response capsule providing real-time multi-sensor telemetry, precise 27m obstruction mapping, and guaranteed mechanical retrieval.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
          <Link
            to="/robot"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-base transition-all shadow-lg shadow-cyan-500/20 hover:scale-105"
          >
            <Radio className="w-5 h-5 mr-2 text-slate-950" />
            <span>Open Live Robot</span>
          </Link>
        </div>

        {/* Footer Stamp */}
        <div className="mt-14 inline-flex items-center space-x-2 text-sm font-mono text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Smart India Hackathon (SIH) Engineering Innovation</span>
        </div>

      </div>
    </section>
  );
}
