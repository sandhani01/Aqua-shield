import React, { useState } from 'react';
import { 
  Shield, 
  Tag, 
  Info, 
  CheckCircle2, 
  Maximize2, 
  Crosshair,
  Compass,
  Cpu
} from 'lucide-react';

export default function PrototypeSection() {
  const [activeTag, setActiveTag] = useState(null);

  const labels = [
    { id: 'cam', name: 'Camera', spec: 'OV2640 / Wide-Angle 120° FOV lens with waterproof optical port' },
    { id: 'led', name: 'LED Ring', spec: '12-LED 5000K high-lumen illumination ring with PWM dimming' },
    { id: 'body', name: 'Waterproof Body', spec: '90mm OD cast acrylic cylinder with silicone dual O-ring compression seals' },
    { id: 'prop', name: 'Propulsion', spec: 'Dual shrouded geared DC thrusters with debris-filtering intake grilles' },
    { id: 'bat', name: 'Battery', spec: '2S2P 7.4V 4400mAh Li-ion battery pack with integrated BMS cutoff' },
    { id: 'esp', name: 'ESP32', spec: '240MHz dual-core microcontroller running sensor fusion & safety loop' },
    { id: 'sens', name: 'Sensors', spec: 'MPU6050 6-Axis IMU, ACS712 Current, Hall Flow Sensor, and Rotary Encoder' },
    { id: 'teth', name: 'Tether', spec: '30m high-tensile (50kg rated) braided cord with signal conductors' },
    { id: 'anc', name: 'Folding Anchor', spec: 'Waterproof metal-gear servo actuated articulated titanium recovery anchor' }
  ];

  return (
    <section id="prototype" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[300px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 11 // PHYSICAL PROTOTYPE CONCEPT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Prototype <span className="text-cyan-400">Architecture</span>
          </h2>

          <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            Prototype Concept — ₹10,000 Target Budget
          </div>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Constructed with precision-machined acrylic and commercial off-the-shelf mechatronics, designed for rapid fabrication, low-cost maintenance, and repeatable testbed demonstration.
          </p>

          {/* Honest SIH Disclaimer */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono">
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Note: Ingress testing conducted in 1.5m static water column testbed. Non-certified IP rating until industrial lab certification.</span>
          </div>
        </div>

        {/* Prototype Image with Overlaid Labels */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] group">
            
            {/* Top HUD Spec Tag */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-[#050811]/90 to-transparent text-xs font-mono text-cyan-300">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-ping"></span>
                AQUA-SHIELD MODEL 01 // PHYSICAL PROTOTYPE ASSEMBLY
              </span>
              <span className="text-slate-400 hidden sm:inline">
                TARGET BUDGET: ₹7,000 – ₹10,000
              </span>
            </div>

            {/* Prototype Image */}
            <div className="relative w-full aspect-[16/9] bg-slate-950">
              <img
                src="/assets/aquashield_capsule.jpg"
                alt="AQUA-SHIELD Physical Prototype Concept with Labeled Subsystems"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

          </div>
        </div>

        {/* Interactive 9 Labeled Subsystems Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Labeled Prototype Components & Physical Specifications
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {labels.map((item, idx) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveTag(item.id)}
                onMouseLeave={() => setActiveTag(null)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  activeTag === item.id
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)] scale-102'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {item.name}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    LABEL 0{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  {item.spec}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
