import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Tag, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-radial-vignette border-t-2 border-cyan-500/30 overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      
      {/* Central Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Large Brand Icon */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,240,255,0.4)] mb-8">
          <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400" />
        </div>

        {/* Large AQUA-SHIELD Logo */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-heading uppercase mb-6">
          AQUA<span className="text-cyan-400">-SHIELD</span>
        </h2>

        {/* Large Core Statement */}
        <div className="max-w-3xl mx-auto mb-6">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-100 font-heading tracking-tight uppercase leading-tight">
            “BEFORE A WORKER ENTERS,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              WE SEND THE INSPECTOR.
            </span>”
          </blockquote>
        </div>

        {/* Five-Stage Workflow Mantra */}
        <p className="text-lg sm:text-xl md:text-2xl font-mono text-cyan-300 font-semibold tracking-wider mb-10">
          Inspect. Locate. Assess. Decide. Return.
        </p>

        {/* Buttons: [View Prototype] [View Dashboard] [Contact Team] */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <a
            href="#prototype"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <Tag className="w-4 h-4 mr-2" />
            <span>View Prototype</span>
          </a>

          <a
            href="#live-dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105"
          >
            <Activity className="w-4 h-4 mr-2 text-slate-950" />
            <span>View Live Dashboard</span>
          </a>

          <a
            href="#team"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold text-sm transition-all"
          >
            <Mail className="w-4 h-4 mr-2 text-cyan-400" />
            <span>Contact Team</span>
          </a>
        </div>

        {/* SIH Submission Note */}
        <div className="mt-12 inline-flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-4 py-2 rounded-full border border-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Prepared for Smart India Hackathon & Municipal Engineering Evaluation</span>
        </div>

      </div>
    </section>
  );
}
