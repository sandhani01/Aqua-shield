import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Shield, 
  Wifi, 
  WifiOff, 
  Radio, 
  Camera, 
  Video, 
  VideoOff, 
  Gamepad2, 
  Activity, 
  Zap, 
  Droplets, 
  Gauge, 
  AlertTriangle, 
  RefreshCw, 
  Maximize2, 
  Sliders, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  Power,
  Compass,
  Sparkles
} from 'lucide-react';
import PrototypeTestingSuite from './PrototypeTestingSuite';

const BRIDGE_HTTP = 'http://localhost:5001';
const BRIDGE_WS = 'ws://localhost:5001/ws';

export default function PhysicalRobotConsole() {
  // --- Connection State ---
  const [isBridgeConnected, setIsBridgeConnected] = useState(false);
  const [isRobotConnected, setIsRobotConnected] = useState(false);
  const [connectedPort, setConnectedPort] = useState('');
  const [availablePorts, setAvailablePorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [customPort, setCustomPort] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isConnectingPort, setIsConnectingPort] = useState(false);
  const [lastError, setLastError] = useState('');

  // --- Robot Command State ---
  const [activeCommand, setActiveCommand] = useState('S');
  const [lastSentCommand, setLastSentCommand] = useState('S');
  const [commandSuccess, setCommandSuccess] = useState(true);

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

  // --- ESP32-CAM State ---
  const [cameraUrl, setCameraUrl] = useState('http://192.168.4.1/stream');
  const [useProxy, setUseProxy] = useState(false);
  const [isCameraOnline, setIsCameraOnline] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [showCamSettings, setShowCamSettings] = useState(false);
  const [streamKey, setStreamKey] = useState(Date.now());

  // Refs
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const lastCommandTimeRef = useRef(0);
  const cameraImgRef = useRef(null);

  // Determine active camera stream source (no query param on direct stream to ensure exact URI match on ESP32)
  const activeStreamSrc = useProxy
    ? `${BRIDGE_HTTP}/api/camera-proxy?url=${encodeURIComponent(cameraUrl)}&t=${streamKey}`
    : cameraUrl;

  // -------------------------------------------------------------
  // 1. WebSocket Bridge Connection
  // -------------------------------------------------------------
  const connectBridge = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(BRIDGE_WS);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsBridgeConnected(true);
        setLastError('');
        // Request available ports
        ws.send(JSON.stringify({ type: 'get_ports' }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'status') {
            setIsRobotConnected(Boolean(msg.connected));
            setConnectedPort(msg.port || '');
            if (msg.connected && msg.port) {
              setSelectedPort((current) => current || msg.port);
            }
            if (msg.error) {
              setLastError(msg.error);
            }
            if (msg.lastTelemetry) {
              setTelemetry(msg.lastTelemetry);
            }
          } else if (msg.type === 'telemetry') {
            setTelemetry(msg.data);
            setTelemetryHistory((prev) => [
              ...prev.slice(-19),
              { time: new Date(msg.data.timestamp).toLocaleTimeString(), ...msg.data },
            ]);
          } else if (msg.type === 'ports') {
            setAvailablePorts(msg.ports || []);
            setSelectedPort((current) => {
              if (!current && msg.ports && msg.ports.length > 0) {
                const btPort = msg.ports.find((p) => p.isBluetooth) || msg.ports[0];
                return btPort.path;
              }
              return current;
            });
          } else if (msg.type === 'command_status') {
            setCommandSuccess(msg.success);
            if (!msg.success && msg.error) {
              setLastError(msg.error);
            }
          } else if (msg.type === 'raw') {
            setRawLogs((prev) => [...prev.slice(-40), msg.text]);
          }
        } catch (e) {
          console.error('[WS Parse Error]', e);
        }
      };

      ws.onclose = () => {
        setIsBridgeConnected(false);
        setIsRobotConnected(false);
        wsRef.current = null;
        // Auto-reconnect bridge in 3s
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = setTimeout(connectBridge, 3000);
      };

      ws.onerror = () => {
        setIsBridgeConnected(false);
        setLastError('Unable to connect to local bridge server (localhost:5001). Run "npm run bridge" in terminal.');
      };
    } catch (e) {
      console.error('[WS Init Error]', e);
    }
  }, []);

  useEffect(() => {
    connectBridge();
    return () => {
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        // Send emergency stop on unmount
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'command', command: 'S' }));
        }
        wsRef.current.close();
      }
    };
  }, [connectBridge]);

  // -------------------------------------------------------------
  // 2. Fetch Ports from Bridge REST endpoint
  // -------------------------------------------------------------
  const fetchPorts = async () => {
    try {
      const res = await fetch(`${BRIDGE_HTTP}/api/ports`);
      const data = await res.json();
      if (data.success && data.ports) {
        setAvailablePorts(data.ports);
        if (data.connectedPort) {
          setConnectedPort(data.connectedPort);
          setIsRobotConnected(true);
        }
        setSelectedPort((prev) => {
          if (!prev && data.ports.length > 0) {
            const bt = data.ports.find((p) => p.isBluetooth) || data.ports[0];
            return bt.path;
          }
          return prev;
        });
      }
    } catch {
      // Bridge might be starting
    }
  };

  const handleConnectPort = async (targetPort) => {
    const port = targetPort || (isCustomMode ? customPort.trim() : selectedPort);
    if (!port) {
      setLastError('Please select or enter a valid COM port (e.g. COM4)');
      return;
    }
    setIsConnectingPort(true);
    setLastError('');
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'connect', port }));
      } else {
        await fetch(`${BRIDGE_HTTP}/api/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ port }),
        });
      }
    } catch (err) {
      setLastError(`Connect failed: ${err.message}`);
    } finally {
      setIsConnectingPort(false);
    }
  };

  const handleDisconnectPort = async () => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'disconnect' }));
      } else {
        await fetch(`${BRIDGE_HTTP}/api/disconnect`, { method: 'POST' });
      }
    } catch (err) {
      setLastError(`Disconnect error: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // 3. Command Dispatcher with Debounce & Safety
  // -------------------------------------------------------------
  const sendRobotCommand = useCallback((cmd) => {
    const valid = ['F', 'B', 'L', 'R', 'S'].includes(cmd);
    if (!valid) return;

    const now = Date.now();
    // Allow 'S' (stop) unconditionally; rate-limit other commands to 80ms
    if (cmd !== 'S' && now - lastCommandTimeRef.current < 80) {
      return;
    }
    lastCommandTimeRef.current = now;

    setActiveCommand(cmd);
    setLastSentCommand(cmd);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'command', command: cmd }));
    }
  }, []);

  // -------------------------------------------------------------
  // 4. Keyboard Navigation Controls
  // W/Up -> F, S/Down -> B, A/Left -> L, D/Right -> R, Space -> S
  // Keyup sends 'S' to prevent continuous uncontrolled movement
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture when typing in text input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (e.repeat) return; // Prevent browser key-repeat command spam

      if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        sendRobotCommand('F');
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        sendRobotCommand('B');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        sendRobotCommand('L');
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        sendRobotCommand('R');
      } else if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        sendRobotCommand('S');
      }
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      // On release of any motion key, automatically issue STOP for operator safety
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        sendRobotCommand('S');
      }
    };

    const handleWindowBlur = () => {
      // Emergency halt if browser window loses focus
      sendRobotCommand('S');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [sendRobotCommand]);

  // -------------------------------------------------------------
  // 5. Camera Stream Status Monitoring
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
    <div className="max-w-[1540px] mx-auto px-3 sm:px-6 py-6 font-sans text-slate-100">
      
      {/* ========================================================================= */}
      {/* 1. TOP STATUS & HARDWARE BRIDGE CONTROL BAR                                */}
      {/* ========================================================================= */}
      <div className="mb-4 p-4 rounded-2xl bg-[#070e20] border border-cyan-500/20 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Brand & Mission Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                AQUA-SHIELD
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                PHYSICAL ROBOT CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Bluetooth Classic SPP Teleoperation &amp; Multi-Sensor Drainage Diagnostic
            </p>
          </div>
        </div>

        {/* Dual Primary Status Indicators (Robot & Camera) */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Robot Connection Status */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${
            isRobotConnected 
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
              : 'bg-red-950/70 border-red-500 text-red-300'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isRobotConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`}></span>
            <span>Robot: {isRobotConnected ? `● Connected (${connectedPort})` : '● Disconnected'}</span>
          </div>

          {/* Camera Connection Status */}
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all ${
            isCameraOnline 
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
          </div>

        </div>

        {/* COM Port Selector & Connect/Disconnect Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {!isCustomMode ? (
            <select
              value={selectedPort}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '__custom__') {
                  setIsCustomMode(true);
                  setSelectedPort(customPort || '');
                } else {
                  setSelectedPort(val);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              {availablePorts.length === 0 ? (
                <option value="">Scanning COM Ports...</option>
              ) : (
                availablePorts.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.path} {p.isBluetooth ? '(Bluetooth)' : ''}
                  </option>
                ))
              )}
              {selectedPort && !availablePorts.some((p) => p.path === selectedPort) && (
                <option value={selectedPort}>{selectedPort}</option>
              )}
              <option value="__custom__">✏️ Custom COM Port...</option>
            </select>
          ) : (
            <div className="flex items-center space-x-1">
              <input
                type="text"
                value={customPort}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setCustomPort(val);
                  setSelectedPort(val);
                }}
                placeholder="e.g. COM4"
                className="w-24 px-2 py-1.5 rounded-xl bg-slate-900 border border-cyan-500 text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <button
                onClick={() => setIsCustomMode(false)}
                className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 hover:text-white"
                title="Back to dropdown list"
              >
                List
              </button>
            </div>
          )}

          <button
            onClick={fetchPorts}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
            title="Refresh Available Ports"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {isRobotConnected && connectedPort === selectedPort ? (
            <button
              onClick={handleDisconnectPort}
              className="px-3.5 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 hover:text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={() => handleConnectPort(selectedPort)}
              disabled={isConnectingPort || !selectedPort}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>
                {isConnectingPort
                  ? 'Connecting...'
                  : isRobotConnected
                  ? `Switch to ${selectedPort}`
                  : `Connect to ${selectedPort || 'Port'}`}
              </span>
            </button>
          )}

          {isRobotConnected && connectedPort !== selectedPort && (
            <button
              onClick={handleDisconnectPort}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-600 text-slate-400 hover:text-red-300 text-xs font-mono transition-colors"
              title="Disconnect currently active port"
            >
              Disconnect {connectedPort}
            </button>
          )}
        </div>

      </div>

      {/* Error Alert Banner */}
      {lastError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs font-mono flex items-center justify-between animate-fadeIn">
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

      {/* Cloud HTTPS Mixed-Content Notice */}
      {typeof window !== 'undefined' && window.location.protocol === 'https:' && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs font-mono shadow-lg">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">🔒 Browser Security Notice (HTTPS Cloud Deployment):</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Web browsers enforce Mixed Content security which blocks HTTPS pages from directly querying local insecure endpoints (<code className="text-cyan-300 font-bold">ws://localhost:5001</code> and <code className="text-cyan-300 font-bold">http://192.168.4.1</code>).
                To teleoperate the physical robot and view the live ESP32-CAM stream, please open the local console at:
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a
                  href="http://localhost:5173/robot"
                  className="px-3 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  <span>Open Local Console (http://localhost:5173/robot)</span>
                </a>
                <span className="text-[10px] text-slate-400">or click the lock icon in your address bar and allow "Insecure content".</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE CAMERA STREAM (TOP FULL SECTION)                                  */}
      {/* ========================================================================= */}
      <div className="mb-4 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-xl overflow-hidden">
        
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

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-slate-400 text-[10px]">Quick Presets:</span>
              {[
                { label: 'ESP32 Stream (Default)', url: 'http://192.168.4.1/stream' },
                { label: 'Port 81 Stream', url: 'http://192.168.4.1:81/stream' },
                { label: 'MJPEG Path', url: 'http://192.168.4.1/mjpeg' },
                { label: 'Snapshot Poll', url: 'http://192.168.4.1/capture' },
              ].map((preset) => (
                <button
                  key={preset.url}
                  onClick={() => {
                    setCameraUrl(preset.url);
                    setStreamKey(Date.now());
                  }}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300"
                >
                  {preset.label}
                </button>
              ))}

              <label className="flex items-center space-x-1.5 ml-auto text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                  className="rounded border-slate-700"
                />
                <span>Bridge Proxy Mode</span>
              </label>
            </div>
          </div>
        )}

        {/* Video Viewport */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] bg-black flex items-center justify-center overflow-hidden">
          
          {/* Active Live Video Stream */}
          <img
            ref={cameraImgRef}
            key={streamKey}
            src={activeStreamSrc}
            alt="ESP32-CAM Drainage Inspection Stream"
            onLoad={handleCameraLoad}
            onError={handleCameraError}
            className={`w-full h-full object-contain ${!isCameraOnline ? 'hidden' : 'block'}`}
          />

          {/* Offline / Placeholder Graphic */}
          {!isCameraOnline && (
            <div className="text-center p-6 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                <VideoOff className="w-8 h-8 text-cyan-400/60" />
              </div>
              <h3 className="text-base font-bold text-white font-mono mb-1">
                ESP32-CAM STREAM STANDBY
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed mb-3">
                Connect your laptop/device Wi-Fi to the ESP32-CAM network (IP: <span className="text-cyan-300 font-bold">192.168.4.1</span>).
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

          {/* Submerged Pipe Overlay Reticle */}
          {isCameraOnline && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-cyan-400/30"></div>
              <div className="absolute w-24 h-24 rounded-full border border-cyan-400/20"></div>
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400/60"></div>
              {/* Corner Watermarks */}
              <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded">
                AQUA-SHIELD CAM • DUAL LEDS ACTIVE
              </div>
              <div className="absolute bottom-3 right-4 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                DIST: {telemetry.distance} cm
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
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              KEYBOARD: W, A, S, D, SPACE
            </span>
          </div>

          {/* D-PAD DIRECTIONAL CLUSTER */}
          <div className="my-3 flex flex-col items-center justify-center">
            
            {/* FORWARD (W / UP) */}
            <button
              onPointerDown={() => sendRobotCommand('F')}
              onPointerUp={() => sendRobotCommand('S')}
              className={`w-28 sm:w-32 py-3 mb-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all ${
                activeCommand === 'F'
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
                onPointerDown={() => sendRobotCommand('L')}
                onPointerUp={() => sendRobotCommand('S')}
                className={`flex-1 py-3.5 rounded-2xl border font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  activeCommand === 'L'
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
                className={`w-28 sm:w-32 py-4 rounded-2xl font-mono font-black text-xs sm:text-sm tracking-wider flex flex-col items-center justify-center transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] ${
                  activeCommand === 'S'
                    ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-white scale-100 shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                    : 'bg-red-700 hover:bg-red-600 text-white border-2 border-red-500'
                }`}
                title="Emergency Halt (Press 'Space')"
              >
                <span className="text-sm font-black">🛑 STOP</span>
                <span className="text-[9px] tracking-widest text-red-200 mt-0.5">(SPACE)</span>
              </button>

              {/* RIGHT (D / RIGHT) */}
              <button
                onPointerDown={() => sendRobotCommand('R')}
                onPointerUp={() => sendRobotCommand('S')}
                className={`flex-1 py-3.5 rounded-2xl border font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                  activeCommand === 'R'
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
              onPointerDown={() => sendRobotCommand('B')}
              onPointerUp={() => sendRobotCommand('S')}
              className={`w-28 sm:w-32 py-3 mt-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all ${
                activeCommand === 'B'
                  ? 'bg-cyan-400 text-slate-950 border-white shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-95'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-cyan-500/40 text-slate-200 hover:text-white hover:border-cyan-400'
              }`}
              title="Backward (Press 'S' or 'Arrow Down')"
            >
              <span className="text-lg leading-none">▼</span>
              <span className="text-[10px] tracking-wider mt-0.5">BACKWARD (S)</span>
            </button>

          </div>

          {/* SAFETY PROTOCOL ADVISORY */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400 leading-snug">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>SAFETY INTERLOCK ACTIVE</span>
            </div>
            <span>• Motors halt automatically on key release.</span><br />
            <span>• Initial state is locked at STOP. Spacebar instantly cuts motor power.</span>
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT: LIVE TELEMETRY CARDS (7 COLS)                                    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#070e20] border border-cyan-500/25 shadow-xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> LIVE TELEMETRY STREAM
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              {telemetry.timestamp ? `LAST UPDATE: ${new Date(telemetry.timestamp).toLocaleTimeString()}` : 'AWAITING ESP32 PACKET (~1s)'}
            </span>
          </div>

          {/* TELEMETRY METRIC TILES (7 METRICS SPECIFIED) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-1">
            
            {/* 1. VOLTAGE */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>VOLTAGE</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {telemetry.voltage.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">V</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                INA219 Bus • Li-ion Pack
              </div>
            </div>

            {/* 2. CURRENT */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>CURRENT</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${
                  telemetry.current > 1500 ? 'text-red-400 animate-pulse' : 'text-white'
                }`}>
                  {telemetry.current.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">mA</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                INA219 Shunt Load
              </div>
            </div>

            {/* 3. GAS LEVEL */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>GAS LEVEL</span>
                <Droplets className={`w-3.5 h-3.5 ${telemetry.gas > 1800 ? 'text-red-400' : 'text-cyan-400'}`} />
              </div>
              <div className="my-1.5">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${
                  telemetry.gas > 1800 ? 'text-red-400 animate-pulse' : 'text-white'
                }`}>
                  {telemetry.gas}
                </span>
                <span className="text-[10px] font-mono text-slate-400 ml-1">RAW</span>
              </div>
              <div className={`text-[9px] font-mono font-bold ${telemetry.gas > 1800 ? 'text-red-400' : 'text-emerald-400'}`}>
                {telemetry.gas > 1800 ? '⚠️ High Hazard' : '🟢 Atmosphere Normal'}
              </div>
            </div>

            {/* 4. DISTANCE */}
            <div className="p-3 rounded-xl bg-[#06101e] border border-cyan-500/30 flex flex-col justify-between hover:border-cyan-400 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>DISTANCE</span>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {telemetry.distance}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">cm</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Ultrasonic HC-SR04
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
                  X: <span className="text-cyan-300">{telemetry.accelX.toFixed(1)}</span> m/s²
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Y: <span className="text-cyan-300">{telemetry.accelY.toFixed(1)}</span> m/s²
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
                  {telemetry.accelZ.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-cyan-400 ml-1">m/s²</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                MPU6050 Vertical Axis
              </div>
            </div>

          </div>

          {/* TELEMETRY DIAGNOSTIC FOOTER */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              STREAM: <strong className="text-cyan-300">ESP32 BluetoothSerial (SPP)</strong>
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
      {/* 4. LABORATORY VERIFICATION & JUDGE EVALUATION MATRIX (TESTS 1 - 9)       */}
      {/* ========================================================================= */}
      <PrototypeTestingSuite 
        telemetry={telemetry}
        isCameraOnline={isCameraOnline}
        activeCommand={activeCommand}
        sendRobotCommand={sendRobotCommand}
      />

      {/* ========================================================================= */}
      {/* 5. COLLAPSIBLE RAW SERIAL LOGS FOR DEBUGGING                              */}
      {/* ========================================================================= */}
      {showRawLogs && (
        <div className="mt-4 p-4 rounded-2xl bg-black border border-cyan-500/30 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-cyan-300 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4" /> LIVE ESP32 SERIAL CONSOLE BUFFER
            </span>
            <span className="text-[10px] text-slate-500">Baud Rate: 115200</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] text-emerald-400/90">
            {rawLogs.length === 0 ? (
              <span className="text-slate-600 italic">No incoming serial packets yet. Connect to robot COM port to view stream.</span>
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
