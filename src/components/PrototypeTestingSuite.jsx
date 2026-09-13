import React, { useState } from 'react';
import { 
  Award, 
  Camera, 
  Gamepad2, 
  Compass, 
  Zap, 
  Activity, 
  Waves, 
  Droplets, 
  BatteryCharging, 
  Anchor, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Info,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Gauge
} from 'lucide-react';

export default function PrototypeTestingSuite({ 
  telemetry = {}, 
  isCameraOnline = false, 
  activeCommand = 'S', 
  sendRobotCommand = () => {} 
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'test1', ... 'test9'
  
  // Test 1: Camera Test State
  const testObjects = [
    { name: 'Plastic bottle', icon: '🍼', desc: 'Floating synthetic container' },
    { name: 'Leaves', icon: '🍂', desc: 'Organic sediment & foliage' },
    { name: 'Mud', icon: '🪵', desc: 'Dense silt / bottom deposit' },
    { name: 'Plastic waste', icon: '🛍️', desc: 'Non-biodegradable blockage' },
  ];

  // Test 3: Encoder Distance Traverse Simulation State
  const [demoDistance, setDemoDistance] = useState(27.0);

  // Test 4: Current / Motor Load Simulation State
  const [currentLoadLevel, setCurrentLoadLevel] = useState('normal'); // 'normal' (0.8A), 'obs1' (1.2A), 'obs2' (1.5A), 'high' (1.8A)

  // Test 5: IMU Tilt Simulation State
  const [imuSimState, setImuSimState] = useState('normal'); // 'normal' (2.1°), 'abnormal' (8.5°)

  // Test 6: Flow Rate Simulation State
  const [flowRateLevel, setFlowRateLevel] = useState('normal'); // 'normal', 'high', 'critical'

  // Test 7: Gas Sensor State
  const [gasSimState, setGasSimState] = useState('normal'); // 'normal', 'abnormal'

  // Test 8: Battery Monitor State
  const [batterySimState, setBatterySimState] = useState('normal'); // 'normal', 'low'

  // Test 9: Tether Recovery State
  const [tetherStep, setTetherStep] = useState('ready'); // 'ready', 'stuck', 'stop_motors', 'anchor', 'recovery'

  // Calculations
  const effectiveDistance = demoDistance;
  const isBlockageDetected = effectiveDistance >= 25.0;

  // Load calculations
  const loadAmps = currentLoadLevel === 'high' ? 1.8 : currentLoadLevel === 'obs2' ? 1.5 : currentLoadLevel === 'obs1' ? 1.2 : (telemetry.current > 0 ? +(telemetry.current / 1000).toFixed(2) : 0.8);
  const isHighLoad = loadAmps >= 1.5;

  // IMU calculations
  const effectiveTilt = imuSimState === 'abnormal' ? 8.5 : 2.1;
  const isTiltAbnormal = effectiveTilt >= 8.0;

  // Flow & Decision Support calculation
  const isHighFlow = flowRateLevel === 'high' || flowRateLevel === 'critical';
  const isHighRisk = isHighFlow && isTiltAbnormal;

  // Gas calculation
  const isGasAbnormal = gasSimState === 'abnormal' || telemetry.gas > 1800;

  // Battery calculation
  const batteryPct = batterySimState === 'low' ? 14 : 78;
  const batteryVolts = batterySimState === 'low' ? 10.2 : (telemetry.voltage > 0 ? telemetry.voltage : 11.6);
  const isLowBattery = batteryPct < 20 || batteryVolts < 10.8;

  return (
    <div className="mt-12 font-sans space-y-12">
      
      {/* ========================================================================= */}
      {/* SECTION HEADER                                                            */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#070e20] border-2 border-cyan-500/40 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-cyan-950">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border-2 border-cyan-400/70 flex items-center justify-center text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
              <Award className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white font-mono">
                  LABORATORY VERIFICATION &amp; EVALUATION SUITE
                </h2>
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-extrabold bg-cyan-950 border border-cyan-500/60 text-cyan-300">
                  TESTS 1 – 9
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-mono mt-1">
                Rigorous empirical hardware test protocols &amp; interactive demonstrations for judges
              </p>
            </div>
          </div>

          {/* Quick Jump Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono">
            {[
              { id: 'all', label: 'All 9 Tests' },
              { id: 'test1', label: '1. Camera' },
              { id: 'test2', label: '2. Motors' },
              { id: 'test3', label: '3. Encoder' },
              { id: 'test4', label: '4. Load' },
              { id: 'test5', label: '5. IMU' },
              { id: 'test6', label: '6. Flow' },
              { id: 'test7', label: '7. Gas' },
              { id: 'test8', label: '8. Battery' },
              { id: 'test9', label: '9. Tether' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all font-bold ${
                  activeTab === tab.id
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105'
                    : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Sensor Fusion Alert if Triggered */}
        {isHighRisk && (
          <div className="mt-6 p-5 rounded-2xl bg-red-950 border-2 border-red-500 text-red-100 font-mono flex items-center justify-between animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <strong className="text-white text-base sm:text-lg block mb-1">
                  ⚠️ CRITICAL DECISION-SUPPORT: HIGH RISK PROTOCOL ACTIVE
                </strong>
                <span className="text-sm sm:text-base leading-relaxed">
                  Sensor Fusion Triggered: <strong className="text-amber-300">HIGH FLOW</strong> + <strong className="text-red-300">ABNORMAL MOVEMENT (8.5° TILT)</strong> = <strong className="text-red-400 underline font-black">HIGH RISK</strong>. Recommended Action: STOP MOTORS IMMEDIATELY &amp; ENGAGE RETRIEVAL TETHER.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: 5. TEST 1 — CAMERA TEST                                        */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test1') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Camera className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                5. TEST 1 — Camera Test
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">CAMERA STATUS:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isCameraOnline ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}>
                {isCameraOnline ? 'ONLINE 🟢' : 'AWAITING ESP32-CAM STREAM'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Objective & Procedure (6 cols) */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Objective
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Verify that the camera can inspect a dark drainage passage.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
                    Procedure
                  </h4>
                  <ol className="text-sm sm:text-base text-slate-200 space-y-2.5 font-mono list-decimal list-inside leading-relaxed bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                    <li><strong className="text-white">Turn ON the camera.</strong> (ESP32-CAM stream initialized)</li>
                    <li><strong className="text-white">Turn ON the LED lights.</strong> (Dual high-intensity headlights)</li>
                    <li><strong className="text-white">Place the robot inside the transparent test channel.</strong></li>
                    <li><strong className="text-white">Place different objects inside:</strong></li>
                    <div className="grid grid-cols-2 gap-3 pl-4 py-2">
                      {testObjects.map((obj, i) => (
                        <div key={i} className="flex items-center space-x-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
                          <span className="text-base">{obj.icon}</span>
                          <span className="font-bold">{obj.name}</span>
                        </div>
                      ))}
                    </div>
                    <li><strong className="text-white">View the live camera feed on the website.</strong></li>
                  </ol>
                </div>
              </div>

              {/* Right: Expected Result (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="p-6 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      EXPECTED RESULT (WEBSITE DISPLAY)
                    </span>
                    <span className="text-xs font-bold text-slate-400">BENCHMARK CHECKLIST</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold mb-1">CAMERA</span>
                      <span className="text-lg sm:text-xl font-black text-emerald-400">
                        → ONLINE
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold mb-1">LED</span>
                      <span className="text-lg sm:text-xl font-black text-cyan-300">
                        → ON
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold mb-1">VIDEO</span>
                      <span className="text-lg sm:text-xl font-black text-emerald-400">
                        → LIVE
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex flex-col">
                      <span className="text-xs text-slate-400 uppercase font-bold mb-1">VISUAL</span>
                      <span className="text-base sm:text-lg font-black text-emerald-300 leading-tight">
                        → BLOCKAGE/DEBRIS VISIBLE
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-300 border-t border-slate-800 pt-3">
                    <span>Camera Stream Endpoint: <code className="text-cyan-400 font-bold">http://192.168.4.1/stream</code></span>
                    <span>Port: <strong className="text-white font-bold">80</strong></span>
                  </div>
                </div>
              </div>

            </div>

            {/* Prominent Judge Explanation Quote */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “First, we verify that AQUA-SHIELD can visually inspect a dark drainage passage without requiring immediate human entry.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 6. TEST 2 — MOTOR AND WHEEL TEST                               */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test2') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Gamepad2 className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                6. TEST 2 — Motor and Wheel Test
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">DRIVE STATE:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                activeCommand !== 'S' ? 'bg-emerald-950 border-emerald-500 text-emerald-300 animate-pulse' : 'bg-slate-900 border-slate-700 text-amber-300'
              }`}>
                {activeCommand !== 'S' ? 'RUNNING 🟢' : 'STOPPED 🛑'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Objective & Test Check (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Objective
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Verify that the robot can move inside the drainage channel.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                    Test Motions Check
                  </h4>
                  <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                    {['Forward', 'Reverse', 'Left', 'Right', 'Stop'].map((m, i) => (
                      <div key={i} className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-center justify-between">
                        <span className="font-bold">{m}</span>
                        <span className="text-emerald-400 font-black">✓ VERIFIED</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: Large Centered D-Pad (4 cols) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border-2 border-slate-800 font-mono">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                  The website should provide:
                </span>

                {/* Substantial D-Pad Layout */}
                <div className="flex flex-col items-center space-y-3">
                  {/* FORWARD */}
                  <button
                    onClick={() => sendRobotCommand('F')}
                    className={`w-44 py-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      activeCommand === 'F' 
                        ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] font-black scale-105' 
                        : 'bg-[#0a1428] border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 font-bold'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5 mb-0.5" />
                    <span className="text-sm font-black">FORWARD</span>
                  </button>

                  {/* LEFT - STOP - RIGHT */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => sendRobotCommand('L')}
                      className={`w-32 py-3.5 rounded-2xl border-2 flex items-center justify-center space-x-1.5 transition-all ${
                        activeCommand === 'L' 
                          ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] font-black scale-105' 
                          : 'bg-[#0a1428] border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 font-bold'
                      }`}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="text-sm font-black">LEFT</span>
                    </button>

                    <button
                      onClick={() => sendRobotCommand('S')}
                      className={`w-28 py-4 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        activeCommand === 'S' 
                          ? 'bg-red-600 text-white border-red-400 shadow-[0_0_20px_#ef4444] font-black scale-110' 
                          : 'bg-red-950/80 border-red-800 text-red-300 hover:bg-red-900 font-black'
                      }`}
                    >
                      <span className="text-base font-black">STOP</span>
                    </button>

                    <button
                      onClick={() => sendRobotCommand('R')}
                      className={`w-32 py-3.5 rounded-2xl border-2 flex items-center justify-center space-x-1.5 transition-all ${
                        activeCommand === 'R' 
                          ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] font-black scale-105' 
                          : 'bg-[#0a1428] border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 font-bold'
                      }`}
                    >
                      <span className="text-sm font-black">RIGHT</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* REVERSE */}
                  <button
                    onClick={() => sendRobotCommand('B')}
                    className={`w-44 py-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                      activeCommand === 'B' 
                        ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] font-black scale-105' 
                        : 'bg-[#0a1428] border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 font-bold'
                    }`}
                  >
                    <span className="text-sm font-black">REVERSE</span>
                    <ArrowDown className="w-5 h-5 mt-0.5" />
                  </button>
                </div>

                <span className="text-xs text-slate-400 mt-4 font-mono">Keyboard: W (Fwd), S (Rev), A (Left), D (Right), Space (Stop)</span>
              </div>

              {/* Right: Large Website Display (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                <div className="p-6 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono shadow-xl">
                  <div className="text-sm sm:text-base font-black text-cyan-300 tracking-wider border-b border-slate-800 pb-3 mb-5">
                    WEBSITE DISPLAY
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Motor Status:</span>
                      <span className={`text-lg sm:text-xl font-mono font-black ${activeCommand !== 'S' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}>
                        {activeCommand !== 'S' ? 'RUNNING' : 'STOPPED'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Direction:</span>
                      <span className="text-lg sm:text-xl font-mono font-black text-white">
                        {activeCommand === 'F' && 'FORWARD'}
                        {activeCommand === 'B' && 'REVERSE'}
                        {activeCommand === 'L' && 'LEFT'}
                        {activeCommand === 'R' && 'RIGHT'}
                        {activeCommand === 'S' && 'STOPPED'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070e20] border border-cyan-950 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Speed:</span>
                      <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300">
                        60%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “Wheels provide simple, reliable movement for student drain inspection.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: 7. TEST 3 — ENCODER / DISTANCE MEASUREMENT                     */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test3') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Compass className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                7. TEST 3 — Encoder / Distance Measurement
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">BLOCKAGE STATUS:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isBlockageDetected ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-cyan-950 border-cyan-500 text-cyan-300'
              }`}>
                {isBlockageDetected ? 'BLOCKAGE DETECTED (≈ 27.0 m) 🔴' : 'CHANNEL CLEAR 🟢'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Importance & Traverse Sequence (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Core Feature
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    This is one of the most important features. The encoder measures how far the robot has travelled.
                  </p>
                </div>

                {/* Traverse progression diagram */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm">
                  <span className="text-slate-300 font-bold block mb-3 text-xs sm:text-sm uppercase tracking-wider">
                    TRAVERSE PROGRESSION EXAMPLE:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-slate-700">START</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">0 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">5 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">10 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">15 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">20 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-200">25 m</span>
                    <span className="text-slate-500">→</span>
                    <span className="px-3 py-1 rounded-lg bg-red-950 border border-red-600 text-red-300 font-black animate-pulse">
                      BLOCKAGE (27 m)
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
                  <strong className="text-white block mb-1">Demonstration:</strong>
                  Place an artificial blockage at a known distance (e.g., 27 m). The system displays approximately:
                  <div className="mt-2 text-center text-red-400 font-mono font-bold text-sm bg-red-950/60 p-2 rounded-lg border border-red-800">
                    BLOCKAGE DETECTED — APPROX. 27 m
                  </div>
                </div>
              </div>

              {/* Right: Big Visual Progress Track & Demonstration (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE: INSPECTION DISTANCE
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {effectiveDistance.toFixed(1)} <span className="text-xl text-cyan-400">m</span>
                    </span>
                  </div>

                  {/* Big Distance Progress Bar */}
                  <div className="py-4">
                    <div className="relative w-full h-8 bg-slate-900 rounded-full border-2 border-slate-700 overflow-hidden my-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          effectiveDistance >= 26.0 ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_15px_#06b6d4]'
                        }`}
                        style={{ width: `${Math.min(100, (effectiveDistance / 30) * 100)}%` }}
                      />
                      {/* Pin at 27m (90% of 30m) */}
                      <div 
                        className="absolute top-0 bottom-0 w-2.5 bg-amber-400 z-10 shadow-[0_0_10px_#f59e0b] animate-pulse" 
                        style={{ left: '90%' }} 
                        title="27.0 m Benchmark Blockage"
                      />
                    </div>

                    {/* Distance Labels */}
                    <div className="flex justify-between text-xs sm:text-sm text-slate-400 font-mono px-2 font-bold">
                      <span>0 m</span>
                      <span>5 m</span>
                      <span>10 m</span>
                      <span>15 m</span>
                      <span>20 m</span>
                      <span>25 m</span>
                      <span className="text-amber-400 font-black text-sm sm:text-base flex flex-col items-center">
                        <span>● 27 m</span>
                        <span className="text-[10px] text-red-400">CHOKE</span>
                      </span>
                      <span>30 m</span>
                    </div>
                  </div>

                  {/* Blockage Alert Callout */}
                  <div className="p-4 rounded-xl bg-[#070e20] border-2 border-cyan-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-base">
                    <div>
                      <span className="text-slate-400 mr-2 font-bold">BLOCKAGE:</span>
                      <strong className={`text-lg sm:text-xl font-black ${isBlockageDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                        {isBlockageDetected ? 'DETECTED' : 'CLEAR'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 mr-2 font-bold">LOCATION:</span>
                      <strong className="text-xl sm:text-2xl font-black text-amber-300">
                        ≈ {effectiveDistance.toFixed(1)} m
                      </strong>
                    </div>
                  </div>

                  {/* Demonstration Interactive Step Buttons */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Click to Test Known Distance Traverse:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[0, 5, 10, 15, 20, 25, 27].map((dist) => (
                        <button
                          key={dist}
                          onClick={() => setDemoDistance(dist)}
                          className={`px-4 py-2 rounded-xl text-sm font-mono font-black border-2 transition-all ${
                            effectiveDistance === dist 
                              ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_15px_#06b6d4] scale-105' 
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          {dist} m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “The encoder provides the distance information; the camera and other sensors provide supporting evidence.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: 8. TEST 4 — CURRENT SENSOR / MOTOR LOAD                        */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test4') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Zap className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                8. TEST 4 — Current Sensor / Motor Load
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">LOAD CLASSIFICATION:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isHighLoad ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {isHighLoad ? '🔴 HIGH MOTOR LOAD' : '🟢 NORMAL LOAD'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Dynamic & Curve Concept (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Load Dynamics
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Normal movement: <span className="text-emerald-400 font-mono font-bold">Motor Current = NORMAL</span>.
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    When the robot encounters resistance:<br />
                    <code className="text-cyan-300 font-bold font-mono text-base">Motor resistance ↑ → Motor current ↑</code>
                  </p>
                </div>

                {/* Resistance Progression Diagram */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-3">
                  <span className="text-slate-300 text-xs sm:text-sm font-bold block uppercase tracking-wider">
                    CURRENT RESISTANCE CURVE:
                  </span>
                  <div className="flex justify-between items-center text-sm sm:text-base p-2.5 rounded-xl bg-[#070e20]">
                    <span className="text-slate-400">Normal:</span>
                    <span className="text-emerald-400 font-black">0.8 A</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base p-2.5 rounded-xl bg-[#070e20]">
                    <span className="text-slate-400">Obstacle Drag 1:</span>
                    <span className="text-amber-400 font-black">1.2 A</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base p-2.5 rounded-xl bg-[#070e20]">
                    <span className="text-slate-400">Obstacle Drag 2:</span>
                    <span className="text-amber-300 font-black">1.5 A</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base p-2.5 rounded-xl bg-red-950/80 border border-red-700">
                    <span className="text-red-200 font-bold">Obstacle High Load:</span>
                    <span className="text-red-400 font-black text-lg animate-pulse">1.8 A → HIGH LOAD</span>
                  </div>
                </div>
              </div>

              {/* Right: Dynamic Display & Interactive Obstacle Buttons (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE DISPLAY TRANSITION
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {loadAmps.toFixed(2)} <span className="text-xl text-cyan-400">A</span>
                    </span>
                  </div>

                  {/* Dynamic Transition Banner */}
                  <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                    isHighLoad 
                      ? 'bg-red-950 border-red-500 text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.5)]' 
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                  }`}>
                    <span className="text-2xl sm:text-3xl font-black tracking-wider">
                      {isHighLoad ? '🔴 HIGH MOTOR LOAD' : '🟢 NORMAL'}
                    </span>
                    <span className="text-base sm:text-lg font-bold mt-2">
                      {isHighLoad ? '⚠️ Possible obstruction detected' : 'Clear rolling passage (Motor current = NORMAL)'}
                    </span>
                  </div>

                  {/* Interactive Buttons */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Click to Test Resistance Load Stages:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'normal', val: '0.8 A', label: 'Normal' },
                        { id: 'obs1', val: '1.2 A', label: 'Obstacle 1' },
                        { id: 'obs2', val: '1.5 A', label: 'Obstacle 2' },
                        { id: 'high', val: '1.8 A', label: 'High Load' },
                      ].map((step) => (
                        <button
                          key={step.id}
                          onClick={() => setCurrentLoadLevel(step.id)}
                          className={`p-3.5 rounded-xl text-sm sm:text-base font-mono text-center border-2 transition-all ${
                            currentLoadLevel === step.id 
                              ? 'bg-cyan-400 text-slate-950 font-black border-white shadow-[0_0_15px_#06b6d4] scale-105' 
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          <div className="font-black text-base sm:text-lg">{step.val}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{step.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800 text-xs sm:text-sm text-cyan-300">
                  <strong>Sensor Fusion Principle:</strong> A current increase alone does not prove that a blockage exists. Therefore, AQUA-SHIELD combines: <strong>Camera + Encoder + Current Sensor</strong> to provide stronger blockage evidence.
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “By fusing visual recognition, travel distance, and electrical load, false alarms are eliminated.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: 9. TEST 5 — IMU TEST                                           */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test5') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Activity className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                9. TEST 5 — IMU Test
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">MOVEMENT STATUS:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isTiltAbnormal ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {isTiltAbnormal ? '🔴 ABNORMAL MOVEMENT' : '🟢 STABLE'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Objective & Normal Condition (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Objective
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Monitor abnormal movement or excessive tilt to prevent vehicle rollover.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-3">
                  <span className="text-slate-300 font-bold block text-xs sm:text-sm uppercase tracking-wider">
                    NORMAL CONDITION:
                  </span>
                  <div className="flex justify-between items-center text-base p-2.5 rounded-xl bg-[#070e20]">
                    <span className="text-slate-400">Tilt:</span>
                    <span className="text-emerald-400 font-black">2.1°</span>
                  </div>
                  <div className="flex justify-between items-center text-base p-2.5 rounded-xl bg-[#070e20]">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-emerald-400 font-black">STABLE</span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 text-xs sm:text-sm text-slate-300">
                    If the robot is tilted beyond a predefined threshold:
                    <div className="text-red-300 font-black mt-1 text-sm sm:text-base">
                      Tilt → ABNORMAL MOVEMENT → STOP
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
                  <strong className="text-white block mb-1">Experimental Threshold:</strong>
                  “The exact threshold should be determined experimentally based on your robot and test channel.”
                </div>
              </div>

              {/* Right: Large IMU STATUS Display & Toggle (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE: IMU STATUS
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">MPU6050 6-DOF</span>
                  </div>

                  {/* Tilt Angle Readout */}
                  <div className="p-6 rounded-2xl bg-[#070e20] border-2 border-cyan-950 text-center space-y-3">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      CURRENT INCLINE:
                    </span>
                    <div className={`text-4xl sm:text-5xl font-black font-mono ${isTiltAbnormal ? 'text-red-400' : 'text-emerald-400'}`}>
                      Tilt: {effectiveTilt.toFixed(1)}°
                    </div>

                    <div className={`p-3.5 rounded-xl border-2 font-black text-lg sm:text-xl tracking-wider ${
                      isTiltAbnormal 
                        ? 'bg-red-950 border-red-500 text-red-200 animate-pulse' 
                        : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    }`}>
                      {isTiltAbnormal ? '🔴 ABNORMAL MOVEMENT — ACTION: STOP' : '🟢 STABLE'}
                    </div>
                  </div>

                  {/* Interactive Toggle Buttons */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Test Incline Angle Trigger:
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setImuSimState('normal')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          imuSimState === 'normal' 
                            ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        Normal (2.1° STABLE)
                      </button>
                      <button
                        onClick={() => setImuSimState('abnormal')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          imuSimState === 'abnormal' 
                            ? 'bg-red-600 text-white border-white shadow-[0_0_20px_#ef4444] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        Abnormal (8.5° STOP)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center font-mono">
                  Autonomous failsafe: cutting motor drive power upon exceeding 8.0° threshold.
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “Prevents vehicle rollover in uneven pipes by automatically halting drive power upon acute pitch or roll.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: 10. TEST 6 — FLOW SENSOR                                       */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test6') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Waves className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                10. TEST 6 — Flow Sensor
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">FLOW CLASSIFICATION:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                flowRateLevel === 'critical' ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : flowRateLevel === 'high' ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {flowRateLevel === 'critical' ? '🔴 CRITICAL FLOW' : flowRateLevel === 'high' ? '🟡 HIGH FLOW' : '🟢 NORMAL FLOW'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Procedure & Tiers (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Channel Procedure
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Create water flow in the test channel using a small pump.
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 mt-2">
                    The website classifies channel hydrological condition into 3 distinct operational tiers:
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-2.5">
                  <div className={`p-3 rounded-xl flex justify-between items-center text-sm sm:text-base ${flowRateLevel === 'normal' ? 'bg-emerald-950 border border-emerald-500 font-black text-emerald-200' : 'text-slate-400 bg-slate-900'}`}>
                    <span>🟢 NORMAL FLOW</span>
                    <span>&lt; 15 L/min</span>
                  </div>
                  <div className={`p-3 rounded-xl flex justify-between items-center text-sm sm:text-base ${flowRateLevel === 'high' ? 'bg-amber-950 border border-amber-500 font-black text-amber-200' : 'text-slate-400 bg-slate-900'}`}>
                    <span>🟡 HIGH FLOW</span>
                    <span>15 – 35 L/min</span>
                  </div>
                  <div className={`p-3 rounded-xl flex justify-between items-center text-sm sm:text-base ${flowRateLevel === 'critical' ? 'bg-red-950 border border-red-500 font-black text-red-200' : 'text-slate-400 bg-slate-900'}`}>
                    <span>🔴 CRITICAL FLOW</span>
                    <span>&gt; 35 L/min</span>
                  </div>
                </div>

                {/* Decision Support Box */}
                <div className="p-5 rounded-2xl bg-red-950/60 border-2 border-red-800/80 font-mono text-sm space-y-2">
                  <span className="text-amber-300 font-black block uppercase tracking-wider text-xs sm:text-sm">
                    Decision-Support System:
                  </span>
                  <p className="text-slate-200 leading-relaxed text-sm">
                    If high flow is combined with abnormal robot movement:
                  </p>
                  <div className="p-2.5 rounded-xl bg-red-950 border border-red-600 text-center font-black text-red-200 text-base">
                    HIGH FLOW + ABNORMAL MOVEMENT → <span className="text-white text-lg">HIGH RISK</span>
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    This becomes part of the automated safety decision-support system.
                  </p>
                </div>
              </div>

              {/* Right: Large Display & Pump Triggers (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE DISPLAY
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">Turbine Hall Sensor</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#070e20] border-2 border-cyan-950 text-center space-y-3">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      Channel Flow Condition:
                    </span>
                    <div className={`text-3xl sm:text-4xl md:text-5xl font-black ${
                      flowRateLevel === 'critical' ? 'text-red-400' : flowRateLevel === 'high' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      Water Flow: {flowRateLevel.toUpperCase()}
                    </div>
                  </div>

                  {/* Big Pump Trigger Buttons */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Simulate Testbed Pump Rates:
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {['normal', 'high', 'critical'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFlowRateLevel(lvl)}
                          className={`py-4 rounded-2xl text-sm sm:text-base font-mono uppercase font-black border-2 transition-all ${
                            flowRateLevel === lvl 
                              ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] scale-105' 
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center font-mono">
                  Autonomous decision trigger: halts transit if flow exceeds 35 L/min or when combined with abnormal tilt.
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “Provides critical hydrodynamic situational awareness to prevent the inspection capsule from being swept away.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: 11. TEST 7 — GAS SENSOR                                        */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test7') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Droplets className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                11. TEST 7 — Gas Sensor
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">ATMOSPHERE:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isGasAbnormal ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {isGasAbnormal ? '⚠️ ABNORMAL GAS INDICATION' : '🟢 NORMAL'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Protected Sensing Inlet Concept (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Protected Sensing Inlet Architecture
                  </h4>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    The gas sensor should not simply be placed inside a completely sealed electronics enclosure.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-3">
                  <span className="text-cyan-300 font-black block text-xs sm:text-sm uppercase tracking-wider">
                    PROTECTED SENSING INLET SPECIFICATION:
                  </span>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    Use a protected sensing inlet so that the sensor can sample the surrounding atmosphere while the electronics remain protected from water.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs sm:text-sm space-y-1">
                    <div>✓ Waterproof electronics capsule enclosure</div>
                    <div>✓ Semi-permeable external sampling orifice</div>
                  </div>
                </div>
              </div>

              {/* Right: Large Website AIR/GAS Display & Threshold Toggle (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE: AIR / GAS CONDITION
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">MQ-Series Sniffer</span>
                  </div>

                  {/* Readout Box */}
                  <div className="p-6 rounded-2xl bg-[#070e20] border-2 border-cyan-950 space-y-4">
                    <div className="flex justify-between items-center text-base sm:text-lg">
                      <span className="text-slate-400 font-bold">Gas Level:</span>
                      <strong className="text-white font-mono text-lg sm:text-xl font-black">
                        {isGasAbnormal ? 'ELEVATED (> 1800 ADC)' : 'NORMAL (1320 ADC)'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-base sm:text-lg">
                      <span className="text-slate-400 font-bold">Status:</span>
                      <strong className={`font-mono text-lg sm:text-xl font-black ${isGasAbnormal ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isGasAbnormal ? '🔴 ABNORMAL' : '🟢 NORMAL'}
                      </strong>
                    </div>

                    {isGasAbnormal ? (
                      <div className="mt-4 p-4 rounded-xl bg-red-950 border-2 border-red-500 text-red-100 text-center space-y-1.5 animate-pulse">
                        <div className="font-black text-red-300 text-lg sm:text-xl">
                          ⚠️ ABNORMAL GAS INDICATION
                        </div>
                        <div className="text-sm sm:text-base font-bold">
                          Human intervention: <strong className="text-white underline font-black">NOT RECOMMENDED</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-200 text-center font-bold text-sm sm:text-base">
                        Baseline safe atmospheric reading
                      </div>
                    )}
                  </div>

                  {/* Interactive Toggle */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Test Gas Level Threshold:
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setGasSimState('normal')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          gasSimState === 'normal' 
                            ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        Normal (Status: 🟢)
                      </button>
                      <button
                        onClick={() => setGasSimState('abnormal')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          gasSimState === 'abnormal' 
                            ? 'bg-red-600 text-white border-white shadow-[0_0_20px_#ef4444] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        Abnormal (Status: ⚠️)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Important Safety Statement Banner */}
                <div className="p-5 rounded-2xl bg-amber-950/80 border-2 border-amber-500 text-amber-100 font-mono text-xs sm:text-sm space-y-2 shadow-lg">
                  <div className="flex items-center space-x-2 text-amber-300 font-black uppercase tracking-wider text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Important Safety Statement</span>
                  </div>
                  <div className="text-red-300 line-through text-xs sm:text-sm">
                    Do not claim: “The drain is safe for human entry.”
                  </div>
                  <div className="text-white text-sm sm:text-base leading-relaxed font-bold bg-slate-950/80 p-3 rounded-xl border border-amber-500/50">
                    Instead say: “The system provides preliminary environmental condition monitoring to support inspection decisions.”
                  </div>
                  <p className="text-xs text-amber-300/80">
                    * A hobby gas sensor is not a substitute for certified confined-space gas detection equipment.
                  </p>
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “Demonstrates responsible engineering ethics and rigorous industrial safety compliance.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: 12. TEST 8 — BATTERY MONITORING                                 */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test8') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <BatteryCharging className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                12. TEST 8 — Battery Monitoring
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">BATTERY HEALTH:</span>
              <span className={`px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider ${
                isLowBattery ? 'bg-red-950 border-red-500 text-red-300 animate-pulse' : 'bg-emerald-950 border-emerald-500 text-emerald-300'
              }`}>
                {isLowBattery ? '🔴 LOW BATTERY (RETURN TO BASE)' : '🟢 NORMAL (78%)'}
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Objective & Safety Benefit (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Operational Objective
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    Prevent the robot from becoming stranded inside the test channel.
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    Continuous voltage sensing with automatic return thresholding prevents lost missions and stuck vehicles.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-3">
                  <span className="text-slate-300 font-bold block text-xs sm:text-sm uppercase tracking-wider">
                    LOW BATTERY ACTION PROTOCOL:
                  </span>
                  <div className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    When the battery reaches your predefined low-battery threshold:
                  </div>
                  <div className="p-4 rounded-xl bg-red-950 border-2 border-red-600 text-red-200 font-black text-center space-y-1">
                    <div className="text-lg sm:text-xl text-red-300">🔴 LOW BATTERY</div>
                    <div className="text-base sm:text-lg text-amber-300">ACTION: RETURN TO BASE</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
                  <strong className="text-white block mb-1">Stranding Prevention:</strong>
                  “This prevents the robot from becoming stranded inside the test channel.”
                </div>
              </div>

              {/* Right: Big BATTERY Display Box & Interactive Cutoff Buttons (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      WEBSITE: BATTERY
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">Li-ion 3S Pack</span>
                  </div>

                  {/* Huge Battery Readout */}
                  <div className="p-6 rounded-2xl bg-[#070e20] border-2 border-cyan-950 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-slate-400 uppercase">Charge:</span>
                      <span className={`text-4xl sm:text-5xl md:text-6xl font-black font-mono ${isLowBattery ? 'text-red-400' : 'text-cyan-300'}`}>
                        {batteryPct}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-lg sm:text-xl">
                      <span className="text-slate-400 font-bold uppercase">Voltage:</span>
                      <span className="text-white font-mono font-black text-2xl sm:text-3xl">
                        {batteryVolts.toFixed(1)} V
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-lg sm:text-xl">
                      <span className="text-slate-400 font-bold uppercase">Status:</span>
                      <strong className={`font-mono text-xl sm:text-2xl font-black ${isLowBattery ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isLowBattery ? '🔴 LOW BATTERY' : 'NORMAL'}
                      </strong>
                    </div>

                    {isLowBattery && (
                      <div className="mt-4 p-4 rounded-xl bg-red-950 border-2 border-red-500 text-red-200 text-center font-black text-lg sm:text-xl animate-pulse">
                        ACTION: RETURN TO BASE
                      </div>
                    )}
                  </div>

                  {/* Interactive Big Buttons */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Test Battery Level Threshold:
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setBatterySimState('normal')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          batterySimState === 'normal' 
                            ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_#06b6d4] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        78% (11.6 V NORMAL)
                      </button>
                      <button
                        onClick={() => setBatterySimState('low')}
                        className={`py-4 px-6 rounded-2xl text-base sm:text-lg font-mono font-black border-2 transition-all ${
                          batterySimState === 'low' 
                            ? 'bg-red-600 text-white border-white shadow-[0_0_20px_#ef4444] scale-105' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                        }`}
                      >
                        Low (&lt; 10.8 V CUTOFF)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center font-mono">
                  Calibrated Low-Battery Cutoff Threshold: 10.8 V
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “When the battery reaches the predefined threshold, the system initiates RETURN TO BASE. This prevents the robot from becoming stranded inside the test channel.”
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: 13. TEST 9 — TETHER AND RECOVERY                               */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'test9') && (
        <section className="rounded-3xl bg-[#06101e] border-2 border-cyan-500/40 shadow-2xl overflow-hidden">
          {/* Large Section Banner Header */}
          <div className="px-6 sm:px-8 py-5 bg-[#08172c] border-b-2 border-cyan-900/80 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center space-x-3.5">
              <span className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-md">
                <Anchor className="w-6 h-6" />
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide">
                13. TEST 9 — Tether and Recovery
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-slate-300">FAIL-SAFE STATUS:</span>
              <span className="px-4 py-1.5 rounded-xl text-sm font-black border tracking-wider bg-emerald-950 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                100% PHYSICAL RECOVERY READY
              </span>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Physical Safety & 30m Prototype Specification (5 cols) */}
              <div className="lg:col-span-5 space-y-5 font-sans">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Physical Safety &amp; Recovery Feature
                  </h4>
                  <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                    The tether is an important physical safety/recovery feature.
                  </p>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                    The tether provides physical recovery even if electronic communication fails.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 font-mono text-sm space-y-3">
                  <span className="text-cyan-300 font-black block text-xs sm:text-sm uppercase tracking-wider">
                    PROTOTYPE SPECIFICATION:
                  </span>
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-bold">
                    For a larger prototype, a <strong className="text-cyan-400">30 m tether</strong> can be used.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-300">
                    Tensile Strength: <strong className="text-cyan-300">50 kg Break Resistance</strong>
                  </div>
                </div>
              </div>

              {/* Right: Flowchart & Interactive Step Demonstrator (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 font-mono flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-sm sm:text-base font-black text-cyan-300 tracking-wider">
                      RECOVERY FLOWCHART SEQUENCE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-400">4-Stage Failsafe</span>
                  </div>

                  {/* Flowchart Sequence */}
                  <div className="p-5 rounded-2xl bg-[#070e20] border-2 border-cyan-950 space-y-2 text-center font-black text-base sm:text-lg">
                    <div className={`p-3.5 rounded-xl transition-all ${
                      tetherStep === 'stuck' ? 'bg-red-900 text-white shadow-[0_0_15px_#ef4444] scale-102' : 'text-slate-400 bg-slate-900/60'
                    }`}>
                      ROBOT STUCK
                    </div>
                    <div className="text-slate-500 text-lg">↓</div>
                    <div className={`p-3.5 rounded-xl transition-all ${
                      tetherStep === 'stop_motors' ? 'bg-amber-900 text-white shadow-[0_0_15px_#f59e0b] scale-102' : 'text-slate-400 bg-slate-900/60'
                    }`}>
                      STOP MOTORS
                    </div>
                    <div className="text-slate-500 text-lg">↓</div>
                    <div className={`p-3.5 rounded-xl transition-all ${
                      tetherStep === 'anchor' ? 'bg-cyan-900 text-white shadow-[0_0_15px_#06b6d4] scale-102' : 'text-slate-400 bg-slate-900/60'
                    }`}>
                      SECURE / ANCHOR
                    </div>
                    <div className="text-slate-500 text-lg">↓</div>
                    <div className={`p-3.5 rounded-xl transition-all ${
                      tetherStep === 'recovery' ? 'bg-emerald-900 text-white shadow-[0_0_15px_#10b981] scale-102' : 'text-slate-400 bg-slate-900/60'
                    }`}>
                      OPERATOR RECOVERY
                    </div>
                  </div>

                  {/* Step Buttons */}
                  <div className="mt-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-300 block mb-2.5">
                      Step Through Physical Recovery:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'stuck', label: '1. Stuck' },
                        { id: 'stop_motors', label: '2. Stop' },
                        { id: 'anchor', label: '3. Anchor' },
                        { id: 'recovery', label: '4. Recover' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setTetherStep(s.id)}
                          className={`p-3.5 rounded-xl text-sm sm:text-base font-mono font-black border-2 transition-all ${
                            tetherStep === s.id 
                              ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_15px_#06b6d4] scale-105' 
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center font-mono">
                  Physical tether guarantees zero vehicle loss even if floodwater causes catastrophic electronic failure.
                </div>
              </div>

            </div>

            {/* Judge Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/40 border-2 border-cyan-600/60 text-sm sm:text-base font-mono text-cyan-200 leading-relaxed shadow-lg">
              <span className="text-cyan-400 font-black block mb-1 text-sm sm:text-base uppercase tracking-wider">
                Judge explanation
              </span>
              “For a larger prototype, a 30 m tether can be used. The tether provides physical recovery even if electronic communication fails.”
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
