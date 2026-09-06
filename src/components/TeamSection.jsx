import React from 'react';
import { teamMembers } from '../data/teamMembers';
import { 
  Users, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export default function TeamSection() {
  return (
    <section id="team" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 15 // MULTIDISCIPLINARY ENGINEERING TEAM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Meet the <span className="text-cyan-400">Innovators</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A cohesive student engineering team bringing together Embedded Systems, Mechanical Mechatronics, Instrumentation, and Full-Stack Telemetry Software for Smart India Hackathon.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Avatar & Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-slate-950 font-bold font-mono text-base shadow-lg`}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                      {member.name}
                    </h3>
                    <div className="text-xs font-mono text-cyan-400 font-semibold">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Discipline Badge */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {member.discipline}
                  </span>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2 text-xs">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    CORE RESPONSIBILITIES:
                  </div>
                  <ul className="space-y-1.5">
                    {member.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start text-slate-300 text-[11px] leading-snug">
                        <CheckCircle2 className="w-3 h-3 mr-1.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>SMART INDIA HACKATHON</span>
                <span className="text-cyan-400">SIH 2024–2026</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
