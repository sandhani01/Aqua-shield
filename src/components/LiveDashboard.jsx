import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  simulationTimeline, 
  prototypeTests, 
  generateInspectionReport 
} from '../data/simulationData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertOctagon, 
  Anchor, 
  Activity, 
  Compass, 
  Waves, 
  Shield, 
  Layers, 
  Camera, 
  Video, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Crosshair, 
  Zap, 
  Cable, 
  Settings, 
  FileText, 
  LayoutDashboard, 
  Gamepad2, 
  Droplets, 
  BatteryCharging, 
  Download, 
  FileCheck, 
  Sparkles, 
  Award 
} from 'lucide-react';

export default function LiveDashboard() {
  // STARTING POINT: Default to step 0 (0.0m Entry Point), NOT the emergency
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'video', 'sensors', 'navigation', 'logs', 'settings'
  const [cameraView, setCameraView] = useState('front'); // 'front', 'bottom', 'rear'
  const [simulatedFault, setSimulatedFault] = useState(null); // 'flow', 'motor', 'battery', 'comm'
  const [showJudgeExplanation, setShowJudgeExplanation] = useState(true);
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [isRecording] = useState(true);
  const [reportDownloaded, setReportDownloaded] = useState(false);

  const step = simulationTimeline[currentStepIdx] || simulationTimeline[0];
  const isEmergency = currentStepIdx === 5 || currentStepIdx === 6 || simulatedFault !== null;
  const isReturning = currentStepIdx >= 7 && currentStepIdx <= 9;

  // Real-world clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setDateString(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automated Simulation Traverse: DEPLOY (0m) -> MEASURE -> DETECT -> LOCATE (27.0m) -> RETURN (0m)
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= simulationTimeline.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleStartSim = () => {
    setSimulatedFault(null);
    if (currentStepIdx >= simulationTimeline.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsSimulating(true);
  };

  const handlePauseSim = () => {
    setIsSimulating(!isSimulating);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulatedFault(null);
    setCurrentStepIdx(0);
  };

  const handleEmergencyStop = () => {
    setIsSimulating(false);
    setCurrentStepIdx(6); // Step 6: Instant halt & anchor deployment
  };

  const handleNextStep = () => {
    if (currentStepIdx < simulationTimeline.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleManualMove = (dir) => {
    if ((dir === 'forward' || dir === 'right') && currentStepIdx < 5) {
      setCurrentStepIdx(prev => Math.min(5, prev + 1));
    } else if ((dir === 'reverse' || dir === 'left') && currentStepIdx > 0) {
      setCurrentStepIdx(prev => Math.max(0, prev - 1));
    }
  };

  // Fail-Safe Simulation Triggers (Section 22)
  const triggerFailSafe = (faultType) => {
    setIsSimulating(false);
    setSimulatedFault(faultType);
    setCurrentStepIdx(6); // Trigger secure/anchor and return
  };

  // Handle Inspection Report Download (Section 24)
  const handleDownloadReport = () => {
    const reportContent = generateInspectionReport(step);
    const element = document.createElement("a");
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AQUA_SHIELD_INSPECTION_DOSSIER_27M_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setReportDownloaded(true);
    setTimeout(() => setReportDownloaded(false), 4000);
  };

  // Trajectory Waypoint Positions (% on canal canvas)
  const getRoverCoordinates = (idx) => {
    switch (idx) {
      case 0: return { x: 12, y: 64 };
      case 1: return { x: 24, y: 58 };
      case 2: return { x: 36, y: 52 };
      case 3: return { x: 48, y: 46 };
      case 4: return { x: 62, y: 41 };
      case 5: return { x: 76, y: 35 }; // Blockage reached at 27.0m
      case 6: return { x: 76, y: 35 }; // Anchor locked at 27.0m
      case 7: return { x: 60, y: 42 }; // Winching back
      case 8: return { x: 36, y: 52 }; // Passing 10m on return
      case 9: return { x: 12, y: 64 }; // Retrieved at entrance
      default: return { x: 12, y: 64 };
    }
  };

  const roverPos = getRoverCoordinates(currentStepIdx);

  return (
    <section id="live-dashboard" className="py-8 md:py-12 bg-[#040814] text-slate-100 font-sans border-t border-cyan-950/60 selection:bg-cyan-500/30">
      <div className="max-w-[1540px] mx-auto px-2 sm:px-4 md:px-6">

        {/* ========================================================================= */}
        {/* DASHBOARD HEADER (SECTION 15 & REFERENCE SPECIFICATION)                   */}
        {/* ========================================================================= */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#070e20] border border-cyan-500/20 shadow-[0_0_25px_rgba(0,180,255,0.08)] mb-3">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center space-x-3 group" title="Return to Aqua-Shield Home">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-cyan-400" />
              <Droplets className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg md:text-xl font-black tracking-wider text-white font-mono group-hover:text-cyan-300 transition-colors">
                  AQUA-SHIELD
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <div className="text-[10px] font-mono tracking-wider text-cyan-400/90 uppercase font-semibold">
                First-Response Drain Inspection System
              </div>
            </div>
          </Link>

          {/* Slogans & Core Status Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ROBOT CONNECTED</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>CAMERA ONLINE</span>
            </div>

            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200 font-bold">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <span>BATTERY {step.battery}% ({step.voltage}V)</span>
            </div>
          </div>

          {/* Clock, Telemetry & Back / SIH Judge Pitch */}
          <div className="flex items-center space-x-2.5 text-xs font-mono">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-400">{dateString || 'Thu, 11 Sep 2026'}</div>
              <div className="text-sm font-bold text-white tracking-wide">{timeString || '10:32:10 AM'}</div>
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0"
              title="Return to Aqua-Shield Presentation Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Back to Site</span>
            </Link>

            <button
              onClick={() => setShowJudgeExplanation(!showJudgeExplanation)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0"
              title="View SIH Judge Presentation Note"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showJudgeExplanation ? "Hide Pitch" : "Judge Pitch"}</span>
            </button>
          </div>

        </header>

        {/* ========================================================================= */}
        {/* SIH JUDGE PRESENTATION BANNER (EXACT PHRASING SPECIFIED BY USER)          */}
        {/* ========================================================================= */}
        {showJudgeExplanation && (
          <div className="mb-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-blue-950/70 border border-cyan-500/40 shadow-lg text-xs leading-relaxed">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-xs block mb-0.5">
                    🔥 SIH Evaluator Briefing — The Core of AQUA-SHIELD:
                  </strong>
                  <p className="text-slate-300 text-xs italic">
                    “Sir, AQUA-SHIELD does not send a worker into an unknown drainage environment first. It sends a compact inspection capsule first. The capsule provides live visual inspection, estimates the blockage location, monitors basic environmental and operating conditions, and uses multiple sensor inputs to support the decision to continue or stop the inspection before human intervention.”
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] font-mono text-cyan-300">
                    <span className="font-bold text-white">WORKFLOW:</span>
                    <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      DEPLOY → MOVE → SEE → MEASURE → DETECT → LOCATE (27m) → ASSESS → RETURN
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowJudgeExplanation(false)}
                className="text-slate-500 hover:text-slate-300 text-xs p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 16: MAIN SENSOR CARDS (6 LIVE TILES SPECIFIED IN SECTION 16)       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3">
          
          {/* Card 1: DISTANCE */}
          <div className="p-2.5 rounded-xl bg-[#070e20] border border-cyan-500/25 flex flex-col justify-between shadow-md hover:border-cyan-400/50 transition-all">
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>DISTANCE</span>
              <Compass className="w-3 h-3 text-cyan-400" />
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-white">
                {step.distance.toFixed(1)} <span className="text-xs text-slate-400 font-normal">m</span>
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Encoder ±2cm
            </div>
          </div>

          {/* Card 2: WATER FLOW */}
          <div className="p-2.5 rounded-xl bg-[#070e20] border border-cyan-500/25 flex flex-col justify-between shadow-md hover:border-cyan-400/50 transition-all">
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>WATER FLOW</span>
              <Waves className="w-3 h-3 text-cyan-400" />
            </span>
            <div className="my-1">
              <span className={`text-base sm:text-lg font-black font-mono ${
                step.flowStatus.includes('HIGH') ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {step.flowStatus.split(' ')[0]}
              </span>
              <span className="block text-[10px] font-mono text-slate-400">
                {step.flowRate.toFixed(1)} L/min
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-400">
              Turbine flow sensor
            </div>
          </div>

          {/* Card 3: MOTOR LOAD (ACS712 CURRENT SENSOR) */}
          <div className={`p-2.5 rounded-xl bg-[#070e20] border flex flex-col justify-between shadow-md transition-all ${
            step.currentAmps >= 1.5 ? 'border-red-500/70 bg-red-950/20' : 'border-cyan-500/25 hover:border-cyan-400/50'
          }`}>
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>MOTOR LOAD</span>
              <Zap className={`w-3 h-3 ${step.currentAmps >= 1.5 ? 'text-red-400' : 'text-cyan-400'}`} />
            </span>
            <div className="my-1">
              <span className={`text-base sm:text-lg font-black font-mono ${
                step.currentAmps >= 1.5 ? 'text-red-400' : 'text-cyan-300'
              }`}>
                {step.currentAmps >= 1.5 ? 'HIGH' : 'NORMAL'}
              </span>
              <span className="block text-[10px] font-mono text-slate-400">
                {step.currentAmps.toFixed(1)} A ({step.motorCurrent} mA)
              </span>
            </div>
            <div className={`text-[9px] font-mono ${step.currentAmps >= 1.5 ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
              {step.currentAmps >= 1.5 ? '⚠️ Obstacle Drag' : 'Rolling Freely'}
            </div>
          </div>

          {/* Card 4: TILT (MPU6050 IMU) */}
          <div className="p-2.5 rounded-xl bg-[#070e20] border border-cyan-500/25 flex flex-col justify-between shadow-md hover:border-cyan-400/50 transition-all">
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>TILT</span>
              <Activity className="w-3 h-3 text-cyan-400" />
            </span>
            <div className="my-1">
              <span className={`text-2xl font-black font-mono ${
                step.tiltPitch > 8.5 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {step.tiltPitch}°
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-300">
              {step.tiltPitch > 8.5 ? '🔴 ABNORMAL' : '🟢 STABLE (<8.5°)'}
            </div>
          </div>

          {/* Card 5: BATTERY */}
          <div className="p-2.5 rounded-xl bg-[#070e20] border border-cyan-500/25 flex flex-col justify-between shadow-md hover:border-cyan-400/50 transition-all">
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>BATTERY</span>
              <BatteryCharging className="w-3 h-3 text-emerald-400" />
            </span>
            <div className="my-1">
              <span className="text-2xl font-black font-mono text-white">
                {step.battery}%
              </span>
              <span className="block text-[10px] font-mono text-slate-400">
                Voltage: {step.voltage} V
              </span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400">
              Pack: Normal 3S Li-ion
            </div>
          </div>

          {/* Card 6: RISK LEVEL */}
          <div className={`p-2.5 rounded-xl bg-[#070e20] border flex flex-col justify-between shadow-md transition-all ${
            step.riskLevel === 'danger' 
              ? 'border-red-500 bg-red-950/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : step.riskLevel === 'warning'
              ? 'border-amber-500/50 bg-amber-950/20'
              : 'border-cyan-500/25'
          }`}>
            <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-between">
              <span>RISK</span>
              <AlertTriangle className={`w-3 h-3 ${
                step.riskLevel === 'danger' ? 'text-red-400' : step.riskLevel === 'warning' ? 'text-amber-400' : 'text-emerald-400'
              }`} />
            </span>
            <div className="my-1">
              <span className={`text-xl font-black font-mono uppercase ${
                step.riskLevel === 'danger' ? 'text-red-400' : step.riskLevel === 'warning' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {step.riskLevel === 'danger' ? 'HIGH' : step.riskLevel === 'warning' ? 'MODERATE' : 'LOW'}
              </span>
            </div>
            <div className={`text-[9px] font-mono font-bold ${
              step.riskLevel === 'danger' ? 'text-red-300' : 'text-slate-400'
            }`}>
              {step.riskLevel === 'danger' ? 'Stop & Inspect' : 'Safe to Proceed'}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MAIN COCKPIT: LEFT SIDEBAR + CENTER SIMULATION + RIGHT SURVEILLANCE STACK */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">

          {/* ----------------------------------------------------------------------- */}
          {/* 1. LEFT SIDEBAR (SECTIONS & TOOLS)                                      */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="xl:col-span-1 hidden md:flex xl:flex-col justify-between py-2 px-1.5 rounded-2xl bg-[#060b19] border border-cyan-950/70">
            <div className="space-y-1.5 w-full">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'video', label: 'Live Video', icon: Video },
                { id: 'sensors', label: 'Sensors', icon: Activity },
                { id: 'navigation', label: 'Navigation', icon: Compass },
                { id: 'logs', label: 'Logs', icon: FileText },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center xl:flex-col py-2.5 px-2 rounded-xl text-xs font-mono font-medium transition-all ${
                      isActive 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 xl:mb-1 shrink-0 mr-2 xl:mr-0" />
                    <span className="text-[10px] tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden xl:block p-2 text-center rounded-xl bg-slate-950/80 border border-slate-800 text-[9px] font-mono text-slate-400">
              <span className="text-cyan-400 block font-bold">4 DC MOTORS</span>
              <span>PROTECTED WHEELS</span>
            </div>
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* 2. CENTER STAGE: SIMULATION ARENA & CONTROLS (7 COLS)                    */}
          {/* ----------------------------------------------------------------------- */}
          <div className="xl:col-span-7 flex flex-col space-y-3">
            
            {/* SIMULATION ARENA (4-WHEEL CAPSULE IN DRAINAGE TESTBED CHANNEL) */}
            <div className="relative w-full h-[360px] sm:h-[400px] md:h-[430px] rounded-2xl bg-[#06101e] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col justify-between p-3 select-none">
              
              {/* Background Canal Illustration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                
                {/* Upper Concrete Wall with Moss Texture */}
                <div className="absolute top-0 inset-x-0 h-[22%] bg-gradient-to-b from-[#1b241e] via-[#242e27] to-[#1a211c] border-b-2 border-[#37453b]">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <div className="absolute top-2 left-6 text-[9px] font-mono text-emerald-400/60 font-semibold tracking-wider">
                    TRANSPARENT DRAINAGE TEST CHANNEL (WEST EMBANKMENT)
                  </div>
                </div>

                {/* Flowing Water Channel Bed */}
                <div className="absolute top-[22%] bottom-[22%] inset-x-0 bg-gradient-to-r from-[#0a232c] via-[#0d2e38] to-[#071920] relative">
                  
                  {/* Subtle water ripple lines */}
                  <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(6,182,212,0.15)_40px,rgba(6,182,212,0.15)_80px)] animate-pulse"></div>

                  {/* Flow Direction Indicator Water Arrows */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-around opacity-20 pointer-events-none">
                    <span className="text-cyan-400 font-mono text-xs">→ → →</span>
                    <span className="text-cyan-400 font-mono text-xs">→ → →</span>
                    <span className="text-cyan-400 font-mono text-xs">→ → →</span>
                    <span className="text-cyan-400 font-mono text-xs">→ → →</span>
                  </div>

                  {/* Culvert Grate Iron Bars at Channel Exit (Right Side) */}
                  <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-[#121920] border-l-4 border-slate-700 flex justify-evenly items-center px-1">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div key={bar} className="w-1.5 h-full bg-gradient-to-b from-slate-600 via-slate-800 to-slate-600 rounded-sm shadow-md"></div>
                    ))}
                  </div>

                  {/* Culvert Choke Silt & Trash Heap (Approx. 27.0 m Benchmark) */}
                  <div className="absolute right-8 sm:right-12 top-4 bottom-4 w-20 sm:w-24 bg-gradient-to-l from-[#362514] via-[#4a341c] to-transparent rounded-l-2xl border-l-2 border-red-500/80 flex items-center justify-center p-2 opacity-90 shadow-2xl">
                    <div className="text-center">
                      <span className="block text-[8px] font-mono text-red-300 font-bold tracking-tight">
                        BLOCKAGE
                      </span>
                      <span className="text-[7px] font-mono text-amber-400 font-semibold">
                        APPROX. 27.0 m
                      </span>
                    </div>
                  </div>

                </div>

                {/* Lower Concrete Wall */}
                <div className="absolute bottom-0 inset-x-0 h-[22%] bg-gradient-to-t from-[#1b241e] via-[#242e27] to-[#1a211c] border-t-2 border-[#37453b]">
                  <div className="absolute bottom-2 left-6 text-[9px] font-mono text-emerald-400/60 font-semibold tracking-wider">
                    TRANSPARENT DRAINAGE TEST CHANNEL (EAST EMBANKMENT)
                  </div>
                </div>

                {/* GLOWING TRAJECTORY TRACK LINE */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#00e5ff" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ff3d00" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 80, 250 Q 220, 225 380, 205 T 720, 150"
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
                  />
                </svg>

              </div>

              {/* FLOATING TOP BADGES & DEPTH METER */}
              <div className="relative z-20 flex items-center justify-between">
                
                {/* Mission Step Badge */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700/80 backdrop-blur-md">
                  <span className={`w-2 h-2 rounded-full ${
                    isEmergency ? 'bg-red-500 animate-ping' : isReturning ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'
                  }`}></span>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {currentStepIdx === 0 && "1. DEPLOY: ROBOT AT ENTRANCE (0.0 m)"}
                    {currentStepIdx === 1 && "2. MOVE: 5.0m MARK CONFIRMED"}
                    {currentStepIdx === 2 && "3. MEASURE: 10.0m STEADY TRANSIT"}
                    {currentStepIdx === 3 && "4. SEE: 15.0m DEBRIS SCATTERED"}
                    {currentStepIdx === 4 && "5. DETECT: 20.0m RESTRICTION AHEAD"}
                    {currentStepIdx === 5 && "6. ⚠️ LOCATE: BLOCKAGE DETECTED @ 27.0 m"}
                    {currentStepIdx === 6 && "7. 🛡️ ASSESS: MOTORS HALTED / ANCHOR LOCKED"}
                    {currentStepIdx === 7 && "8. 🔄 RETURN: TETHER WINCH RECOVERY (20m)"}
                    {currentStepIdx === 8 && "9. 🔄 RETURN: TETHER REEL WINCHING (10m)"}
                    {currentStepIdx === 9 && "10. ✅ SAFE END POINT: RETRIEVED AT ENTRANCE"}
                  </span>
                </div>

                {/* Floating Depth Badge */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-200">
                    Depth: <strong className="text-white text-sm">{step.waterLevel.toFixed(1)} m</strong>
                  </span>
                </div>

              </div>

              {/* AI DETECTED OBJECT BOUNDING BOXES (MATCHING TEST 1 OBJECTS) */}
              <div className="absolute inset-0 pointer-events-none z-20">
                
                {/* 1. Plastic Bottle */}
                <div className="absolute top-[28%] left-[16%] w-20 sm:w-24 h-14 sm:h-16 border-2 border-emerald-400 bg-emerald-500/10 rounded p-1 flex flex-col justify-between shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-black/80 px-1 rounded self-start border border-emerald-500/40">
                    Plastic Bottle
                  </span>
                  <div className="w-6 h-3 bg-cyan-400/30 rounded-full self-center border border-cyan-400/60 rotate-12"></div>
                </div>

                {/* 2. Leaves */}
                <div className="absolute top-[25%] left-[40%] w-18 sm:w-20 h-12 sm:h-14 border-2 border-emerald-400 bg-emerald-500/10 rounded p-1 flex flex-col justify-between shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-black/80 px-1 rounded self-start border border-emerald-500/40">
                    Leaves
                  </span>
                  <div className="w-5 h-4 bg-emerald-700/40 rounded-sm self-center -rotate-45 border border-emerald-500/40"></div>
                </div>

                {/* 3. Mud & Plastic Waste */}
                <div className="absolute bottom-[26%] left-[54%] w-24 sm:w-28 h-14 sm:h-16 border-2 border-emerald-400 bg-emerald-500/10 rounded p-1 flex flex-col justify-between shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-300 bg-black/80 px-1 rounded self-start border border-emerald-500/40">
                    Plastic Waste
                  </span>
                  <div className="w-7 h-4 bg-amber-600/30 rounded self-center rotate-6 border border-amber-500/40"></div>
                </div>

                {/* 4. BLOCKAGE AT 27.0m BENCHMARK */}
                <div className={`absolute top-[26%] right-[10%] w-24 sm:w-28 h-20 sm:h-24 border-2 border-red-500 bg-red-950/30 rounded p-1 flex flex-col justify-between ${
                  isEmergency ? 'animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]' : 'opacity-80'
                }`}>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-red-300 bg-red-950 px-1.5 py-0.5 rounded self-start border border-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400" /> Blockage
                  </span>
                  <div className="text-center font-mono text-[8px] text-red-200 bg-black/80 rounded py-0.5 border border-red-800">
                    APPROX. 27.0 m
                  </div>
                </div>

                {/* THE AQUA-SHIELD CAPSULE (4 DC GEARED MOTORS + PROTECTED WHEELS + DOME) */}
                <div 
                  className="absolute transition-all duration-700 ease-out z-30"
                  style={{ 
                    left: `${roverPos.x}%`, 
                    top: `${roverPos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    
                    {/* Glowing LED lights projection */}
                    <div className="absolute -inset-2 rounded-2xl bg-cyan-400/20 blur-sm animate-pulse"></div>

                    {/* 4-Wheel Physical Chassis (Section 3 Prototype Arrangement) */}
                    <div className="w-26 sm:w-28 h-16 sm:h-18 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center justify-between px-2 relative">
                      
                      {/* 4 Protected Rugged Wheels (Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
                      <div className="absolute -top-2.5 -left-2 w-5 h-3 bg-slate-950 rounded-sm border-2 border-slate-600 shadow-md"></div>
                      <div className="absolute -top-2.5 -right-2 w-5 h-3 bg-slate-950 rounded-sm border-2 border-slate-600 shadow-md"></div>
                      <div className="absolute -bottom-2.5 -left-2 w-5 h-3 bg-slate-950 rounded-sm border-2 border-slate-600 shadow-md"></div>
                      <div className="absolute -bottom-2.5 -right-2 w-5 h-3 bg-slate-950 rounded-sm border-2 border-slate-600 shadow-md"></div>

                      {/* Front Transparent Dome with Dual LEDs */}
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 rounded-r-full bg-cyan-400/30 border-2 border-cyan-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]"></div>
                      </div>

                      {/* Hull Center: Waterproof Electronics & ESP32 label */}
                      <div className="w-full text-center pl-1 pr-3">
                        <div className="flex items-center justify-center gap-1">
                          <Shield className="w-3 h-3 text-cyan-400" />
                          <span className="text-[8px] font-black font-mono tracking-wider text-white">
                            AQUA-SHIELD
                          </span>
                        </div>
                        <div className="text-[7px] font-mono text-cyan-300 font-bold">
                          {step.distance.toFixed(1)} m
                        </div>
                        <div className="text-[6px] font-mono text-slate-400">
                          4 DC WHEELS
                        </div>
                      </div>

                      {/* Titanium Anchor Deployment Visual */}
                      {step.anchorDeployed && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[8px] font-bold font-mono">
                          <Anchor className="w-2.5 h-2.5 mr-1" /> ANCHOR LOCKED
                        </div>
                      )}

                    </div>

                    {/* Forward LED Illumination Spotlight Cone */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 -right-14 w-16 h-12 pointer-events-none opacity-50"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,229,255,0.8), transparent)',
                        clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 65%)'
                      }}
                    ></div>

                  </div>
                </div>

              </div>

              {/* SECTION 18: VISUAL DISTANCE PROGRESS BAR (0m to 30m with 27m pin) */}
              <div className="relative z-20 bg-slate-950/90 p-2 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                  <span>INSPECTION PROGRESS</span>
                  <span className="text-white font-bold">{step.distance.toFixed(1)} m / 30.0 m</span>
                  <span className="text-red-400 font-bold">BLOCKAGE: {step.obstacleDetected ? "DETECTED ≈ 27.0 m" : "SCANNING"}</span>
                </div>

                <div className="relative w-full h-2.5 bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
                  {/* Progress fill */}
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      step.distance >= 25.0 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, (step.distance / 30) * 100)}%` }}
                  ></div>

                  {/* 27.0m Benchmark Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-red-400 z-10"
                    style={{ left: '90%' }}
                    title="27.0m Blockage Location"
                  ></div>
                </div>

                <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                  <span>START (0 m)</span>
                  <span>10 m</span>
                  <span>20 m</span>
                  <span className="text-red-400 font-bold">27 m (BLOCKAGE)</span>
                  <span>30 m END</span>
                </div>
              </div>

            </div>

            {/* SIMULATION PLAYBACK & OPERATOR CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070e20] border border-cyan-950">
              
              {/* Deploy / Traverse Button */}
              <button
                onClick={isSimulating ? handlePauseSim : handleStartSim}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all flex items-center shadow-[0_0_15px_rgba(6,182,212,0.35)]"
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-4 h-4 mr-1.5 fill-slate-950" /> Pause Traverse
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1.5 fill-slate-950" /> 
                    {currentStepIdx === 0 
                      ? "DEPLOY (Start 0m → Detect 27m → Return 0m)"
                      : currentStepIdx >= 9 
                        ? "Restart Mission Cycle (0m → 27m → Return)"
                        : "Resume Traverse Cycle"}
                  </>
                )}
              </button>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleNextStep}
                  disabled={isSimulating || currentStepIdx >= simulationTimeline.length - 1}
                  className="px-3 py-2 text-xs font-mono font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white disabled:opacity-40"
                >
                  Next Step
                </button>

                <button
                  onClick={handleEmergencyStop}
                  className="px-3 py-2 text-xs font-mono font-bold rounded-xl bg-red-950/80 border border-red-700 text-red-300 hover:bg-red-900 hover:text-white flex items-center gap-1 shadow-sm"
                  title="Trigger immediate anchor lock and motor shutoff"
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400" /> Emergency Stop
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  title="Reset to 0.0m Starting Point"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* SECTION 22: FAIL-SAFE SIMULATION SUITE */}
            <div className="p-3 rounded-xl bg-[#070e20] border border-amber-500/30 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-300">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>SECTION 22: FAIL-SAFE SIMULATION TRIGGERS</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Click to test emergency logic in front of judges
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                
                {/* 1. High Flow */}
                <button
                  onClick={() => triggerFailSafe('flow')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    simulatedFault === 'flow' 
                      ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-sm' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-500/50'
                  }`}
                >
                  <span className="block font-bold text-amber-400">Simulate High Flow</span>
                  <span className="text-[9px] text-slate-400">&gt; 35 L/min Surge</span>
                </button>

                {/* 2. Motor Overload */}
                <button
                  onClick={() => triggerFailSafe('motor')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    simulatedFault === 'motor' 
                      ? 'bg-red-950 border-red-400 text-red-200 shadow-sm' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-red-500/50'
                  }`}
                >
                  <span className="block font-bold text-red-400">Simulate Motor Overload</span>
                  <span className="text-[9px] text-slate-400">&gt; 1.5 A Current Stall</span>
                </button>

                {/* 3. Low Battery */}
                <button
                  onClick={() => triggerFailSafe('battery')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    simulatedFault === 'battery' 
                      ? 'bg-red-950 border-red-400 text-red-200 shadow-sm' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-red-500/50'
                  }`}
                >
                  <span className="block font-bold text-red-400">Simulate Low Battery</span>
                  <span className="text-[9px] text-slate-400">&lt; 15% (Auto Return)</span>
                </button>

                {/* 4. Comm Loss */}
                <button
                  onClick={() => triggerFailSafe('comm')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    simulatedFault === 'comm' 
                      ? 'bg-amber-950 border-amber-400 text-amber-200 shadow-sm' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-amber-500/50'
                  }`}
                >
                  <span className="block font-bold text-amber-400">Simulate Comm Loss</span>
                  <span className="text-[9px] text-slate-400">Tether Winch Override</span>
                </button>

              </div>

              {simulatedFault && (
                <div className="mt-2.5 p-2 rounded-lg bg-red-950/80 border border-red-600 text-red-200 text-xs font-mono flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-2">
                    <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      <strong>FAULT TRIGGERED:</strong> STOPPING MOTORS → SECURING / ANCHORING → RETURN MODE
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-900 font-bold text-[10px]">
                    INSPECTION ABORTED
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* 3. RIGHT STACK: CAMERA FEED, SENSOR STATUS & SENSOR FUSION ENGINE        */}
          {/* ----------------------------------------------------------------------- */}
          <div className="xl:col-span-4 space-y-3">
            
            {/* SECTION 17: LIVE CAMERA FEED */}
            <div className="p-3 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-lg">
              
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LIVE DRAIN CAMERA</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">LED: ON</span>
                  {isRecording && (
                    <span className="flex items-center text-red-500 font-bold animate-pulse">
                      ● REC
                    </span>
                  )}
                </div>
              </div>

              {/* Camera Stream Viewport */}
              <div className="relative w-full h-44 rounded-xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                
                {/* Underwater Visual Backdrop */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: cameraView === 'front'
                      ? 'radial-gradient(circle at 50% 50%, rgba(20, 83, 45, 0.45) 0%, rgba(5, 46, 22, 0.7) 40%, rgba(2, 20, 10, 0.95) 100%)'
                      : cameraView === 'bottom'
                      ? 'radial-gradient(circle at 50% 60%, rgba(30, 60, 40, 0.5) 0%, rgba(10, 30, 20, 0.8) 50%, #030d07 100%)'
                      : 'radial-gradient(circle at 50% 50%, rgba(14, 116, 144, 0.3) 0%, rgba(8, 47, 73, 0.7) 50%, #020617 100%)'
                  }}
                ></div>

                {/* Submerged Pipe Rings */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-36 h-36 rounded-full border-4 border-emerald-500/40"></div>
                  <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/30"></div>
                  <div className="absolute w-12 h-12 rounded-full border border-emerald-300/20"></div>
                </div>

                {/* What Camera Sees */}
                <div className="relative z-10 text-center px-4">
                  {cameraView === 'front' ? (
                    isEmergency ? (
                      <div className="p-2 rounded-lg bg-red-950/70 border border-red-500/80 text-red-200">
                        <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1 animate-bounce" />
                        <span className="text-[11px] font-mono font-bold block text-red-400">OBSTRUCTION VISIBLE (27.0 m)</span>
                        <span className="text-[9px] font-mono text-slate-300">Debris dam choking 85% of channel</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Crosshair className="w-6 h-6 text-emerald-400/70 mx-auto mb-1 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block">LIVE CONDUIT STREAM</span>
                        <span className="text-[9px] font-mono text-slate-400">ESP32 Camera • Dual LEDs ON</span>
                      </div>
                    )
                  ) : cameraView === 'bottom' ? (
                    <div className="text-center">
                      <Layers className="w-6 h-6 text-cyan-400/70 mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-cyan-300 font-bold block">CHANNEL INVERT BED</span>
                      <span className="text-[9px] font-mono text-slate-400">Mud & silt deposit: 3.8 cm</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Cable className="w-6 h-6 text-amber-400/70 mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-amber-300 font-bold block">RECOVERY TETHER LINE</span>
                      <span className="text-[9px] font-mono text-slate-400">Tether payout tension: {step.tetherTension} N</span>
                    </div>
                  )}
                </div>

                {/* Camera Tabs */}
                <div className="absolute bottom-1.5 inset-x-2 flex items-center justify-between gap-1 z-20">
                  {[
                    { id: 'front', label: 'Front Camera' },
                    { id: 'bottom', label: 'Bottom Camera' },
                    { id: 'rear', label: 'Rear Camera' }
                  ].map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => setCameraView(cam.id)}
                      className={`flex-1 py-1 rounded text-[9px] font-mono font-medium transition-all ${
                        cameraView === cam.id 
                          ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm' 
                          : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>

              </div>

            </div>

            {/* SECTION 19: SENSOR MONITORING PANEL */}
            <div className="p-3 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-lg font-mono text-xs">
              
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> SENSOR STATUS
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">ALL 7 ACTIVE</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Camera:</span>
                  <span className="text-emerald-400 font-bold">🟢 ONLINE</span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">IMU:</span>
                  <span className={step.tiltPitch > 8.5 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                    {step.tiltPitch > 8.5 ? "🔴 ABNORMAL" : "🟢 NORMAL (2.4°)"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Flow:</span>
                  <span className={step.flowStatus.includes('HIGH') ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                    {step.flowStatus.includes('HIGH') ? "🟡 HIGH FLOW" : "🟢 NORMAL"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Gas:</span>
                  <span className="text-emerald-400 font-bold">🟢 NORMAL ({step.gasH2S} ppm)</span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Current:</span>
                  <span className={step.currentAmps >= 1.5 ? "text-red-400 font-bold animate-pulse" : "text-emerald-400 font-bold"}>
                    {step.currentAmps >= 1.5 ? "🔴 HIGH (1.8 A)" : "🟢 NORMAL (0.8 A)"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Encoder:</span>
                  <span className="text-emerald-400 font-bold">🟢 ACTIVE ({step.distance.toFixed(1)} m)</span>
                </div>
                <div className="flex justify-between items-center p-1 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-300">Battery:</span>
                  <span className="text-emerald-400 font-bold">🟢 {step.battery}% ({step.voltage} V)</span>
                </div>
              </div>

            </div>

            {/* SECTION 20: SENSOR FUSION / DECISION ENGINE */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#081226] to-[#050a18] border-2 border-cyan-500/40 shadow-xl font-mono text-xs">
              
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-800/60">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> SENSOR FUSION ENGINE
                </span>
                <span className="text-[9px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  ESP32 EDGE
                </span>
              </div>

              {/* Fusion inputs box */}
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-[11px] mb-2">
                <div className="text-slate-300 flex justify-between">
                  <span>• Camera:</span>
                  <strong className={step.obstacleDetected ? "text-red-400" : "text-emerald-400"}>
                    {step.obstacleDetected ? "Obstruction Visible" : "Clear Passage"}
                  </strong>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>• Encoder:</span>
                  <strong className="text-white">{step.distance.toFixed(1)} m</strong>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>• Current:</span>
                  <strong className={step.currentAmps >= 1.5 ? "text-red-400" : "text-emerald-400"}>
                    {step.currentAmps >= 1.5 ? "HIGH (1.8 A)" : "NORMAL (0.8 A)"}
                  </strong>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>• Flow:</span>
                  <strong className={step.flowStatus.includes('HIGH') ? "text-amber-400" : "text-emerald-400"}>
                    {step.flowStatus.split(' ')[0]}
                  </strong>
                </div>
                <div className="text-slate-300 flex justify-between">
                  <span>• IMU:</span>
                  <strong className="text-emerald-400">STABLE (2.4°)</strong>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="text-center text-cyan-400 my-1 text-xs">↓</div>

              {/* Output Recommendation */}
              <div className={`p-2.5 rounded-xl border text-center transition-all ${
                step.obstacleDetected 
                  ? 'bg-red-950/70 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : 'bg-emerald-950/60 border-emerald-500/50'
              }`}>
                <span className={`text-xs font-bold block ${step.obstacleDetected ? 'text-red-300' : 'text-emerald-300'}`}>
                  {step.obstacleDetected ? "BLOCKAGE DETECTED @ APPROX. 27 m" : "ALL SYSTEMS NOMINAL"}
                </span>
                <span className="text-[10px] text-slate-300 block mt-0.5">
                  RECOMMENDATION: <strong className={step.obstacleDetected ? 'text-amber-300' : 'text-cyan-300'}>{step.recommendation}</strong>
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: ROBOT CONTROLLER, INSPECTION LOG & DOWNLOADABLE REPORT    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
          
          {/* SECTION 21: ROBOT CONTROL PANEL (4 COLS) */}
          <div className="lg:col-span-4 p-3 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-lg flex flex-col justify-between">
            
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> SECTION 21: ROBOT CONTROL PANEL
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Motor: {step.motorRunning ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 my-2">
              
              {/* D-Pad */}
              <div className="relative w-28 h-28 rounded-full bg-slate-950 border-2 border-cyan-500/40 flex items-center justify-center shadow-inner shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]"></div>
                </div>

                <button
                  onClick={() => handleManualMove('forward')}
                  className="absolute top-1 left-1/2 -translate-x-1/2 p-1 text-slate-400 hover:text-cyan-300 hover:scale-110 active:scale-95"
                  title="Forward"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleManualMove('reverse')}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 p-1 text-slate-400 hover:text-cyan-300 hover:scale-110 active:scale-95"
                  title="Reverse"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleManualMove('left')}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-300 hover:scale-110 active:scale-95"
                  title="Left"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleManualMove('right')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-300 hover:scale-110 active:scale-95"
                  title="Right"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 flex-1 font-mono text-[10px]">
                <button
                  onClick={() => handleManualMove('forward')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <ArrowUp className="w-3 h-3 text-cyan-400" /> Forward
                </button>
                <button
                  onClick={() => handleManualMove('reverse')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <ArrowDown className="w-3 h-3 text-cyan-400" /> Reverse
                </button>
                <button
                  onClick={() => handleManualMove('left')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3 text-cyan-400" /> Left
                </button>
                <button
                  onClick={() => handleManualMove('right')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 text-cyan-400" /> Right
                </button>
              </div>

            </div>

            {/* Separated Large Emergency Stop Button (Section 21) */}
            <button
              onClick={handleEmergencyStop}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-mono font-black text-xs tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>🔴 EMERGENCY STOP</span>
            </button>

          </div>

          {/* SECTION 23: CHRONOLOGICAL INSPECTION LOG (4 COLS) */}
          <div className="lg:col-span-4 p-3 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-lg flex flex-col justify-between font-mono text-xs">
            
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> SECTION 23: INSPECTION LOG
              </span>
              <span className="text-[10px] text-cyan-400">CHRONOLOGICAL</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-cyan-400 font-bold">10:32:10</span>
                <span>DEPLOYED (0.0 m)</span>
              </div>
              {currentStepIdx >= 2 && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-cyan-400 font-bold">10:32:42</span>
                  <span>10 m REACHED</span>
                </div>
              )}
              {currentStepIdx >= 4 && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-cyan-400 font-bold">10:33:21</span>
                  <span>20 m REACHED</span>
                </div>
              )}
              {currentStepIdx >= 5 && (
                <>
                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                    <span>10:33:54</span>
                    <span>HIGH MOTOR LOAD (1.8 A)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                    <span>10:33:56</span>
                    <span>BLOCKAGE DETECTED</span>
                  </div>
                  <div className="flex items-center space-x-2 text-red-400 font-bold">
                    <span>10:33:56</span>
                    <span>LOCATION: ≈ 27.0 m</span>
                  </div>
                </>
              )}
              {currentStepIdx >= 6 && (
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <span>10:34:00</span>
                  <span>INSPECTION ABORTED — ANCHORED</span>
                </div>
              )}
              {currentStepIdx >= 7 && (
                <div className="flex items-center space-x-2 text-sky-400 font-bold">
                  <span>10:34:10</span>
                  <span>RETURNING VIA TETHER WINCH</span>
                </div>
              )}
              {currentStepIdx >= 9 && (
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <span>10:34:55</span>
                  <span>SAFE RETURN COMPLETE</span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 mt-2">
              Auto-logged to onboard MicroSD module in real-time.
            </div>

          </div>

          {/* SECTION 24: FINAL INSPECTION REPORT & DOWNLOAD ACTION (4 COLS) */}
          <div className="lg:col-span-4 p-3 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-lg flex flex-col justify-between font-mono text-xs">
            
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" /> SECTION 24: INSPECTION REPORT
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">DOSSIER</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance Travelled:</span>
                <span className="text-white font-bold">{step.distance.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blockage:</span>
                <span className={step.obstacleDetected ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {step.obstacleDetected ? "DETECTED" : "NONE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Approx. Location:</span>
                <span className="text-red-300 font-bold">
                  {step.obstacleDetected ? "≈ 27.0 m" : "Scanning"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Motor Load:</span>
                <span className={step.currentAmps >= 1.5 ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {step.currentAmps >= 1.5 ? "HIGH (1.8 A)" : "NORMAL"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movement:</span>
                <span className="text-emerald-400 font-bold">STABLE (2.4°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Decision:</span>
                <span className="text-amber-300 font-bold">
                  {step.obstacleDetected ? "STOP / HUMAN RECON REQUIRED" : "CONTINUE INSPECTION"}
                </span>
              </div>
            </div>

            {/* DOWNLOAD REPORT BUTTON (SECTION 24) */}
            <button
              onClick={handleDownloadReport}
              className="w-full mt-2 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-black text-xs tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>{reportDownloaded ? "✓ REPORT DOWNLOADED!" : "DOWNLOAD REPORT"}</span>
            </button>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* SECTIONS 5–13: PROTOTYPE TESTING MATRIX (TEST 1 TO TEST 9)                */}
        {/* ========================================================================= */}
        <div className="mt-4 p-4 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <Award className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-sm font-mono font-bold text-white block">
                  PROTOTYPE TESTING MATRIX &amp; EVALUATION SUITE (TESTS 1–9)
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Laboratory verification procedures for SIH judges &amp; municipal evaluators
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowTestingSuite(!showTestingSuite)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-colors shrink-0"
            >
              {showTestingSuite ? "Hide 9 Tests" : "Inspect 9 Prototype Tests"}
            </button>
          </div>

          {showTestingSuite && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800">
              {prototypeTests.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-cyan-400 font-bold">{t.num}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        {t.status}
                      </span>
                    </div>
                    <span className="font-bold text-white block mb-1 text-xs">{t.name}</span>
                    <p className="text-[11px] text-slate-400 leading-tight mb-2">{t.desc}</p>
                  </div>
                  <div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-300 font-bold mb-1.5">
                      {t.readout}
                    </div>
                    <p className="text-[10px] text-cyan-200/80 italic leading-snug">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
