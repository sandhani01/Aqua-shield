import React, { useState } from 'react';
import { 
  Camera, 
  Gauge, 
  Compass, 
  Activity, 
  Waves, 
  Cpu, 
  AlertOctagon, 
  CheckCircle, 
  ArrowDown, 
  Sparkles,
  Sliders,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export default function SensorFusionSection() {
  // Scenarios available for interactive exploration
  const scenarios = [
    {
      id: "choke-point",
      name: "Critical Blockage at 25.4 m (Prompt Scenario)",
      badge: "CRITICAL HAZARD",
      badgeColor: "bg-red-950 text-red-300 border-red-500",
      inputs: {
        camera: "Obstruction visible (Debris dam / silt choked)",
        cameraStatus: "hazard",
        encoder: "25.4 m (Travel odometry distance)",
        encoderStatus: "nominal",
        current: "Motor load HIGH (910 mA / drag resistance)",
        currentStatus: "hazard",
        flow: "HIGH (41.8 L/min surge restriction)",
        flowStatus: "hazard",
        imu: "Abnormal movement (Pitch 14.8° tilt shift)",
        imuStatus: "hazard"
      },
      output: {
        detection: "BLOCKAGE DETECTED",
        location: "APPROX. LOCATION: 25.4 m",
        risk: "OPERATING CONDITION: HIGH RISK",
        action: "ACTION: RETURN (HALT THRUSTERS & DEPLOY ANCHOR)",
        statusColor: "border-red-500 bg-red-950/40 text-red-400",
        pillColor: "bg-red-500 text-slate-950"
      },
      explanation: "Single sensor reading alone could be a false positive (e.g., murky water or temporary current spike). The fusion engine correlates elevated current + surge flow + abnormal tilt + optical occlusion to verify a genuine physical dam."
    },
    {
      id: "clear-transit",
      name: "Nominal Mid-Pipe Cruising (10.0 m)",
      badge: "SYSTEM NOMINAL",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500",
      inputs: {
        camera: "Conduit clear (Normal water line visible)",
        cameraStatus: "nominal",
        encoder: "10.0 m (Smooth forward transit)",
        encoderStatus: "nominal",
        current: "Motor load NOMINAL (260 mA baseline)",
        currentStatus: "nominal",
        flow: "NORMAL (15.6 L/min steady drainage)",
        flowStatus: "nominal",
        imu: "Stable horizontal orientation (Pitch 1.8°)",
        imuStatus: "nominal"
      },
      output: {
        detection: "CLEAR CONDUIT / NOMINAL INCLINE",
        location: "CURRENT POSITION: 10.0 m",
        risk: "OPERATING CONDITION: LOW RISK",
        action: "ACTION: CONTINUE FORWARD INSPECTION",
        statusColor: "border-emerald-500 bg-emerald-950/40 text-emerald-400",
        pillColor: "bg-emerald-400 text-slate-950"
      },
      explanation: "All 5 transducer channels report balanced equilibrium. Firmware keeps thrusters at 40% duty cycle, collecting standard 30 FPS video telemetry."
    },
    {
      id: "turbulence-warning",
      name: "Hydraulic Turbulence Warning (20.0 m)",
      badge: "WARNING THRESHOLD",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500",
      inputs: {
        camera: "Turbid water / minor floating particles",
        cameraStatus: "warning",
        encoder: "20.0 m (Approaching restriction zone)",
        encoderStatus: "nominal",
        current: "Motor load MODERATE (440 mA resistance)",
        currentStatus: "warning",
        flow: "ELEVATED (26.5 L/min backpressure buildup)",
        flowStatus: "warning",
        imu: "Minor hydrodynamic vibration (Pitch 6.2°)",
        imuStatus: "warning"
      },
      output: {
        detection: "BACKWATER PRESSURE WARNING",
        location: "CURRENT POSITION: 20.0 m",
        risk: "OPERATING CONDITION: MODERATE RISK",
        action: "ACTION: SLOW THRUSTERS / DOUBLE SENSOR SAMPLING",
        statusColor: "border-amber-500 bg-amber-950/40 text-amber-400",
        pillColor: "bg-amber-400 text-slate-950"
      },
      explanation: "Flow turbulence and moderate current increase triggers early caution state without aborting prematurely, enabling the capsule to approach carefully for visual verification."
    }
  ];

  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const active = scenarios[activeScenarioIdx];

  return (
    <section id="sensor-fusion" className="relative py-20 md:py-28 bg-[#070b16] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 05 // MULTI-SENSOR FUSION ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            One Sensor Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-400 to-cyan-400">Not Enough</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            In murky flooded culverts, a single camera can be blinded by silt, and a current spike could just be a minor twig. AQUA-SHIELD fuses 5 concurrent telemetry streams to achieve deterministic hazard classification.
          </p>

          {/* Interactive Scenario Selector */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {scenarios.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => setActiveScenarioIdx(i)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeScenarioIdx === i
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                }`}
              >
                {sc.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Sensor Fusion Flow Architecture */}
        <div className="max-w-5xl mx-auto">
          
          {/* Level 1: Five Sensors */}
          <div className="text-center mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              [LAYER 1: CONCURRENT SENSOR INPUT TRANSDUCERS]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
            
            {/* Sensor 1: Camera */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              active.inputs.cameraStatus === 'hazard'
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : active.inputs.cameraStatus === 'warning'
                ? 'bg-amber-950/30 border-amber-500'
                : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400 border border-white/10">
                <Camera className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white font-heading">Camera</div>
              <div className="text-[9px] font-mono text-cyan-400 mb-1">Visual Stream</div>
              <div className="text-[10px] font-mono text-slate-300 leading-tight">
                {active.inputs.camera}
              </div>
            </div>

            {/* Sensor 2: Rotary Encoder */}
            <div className="p-3.5 rounded-xl border bg-slate-900/70 border-slate-800 text-center transition-all">
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400 border border-white/10">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white font-heading">Encoder</div>
              <div className="text-[9px] font-mono text-cyan-400 mb-1">Distance Tracker</div>
              <div className="text-[10px] font-mono text-emerald-400 font-bold leading-tight">
                {active.inputs.encoder}
              </div>
            </div>

            {/* Sensor 3: IMU */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              active.inputs.imuStatus === 'hazard'
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : active.inputs.imuStatus === 'warning'
                ? 'bg-amber-950/30 border-amber-500'
                : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400 border border-white/10">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white font-heading">IMU (MPU6050)</div>
              <div className="text-[9px] font-mono text-cyan-400 mb-1">Kinematics & Tilt</div>
              <div className="text-[10px] font-mono text-slate-300 leading-tight">
                {active.inputs.imu}
              </div>
            </div>

            {/* Sensor 4: Current Sensor */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              active.inputs.currentStatus === 'hazard'
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : active.inputs.currentStatus === 'warning'
                ? 'bg-amber-950/30 border-amber-500'
                : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400 border border-white/10">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white font-heading">Current Sensor</div>
              <div className="text-[9px] font-mono text-cyan-400 mb-1">Motor Load</div>
              <div className="text-[10px] font-mono text-slate-300 leading-tight">
                {active.inputs.current}
              </div>
            </div>

            {/* Sensor 5: Flow Sensor */}
            <div className={`p-3.5 rounded-xl border text-center transition-all ${
              active.inputs.flowStatus === 'hazard'
                ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : active.inputs.flowStatus === 'warning'
                ? 'bg-amber-950/30 border-amber-500'
                : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-black/40 flex items-center justify-center text-cyan-400 border border-white/10">
                <Waves className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-white font-heading">Flow Sensor</div>
              <div className="text-[9px] font-mono text-cyan-400 mb-1">Water Hydrodynamics</div>
              <div className="text-[10px] font-mono text-slate-300 leading-tight">
                {active.inputs.flow}
              </div>
            </div>

          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center my-3 text-cyan-400 animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Level 2: ESP32 Edge Sensor Fusion Brain */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-cyan-950/60 border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] text-center mb-6">
            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-cyan-300 mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>LAYER 2: ESP32 EDGE DECISION MATRIX // REAL-TIME FUSION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-heading uppercase tracking-wide">
              Multi-Parametric Correlation State Machine
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              {active.explanation}
            </p>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center my-3 text-cyan-400 animate-bounce">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Level 3: Output System Status */}
          <div className="text-center mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              [LAYER 3: DETERMINISTIC MISSION STATUS & SAFETY ACTION]
            </span>
          </div>

          <div className={`p-6 sm:p-8 rounded-2xl border-2 ${active.output.statusColor} backdrop-blur-md shadow-2xl relative overflow-hidden text-center`}>
            
            <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow">
              <span className={`px-2.5 py-0.5 rounded-full ${active.output.pillColor}`}>
                {active.output.detection}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto my-3">
              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400">ESTIMATED LOCATION</div>
                <div className="text-base font-bold text-cyan-300 font-mono">
                  {active.output.location}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400">OPERATING CONDITION</div>
                <div className="text-base font-bold text-amber-300 font-mono">
                  {active.output.risk}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                <div className="text-[10px] font-mono text-slate-400">SYSTEM ACTION</div>
                <div className="text-base font-bold text-white font-mono">
                  {active.output.action}
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] font-mono text-slate-400">
              Telemetry logged with microsecond timestamp to local microSD FAT32 storage and streamed up the tether.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
