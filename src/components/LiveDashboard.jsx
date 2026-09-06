import React, { useState, useEffect, useRef } from 'react';
import { simulationTimeline } from '../data/simulationData';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle, 
  ShieldAlert, 
  Anchor, 
  Maximize2, 
  Activity, 
  BatteryCharging, 
  Compass, 
  Waves, 
  Gauge, 
  ArrowRight,
  Terminal,
  Radio,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';

export default function LiveDashboard() {
  const [currentStepIdx, setCurrentStepIdx] = useState(5); // Default to prompt's 25.4m milestone
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1800); // ms per step
  const [eventLogs, setEventLogs] = useState([]);
  const canvasRef = useRef(null);

  const step = simulationTimeline[currentStepIdx];

  // Simulation sequence playback effect
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
      }, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  // Log events on step change
  useEffect(() => {
    const newLog = {
      time: step.timestamp,
      dist: `${step.distance}m`,
      msg: `${step.systemStatus} — ${step.action}`,
      risk: step.riskLevel
    };
    setEventLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  }, [currentStepIdx]);

  // Canvas HUD camera view renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background: Dark flooded conduit interior
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, width, height);

    // Circular concrete culvert outline
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Water level gradient in bottom half
    const waterGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
    waterGrad.addColorStop(0, 'rgba(0, 150, 255, 0.08)');
    waterGrad.addColorStop(1, 'rgba(0, 40, 80, 0.6)');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, height * 0.45, width, height * 0.55);

    // Simulated LED ring illumination cone
    const radGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.38);
    radGrad.addColorStop(0, 'rgba(200, 245, 255, 0.45)');
    radGrad.addColorStop(0.5, 'rgba(0, 200, 255, 0.15)');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // If at or near blockage (step >= 5 && step <= 6)
    if (step.obstacleDetected) {
      // Draw simulated debris obstacle cluster
      ctx.fillStyle = 'rgba(120, 60, 20, 0.75)';
      ctx.beginPath();
      ctx.ellipse(width / 2, height * 0.55, width * 0.22, height * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Debris details (plastic bags / branches)
      ctx.fillStyle = 'rgba(230, 230, 230, 0.6)';
      ctx.fillRect(width * 0.42, height * 0.48, 25, 15);
      ctx.fillStyle = 'rgba(80, 50, 30, 0.9)';
      ctx.fillRect(width * 0.48, height * 0.52, 40, 6);

      // Targeting Reticle / Bounding Box
      const boxX = width * 0.32;
      const boxY = height * 0.38;
      const boxW = width * 0.36;
      const boxH = height * 0.34;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Corner Brackets
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX - 4, boxY - 4, 12, 12);
      ctx.strokeRect(boxX + boxW - 8, boxY - 4, 12, 12);

      // Label
      ctx.fillStyle = '#ef4444';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`! OBSTACLE DAM DETECTED [${step.distance}m]`, boxX, boxY - 8);
    } else {
      // Clear passage reticle
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, height / 2);
    ctx.lineTo(width / 2 + 30, height / 2);
    ctx.moveTo(width / 2, height / 2 - 30);
    ctx.lineTo(width / 2, height / 2 + 30);
    ctx.stroke();

    // Camera Watermark / In-feed HUD
    ctx.fillStyle = '#00f0ff';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`CAM_FEED // 1080p @ 30FPS • PWM: 100%`, 14, 22);
    ctx.fillText(`DIST: ${step.distance.toFixed(1)}m | TILT: ${step.tiltPitch}°`, 14, 38);
    ctx.fillText(`TETHER TENSION: ${step.tetherTension} N`, 14, height - 14);

    if (step.anchorDeployed) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`[⚓ ANCHOR LOCKED AGAINST CULVERT BED]`, width - 260, height - 14);
    }

  }, [currentStepIdx, step]);

  // Chart data up to current step
  const chartHistory = simulationTimeline.slice(0, currentStepIdx + 1).map((s, idx) => ({
    name: `${s.distance}m`,
    distance: s.distance,
    current: s.motorCurrent,
    flow: s.flowRate,
    battery: s.battery
  }));

  const startSimulation = () => {
    setCurrentStepIdx(0);
    setIsSimulating(true);
  };

  const handleContinue = () => {
    if (currentStepIdx < simulationTimeline.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleAbort = () => {
    // Jump directly to emergency abort / anchor deployment (step 6)
    setCurrentStepIdx(6);
    setIsSimulating(false);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentStepIdx(0);
  };

  return (
    <section id="live-dashboard" className="relative py-20 md:py-28 bg-[#050811] border-t border-cyan-950/80">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SECTION 06 // MISSION CONTROL TELEMETRY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Live Inspection <span className="text-cyan-400">Dashboard</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Real-time cockpit simulator designed for field operators and municipal control centers. Experience the live sequence from launch to 25.4 m blockage detection and fail-safe recovery.
          </p>

          {/* Main Simulation Action Controller */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startSimulation}
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <Play className="w-4 h-4 mr-2 fill-slate-950" />
              <span>Simulate Inspection (0m → 25.4m → Return)</span>
            </button>

            {isSimulating ? (
              <button
                onClick={() => setIsSimulating(false)}
                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-mono"
              >
                <Pause className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Pause
              </button>
            ) : null}

            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset to 0 m
            </button>
          </div>
        </div>

        {/* The Cockpit Container */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.15)] relative">
          
          {/* Top Status Header Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
            
            {/* System Status Banner */}
            <div className="flex items-center space-x-3">
              <div className={`w-3.5 h-3.5 rounded-full ${
                step.riskLevel === 'danger'
                  ? 'bg-red-500 animate-ping'
                  : step.riskLevel === 'warning'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}></div>
              <div>
                <div className="text-[10px] font-mono text-slate-400 tracking-wider">SYSTEM STATUS</div>
                <div className={`text-lg sm:text-xl font-extrabold font-heading ${
                  step.riskLevel === 'danger'
                    ? 'text-red-400'
                    : step.riskLevel === 'warning'
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }`}>
                  {step.riskLevel === 'danger' ? '🔴 ' : step.riskLevel === 'warning' ? '⚠️ ' : '🟢 '}
                  {step.systemStatus}
                </div>
              </div>
            </div>

            {/* Manual Operator Buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={handleContinue}
                disabled={isSimulating || currentStepIdx >= simulationTimeline.length - 1}
                className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/70 hover:text-white disabled:opacity-40 transition-colors uppercase tracking-wider"
              >
                [CONTINUE]
              </button>

              <button
                onClick={handleAbort}
                className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg bg-red-600/20 border border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center space-x-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>[ABORT / RETURN]</span>
              </button>
            </div>

          </div>

          {/* Middle Cockpit: Camera Feed (Left) & Essential Readout Gauges (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Left 7 cols: Live Camera Feed with HUD */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-black aspect-[16/10] shadow-inner">
                
                {/* Canvas Camera View */}
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={400}
                  className="w-full h-full object-cover"
                />

                {/* Top Corner Badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 border border-red-500/60 text-red-400 text-[10px] font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>LIVE POV FEED</span>
                </div>

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <p className="text-xs text-slate-200 font-mono">
                    <span className="text-cyan-400 font-bold">NOTE:</span> {step.cameraViewNote}
                  </p>
                </div>
              </div>

              {/* Simulation Sequence Milestone Scrubber */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto">
                <span className="text-slate-500 uppercase">Milestones:</span>
                {simulationTimeline.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setIsSimulating(false); setCurrentStepIdx(idx); }}
                    className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                      currentStepIdx === idx
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'hover:text-cyan-300'
                    }`}
                  >
                    {s.distance}m {s.obstacleDetected ? '⚠️' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Telemetry Gauges Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              
              {/* Metric 1: Distance */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><Gauge className="w-3.5 h-3.5 mr-1 text-cyan-400" /> DISTANCE</span>
                  <span className="text-[10px] text-cyan-400">ENCODER</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {step.distance.toFixed(1)} <span className="text-sm text-cyan-400">m</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Target Max: 30.0 m
                </div>
              </div>

              {/* Metric 2: Water Flow */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                step.flowStatus.includes('HIGH') || step.flowStatus.includes('CRITICAL')
                  ? 'bg-red-950/30 border-red-500/60'
                  : 'bg-slate-900/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><Waves className="w-3.5 h-3.5 mr-1 text-cyan-400" /> WATER FLOW</span>
                  <span className="text-[10px] text-cyan-400">TURBINE</span>
                </div>
                <div className="my-2">
                  <div className={`text-2xl sm:text-3xl font-black font-mono ${
                    step.flowStatus.includes('HIGH') || step.flowStatus.includes('CRITICAL') ? 'text-red-400' : 'text-white'
                  }`}>
                    {step.flowRate.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-400">L/min</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-400">
                  Flow: {step.flowStatus}
                </div>
              </div>

              {/* Metric 3: Motor Load / Current */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                step.motorCurrent > 600
                  ? 'bg-red-950/30 border-red-500/60'
                  : 'bg-slate-900/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1 text-cyan-400" /> MOTOR CURRENT</span>
                  <span className="text-[10px] text-cyan-400">ACS712</span>
                </div>
                <div className="my-2">
                  <div className={`text-2xl sm:text-3xl font-black font-mono ${
                    step.motorCurrent > 600 ? 'text-red-400' : 'text-white'
                  }`}>
                    {step.motorCurrent} <span className="text-sm font-sans font-normal text-slate-400">mA</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono font-bold text-cyan-400 truncate">
                  {step.motorStatus}
                </div>
              </div>

              {/* Metric 4: Battery */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><BatteryCharging className="w-3.5 h-3.5 mr-1 text-cyan-400" /> BATTERY</span>
                  <span className="text-[10px] text-cyan-400">7.4V BMS</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {step.battery}%
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Est. Run: 48 mins rem.
                </div>
              </div>

              {/* Metric 5: Tilt Angle */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><Compass className="w-3.5 h-3.5 mr-1 text-cyan-400" /> PITCH / ROLL</span>
                  <span className="text-[10px] text-cyan-400">MPU6050</span>
                </div>
                <div className="my-2">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">
                    {step.tiltPitch}° <span className="text-slate-400 text-xs">/ {step.tiltRoll}°</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-cyan-300">
                  {step.tiltStatus}
                </div>
              </div>

              {/* Metric 6: Obstruction Status */}
              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                step.obstacleDetected
                  ? 'bg-red-950/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                  <span className="flex items-center"><ShieldAlert className="w-3.5 h-3.5 mr-1 text-cyan-400" /> OBSTRUCTION</span>
                  <span className="text-[10px] text-cyan-400">AI / FUSION</span>
                </div>
                <div className="my-2">
                  <div className={`text-base sm:text-lg font-black font-mono uppercase ${
                    step.obstacleDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                  }`}>
                    {step.obstacleDetected ? 'DETECTED' : 'CLEAR'}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {step.obstacleType}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Cockpit: Dynamic Sensor Trend Charts & Event Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-slate-800">
            
            {/* Live Chart: Distance & Motor Current */}
            <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-slate-300 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> REAL-TIME SENSOR PROFILES (DISTANCE VS MOTOR CURRENT)
                </span>
                <span className="text-cyan-400">CYCLES: 50Hz LOG</span>
              </div>
              <div className="h-48 sm:h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartHistory}>
                    <defs>
                      <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#172554" opacity={0.5} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontStyle="monospace" />
                    <YAxis stroke="#64748b" fontSize={10} fontStyle="monospace" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09101f', borderColor: '#00f0ff', fontSize: '11px', fontFamily: 'monospace' }} 
                    />
                    <Area type="monotone" dataKey="current" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#currentGrad)" name="Motor Current (mA)" />
                    <Area type="monotone" dataKey="flow" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#flowGrad)" name="Flow Rate (L/min)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event Timeline Log */}
            <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-slate-300 flex items-center">
                  <Terminal className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> EVENT LOG TIMELINE
                </span>
                <span className="text-slate-500">microSD BUFFER</span>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-48 sm:max-h-56 pr-1 font-mono text-[10px]">
                {eventLogs.map((ev, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border ${
                      ev.risk === 'danger'
                        ? 'bg-red-950/40 border-red-500/50 text-red-300'
                        : ev.risk === 'warning'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-0.5">
                      <span>[{ev.time}]</span>
                      <span className="text-cyan-400">{ev.dist}</span>
                    </div>
                    <div className="leading-tight truncate">
                      {ev.msg}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
