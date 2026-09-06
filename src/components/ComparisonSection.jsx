import React from 'react';
import { comparisonData } from '../data/roadmapPhases';
import { 
  Check, 
  X, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export default function ComparisonSection() {
  return (
    <section id="comparison" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 09 // STRATEGIC DIFFERENTIATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            What Makes <span className="text-cyan-400">AQUA-SHIELD</span> Different?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Existing sewer crawlers already perform robotic visual inspection. AQUA-SHIELD is architected specifically around the human-first safety timeline: providing rapid, low-cost pre-entry assessment and guaranteed recovery.
          </p>
        </div>

        {/* Main Strategic Statement Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0a1224] to-cyan-950/60 border-2 border-cyan-500/50 text-center my-10 shadow-[0_0_35px_rgba(0,240,255,0.2)]">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800 inline-block mb-3">
            CORE PHILOSOPHY
          </span>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-heading leading-snug">
            “Existing systems can inspect. AQUA-SHIELD focuses on what should happen BEFORE human intervention.”
          </blockquote>
        </div>

        {/* Three Core Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Pillar 1: Traditional Manual */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-700">
                  CONVENTIONAL
                </span>
                <span className="text-xs font-mono text-slate-500">RISK: EXTREME</span>
              </div>
              <h3 className="text-lg font-bold text-white font-heading mb-2">
                Traditional Manual Inspection
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start text-red-400">
                  <span className="mr-2">✕</span> Human worker approaches flooded manhole first
                </li>
                <li className="flex items-start text-red-400">
                  <span className="mr-2">✕</span> Zero awareness of toxic gas or sudden surges
                </li>
                <li className="flex items-start text-red-400">
                  <span className="mr-2">✕</span> Blockage location guessed from surface ponding
                </li>
                <li className="flex items-start text-red-400">
                  <span className="mr-2">✕</span> Manual, hazardous evidence collection
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Unacceptable risk to human life in urban drainage maintenance.
            </div>
          </div>

          {/* Pillar 2: Existing Robotic Crawlers */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-600">
                  COMMERCIAL CCTV
                </span>
                <span className="text-xs font-mono text-slate-500">COST: ₹15L–₹35L</span>
              </div>
              <h3 className="text-lg font-bold text-white font-heading mb-2">
                Existing Industrial Crawlers
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start text-slate-400">
                  <span className="mr-2">•</span> High-definition camera-based optical assessment
                </li>
                <li className="flex items-start text-slate-400">
                  <span className="mr-2">•</span> Heavy motorized crawler tractor (15–40 kg)
                </li>
                <li className="flex items-start text-slate-400">
                  <span className="mr-2">•</span> Requires specialized utility truck & generator
                </li>
                <li className="flex items-start text-slate-400">
                  <span className="mr-2">•</span> Cost prohibitive for routine municipal monsoon checks
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              Specialized industrial tools; not designed for rapid emergency deployment.
            </div>
          </div>

          {/* Pillar 3: AQUA-SHIELD */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-cyan-950/50 to-slate-900/90 border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-slate-950 bg-cyan-400 px-2.5 py-1 rounded shadow">
                  AQUA-SHIELD
                </span>
                <span className="text-xs font-mono text-emerald-400">BUDGET: &lt; ₹10,000</span>
              </div>
              <h3 className="text-lg font-bold text-white font-heading mb-2">
                Human-First Assessment Capsule
              </h3>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-start text-cyan-300">
                  <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  First-response rapid deployment before any human entry
                </li>
                <li className="flex items-start text-cyan-300">
                  <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Exact sub-meter blockage localization (e.g. 25.4 m marked)
                </li>
                <li className="flex items-start text-cyan-300">
                  <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Multi-sensor fusion: Camera + IMU + Flow + Current + Encoder
                </li>
                <li className="flex items-start text-cyan-300">
                  <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Active folding anchor + high-tensile fail-safe recovery
                </li>
                <li className="flex items-start text-cyan-300">
                  <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                  Low-cost student prototype using off-the-shelf components
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-3 border-t border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-semibold">
              Workers enter only after condition assessment is verified safe.
            </div>
          </div>

        </div>

        {/* Detailed Comparison Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Comprehensive Feature Matrix Comparison
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              SIH BENCHMARK EVALUATION
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-slate-400">
                  <th className="p-3.5 font-semibold w-1/4">Evaluation Parameter</th>
                  <th className="p-3.5 font-semibold text-red-400 w-1/4">Traditional Manual</th>
                  <th className="p-3.5 font-semibold text-slate-400 w-1/4">Commercial CCTV Crawlers</th>
                  <th className="p-3.5 font-semibold text-cyan-400 w-1/4 bg-cyan-950/20">AQUA-SHIELD Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      row.highlight ? 'bg-cyan-950/10' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold text-slate-200 font-heading">
                      {row.criterion}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {row.manual}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {row.existingRobots}
                    </td>
                    <td className="p-3.5 font-semibold text-cyan-300 bg-cyan-950/20 border-l border-cyan-500/20">
                      {row.aquaShield}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
