import React, { useState } from 'react';
import { 
  Eye, 
  MapPin, 
  Gauge, 
  Cpu, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function SolutionSection() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(0);

  const workflowSteps = [
    {
      id: "inspect",
      stepNum: "01",
      name: "INSPECT",
      tagline: "Camera + LED inspect the dark passage.",
      icon: Eye,
      color: "border-cyan-500 text-cyan-400 bg-cyan-950/40",
      pillBg: "bg-cyan-950 border-cyan-700 text-cyan-300",
      description: "Wide-angle low-light camera coupled with a concentric 12-LED ring cuts through murky water, revealing floating debris, wall cracks, and culvert sedimentation.",
      activeSensors: "Wide-Angle Optical Sensor • 12-LED PWM Ring • Dome Anti-Glare Shield",
      metric: "120° Field of View / 5m Optical Range",
      takeaway: "Gives operators eyes inside the submerged passage without risking human ocular or respiratory health."
    },
    {
      id: "locate",
      stepNum: "02",
      name: "LOCATE",
      tagline: "Rotary encoder estimates travel distance and blockage location.",
      icon: MapPin,
      color: "border-blue-500 text-blue-400 bg-blue-950/40",
      pillBg: "bg-blue-950 border-blue-700 text-blue-300",
      description: "A precision rotary encoder tracks the unspooling tether line and capsule travel distance. When an obstacle is met, the exact distance from the manhole is stamped (e.g. 25.4 m).",
      activeSensors: "Rotary Wheel Encoder • Ground Cable Spool Counter • Odometry Filter",
      metric: "±2 cm Spatial Resolution over 30m Conduit",
      takeaway: "Municipal crews know precisely where to excavate or position suction hoses instead of guessing along entire streets."
    },
    {
      id: "assess",
      stepNum: "03",
      name: "ASSESS",
      tagline: "IMU, current sensor and flow sensor monitor movement, resistance and water-flow conditions.",
      icon: Gauge,
      color: "border-teal-500 text-teal-400 bg-teal-950/40",
      pillBg: "bg-teal-950 border-teal-700 text-teal-300",
      description: "Multiple physical sensors continuously poll the environment: MPU6050 flags abnormal pitch/roll, ACS712 monitors motor current to detect debris resistance, and the flow sensor reads flood surges.",
      activeSensors: "MPU6050 6-DOF IMU • ACS712 Current Shunt • Turbine Flow Meter",
      metric: "50Hz Polling Rate across All Transducers",
      takeaway: "Distinguishes between harmless floating leaves and dangerous high-pressure silt dams that threaten worker stability."
    },
    {
      id: "decide",
      stepNum: "04",
      name: "DECIDE",
      tagline: "ESP32 combines sensor information and determines system status.",
      icon: Cpu,
      color: "border-indigo-500 text-indigo-400 bg-indigo-950/40",
      pillBg: "bg-indigo-950 border-indigo-700 text-indigo-300",
      description: "The onboard ESP32 runs a deterministic edge sensor fusion state machine. It evaluates compound conditions (e.g., motor current high + water flow surge + tilt shift) to generate immediate hazard ratings.",
      activeSensors: "ESP32 Dual-Core • FreeRTOS Real-Time Decision Loop • Edge Fusion Engine",
      metric: "< 20ms Decision Latency for Emergency Stop",
      takeaway: "Eliminates operator hesitation by autonomously classifying risk: NORMAL, CAUTION, or CRITICAL BLOCKAGE."
    },
    {
      id: "return",
      stepNum: "05",
      name: "RETURN",
      tagline: "Unsafe condition detected or operator aborts: stop, anchor and controlled recovery.",
      icon: RotateCcw,
      color: "border-amber-500 text-amber-400 bg-amber-950/40",
      pillBg: "bg-amber-950 border-amber-700 text-amber-300",
      description: "If an unsafe condition is flagged or the operator commands an abort, thrusters halt immediately. The servo-driven folding anchor deploys against the bed, and the high-tensile tether spools back smoothly.",
      activeSensors: "Waterproof High-Torque Servo • Articulated Flukes • 50kg Kevlar Tether",
      metric: "100% Mechanical Retrieval Guarantee",
      takeaway: "The capsule cannot be swept away by rushing torrents; recoverability is engineered into the core architecture."
    }
  ];

  const currentStep = workflowSteps[selectedWorkflow];

  return (
    <section id="solution" className="relative py-20 md:py-28 bg-[#050811] overflow-hidden">
      
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 02 // AUTONOMOUS FIRST RESPONDER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">AQUA-SHIELD</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A purpose-built, low-cost autonomous capsule that eliminates guesswork by executing a closed-loop five-stage inspection and assessment sequence before any worker steps foot inside.
          </p>
        </div>

        {/* Five-Stage Workflow Pipeline Strip */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = selectedWorkflow === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedWorkflow(idx)}
                  className={`w-full md:flex-1 flex items-center justify-between md:justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                      : 'hover:bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected ? 'bg-cyan-400 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {step.stepNum}
                    </div>
                    <div>
                      <div className={`text-xs sm:text-sm font-bold font-heading tracking-wide ${
                        isSelected ? 'text-cyan-300' : 'text-slate-300'
                      }`}>
                        {step.name}
                      </div>
                      <div className="text-[10px] text-slate-500 hidden lg:block">
                        {step.tagline.split('.')[0]}
                      </div>
                    </div>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep Dive Stage Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden shadow-xl">
              
              {/* Top Meta */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${currentStep.pillBg}`}>
                  STAGE {currentStep.stepNum} // CORE OPERATION
                </span>
                <span className="text-xs font-mono text-cyan-400 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> CLOSED-LOOP SAFETY
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl sm:text-3xl font-black text-white font-heading mb-2">
                {currentStep.name}: <span className="text-cyan-400">{currentStep.tagline}</span>
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {currentStep.description}
              </p>

              {/* Specs & Hardware Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 font-mono">ACTIVE SUBSYSTEMS:</span>
                  <span className="text-cyan-300 font-semibold">{currentStep.activeSensors}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400 font-mono">PERFORMANCE BENCHMARK:</span>
                  <span className="text-emerald-400 font-mono">{currentStep.metric}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs py-1.5">
                  <span className="text-slate-400 font-mono">HUMAN SAFETY BENEFIT:</span>
                  <span className="text-slate-200">{currentStep.takeaway}</span>
                </div>
              </div>

              {/* Step Selector Buttons */}
              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  disabled={selectedWorkflow === 0}
                  onClick={() => setSelectedWorkflow(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 hover:border-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-slate-300"
                >
                  ← Previous Stage
                </button>
                <div className="text-xs font-mono text-slate-400">
                  {selectedWorkflow + 1} of 5
                </div>
                <button
                  disabled={selectedWorkflow === workflowSteps.length - 1}
                  onClick={() => setSelectedWorkflow(prev => Math.min(workflowSteps.length - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Next Stage →
                </button>
              </div>

            </div>
          </div>

          {/* Right: Technical Blueprint Cutaway Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 relative overflow-hidden">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>TECHNICAL ILLUSTRATION // WORKFLOW SCHEMATIC</span>
                <span className="text-slate-500">REV 1.4</span>
              </div>

              {/* Simplified Animated Schematic */}
              <div className="relative p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
                
                {/* Simulated Pipe Walls */}
                <div className="w-full h-1 bg-slate-800 absolute top-4 left-0"></div>
                <div className="w-full h-1 bg-slate-800 absolute bottom-4 left-0"></div>
                
                {/* Water Level Line */}
                <div className="w-full h-20 bg-gradient-to-t from-cyan-950/40 to-transparent absolute bottom-4 left-0 pointer-events-none"></div>

                {/* Capsule Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-48 h-20 rounded-full bg-[#0a1428] border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-between px-4 relative">
                    
                    {/* Front Dome */}
                    <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-300 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-cyan-300 animate-pulse"></div>
                    </div>

                    {/* Internal Electronics Icon */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono font-bold text-white">AQUA-SHIELD</span>
                      <span className="text-[8px] font-mono text-cyan-400">ESP32 + FUSION</span>
                    </div>

                    {/* Shrouded Thrusters */}
                    <div className="flex flex-col space-y-1">
                      <div className="w-3 h-3 rounded bg-cyan-950 border border-cyan-400"></div>
                      <div className="w-3 h-3 rounded bg-cyan-950 border border-cyan-400"></div>
                    </div>

                    {/* Tether Cable Line coming out back */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent translate-x-full"></div>
                  </div>

                  {/* Distance Pointer Marker */}
                  <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-700">
                    <span>STATUS: {currentStep.name}</span>
                    <span>•</span>
                    <span>ODOMETRY: ACTIVE</span>
                  </div>
                </div>

                {/* Simulated Obstacle Dam at Far Right */}
                <div className="absolute right-2 bottom-4 top-4 w-6 bg-gradient-to-l from-amber-900/60 to-red-950/80 border-l border-amber-500/50 rounded flex items-center justify-center">
                  <span className="text-[8px] font-mono text-amber-300 -rotate-90 whitespace-nowrap">BLOCKAGE</span>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400 font-mono">
                  Controlled testbed workflow: Sensor telemetry continuously streamed via tether while local microSD logs 50Hz black-box state.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
