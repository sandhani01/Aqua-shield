import React, { useState } from 'react';
import { budgetItems, totalTargetBudget } from '../data/budgetItems';
import { DollarSign, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function BudgetSection() {
  const [showAllRows, setShowAllRows] = useState(true);

  return (
    <section id="cost" className="py-20 md:py-28 bg-[#050811] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono uppercase tracking-wider mb-4">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>AFFORDABILITY &amp; SOURCING</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            PROTOTYPE COST &amp; BOM
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Industrial inspection crawlers cost <span className="text-white font-semibold">₹5,00,000 to ₹25,00,000</span>. AQUA-SHIELD delivers a student-buildable prototype for just <span className="text-emerald-400 font-bold font-mono">₹8,250</span>.
          </p>
        </div>

        {/* 4 High-Impact Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 shadow-lg text-center">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Target Budget</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">₹7,000 – ₹10k</div>
            <div className="text-xs text-slate-400 mt-2">Municipal scale target</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1f18] to-[#061410] border border-emerald-500/50 shadow-lg text-center">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Actual Prototype BOM</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
              ₹{totalTargetBudget.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-300/80 mt-2 font-medium">100% Itemized &amp; Verified</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 shadow-lg text-center">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">Component Sourcing</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">100% COTS</div>
            <div className="text-xs text-slate-400 mt-2">Standard Indian distributors</div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1226] to-[#060c18] border border-slate-800 shadow-lg text-center">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Cost Advantage</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">&gt; 98% LOWER</div>
            <div className="text-xs text-slate-400 mt-2">vs imported crawler rigs</div>
          </div>

        </div>

        {/* Itemized BOM Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#070b16] overflow-hidden shadow-xl">
          
          <div className="p-5 bg-gradient-to-r from-slate-900 to-[#0a1226] border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-white font-heading">
                Complete Bill of Materials Breakdown
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every component is off-the-shelf, easily replaceable, and accessible to Indian municipalities.
              </p>
            </div>
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <span>{showAllRows ? 'Compact View' : 'Expand All (10 Items)'}</span>
              {showAllRows ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-xs">
                  <th className="py-3.5 px-4">Subsystem</th>
                  <th className="py-3.5 px-4">Hardware Component &amp; Sourcing</th>
                  <th className="py-3.5 px-3 text-center">Qty</th>
                  <th className="py-3.5 px-4 text-right">Est. Cost</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Engineering Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {(showAllRows ? budgetItems : budgetItems.slice(0, 5)).map((item, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-slate-800/30 transition-colors ${
                      idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'
                    }`}
                  >
                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-white">{item.item}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.source}</div>
                    </td>
                    <td className="py-3.5 px-3 align-top text-center font-mono text-slate-300 font-medium">
                      {item.qty}
                    </td>
                    <td className="py-3.5 px-4 align-top text-right font-mono font-bold text-emerald-400 text-base whitespace-nowrap">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 align-top text-slate-300 hidden md:table-cell text-xs leading-relaxed">
                      {item.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-gradient-to-r from-slate-950 to-[#091226] font-mono">
                  <td colSpan="3" className="py-4 px-4 text-right font-bold text-white text-base">
                    TOTAL PROTOTYPE BOM:
                  </td>
                  <td className="py-4 px-4 text-right font-black text-emerald-400 text-xl whitespace-nowrap">
                    ₹{totalTargetBudget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-xs text-emerald-300 hidden md:table-cell font-sans">
                    ✓ Well within the &lt; ₹10,000 hackathon constraint
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sourced from standard vendors (Robu.in, ElectronicsComp, local hardware markets)</span>
            </div>
            <div className="text-slate-500">
              Zero custom ASIC or proprietary components required
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
