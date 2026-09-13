import React from 'react';
import { teamMembers } from '../data/teamMembers';
import { Users, CheckCircle2 } from 'lucide-react';

export default function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>SIH INNOVATION TEAM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            ENGINEERING TEAM
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Multidisciplinary engineering team combining Embedded Systems, Mechatronics, Hydrodynamics, and Mission Software.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#091224] to-[#050a16] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                
                {/* Avatar & Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 font-mono text-base shadow-inner">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-heading">
                      {member.name}
                    </h3>
                    <div className="text-xs font-mono text-cyan-400 font-medium">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Discipline Tag */}
                <div className="mb-4">
                  <span className="inline-block text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                    {member.discipline}
                  </span>
                </div>

                {/* Key Responsibilities */}
                <ul className="space-y-2 text-sm text-slate-300">
                  {member.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-cyan-500/80 shrink-0 mt-0.5" />
                      <span className="leading-snug">{resp}</span>
                    </li>
                  ))}
                </ul>

              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Smart India Hackathon</span>
                <span className="text-cyan-400/80">Hardware + Web</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
