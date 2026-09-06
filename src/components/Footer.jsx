import React from 'react';
import { Shield, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#03060d] border-t border-slate-800/80 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white font-heading tracking-wider">
                AQUA<span className="text-cyan-400">-SHIELD</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-cyan-300 italic font-heading">
              “Before a worker enters, we send the inspector.”
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Low-cost autonomous flooded-drain inspection and safety-assessment system designed to eliminate human exposure in subterranean urban hazard corridors.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[11px] font-mono text-slate-500">
              <span className="flex items-center text-emerald-400">
                <Radio className="w-3 h-3 mr-1 animate-pulse" /> FIREBASE HOSTING READY
              </span>
              <span>•</span>
              <span>BUDGET: &lt; ₹10,000</span>
              <span>•</span>
              <span>SIH DEMO VALIDATED</span>
            </div>
          </div>

          {/* Col 2: Navigation Sections */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
              System Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#problem" className="hover:text-cyan-300 transition-colors">The Real Problem</a></li>
              <li><a href="#solution" className="hover:text-cyan-300 transition-colors">Five-Stage Solution</a></li>
              <li><a href="#pipeline" className="hover:text-cyan-300 transition-colors">8-Stage Pipeline</a></li>
              <li><a href="#hardware" className="hover:text-cyan-300 transition-colors">Hardware & Exploded View</a></li>
              <li><a href="#sensor-fusion" className="hover:text-cyan-300 transition-colors">Sensor Fusion Matrix</a></li>
              <li><a href="#live-dashboard" className="hover:text-cyan-300 transition-colors">Mission Control Dashboard</a></li>
            </ul>
          </div>

          {/* Col 3: Engineering Credentials */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
              Evaluation & Roadmap
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#fail-safe" className="hover:text-cyan-300 transition-colors">Fail-Safe Recovery Loop</a></li>
              <li><a href="#channel-demo" className="hover:text-cyan-300 transition-colors">30m Channel Testbed</a></li>
              <li><a href="#comparison" className="hover:text-cyan-300 transition-colors">Differentiation Matrix</a></li>
              <li><a href="#use-cases" className="hover:text-cyan-300 transition-colors">6 Field Use Cases</a></li>
              <li><a href="#budget" className="hover:text-cyan-300 transition-colors">Itemized ₹7.7k BOM</a></li>
              <li><a href="#research-gap" className="hover:text-cyan-300 transition-colors">Research Gap Analysis</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} AQUA-SHIELD Engineering Team. Smart India Hackathon Prototype.
          </div>
          <div className="text-center sm:text-right">
            Controlled 20–30m demonstration testbed setup. Student proof-of-concept; non-field-certified.
          </div>
        </div>
      </div>
    </footer>
  );
}
