import React, { useState } from 'react';
import { budgetItems, totalTargetBudget } from '../data/budgetItems';
import { 
  IndianRupee, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  Cpu, 
  Layers, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function BudgetSection() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section id="budget" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase mb-4">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECTION 12 // LOW-COST ENGINEERING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Low-Cost <span className="text-emerald-400">Design & BOM</span>
          </h2>

          <div className="mt-3 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span>TARGET BUDGET: ₹7,000 – ₹10,000</span>
            <span>•</span>
            <span className="text-white">ESTIMATED PROTOTYPE BOM: ₹{totalTargetBudget.toLocaleString('en-IN')}</span>
          </div>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            By avoiding proprietary industrial subsea robotics ecosystems and leveraging high-volume commercial embedded components, AQUA-SHIELD delivers an accessible solution for every municipality.
          </p>
        </div>

        {/* Emphasized Statement Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1524] to-emerald-950/40 border-2 border-emerald-500/40 text-center my-8 shadow-[0_0_35px_rgba(16,185,129,0.15)]">
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-heading leading-snug">
            “Affordable proof-of-concept using commercially available embedded hardware.”
          </blockquote>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            Commercial pipeline inspection tractors cost ₹15–₹35 Lakhs. AQUA-SHIELD accomplishes pre-entry safety assessment for under ₹10,000.
          </p>
        </div>

        {/* Quick Budget Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Target Cost Band</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              ₹7,000 – ₹10k
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">SIH Prototype Goal</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Total Calculated BOM</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              ₹{totalTargetBudget.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Well Under ₹10k Ceiling</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Component Sourcing</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              100% COTS
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Standard Indian Vendors</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs font-mono text-slate-400 uppercase">Cost Advantage</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              &gt; 98% Savings
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">vs Industrial CCTV Crawlers</div>
          </div>
        </div>

        {/* Itemized Bill of Materials (BOM) Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-white uppercase">
                Itemized Bill of Materials (BOM Breakdown)
              </span>
              <p className="text-[11px] text-slate-400">
                10 Core Hardware Categories with Commercial Sourcing & Engineering Role
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-700">
              AUDITED FOR SIH EVALUATION
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-slate-400">
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Component & Technical Specification</th>
                  <th className="p-3.5 font-semibold text-center">Qty</th>
                  <th className="p-3.5 font-semibold text-right">Est. Price</th>
                  <th className="p-3.5 font-semibold hidden md:table-cell">Engineering Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {budgetItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-cyan-400">
                      {item.category}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{item.item}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.source}</div>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-300">
                      {item.qty}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-slate-300 hidden md:table-cell">
                      {item.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-900 font-mono text-xs">
                  <td colSpan="3" className="p-4 font-bold text-white uppercase tracking-wider text-right">
                    TOTAL TARGET PROTOTYPE ESTIMATE:
                  </td>
                  <td className="p-4 text-right font-black text-sm text-emerald-400">
                    ₹{totalTargetBudget.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-[11px] text-slate-400 hidden md:table-cell">
                    Fits within ₹7,000–₹10,000 target budget constraint
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
