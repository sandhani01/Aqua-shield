/**
 * AQUA-SHIELD Hardware Bridge Server
 * 
 * Bridges physical ESP32 robot (Bluetooth Classic SPP / virtual COM port)
 * with the AQUA-SHIELD web platform over WebSocket and HTTP.
 */

import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { SerialPort } from 'serialport';

const PORT = process.env.PORT || 5001;
let currentPort = null;
let currentPortPath = null;
let isConnected = false;
let isPortOpen = false;
let lastTelemetry = null;
let lastDataReceivedTime = 0;
let handshakeTimeoutTimer = null;
let livenessWatchdogTimer = null;

// Telemetry parsing buffer
let telemetryBuffer = {
  voltage: 0,
  current: 0,
  gas: 0,
  distance: 0,
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  timestamp: Date.now(),
};
let isCapturingTelemetry = false;
let rawLineBuffer = '';

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  // 1. GET /api/ports - list available COM ports
  if (reqUrl.pathname === '/api/ports') {
    try {
      const ports = await SerialPort.list();
      const mapped = ports.map((p) => {
        const isBluetooth = 
          (p.pnpId && p.pnpId.includes('00001101-0000-1000-8000-00805F9B34FB')) ||
          (p.pnpId && p.pnpId.includes('BTHENUM')) ||
          (p.friendlyName && p.friendlyName.toLowerCase().includes('bluetooth'));
        
        return {
          path: p.path,
          friendlyName: p.friendlyName || p.path,
          manufacturer: p.manufacturer || 'Standard Serial',
          pnpId: p.pnpId,
          isBluetooth: Boolean(isBluetooth),
        };
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ports: mapped, connectedPort: currentPortPath }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 2. GET /api/status - current connection status & last telemetry
  if (reqUrl.pathname === '/api/status') {
    const isRobotAlive = isConnected && (Date.now() - lastDataReceivedTime < 4000);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      connected: isRobotAlive,
      verifying: !isRobotAlive && isPortOpen,
      port: currentPortPath,
      lastTelemetry: isRobotAlive ? lastTelemetry : null,
      clientsCount: wss.clients.size,
    }));
    return;
  }

  // 3. POST /api/connect - connect to specific COM port
  if (reqUrl.pathname === '/api/connect' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const portToConnect = data.port;
        if (!portToConnect) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Port path is required' }));
          return;
        }

        connectToPort(portToConnect);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: `Attempting connection to ${portToConnect}` }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 4. POST /api/disconnect - disconnect port safely
  if (reqUrl.pathname === '/api/disconnect' && req.method === 'POST') {
    disconnectPort();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Disconnected' }));
    return;
  }

  // 5. GET /api/camera-proxy - reverse proxy for ESP32-CAM stream
  if (reqUrl.pathname === '/api/camera-proxy') {
    const camUrlStr = reqUrl.searchParams.get('url') || 'http://192.168.4.1/stream';
    try {
      const camUrl = new URL(camUrlStr);
      const camReq = http.request(camUrl, (camRes) => {
        res.writeHead(camRes.statusCode, {
          'Content-Type': camRes.headers['content-type'] || 'multipart/x-mixed-replace; boundary=123456789000000000000987654321',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        });
        camRes.pipe(res);
      });

      camReq.on('error', (err) => {
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Cannot reach ESP32-CAM at ${camUrlStr}: ${err.message}` }));
        }
      });

      req.on('close', () => {
        camReq.destroy();
      });

      camReq.end();
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Invalid camera URL: ${err.message}` }));
    }
    return;
  }

  // Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('error', (err) => {
  // Suppress redundant server-level listen errors since handled on http.Server
  if (err.code !== 'EADDRINUSE') {
    console.error('[WebSocketServer] Error:', err.message);
  }
});

wss.on('connection', (ws) => {
  console.log(`[WebSocket] Client connected. Total clients: ${wss.clients.size}`);

  const isRobotAlive = isConnected && (Date.now() - lastDataReceivedTime < 4000);
  // Send initial state
  ws.send(JSON.stringify({
    type: 'status',
    connected: isRobotAlive,
    verifying: !isRobotAlive && isPortOpen,
    port: currentPortPath,
    lastTelemetry: isRobotAlive ? lastTelemetry : null,
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'command') {
        const cmd = String(data.command || '').toUpperCase();
        if (['F', 'B', 'L', 'R', 'S'].includes(cmd)) {
          sendCommand(cmd);
        } else {
          console.warn(`[Command] Invalid command ignored: ${cmd}`);
        }
      } else if (data.type === 'connect') {
        connectToPort(data.port);
      } else if (data.type === 'disconnect') {
        disconnectPort();
      } else if (data.type === 'get_ports') {
        broadcastPorts();
      }
    } catch (err) {
      console.error('[WebSocket] Failed to parse client message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected. Remaining: ${wss.clients.size}`);
    // Robot safety: if all browser clients disconnect, issue emergency stop
    if (wss.clients.size === 0 && isConnected) {
      console.log('[Safety] All clients disconnected, issuing STOP command');
      sendCommand('S');
    }
  });
});

/**
 * Broadcast JSON payload to all active WebSocket clients
 */
function broadcast(payload) {
  const json = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  }
}

/**
 * Send command character to physical robot
 */
function sendCommand(cmd) {
  if (!currentPort || !isConnected) {
    console.warn(`[Command] Cannot send '${cmd}': Robot not connected`);
    broadcast({
      type: 'command_status',
      success: false,
      command: cmd,
      error: 'Robot not connected',
    });
    return;
  }

  try {
    currentPort.write(cmd, (err) => {
      if (err) {
        console.error(`[Command] Error sending '${cmd}':`, err.message);
        broadcast({
          type: 'command_status',
          success: false,
          command: cmd,
          error: err.message,
        });
      } else {
        console.log(`[Command] Transmitted to ESP32: '${cmd}'`);
        broadcast({
          type: 'command_status',
          success: true,
          command: cmd,
        });
      }
    });
  } catch (err) {
    console.error(`[Command] Exception sending '${cmd}':`, err);
  }
}

function markRobotOnline() {
  lastDataReceivedTime = Date.now();
  if (!isConnected) {
    console.log(`[Serial] Physical robot verified ONLINE on ${currentPortPath}!`);
    isConnected = true;
    if (handshakeTimeoutTimer) {
      clearTimeout(handshakeTimeoutTimer);
      handshakeTimeoutTimer = null;
    }
    broadcast({
      type: 'status',
      connected: true,
      verifying: false,
      port: currentPortPath,
      message: `Robot online and communicating on ${currentPortPath}`,
    });
    startLivenessWatchdog();
  }
}

function startLivenessWatchdog() {
  if (livenessWatchdogTimer) clearInterval(livenessWatchdogTimer);
  livenessWatchdogTimer = setInterval(() => {
    if (isConnected && currentPort && currentPort.isOpen) {
      const elapsed = Date.now() - lastDataReceivedTime;
      if (elapsed > 4000) {
        console.warn(`[Watchdog] No data received from robot for ${elapsed}ms. Robot powered off or signal lost.`);
        disconnectPort('Robot signal lost. Ensure robot power is ON and battery is charged.');
      }
    }
  }, 1000);
}

function connectToPort(portPath) {
  const openNewPort = () => {
    console.log(`[Serial] Opening port ${portPath} @ 115200 baud...`);
    currentPortPath = portPath;

    if (handshakeTimeoutTimer) {
      clearTimeout(handshakeTimeoutTimer);
      handshakeTimeoutTimer = null;
    }
    if (livenessWatchdogTimer) {
      clearInterval(livenessWatchdogTimer);
      livenessWatchdogTimer = null;
    }

    try {
      currentPort = new SerialPort({
        path: portPath,
        baudRate: 115200,
        autoOpen: false,
      });

      currentPort.open((err) => {
        if (err) {
          console.error(`[Serial] Failed to open ${portPath}:`, err.message);
          isPortOpen = false;
          isConnected = false;
          broadcast({
            type: 'status',
            connected: false,
            verifying: false,
            port: portPath,
            error: `Failed to open ${portPath}: ${err.message}`,
          });
          return;
        }

        console.log(`[Serial] Port ${portPath} opened. Awaiting physical robot handshake...`);
        isPortOpen = true;
        isConnected = false; // NOT connected until physical robot transmits telemetry/handshake!
        rawLineBuffer = '';
        isCapturingTelemetry = false;

        // Broadcast intermediate "verifying" state so user sees feedback
        broadcast({
          type: 'status',
          connected: false,
          verifying: true,
          port: portPath,
          message: `Port ${portPath} opened. Waiting for robot response (ensure robot is ON)...`,
        });

        // Send probe ping 'P' and stop 'S' to query ESP32
        setTimeout(() => {
          if (currentPort && currentPort.isOpen) {
            currentPort.write('P\n');
            setTimeout(() => {
              if (currentPort && currentPort.isOpen) {
                currentPort.write('S\n');
              }
            }, 250);
          }
        }, 200);

        // Handshake verification timer:
        // Robot sends telemetry every 1000ms. If within 4000ms no data arrives from the robot,
        // it means the robot is powered OFF or unreachable!
        handshakeTimeoutTimer = setTimeout(() => {
          if (isPortOpen && !isConnected) {
            console.warn(`[Serial] Handshake timeout on ${portPath}. No data received from robot.`);
            disconnectPort(
              `Robot is not responding on ${portPath}. Please ensure the robot power switch is ON, battery is charged, and ESP32 is in range.`
            );
          }
        }, 4000);
      });

      currentPort.on('data', (chunk) => {
        handleSerialData(chunk);
      });

      currentPort.on('error', (err) => {
        console.error(`[Serial] Port error:`, err.message);
        disconnectPort(`Serial port error: ${err.message}`);
      });

      currentPort.on('close', () => {
        console.log(`[Serial] Port ${currentPortPath} closed`);
        if (isConnected || isPortOpen) {
          disconnectPort('Serial port closed');
        }
      });

    } catch (err) {
      console.error(`[Serial] Exception creating SerialPort:`, err);
      isPortOpen = false;
      isConnected = false;
      broadcast({
        type: 'status',
        connected: false,
        verifying: false,
        port: portPath,
        error: err.message,
      });
    }
  };

  if (currentPort && currentPort.isOpen) {
    console.log(`[Serial] Closing previous port ${currentPortPath}`);
    sendCommand('S');
    try {
      currentPort.close(() => {
        setTimeout(openNewPort, 150);
      });
    } catch {
      setTimeout(openNewPort, 150);
    }
  } else {
    openNewPort();
  }
}

/**
 * Safely disconnect from COM port
 */
function disconnectPort(errorMessage = '') {
  if (handshakeTimeoutTimer) {
    clearTimeout(handshakeTimeoutTimer);
    handshakeTimeoutTimer = null;
  }
  if (livenessWatchdogTimer) {
    clearInterval(livenessWatchdogTimer);
    livenessWatchdogTimer = null;
  }

  const prevPort = currentPortPath;
  const wasConnected = isConnected;

  if (currentPort) {
    console.log(`[Serial] Safely disconnecting from ${prevPort || 'port'}...`);
    try {
      if (currentPort.isOpen) {
        currentPort.write('S');
        currentPort.close();
      }
    } catch (err) {
      console.error('[Serial] Close error:', err.message);
    }
    currentPort = null;
  }

  currentPortPath = null;
  isPortOpen = false;
  isConnected = false;
  lastTelemetry = null;
  lastDataReceivedTime = 0;

  broadcast({
    type: 'status',
    connected: false,
    verifying: false,
    port: null,
    error: errorMessage || (wasConnected ? 'Robot disconnected' : ''),
  });
}

/**
 * Accumulate and parse incoming raw serial stream from ESP32
 */
function handleSerialData(chunk) {
  rawLineBuffer += chunk.toString();
  const lines = rawLineBuffer.split(/\r?\n/);
  // Keep unfinished remainder
  rawLineBuffer = lines.pop();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Optional raw debug broadcast
    broadcast({ type: 'raw', text: trimmed });

    // Any valid line from the robot confirms physical link!
    markRobotOnline();

    // 1. Direct Machine-Readable JSON Telemetry Parser (New Bluetooth Architecture)
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.type === 'telemetry') {
          const g1 = typeof parsed.gas1 === 'number' ? parsed.gas1 : (typeof parsed.gas === 'number' ? parsed.gas : 0);
          const g2 = typeof parsed.gas2 === 'number' ? parsed.gas2 : (typeof parsed.gas === 'number' ? parsed.gas : 0);
          const temp = typeof parsed.temperature === 'number' ? parsed.temperature : (typeof parsed.probeTemp === 'number' ? parsed.probeTemp : null);

          lastTelemetry = {
            voltage: typeof parsed.voltage === 'number' ? parsed.voltage : 0,
            current: typeof parsed.current === 'number' ? parsed.current : 0,
            gas: Math.max(g1, g2),
            gas1: g1,
            gas2: g2,
            temperature: temp,
            probeTemp: temp,
            distance: typeof parsed.distance === 'number' ? parsed.distance : -1,
            accelX: parsed.accel?.x ?? (parsed.accelX ?? 0),
            accelY: parsed.accel?.y ?? (parsed.accelY ?? 0),
            accelZ: parsed.accel?.z ?? (parsed.accelZ ?? 0),
            command: parsed.command || 'S',
            moving: Boolean(parsed.moving),
            timestamp: Date.now(),
          };
          broadcast({
            type: 'telemetry',
            data: lastTelemetry,
          });
          continue;
        } else {
          broadcast(parsed);
          continue;
        }
      } catch {
        // Fall through to legacy/CSV parser if JSON parsing fails
      }
    }

    // 2. CSV Telemetry Parser (distance,gas1,gas2,probeTemp,voltage,current,ax,ay,az)
    if (trimmed.includes(',')) {
      const parts = trimmed.split(',');
      if (parts.length >= 7 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
        const distance = parseFloat(parts[0]);
        const gas1 = parseInt(parts[1], 10) || 0;
        const gas2 = parts.length >= 8 ? (parseInt(parts[2], 10) || 0) : gas1;
        const probeTemp = parts.length >= 9 ? parseFloat(parts[3]) : null;
        const voltageIdx = parts.length >= 9 ? 4 : 2;
        const currentIdx = parts.length >= 9 ? 5 : 3;
        const axIdx = parts.length >= 9 ? 6 : 4;
        const ayIdx = parts.length >= 9 ? 7 : 5;
        const azIdx = parts.length >= 9 ? 8 : 6;

        lastTelemetry = {
          distance: isNaN(distance) ? -1 : distance,
          gas1: gas1,
          gas2: gas2,
          gas: Math.max(gas1, gas2),
          temperature: probeTemp !== null && !isNaN(probeTemp) ? probeTemp : null,
          probeTemp: probeTemp !== null && !isNaN(probeTemp) ? probeTemp : null,
          voltage: parseFloat(parts[voltageIdx]) || 0,
          current: parseFloat(parts[currentIdx]) || 0,
          accelX: parseFloat(parts[axIdx]) || 0,
          accelY: parseFloat(parts[ayIdx]) || 0,
          accelZ: parseFloat(parts[azIdx]) || 0,
          command: 'S',
          moving: false,
          timestamp: Date.now(),
        };

        broadcast({
          type: 'telemetry',
          data: lastTelemetry,
        });
        continue;
      }
    }

    // 3. Legacy Human-Readable Block Fallback
    if (trimmed.includes('--- TELEMETRY DATA ---')) {
      isCapturingTelemetry = true;
      telemetryBuffer = {
        voltage: 0,
        current: 0,
        gas: 0,
        distance: 0,
        accelX: 0,
        accelY: 0,
        accelZ: 0,
        timestamp: Date.now(),
      };
      continue;
    }

    if (trimmed.includes('----------------------')) {
      if (isCapturingTelemetry) {
        isCapturingTelemetry = false;
        lastTelemetry = { ...telemetryBuffer, timestamp: Date.now() };
        broadcast({
          type: 'telemetry',
          data: lastTelemetry,
        });
      }
      continue;
    }

    if (!isCapturingTelemetry) continue;

    // Match Voltage: 7.32 V
    const voltMatch = trimmed.match(/Voltage:\s*([0-9.]+)\s*V/i);
    if (voltMatch) {
      telemetryBuffer.voltage = parseFloat(voltMatch[1]);
      continue;
    }

    // Match Current: 425.5 mA
    const currMatch = trimmed.match(/Current:\s*([0-9.-]+)\s*mA/i);
    if (currMatch) {
      telemetryBuffer.current = parseFloat(currMatch[1]);
      continue;
    }

    // Match Gas Level: 1320
    const gasMatch = trimmed.match(/Gas Level:\s*([0-9]+)/i);
    if (gasMatch) {
      telemetryBuffer.gas = parseInt(gasMatch[1], 10);
      continue;
    }

    // Match DISTANCE: 45
    const distMatch = trimmed.match(/DISTANCE:\s*([0-9.]+)/i);
    if (distMatch) {
      telemetryBuffer.distance = parseFloat(distMatch[1]);
      continue;
    }

    // Match Accel [X,Y,Z]: 0.2, -0.1, 9.7
    const accelMatch = trimmed.match(/Accel\s*\[X,Y,Z\]:\s*([0-9.-]+),\s*([0-9.-]+),\s*([0-9.-]+)/i);
    if (accelMatch) {
      telemetryBuffer.accelX = parseFloat(accelMatch[1]);
      telemetryBuffer.accelY = parseFloat(accelMatch[2]);
      telemetryBuffer.accelZ = parseFloat(accelMatch[3]);
      continue;
    }
  }
}

/**
 * Scan and broadcast available COM ports
 */
async function broadcastPorts() {
  try {
    const ports = await SerialPort.list();
    const mapped = ports.map((p) => ({
      path: p.path,
      friendlyName: p.friendlyName || p.path,
      isBluetooth: Boolean(
        (p.pnpId && p.pnpId.includes('00001101-0000-1000-8000-00805F9B34FB')) ||
        (p.pnpId && p.pnpId.includes('BTHENUM')) ||
        (p.friendlyName && p.friendlyName.toLowerCase().includes('bluetooth'))
      ),
    }));
    broadcast({ type: 'ports', ports: mapped });
  } catch (err) {
    console.error('[Ports] Error listing serial ports:', err);
  }
}

// Graceful termination handling
function safeShutdown() {
  console.log('\n[Bridge] Shutting down. Ensuring robot is stopped...');
  if (currentPort && currentPort.isOpen) {
    try {
      currentPort.write('S');
      currentPort.close();
    } catch (e) {
      // Ignore
    }
  }
  process.exit(0);
}

process.on('SIGINT', safeShutdown);
process.on('SIGTERM', safeShutdown);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`Please terminate any existing bridge process, or run with PORT=5002 npm run bridge\n`);
  } else {
    console.error('[Bridge] Server error:', err.message);
  }
  process.exit(1);
});

// Start server
server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🤖 AQUA-SHIELD Robot Bridge running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log('====================================================');

  // Auto-scan for available ports
  SerialPort.list().then((ports) => {
    console.log(`[Bridge] Found ${ports.length} available serial port(s):`);
    ports.forEach(p => {
      console.log(`  • ${p.path} (${p.friendlyName || p.manufacturer || 'Unknown'})`);
    });
  }).catch(err => {
    console.error('[Bridge] Error scanning ports:', err.message);
  });
});
