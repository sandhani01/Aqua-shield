import React, { useState } from 'react';
import { hardwareComponents } from '../data/hardwareComponents';
import { 
  Cpu, 
  Camera, 
  Sun, 
  Gauge, 
  Compass, 
  Activity, 
  Waves, 
  Zap, 
  Anchor, 
  BatteryCharging, 
  HardDrive, 
  GitFork, 
  Shield,
  Layers,
  CheckCircle2,
  Info
} from 'lucide-react';

const iconMap = {
  Cpu,
  Camera,
  Sun,
  Gauge,
  Compass,
  Activity,
  Waves,
  Zap,
  Anchor,
  BatteryCharging,
  HardDrive,
  GitFork,
  Shield
};

export default function HardwareSection() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeComponent, setActiveComponent] = useState(hardwareComponents[0]);

  const categories = ['All', 'Compute & Control', 'Vision Subsystem', 'Navigation & Kinematics', 'Diagnostics', 'Environmental', 'Propulsion', 'Recovery & Safety', 'Power Subsystem', 'Chassis & Ingress'];

  const filtered = selectedFilter === 'All'
    ? hardwareComponents
    : hardwareComponents.filter(c => c.category.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section id="hardware" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Tech Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 04 // HARDWARE ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Inside <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">AQUA-SHIELD</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            13 tightly integrated, low-cost commercial off-the-shelf components engineered into a pressure-sealed, hydrodynamic inspection capsule.
          </p>
        </div>

        {/* Interactive Exploded View Banner */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0a1224] via-[#0e1b38] to-[#0a1224] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                SYSTEM SCHEMATIC // EXPLODED ARRANGEMENT
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading mt-1">
                Modular Submerged Architecture (Front to Rear)
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>STANDARDIZED MODULAR INTERFACE</span>
            </div>
          </div>

          {/* Graphical Exploded Pipeline Representation */}
          <div className="relative py-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[860px] gap-3 px-2">
              
              {/* Node 1: Acrylic Optical Dome */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center relative group">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-300">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white font-heading">Front Optics</div>
                <div className="text-[9px] font-mono text-cyan-400">Dome + Camera</div>
                <div className="text-[8px] text-slate-400 mt-1">120° FOV Optical Lens</div>
              </div>

              <div className="text-cyan-500/40 font-mono text-xs">→</div>

              {/* Node 2: LED Ring */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center relative group">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-300">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white font-heading">Illumination</div>
                <div className="text-[9px] font-mono text-cyan-400">12-LED Ring</div>
                <div className="text-[8px] text-slate-400 mt-1">PWM Brightness Ring</div>
              </div>

              <div className="text-cyan-500/40 font-mono text-xs">→</div>

              {/* Node 3: Sensors & MCU */}
              <div className="flex-1 p-3 rounded-xl bg-cyan-950/60 border-2 border-cyan-400 text-center relative group shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-cyan-200 font-heading">Compute Core</div>
                <div className="text-[9px] font-mono text-cyan-300 font-bold">ESP32 + Sensors</div>
                <div className="text-[8px] text-slate-300 mt-1">MPU6050 • ACS712 • Flow</div>
              </div>

              <div className="text-cyan-500/40 font-mono text-xs">→</div>

              {/* Node 4: Battery & Storage */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center relative group">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-300">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white font-heading">Power Unit</div>
                <div className="text-[9px] font-mono text-cyan-400">Li-ion 2S2P + SD</div>
                <div className="text-[8px] text-slate-400 mt-1">7.4V BMS Isolated</div>
              </div>

              <div className="text-cyan-500/40 font-mono text-xs">→</div>

              {/* Node 5: Propulsion */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center relative group">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white font-heading">Drive Units</div>
                <div className="text-[9px] font-mono text-cyan-400">Dual Thrusters</div>
                <div className="text-[8px] text-slate-400 mt-1">Shrouded Anti-Tangle</div>
              </div>

              <div className="text-cyan-500/40 font-mono text-xs">→</div>

              {/* Node 6: Anchor & Tether */}
              <div className="flex-1 p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-center relative group">
                <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-950 flex items-center justify-center text-amber-300">
                  <Anchor className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white font-heading">Safety Line</div>
                <div className="text-[9px] font-mono text-amber-300">Anchor & Tether</div>
                <div className="text-[8px] text-slate-400 mt-1">Servo Lock & 50kg Cord</div>
              </div>

            </div>
          </div>

        </div>

        {/* Filter Category Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFilter === cat
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 13 Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const Icon = iconMap[item.icon] || Cpu;
            const isSelected = activeComponent.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveComponent(item)}
                className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.voltage}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">SPEC:</span> {item.specs}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    <span className="text-slate-500">ROLE:</span> {item.highlight}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
