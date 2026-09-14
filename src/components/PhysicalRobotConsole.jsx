import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield,
  Camera,
  VideoOff,
  Gamepad2,
  Activity,
  Zap,
  Droplets,
  Gauge,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  Sliders,
  Terminal,
  ChevronDown,
  ChevronUp,
  Power,
  Compass,
  Bluetooth
} from 'lucide-react';
import robotComm from '../services/robotCommunication';

export default function PhysicalRobotConsole() {
  // --- Bluetooth Connection State ---
  const [isRobotConnected, setIsRobotConnected] = useState(false);
  const [connectedPortName, setConnectedPortName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transportMode, setTransportMode] = useState(() => robotComm.mode); // 'webserial' | 'bridge'
  const [bridgePorts, setBridgePorts] = useState([]);
  const [selectedBridgePort, setSelectedBridgePort] = useState('');
  const [lastError, setLastError] = useState('');

  // --- Robot Motion State ---
  const [activeCommand, setActiveCommand] = useState('S');
  const [lastSentCommand, setLastSentCommand] = useState('S');

  // Direction swap orientation calibration:
  // Default is Direct (1:1) since firmware aqua_shield_robot_wifi.ino is now calibrated
  const [swapOrientation, setSwapOrientation] = useState(() => {
    const saved = localStorage.getItem('aqua_shield_swap_orientation');
    return saved !== null ? saved === 'true' : false; // Default: false (Direct 1:1)
  });

  const toggleSwapOrientation = useCallback(() => {
    setSwapOrientation((prev) => {
      const next = !prev;
      localStorage.setItem('aqua_shield_swap_orientation', String(next));
      return next;
    });
  }, []);

  // --- Telemetry State ---
  const [telemetry, setTelemetry] = useState({
    voltage: 0,
    current: 0,
    gas: 0,
    distance: 0,
    accelX: 0,
    accelY: 0,
    accelZ: 0,
    timestamp: null,
  });
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [rawLogs, setRawLogs] = useState([]);
  const [showRawLogs, setShowRawLogs] = useState(false);
  // --- Safety Thresholds & Limit Alert Evaluation (Voltage limits removed as requested) ---
  const [testAlertActive, setTestAlertActive] = useState(false);

  // Real-time limit evaluations
  // 1. Current: Safe < 1400mA | Motor Stall limit: > 2000mA
  const isCurrentCritical = telemetry.current > 2000 || testAlertActive;
  const isCurrentWarning = telemetry.current > 1400 && telemetry.current <= 2000;

  // 2. Gas Level: Safe < 700 RAW | Hazardous Sewer Gas limit: > 1500 RAW
  const isGasCritical = telemetry.gas > 1500 || testAlertActive;
  const isGasWarning = telemetry.gas > 700 && telemetry.gas <= 1500;

  // 3. Distance: Safe > 25cm | Collision / Chokepoint limit: <= 15cm
  const isDistanceCritical = (telemetry.distance > 0 && telemetry.distance <= 15) || testAlertActive;
  const isDistanceWarning = telemetry.distance > 15 && telemetry.distance <= 25;

  // Global hazard alert flag: Activated when ANY limit is crossed (Current, Gas, or Distance)
  const hasActiveAlert = isCurrentCritical || isGasCritical || isDistanceCritical;

  // --- ESP32-CAM State (Isolated stream) ---
  const [cameraUrl, setCameraUrl] = useState('http://192.168.4.1/stream');
  const [isCameraOnline, setIsCameraOnline] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [showCamSettings, setShowCamSettings] = useState(false);
  const [streamKey, setStreamKey] = useState(Date.now());

  // Refs
  const heartbeatTimerRef = useRef(null);
  const activeCommandRef = useRef('S');

  // -------------------------------------------------------------
  // 1. Hold-To-Move & Safe Command Dispatcher
  // -------------------------------------------------------------
  // Kinematic mapping based on user calibration:
  // User requested: "forward is working as right , backword as left. right is working as front and left is working as backqord swap them."
  // When swapped:
  // - FORWARD ('F')  -> Sends 'R' (triggers physical FRONT drive)
  // - BACKWARD ('B') -> Sends 'L' (triggers physical BACKWARD drive)
  // - RIGHT ('R')    -> Sends 'F' (triggers physical RIGHT turn)
  // - LEFT ('L')     -> Sends 'B' (triggers physical LEFT turn)
  // - STOP ('S')     -> Sends 'S'
  const mapCommandToWire = useCallback((cmd) => {
    if (!swapOrientation) return cmd;
    switch (cmd) {
      case 'F': return 'R';
      case 'B': return 'L';
      case 'R': return 'F';
      case 'L': return 'B';
      default: return cmd;
    }
  }, [swapOrientation]);

  // Helper to send single-byte raw command over Bluetooth
  const sendRaw = useCallback((c) => {
    robotComm.sendCommand(c);
  }, []);

  // Stops motor movement immediately, clears heartbeat, and sends
  // a burst of 3 'S' stop packets (+0ms, +35ms, +70ms) to ensure zero stop-lag over Bluetooth
  const stopMoving = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    activeCommandRef.current = 'S';
    setActiveCommand('S');
    setLastSentCommand('S');

    // Immediate STOP
    sendRaw('S');

    // Redundancy burst
    setTimeout(() => sendRaw('S'), 35);
    setTimeout(() => sendRaw('S'), 70);
  }, [sendRaw]);

  // Starts motor movement and sends periodic heartbeat (every 200ms)
  // to satisfy the ESP32 hardware-side 1500ms safety timeout while held
  const startMoving = useCallback((cmd) => {
    const valid = ['F', 'B', 'L', 'R'].includes(cmd);
    if (!valid) return;

    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }

    const wireCmd = mapCommandToWire(cmd);

    activeCommandRef.current = cmd;
    setActiveCommand(cmd);
    setLastSentCommand(wireCmd);

    // Send immediate 1-byte command
    sendRaw(wireCmd);

    // Keep sending command every 200ms while held to keep ESP32 watchdog fed
    heartbeatTimerRef.current = setInterval(() => {
      sendRaw(wireCmd);
    }, 200);
  }, [mapCommandToWire, sendRaw]);

  // Unified command router used by buttons & keyboard
  const sendRobotCommand = useCallback((cmd) => {
    if (cmd === 'S') {
      stopMoving();
    } else {
      startMoving(cmd);
    }
  }, [startMoving, stopMoving]);

  // -------------------------------------------------------------
  // 2. Bluetooth Connection Management via Transport Abstraction
  // -------------------------------------------------------------
  const connectRobot = useCallback(async () => {
    setIsConnecting(true);
    setLastError('');
    try {
      await robotComm.connect({ port: selectedBridgePort });
    } catch (err) {
      setIsConnecting(false);
      setLastError(err.message || 'Bluetooth connection failed');
    }
  }, [selectedBridgePort]);

  const disconnectRobot = useCallback(async () => {
    stopMoving();
    setIsConnecting(false);
    try {
      await robotComm.disconnect();
    } catch (err) {
      console.error(err);
    }
    setIsRobotConnected(false);
  }, [stopMoving]);

  const toggleTransportMode = useCallback(async (newMode) => {
    if (isRobotConnected) {
      await disconnectRobot();
    }
    robotComm.setTransportMode(newMode);
    setTransportMode(newMode);
    if (newMode === 'bridge') {
      try {
        const ports = await robotComm.fetchBridgePorts();
        setBridgePorts(ports);
        if (ports.length > 0 && !selectedBridgePort) {
          const bt = ports.find((p) => p.isBluetooth);
          setSelectedBridgePort(bt ? bt.path : ports[0].path);
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, [disconnectRobot, isRobotConnected, selectedBridgePort]);

  const refreshBridgePorts = useCallback(async () => {
    try {
      const ports = await robotComm.fetchBridgePorts();
      setBridgePorts(ports);
      if (ports.length > 0) {
        const bt = ports.find((p) => p.isBluetooth);
        setSelectedBridgePort(bt ? bt.path : ports[0].path);
      }
    } catch (err) {
      setLastError(`Could not fetch COM ports: ${err.message}`);
    }
  }, []);

  // Listen to robotComm events (Telemetry, Status, Logs, Ports)
  useEffect(() => {
    const unsubTelemetry = robotComm.on('telemetry', (data) => {
      setTelemetry(data);
      setTelemetryHistory((prev) => [
        ...prev.slice(-19),
        { time: new Date().toLocaleTimeString(), ...data },
      ]);
    });

    const unsubStatus = robotComm.on('status', (status) => {
      setIsRobotConnected(Boolean(status.connected));
      setIsVerifying(Boolean(status.verifying));
      if (status.connected) {
        setIsConnecting(false);
        setIsVerifying(false);
        setLastError('');
        setConnectedPortName(status.port || 'ESP32_Robot_BT');
      } else if (status.verifying) {
        setIsConnecting(true);
        setIsVerifying(true);
        setConnectedPortName(status.port || 'ESP32_Robot_BT');
      } else {
        setIsConnecting(false);
        setIsVerifying(false);
        setConnectedPortName('');
        if (status.error) {
          setLastError(status.error);
        }
        setTelemetry({
          voltage: 0,
          current: 0,
          gas: 0,
          distance: 0,
          accelX: 0,
          accelY: 0,
          accelZ: 0,
          timestamp: null,
        });
        stopMoving();
      }
    });

    const unsubLog = robotComm.on('log', (msg) => {
      setRawLogs((prev) => [...prev.slice(-40), msg]);
    });

    const unsubPorts = robotComm.on('ports', (ports) => {
      setBridgePorts(ports || []);
      if (ports && ports.length > 0 && !selectedBridgePort) {
        const bt = ports.find((p) => p.isBluetooth);
        setSelectedBridgePort(bt ? bt.path : ports[0].path);
      }
    });

    return () => {
      unsubTelemetry();
      unsubStatus();
      unsubLog();
      unsubPorts();
    };
  }, [selectedBridgePort, stopMoving]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      robotComm.disconnect().catch(() => {});
    };
  }, []);

  // -------------------------------------------------------------
  // 3. Keyboard Navigation Controls
  // W/Up -> F, S/Down -> B, A/Left -> L, D/Right -> R, Space -> S
  // Keyup sends 'S' and stops heartbeat for guaranteed safety
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (e.repeat) return; // Ignore native browser repeating events

      if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        startMoving('F');
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        startMoving('B');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        startMoving('L');
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        startMoving('R');
      } else if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        stopMoving();
      }
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      // On release of any directional motion key, automatically issue STOP
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        stopMoving();
      }
    };

    const handleWindowBlur = () => {
      // Emergency halt if browser window loses focus
      stopMoving();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopMoving();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startMoving, stopMoving]);

  // -------------------------------------------------------------
  // 4. Camera Stream Handling (Independent from Robot WebSocket)
  // -------------------------------------------------------------
  const handleCameraLoad = () => {
    setIsCameraOnline(true);
    setCameraError('');
  };

  const handleCameraError = () => {
    setIsCameraOnline(false);
    setCameraError('Camera stream unreachable. Confirm device is connected to ESP32-CAM Wi-Fi (192.168.4.1).');
  };

  const refreshCamera = () => {
    setStreamKey(Date.now());
  };

  return (
    <div className="max-w-[1540px] mx-auto px-3 sm:px-6 py-6 font-sans text-slate-100 relative z-10">

      {/* ========================================================================= */}
      {/* CRITICAL HAZARD RED ALERT THEME (Z-INDEX: -1)                             */}
      {/* Activated whenever Voltage, Current, Gas, or Distance breaches limits     */}
      {/* ========================================================================= */}
      {hasActiveAlert && (
        <div
          className="fixed inset-0 pointer-events-none transition-all duration-700 animate-pulse overflow-hidden"
          style={{ zIndex: -1 }}
        >
          {/* Deep crimson emergency background tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-950/75 via-red-900/40 to-[#0b0204] mix-blend-screen" />

          {/* Flashing hazard perimeter vignette & glowing red border */}
          <div className="absolute inset-0 border-[6px] border-red-600/50 shadow-[inset_0_0_180px_rgba(220,38,38,0.65)]" />

          {/* High-intensity danger radial flares */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-red-600/25 blur-[160px] rounded-full" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-rose-700/20 blur-[180px] rounded-full" />

          {/* Ambient diagonal hazard stripe overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,0,0,0.3) 0, rgba(255,0,0,0.3) 25px, transparent 25px, transparent 50px)'
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP STATUS & LOCAL WI-FI WEBSOCKET CONNECTION BAR                      */}
      {/* ========================================================================= */}
      <div className={`mb-4 p-4 sm:p-5 rounded-2xl border-2 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all ${hasActiveAlert ? 'bg-[#120406] border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'bg-[#070e20] border-cyan-500/30'
        }`}>

        {/* Brand & Mission Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                AQUA-SHIELD
              </h1>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Bluetooth Connection Status */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${
            isRobotConnected
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : isVerifying || isConnecting
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-red-950/70 border-red-500 text-red-300'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              isRobotConnected 
                ? 'bg-emerald-400 animate-pulse' 
                : isVerifying || isConnecting 
                  ? 'bg-amber-400 animate-ping' 
                  : 'bg-red-500'
            }`}></span>
            <Bluetooth className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Bluetooth: {
                isRobotConnected 
                  ? `● Connected (${connectedPortName || 'ESP32_Robot_BT'})` 
                  : isVerifying || isConnecting 
                    ? `● Verifying Robot... (${connectedPortName || selectedBridgePort || 'COM'})`
                    : '● Disconnected'
              }
            </span>
          </div>

          {/* Camera Connection Status */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${isCameraOnline
              ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isCameraOnline ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>Camera: {isCameraOnline ? '● Connected' : '● Disconnected'}</span>
          </div>

          {/* Active Command Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">STATE:</span>
            <span className={`font-bold ${activeCommand === 'S' ? 'text-amber-400' : 'text-emerald-400 animate-pulse'}`}>
              {activeCommand === 'F' && 'FORWARD (F)'}
              {activeCommand === 'B' && 'BACKWARD (B)'}
              {activeCommand === 'L' && 'TURNING LEFT (L)'}
              {activeCommand === 'R' && 'TURNING RIGHT (R)'}
              {activeCommand === 'S' && 'STOPPED (S)'}
            </span>
            {activeCommand !== 'S' && swapOrientation && (
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                Wire: {lastSentCommand}
              </span>
            )}
          </div>

          {/* Direction Calibration / Axis Swap Toggle */}
          <button
            onClick={toggleSwapOrientation}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${swapOrientation
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            title="Toggle motor direction mapping (F↔R, B↔L)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Axis: {swapOrientation ? 'Swapped (F↔R, B↔L)' : 'Direct (1:1)'}</span>
          </button>

        </div>

        {/* Bluetooth Connection Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Transport Mode Switcher */}
          <div className="flex items-center bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-700 font-mono text-xs">
            <span className="text-slate-400 mr-2 font-bold">Mode:</span>
            <button
              type="button"
              onClick={() => toggleTransportMode('webserial')}
              disabled={isRobotConnected || !robotComm.isWebSerialSupported()}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                transportMode === 'webserial'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white disabled:opacity-30'
              }`}
              title={robotComm.isWebSerialSupported() ? 'Direct In-Browser Bluetooth via Web Serial API' : 'Web Serial not supported in this browser'}
            >
              Direct (Web Serial)
            </button>
            <button
              type="button"
              onClick={() => toggleTransportMode('bridge')}
              disabled={isRobotConnected}
              className={`ml-1 px-2 py-1 rounded text-[11px] font-bold transition-all ${
                transportMode === 'bridge'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop Bridge Mode (ws://localhost:5001)"
            >
              Bridge Server
            </button>
          </div>

          {/* Bridge COM Port Selector (Only visible in Bridge mode) */}
          {transportMode === 'bridge' && (
            <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-700 font-mono text-xs">
              <select
                value={selectedBridgePort}
                onChange={(e) => setSelectedBridgePort(e.target.value)}
                disabled={isRobotConnected}
                className="bg-slate-950 text-white px-2 py-1 rounded border border-slate-700 text-xs font-mono font-bold focus:outline-none focus:border-cyan-400 max-w-[140px]"
              >
                {bridgePorts.length === 0 ? (
                  <option value="">No COM Ports</option>
                ) : (
                  bridgePorts.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.friendlyName || p.path} {p.isBluetooth ? '⚡ (BT)' : ''}
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={refreshBridgePorts}
                disabled={isRobotConnected}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Refresh COM Ports"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Connect / Disconnect Action Button */}
          {isRobotConnected ? (
            <button
              type="button"
              onClick={disconnectRobot}
              className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Power className="w-4 h-4" />
              <span>Disconnect BT</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={connectRobot}
              disabled={isConnecting || isVerifying}
              className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-black flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 hover:scale-105"
            >
              <Bluetooth className="w-4 h-4" />
              <span>
                {isVerifying ? 'Verifying Robot...' : isConnecting ? 'Opening Port...' : transportMode === 'webserial' ? 'CONNECT BLUETOOTH' : 'CONNECT VIA BRIDGE'}
              </span>
            </button>
          )}
        </div>

      </div>

      {/* Error Alert Banner */}
      {lastError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/90 border-2 border-red-600 text-red-200 text-xs font-mono flex items-center justify-between animate-fadeIn shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{lastError}</span>
          </div>
          <button
            onClick={() => setLastError('')}
            className="text-red-400 hover:text-white text-sm font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE CAMERA STREAM (TOP FULL SECTION)                                  */}
      {/* ========================================================================= */}
      <div className="mb-6 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-xl overflow-hidden">

        {/* Stream Header */}
        <div className="px-4 py-2.5 bg-[#06101e] border-b border-cyan-950 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white tracking-wide">ESP32-CAM LIVE STREAM</span>
            <span className="text-[10px] text-slate-400">({cameraUrl})</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshCamera}
              className="flex items-center space-x-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Refresh Stream"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>

            <button
              onClick={() => setShowCamSettings(!showCamSettings)}
              className="flex items-center space-x-1 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            {isCameraOnline && (
              <span className="flex items-center text-red-500 font-bold animate-pulse text-[10px]">
                ● LIVE FEED
              </span>
            )}
          </div>
        </div>

        {/* Collapsible Camera Endpoint Settings */}
        {showCamSettings && (
          <div className="p-3 bg-slate-950/90 border-b border-slate-800 text-xs font-mono space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-slate-300">Camera Stream URL:</span>
              <div className="flex items-center space-x-2 w-full sm:w-2/3">
                <input
                  type="text"
                  value={cameraUrl}
                  onChange={(e) => setCameraUrl(e.target.value)}
                  className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={refreshCamera}
                  className="px-3 py-1 rounded bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Note: Camera uses its own Wi-Fi or stream address (typically http://192.168.4.1/stream).
            </div>
          </div>
        )}

        {/* Camera Display Viewport */}
        <div className="relative aspect-video max-h-[460px] w-full bg-black flex items-center justify-center overflow-hidden">

          <img
            key={streamKey}
            src={cameraUrl}
            alt="ESP32-CAM Feed"
            onLoad={handleCameraLoad}
            onError={handleCameraError}
            className="w-full h-full object-contain"
          />

          {/* Standby / Offline Overlay */}
          {!isCameraOnline && (
            <div className="absolute inset-0 bg-[#060c1c]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                <VideoOff className="w-8 h-8 text-cyan-400/60" />
              </div>
              <h3 className="text-base font-bold text-white font-mono mb-1">
                ESP32-CAM STREAM STANDBY
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
                Connect your laptop to the ESP32-CAM network (<span className="text-cyan-300 font-bold">192.168.4.1</span>) or verify camera IP.
              </p>
              {cameraError && (
                <div className="p-2 rounded bg-red-950/50 border border-red-800/80 text-[11px] font-mono text-red-300 mb-3">
                  {cameraError}
                </div>
              )}
              <button
                onClick={refreshCamera}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Reconnect Stream
              </button>
            </div>
          )}

          {/* Overlay Reticle */}
          {isCameraOnline && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-cyan-400/30"></div>
              <div className="absolute w-24 h-24 rounded-full border border-cyan-400/20"></div>
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400/60"></div>
              <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded">
                AQUA-SHIELD CAM • DUAL LEDS ACTIVE
              </div>
              <div className="absolute bottom-3 right-4 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                DIST: {telemetry.distance === -1 ? '> 340 cm (CLEAR)' : `${telemetry.distance} cm`}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. LOWER SPLIT: ROBOT CONTROL & LIVE TELEMETRY                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ----------------------------------------------------------------------- */}
        {/* LEFT: ROBOT CONTROLS & ERGONOMIC D-PAD (5 COLS)                         */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-xl flex flex-col justify-between">

          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-cyan-400" /> ROBOT MOTION CONTROL
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                W, A, S, D, SPACE
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${swapOrientation ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}>
                {swapOrientation ? 'CALIBRATED: F↔R, B↔L' : '1:1 DIRECT'}
              </span>
            </div>
          </div>

          {/* D-PAD DIRECTIONAL CLUSTER (HOLD-TO-MOVE) */}
          <div className="my-3 flex flex-col items-center justify-center">

            {/* FORWARD (W / UP) */}
            <button
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture?.(e.pointerId);
                sendRobotCommand('F');
              }}
              onPointerUp={(e) => {
                try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { }
                sendRobotCommand('S');
              }}
              onPointerCancel={() => sendRobotCommand('S')}
              onPointerLeave={() => sendRobotCommand('S')}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-28 sm:w-32 py-3 mb-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all select-none ${activeCommand === 'F'
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400'
                }`}
              title="Forward (Press 'W' or 'Arrow Up')"
            >
              <span className="text-lg leading-none">▲</span>
              <span className="text-[10px] tracking-wider mt-0.5">FORWARD (W)</span>
            </button>

            {/* MIDDLE ROW: LEFT, STOP, RIGHT */}
            <div className="flex items-center justify-center space-x-2 w-full max-w-sm">

              {/* LEFT (A / LEFT) */}
              <button
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                  sendRobotCommand('L');
                }}
                onPointerUp={(e) => {
                  try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { }
                  sendRobotCommand('S');
                }}
                onPointerCancel={() => sendRobotCommand('S')}
                onPointerLeave={() => sendRobotCommand('S')}
                onContextMenu={(e) => e.preventDefault()}
                className={`flex-1 py-3.5 rounded-2xl border font-mono font-bold text-xs flex flex-col items-center justify-center transition-all select-none ${activeCommand === 'L'
                    ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-95'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400'
                  }`}
                title="Left (Press 'A' or 'Arrow Left')"
              >
                <span className="text-lg leading-none">◀</span>
                <span className="text-[10px] tracking-wider mt-0.5">LEFT (A)</span>
              </button>

              {/* VISUALLY PROMINENT STOP BUTTON (SPACE) */}
              <button
                onClick={() => sendRobotCommand('S')}
                className={`w-24 sm:w-28 py-4 rounded-2xl border-2 font-mono font-black text-sm flex flex-col items-center justify-center transition-all select-none ${activeCommand === 'S'
                    ? 'bg-red-600 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-95 animate-pulse'
                    : 'bg-red-950/80 hover:bg-red-900 border-red-700 text-red-200 hover:text-white'
                  }`}
                title="Emergency Halt (Spacebar)"
              >
                <span className="text-base font-black tracking-wider">STOP</span>
                <span className="text-[9px] text-red-300">SPACEBAR</span>
              </button>

              {/* RIGHT (D / RIGHT) */}
              <button
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture?.(e.pointerId);
                  sendRobotCommand('R');
                }}
                onPointerUp={(e) => {
                  try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { }
                  sendRobotCommand('S');
                }}
                onPointerCancel={() => sendRobotCommand('S')}
                onPointerLeave={() => sendRobotCommand('S')}
                onContextMenu={(e) => e.preventDefault()}
                className={`flex-1 py-3.5 rounded-2xl border font-mono font-bold text-xs flex flex-col items-center justify-center transition-all select-none ${activeCommand === 'R'
                    ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-95'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400'
                  }`}
                title="Right (Press 'D' or 'Arrow Right')"
              >
                <span className="text-lg leading-none">▶</span>
                <span className="text-[10px] tracking-wider mt-0.5">RIGHT (D)</span>
              </button>

            </div>

            {/* BACKWARD (S / DOWN) */}
            <button
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture?.(e.pointerId);
                sendRobotCommand('B');
              }}
              onPointerUp={(e) => {
                try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { }
                sendRobotCommand('S');
              }}
              onPointerCancel={() => sendRobotCommand('S')}
              onPointerLeave={() => sendRobotCommand('S')}
              onContextMenu={(e) => e.preventDefault()}
              className={`w-28 sm:w-32 py-3 mt-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all select-none ${activeCommand === 'B'
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400'
                }`}
              title="Backward (Press 'S' or 'Arrow Down')"
            >
              <span className="text-[10px] tracking-wider mb-0.5">BACKWARD (S)</span>
              <span className="text-lg leading-none">▼</span>
            </button>

          </div>

          {/* Safety Notice Footer */}
          <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isRobotConnected ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
              <span>Hold to move • Release to stop</span>
            </div>
            <span className="text-cyan-400 text-[10px]">
              {swapOrientation ? 'Fwd→Front • Back→Back • Right→Right • Left→Left' : 'Standard 1:1 • 500ms Watchdog'}
            </span>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT: LIVE TELEMETRY DASHBOARD (7 COLS)                                */}
        {/* ----------------------------------------------------------------------- */}
        <div className={`lg:col-span-7 p-4 rounded-2xl border shadow-xl flex flex-col justify-between transition-all ${hasActiveAlert
            ? 'bg-[#140507]/90 border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.35)]'
            : 'bg-[#070e20] border-cyan-500/25'
          }`}>

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Activity className={`w-4 h-4 ${hasActiveAlert ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                LIVE SENSOR TELEMETRY
              </span>
              {hasActiveAlert && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-red-950 border border-red-500 text-red-300 animate-pulse">
                  🚨 HAZARD ALERT ACTIVE
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setTestAlertActive(prev => !prev)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${testAlertActive
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-red-400'
                  }`}
                title="Toggle simulated limit breach to preview red alert theme"
              >
                {testAlertActive ? '🔴 TEST ALERT ON' : '⚡ Test Alert Theme'}
              </button>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Update Rate: ~1 Hz
              </span>
            </div>
          </div>

          {/* HAZARD SUMMARY BANNER WHEN LIMIT IS CROSSED */}
          {hasActiveAlert && (
            <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-red-950/90 border-2 border-red-500 text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                <span className="text-[11px] sm:text-xs">
                  LIMIT BREACH DETECTED:{' '}
                  {[
                    isCurrentCritical && `CURRENT (${telemetry.current.toFixed(0)}mA >2000mA Stall)`,
                    isGasCritical && `GAS (${telemetry.gas} RAW >1500 Toxic)`,
                    isDistanceCritical && `DISTANCE (${telemetry.distance}cm ≤15cm Collision)`
                  ].filter(Boolean).join(' • ')}
                </span>
              </div>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-red-900 border border-red-400 text-white font-black shrink-0">
                CRITICAL LIMIT
              </span>
            </div>
          )}

          {/* OFFLINE GUIDANCE BANNER WHEN NOT CONNECTED */}
          {!isRobotConnected && (
            <div className="mb-3 p-3 rounded-xl bg-amber-950/60 border-2 border-amber-500/80 text-amber-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>
                  {isVerifying ? (
                    <>
                      <strong>VERIFYING PHYSICAL LINK:</strong> Port opened. Waiting for telemetry from ESP32. <em>Ensure robot power switch is ON.</em>
                    </>
                  ) : (
                    <>
                      <strong>ROBOT DISCONNECTED:</strong> Telemetry is offline. Ensure robot power is <strong>ON</strong>, then click <span className="text-cyan-300 font-bold">CONNECT BLUETOOTH</span>.
                    </>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={connectRobot}
                disabled={isConnecting || isVerifying}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[11px] font-mono font-black flex items-center space-x-1 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] shrink-0 disabled:opacity-50"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Verifying...' : isConnecting ? 'Opening...' : 'Connect Now'}</span>
              </button>
            </div>
          )}

          {/* TELEMETRY TILES GRID (6 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-1">

            {/* 1. BUS VOLTAGE */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 hover:border-cyan-400 flex flex-col justify-between transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="font-bold">VOLTAGE</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>

              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {isRobotConnected && telemetry.timestamp ? telemetry.voltage.toFixed(2) : '--'}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">{isRobotConnected && telemetry.timestamp ? 'V' : ''}</span>
              </div>

              <div className="text-[9px] font-mono text-slate-400">
                Raw Bus Voltage • Battery % N/A
              </div>
            </div>

            {/* 2. CURRENT LOAD */}
            <div className={`p-3 rounded-xl flex flex-col justify-between transition-all ${isCurrentCritical
                ? 'bg-red-950/80 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : isCurrentWarning
                  ? 'bg-amber-950/40 border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#06101e] border border-cyan-500/30 hover:border-cyan-400'
              }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold">
                  <span>CURRENT LOAD</span>
                  {isCurrentCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>}
                </span>
                <Gauge className={`w-3.5 h-3.5 ${isCurrentCritical ? 'text-red-400' : isCurrentWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
              </div>

              <div className="my-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${isCurrentCritical ? 'text-red-400' : isCurrentWarning ? 'text-amber-300' : 'text-white'
                  }`}>
                  {isRobotConnected && telemetry.timestamp ? telemetry.current.toFixed(1) : '--'}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">{isRobotConnected && telemetry.timestamp ? 'mA' : ''}</span>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                  <span>INA219 Shunt Load</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${isCurrentCritical ? 'bg-red-900 text-red-200' : isCurrentWarning ? 'bg-amber-900/80 text-amber-200' : 'bg-slate-800 text-emerald-300'
                    }`}>
                    {isCurrentCritical ? 'STALL BREACH' : isCurrentWarning ? 'HIGH LOAD' : 'NORMAL'}
                  </span>
                </div>
                <div className="text-[8.5px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 flex justify-between">
                  <span>Safe: &lt;1400mA</span>
                  <span className={isCurrentCritical ? 'text-red-400 font-bold' : 'text-slate-400'}>Limit: &gt;2000mA</span>
                </div>
              </div>
            </div>

            {/* 3. GAS LEVEL */}
            <div className={`p-3 rounded-xl flex flex-col justify-between transition-all ${isGasCritical
                ? 'bg-red-950/80 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : isGasWarning
                  ? 'bg-amber-950/40 border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#06101e] border border-cyan-500/30 hover:border-cyan-400'
              }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold">
                  <span>GAS LEVEL</span>
                  {isGasCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>}
                </span>
                <Droplets className={`w-3.5 h-3.5 ${isGasCritical ? 'text-red-400' : isGasWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
              </div>

              <div className="my-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${isGasCritical ? 'text-red-400' : isGasWarning ? 'text-amber-300' : 'text-white'
                  }`}>
                  {isRobotConnected && telemetry.timestamp ? telemetry.gas : '--'}
                </span>
                <span className="text-[10px] font-mono text-slate-400 ml-1">{isRobotConnected && telemetry.timestamp ? 'RAW' : ''}</span>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono flex items-center justify-between">
                  <span className={isGasCritical ? 'text-red-300 font-bold' : isGasWarning ? 'text-amber-300 font-bold' : 'text-emerald-400 font-semibold'}>
                    {isGasCritical ? '⚠️ Toxic Sewer Gas' : isGasWarning ? '🟡 Elevated Gas' : '🟢 Atmosphere Normal'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${isGasCritical ? 'bg-red-900 text-red-200' : isGasWarning ? 'bg-amber-900/80 text-amber-200' : 'bg-slate-800 text-emerald-300'
                    }`}>
                    {isGasCritical ? 'GAS BREACH' : isGasWarning ? 'CAUTION' : 'SAFE'}
                  </span>
                </div>
                <div className="text-[8.5px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 flex justify-between">
                  <span>Safe: &lt;700 RAW</span>
                  <span className={isGasCritical ? 'text-red-400 font-bold' : 'text-slate-400'}>Limit: &gt;1500 RAW</span>
                </div>
              </div>
            </div>

            {/* 4. DISTANCE */}
            <div className={`p-3 rounded-xl flex flex-col justify-between transition-all ${isDistanceCritical
                ? 'bg-red-950/80 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : isDistanceWarning
                  ? 'bg-amber-950/40 border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-[#06101e] border border-cyan-500/30 hover:border-cyan-400'
              }`}>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 font-bold">
                  <span>DISTANCE</span>
                  {isDistanceCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>}
                </span>
                <Compass className={`w-3.5 h-3.5 ${isDistanceCritical ? 'text-red-400' : isDistanceWarning ? 'text-amber-400' : 'text-cyan-400'}`} />
              </div>

              <div className="my-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${isDistanceCritical ? 'text-red-400' : isDistanceWarning ? 'text-amber-300' : 'text-white'
                  }`}>
                  {isRobotConnected && telemetry.timestamp ? (telemetry.distance === -1 ? '--' : telemetry.distance) : '--'}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">{isRobotConnected && telemetry.timestamp && telemetry.distance !== -1 ? 'cm' : ''}</span>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between">
                  <span>HC-SR04 Ranger</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${telemetry.distance === -1
                      ? 'bg-slate-800 text-cyan-300'
                      : isDistanceCritical
                        ? 'bg-red-900 text-red-200'
                        : isDistanceWarning
                          ? 'bg-amber-900/80 text-amber-200'
                          : telemetry.distance > 0
                            ? 'bg-slate-800 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                    }`}>
                    {telemetry.distance === -1 ? 'OUT OF RANGE' : isDistanceCritical ? 'COLLISION HAZARD' : isDistanceWarning ? 'NEAR WALL' : telemetry.distance > 0 ? 'CLEAR' : 'IDLE'}
                  </span>
                </div>
                <div className="text-[8.5px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 flex justify-between">
                  <span>Safe: &gt;25cm</span>
                  <span className={isDistanceCritical ? 'text-red-400 font-bold' : 'text-slate-400'}>Limit: ≤15cm</span>
                </div>
              </div>
            </div>

            {/* 5. ACCELERATION X & Y */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>ACCEL [X, Y]</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-1.5 font-mono">
                <div className="text-sm font-bold text-white">
                  X: <span className="text-cyan-300">{isRobotConnected && telemetry.timestamp ? telemetry.accelX.toFixed(1) : '--'}</span> {isRobotConnected && telemetry.timestamp ? 'm/s²' : ''}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Y: <span className="text-cyan-300">{isRobotConnected && telemetry.timestamp ? telemetry.accelY.toFixed(1) : '--'}</span> {isRobotConnected && telemetry.timestamp ? 'm/s²' : ''}
                </div>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                MPU6050 Pitch/Roll Tilt
              </div>
            </div>

            {/* 6. ACCELERATION Z */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>ACCEL [Z]</span>
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {isRobotConnected && telemetry.timestamp ? telemetry.accelZ.toFixed(1) : '--'}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">{isRobotConnected && telemetry.timestamp ? 'm/s²' : ''}</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                MPU6050 Vertical Axis
              </div>
            </div>

          </div>

          {/* TELEMETRY DIAGNOSTIC FOOTER */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              TRANSPORT: <strong className="text-cyan-300">Bluetooth Classic Serial ({connectedPortName || 'ESP32_Robot_BT'})</strong>
            </span>
            <button
              onClick={() => setShowRawLogs(!showRawLogs)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showRawLogs ? 'Hide Raw Logs' : 'View Serial Logs'}</span>
              {showRawLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>



      {/* ========================================================================= */}
      {/* 5. COLLAPSIBLE RAW SERIAL / WEBSOCKET LOGS FOR DEBUGGING                   */}
      {/* ========================================================================= */}
      {showRawLogs && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-black border-2 border-cyan-500/40 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-cyan-300 font-bold flex items-center gap-2 text-sm">
              <Terminal className="w-4 h-4" /> LIVE ESP32 BLUETOOTH TELEMETRY BUFFER
            </span>
            <span className="text-[11px] text-slate-500">JSON Stream</span>
          </div>
          <div className="max-h-56 overflow-y-auto space-y-1 font-mono text-[11px] text-emerald-400/90">
            {rawLogs.length === 0 ? (
              <span className="text-slate-600 italic">No incoming packets yet. Enter robot IP and click CONNECT to establish local Wi-Fi WebSocket link.</span>
            ) : (
              rawLogs.map((log, i) => (
                <div key={i} className="leading-tight">
                  <span className="text-slate-600 mr-2">&gt;</span>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
