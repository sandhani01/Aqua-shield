import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#03060c] border-t border-slate-800 text-slate-400 text-sm font-sans py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-400/50 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-heading group-hover:text-cyan-300 transition-colors">
                AQUA<span className="text-cyan-400">-SHIELD</span>
              </span>
            </Link>
            
            <p className="text-base font-semibold text-slate-200">
              “Before a worker enters, we send the inspector.”
            </p>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Low-cost autonomous flooded-drain inspection capsule designed for Indian municipalities to locate 27m blockages, assess hydrodynamic hazards, and protect human workers.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs font-mono text-cyan-400">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">₹8,250 COTS Prototype</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">4-Wheel Drive</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">30m Safety Tether</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              JUDGE WALKTHROUGH
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/#problem" className="hover:text-cyan-400 transition-colors">01. The Problem</a></li>
              <li><a href="/#solution" className="hover:text-cyan-400 transition-colors">02. Solution Concept</a></li>
              <li><a href="/#how-it-works" className="hover:text-cyan-400 transition-colors">03. How It Works</a></li>
              <li><Link to="/robot" className="hover:text-cyan-400 transition-colors">04. Live Robot &amp; Tests</Link></li>
              <li><Link to="/simulator" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">05. Live Simulator →</Link></li>
              <li><a href="/#comparison" className="hover:text-cyan-400 transition-colors">06. Why AQUA-SHIELD?</a></li>
            </ul>
          </div>

          {/* Col 3: Specifications & BOM */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              ENGINEERING &amp; SOURCING
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/#technology" className="hover:text-cyan-400 transition-colors">Hardware Architecture</a></li>
              <li><a href="/#cost" className="hover:text-cyan-400 transition-colors">Bill of Materials (₹8,250)</a></li>
              <li><a href="/#use-cases" className="hover:text-cyan-400 transition-colors">Deployment Scenarios</a></li>
              <li><a href="/#roadmap" className="hover:text-cyan-400 transition-colors">6-Phase Roadmap</a></li>
              <li><a href="/#research-gap" className="hover:text-cyan-400 transition-colors">Academic Research Gap</a></li>
              <li><a href="/#team" className="hover:text-cyan-400 transition-colors">Engineering Team</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} AQUA-SHIELD. Smart India Hackathon Prototype.
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Controlled 20–30m Demonstration Testbed</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
