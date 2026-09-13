import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, ArrowRight, Gauge, Cpu, Radio, Sparkles, Terminal } from 'lucide-react';

export default function DashboardGateway() {
  return (
    <section className="relative py-16 md:py-24 bg-[#030712] border-y border-cyan-950/70 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Interactive 30m Conduit Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading mb-4">
            Live Inspection <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Simulator</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A standalone, high-performance telemetry simulator designed for field operators and municipal evaluators to test drain traversal, inspect live camera streams, and trigger emergency fail-safes in real-time.
          </p>
        </div>

        {/* Feature Teaser Bento Box */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#071126] to-[#040915] border border-cyan-500/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
          
          {/* Top Bar Preview */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-950/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-mono font-bold text-base flex items-center gap-2">
                  <span>AQUA-SHIELD SIMULATOR v2.4</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div className="text-xs font-mono text-cyan-400/80">
                  ENDPOINT: /simulator • STANDALONE SUITE
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE & SYNCED
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                ESP32 EDGE FUSION
              </span>
            </div>
          </div>

          {/* Core Modules Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
            
            <div className="p-5 rounded-2xl bg-[#081022]/80 border border-slate-800/90 hover:border-cyan-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5 font-heading">
                Multi-Sensor Telemetry Feed
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                6 real-time metrics including encoder distance (±2cm), turbine water flow, motor current draw, tilt angles, and Li-ion pack voltage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#081022]/80 border border-slate-800/90 hover:border-cyan-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5 font-heading">
                30m Dynamic Conduit Map
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive spatial map plotting robot traversal, simulated debris (plastics, silt, leaves), and 27.0m blockage obstacle locking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#081022]/80 border border-slate-800/90 hover:border-cyan-500/30 transition-all">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5 font-heading">
                Fail-Safe Emergency Triggers
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hardware test suite simulating high flow surge (&gt;35 L/min), motor overload stalls, low battery return, and loss of tether comms.
              </p>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cyan-950/80 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-cyan-950/30 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 text-center sm:text-left">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full automated inspection sequence or direct Bluetooth Classic hardware teleoperation</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/robot"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-105 shrink-0"
              >
                <Radio className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
                <span>PHYSICAL ROBOT CONSOLE</span>
              </Link>

              <Link
                to="/simulator"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 shrink-0"
              >
                <Activity className="w-4 h-4 mr-2 text-slate-950" />
                <span>LAUNCH SIMULATOR</span>
                <ArrowRight className="w-4 h-4 ml-2 text-slate-950" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
