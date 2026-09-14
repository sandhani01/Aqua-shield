/**
 * =====================================================================================
 *  AQUA-SHIELD ROBOT COMMUNICATION ABSTRACTION LAYER
 * =====================================================================================
 * 
 * Provides a clean decoupled interface between the PhysicalRobotConsole UI
 * and the physical transport layer.
 * 
 * Transports Supported:
 *  1. WebSerialBluetoothTransport:
 *     - Direct in-browser serial communication via Web Serial API (navigator.serial).
 *     - Connects directly to paired ESP32 Bluetooth Classic SPP virtual COM ports (115200 baud).
 *     - Zero external bridge software required in Chrome, Edge, and Opera.
 * 
 *  2. BridgeWebSocketTransport:
 *     - Connects to the local Node.js serial bridge (ws://localhost:5001/ws).
 *     - Cross-browser fallback for browsers without Web Serial (Firefox, Safari)
 *       or for remote/headless setups.
 */

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, fn) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(fn);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const fn of this.listeners.get(event)) {
        try {
          fn(data);
        } catch (err) {
          console.error(`[RobotComm] Error in '${event}' handler:`, err);
        }
      }
    }
  }
}

/**
 * Direct Web Serial Transport (In-browser Bluetooth Classic SPP)
 */
export class WebSerialBluetoothTransport extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isPortOpen = false;
    this.isConnected = false;
    this.isVerifying = false;
    this.keepReading = false;
    this.readLoopPromise = null;
    this.rxBuffer = '';
    this.portInfo = null;
    this.lastPacketTime = 0;
    this.handshakeTimer = null;
    this.watchdogTimer = null;
    this._onVerified = null;
  }

  static isSupported() {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  async connect() {
    if (!WebSerialBluetoothTransport.isSupported()) {
      throw new Error(
        'Web Serial API is not supported in this browser. Use Google Chrome, Microsoft Edge, or switch to Bridge mode.'
      );
    }

    try {
      this.emit('log', '[Bluetooth] Requesting Bluetooth Serial Port...');
      // Prompts user to pick the Bluetooth Serial COM port
      this.port = await navigator.serial.requestPort();

      // Open at standard 115200 baud
      await this.port.open({ baudRate: 115200, bufferSize: 8192 });

      this.isPortOpen = true;
      this.isConnected = false;
      this.isVerifying = true;
      this.keepReading = true;
      this.rxBuffer = '';
      this.lastPacketTime = 0;

      // Try to determine port label
      try {
        const info = this.port.getInfo?.() || {};
        this.portInfo = `USB/BT VID:${info.usbVendorId || 'BT'} PID:${info.usbProductId || 'SPP'}`;
      } catch {
        this.portInfo = 'Bluetooth Serial Port';
      }

      // Handle unexpected disconnects (e.g. Bluetooth power turned off)
      this.port.ondisconnect = () => {
        this.emit('log', '[Bluetooth] Device disconnected from system.');
        this.disconnect('Bluetooth device physically disconnected from system.');
      };

      // Start asynchronous read loop
      this.readLoopPromise = this._startReadLoop();

      this.emit('status', {
        connected: false,
        verifying: true,
        transport: 'webserial',
        port: this.portInfo || 'ESP32_Robot_BT',
        message: 'Port opened. Verifying physical robot handshake (ensure robot is ON)...',
      });
      this.emit('log', '[Bluetooth] Port opened. Awaiting response from robot (ensure robot is ON)...');

      // Send probe / ping bytes to wake/query ESP32
      this._writeRaw('P\n').catch(() => {});
      setTimeout(() => {
        if (this.isPortOpen && !this.isConnected) {
          this._writeRaw('S\n').catch(() => {});
        }
      }, 250);

      // Return a Promise that only resolves when the physical robot verifies it is ONLINE,
      // or rejects after 4000ms if no data is received because the robot is NOT ON!
      return await new Promise((resolve, reject) => {
        this._onVerified = () => {
          resolve(true);
        };

        this.handshakeTimer = setTimeout(async () => {
          if (!this.isConnected) {
            const err = new Error(
              `Robot is not responding on ${this.portInfo || 'Bluetooth Port'}. Please ensure the robot power switch is ON, battery is charged, and ESP32 is in range.`
            );
            this.emit('log', `[Bluetooth] ${err.message}`);
            await this.disconnect(err.message);
            reject(err);
          }
        }, 4000);
      });
    } catch (err) {
      this.isConnected = false;
      this.isVerifying = false;
      this.emit('status', { connected: false, verifying: false, transport: 'webserial', error: err.message });
      throw err;
    }
  }

  async _startReadLoop() {
    const textDecoder = new TextDecoder();

    while (this.port?.readable && this.keepReading) {
      try {
        this.reader = this.port.readable.getReader();
        while (this.keepReading) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          if (value) {
            const chunk = textDecoder.decode(value, { stream: true });
            this._processIncomingChunk(chunk);
          }
        }
      } catch (err) {
        if (this.keepReading) {
          console.error('[WebSerial] Read error:', err);
          this.emit('log', `[Bluetooth Read Error] ${err.message}`);
        }
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch {
            // ignore
          }
          this.reader = null;
        }
      }
    }
  }

  async _writeRaw(text) {
    if (!this.port?.writable) return false;
    try {
      const textEncoder = new TextEncoder();
      const writer = this.port.writable.getWriter();
      try {
        await writer.write(textEncoder.encode(text));
      } finally {
        writer.releaseLock();
      }
      return true;
    } catch (err) {
      console.warn('[WebSerial] Raw write error:', err);
      return false;
    }
  }

  _markRobotOnline() {
    this.lastPacketTime = Date.now();

    if (!this.isConnected) {
      this.isConnected = true;
      this.isVerifying = false;

      if (this.handshakeTimer) {
        clearTimeout(this.handshakeTimer);
        this.handshakeTimer = null;
      }

      this.emit('status', {
        connected: true,
        verifying: false,
        transport: 'webserial',
        port: this.portInfo || 'ESP32_Robot_BT',
      });
      this.emit('log', '[Bluetooth] Robot verified ONLINE and streaming telemetry.');

      if (this._onVerified) {
        this._onVerified();
        this._onVerified = null;
      }

      this._startWatchdog();
    }
  }

  _startWatchdog() {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);
    this.watchdogTimer = setInterval(async () => {
      if (this.isConnected && this.isPortOpen) {
        const elapsed = Date.now() - this.lastPacketTime;
        if (elapsed > 4000) {
          const msg = 'Robot connection lost (no data received. Ensure robot is powered ON and in range).';
          this.emit('log', `[Bluetooth Warning] ${msg}`);
          await this.disconnect(msg);
        }
      }
    }, 1000);
  }

  _processIncomingChunk(chunk) {
    this.rxBuffer += chunk;
    const lines = this.rxBuffer.split(/\r?\n/);
    // Keep incomplete tail in buffer
    this.rxBuffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      this.emit('log', trimmed);

      // Any valid data received from the robot proves physical connection!
      this._markRobotOnline();

      // Parse JSON telemetry line
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed.type === 'telemetry') {
            this.emit('telemetry', {
              voltage: typeof parsed.voltage === 'number' ? parsed.voltage : 0,
              current: typeof parsed.current === 'number' ? parsed.current : 0,
              gas: typeof parsed.gas === 'number' ? parsed.gas : 0,
              distance: typeof parsed.distance === 'number' ? parsed.distance : -1,
              accelX: parsed.accel?.x ?? 0,
              accelY: parsed.accel?.y ?? 0,
              accelZ: parsed.accel?.z ?? 0,
              command: parsed.command || 'S',
              moving: Boolean(parsed.moving),
              timestamp: Date.now(),
            });
            continue;
          }
        } catch {
          // Non-JSON debug output
        }
      }
    }
  }

  async sendCommand(cmd) {
    if (!this.port?.writable || !this.isConnected) {
      console.warn(`[WebSerial] Cannot send '${cmd}': robot not verified online.`);
      return false;
    }

    try {
      return await this._writeRaw(cmd);
    } catch (err) {
      console.error(`[WebSerial] Send error for '${cmd}':`, err);
      this.emit('log', `[Send Error] ${err.message}`);
      return false;
    }
  }

  async disconnect(errorMsg = '') {
    if (this.handshakeTimer) {
      clearTimeout(this.handshakeTimer);
      this.handshakeTimer = null;
    }
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }

    this._onVerified = null;
    this.keepReading = false;
    this.isPortOpen = false;
    this.isConnected = false;
    this.isVerifying = false;

    // Send final STOP command if writable
    if (this.port?.writable) {
      try {
        await this._writeRaw('S');
      } catch {
        // ignore
      }
    }

    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        // ignore
      }
      this.reader = null;
    }

    if (this.readLoopPromise) {
      try {
        await this.readLoopPromise;
      } catch {
        // ignore
      }
      this.readLoopPromise = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (err) {
        console.warn('[WebSerial] Port close warning:', err);
      }
      this.port = null;
    }

    this.emit('status', {
      connected: false,
      verifying: false,
      transport: 'webserial',
      error: errorMsg || '',
    });
    this.emit('log', errorMsg ? `[Bluetooth] Disconnected: ${errorMsg}` : '[Bluetooth] Disconnected from device.');
  }
}

/**
 * Node.js Hardware Bridge WebSocket Transport
 */
export class BridgeWebSocketTransport extends EventEmitter {
  constructor(bridgeUrl = 'ws://localhost:5001/ws', httpUrl = 'http://localhost:5001') {
    super();
    this.bridgeUrl = bridgeUrl;
    this.httpUrl = httpUrl;
    this.ws = null;
    this.isConnected = false;
    this.isBridgeAlive = false;
    this.connectedPort = null;
  }

  async fetchPorts() {
    try {
      const res = await fetch(`${this.httpUrl}/api/ports`);
      const data = await res.json();
      if (data.success) {
        return data.ports || [];
      }
      return [];
    } catch (err) {
      console.warn('[Bridge] Could not fetch ports from bridge:', err.message);
      return [];
    }
  }

  connect(portPath = '') {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws) {
          try { this.ws.close(); } catch {}
          this.ws = null;
        }

        this.emit('log', `[Bridge] Connecting to Bridge Server at ${this.bridgeUrl}...`);
        const ws = new WebSocket(this.bridgeUrl);
        this.ws = ws;

        let opened = false;

        ws.onopen = () => {
          opened = true;
          this.isBridgeAlive = true;
          this.emit('log', '[Bridge] Connected to Bridge WebSocket Server.');

          // If a specific port was requested, command bridge to connect
          if (portPath) {
            ws.send(JSON.stringify({ type: 'connect', port: portPath }));
          }
          resolve(true);
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'status') {
              this.isConnected = Boolean(msg.connected);
              this.connectedPort = msg.port || null;
              this.emit('status', {
                connected: this.isConnected,
                verifying: Boolean(msg.verifying),
                transport: 'bridge',
                port: this.connectedPort,
                bridgeOnline: true,
                message: msg.message || '',
                error: msg.error || '',
              });
            } else if (msg.type === 'telemetry') {
              const data = msg.data || msg;
              this.emit('telemetry', {
                voltage: typeof data.voltage === 'number' ? data.voltage : 0,
                current: typeof data.current === 'number' ? data.current : 0,
                gas: typeof data.gas === 'number' ? data.gas : 0,
                distance: typeof data.distance === 'number' ? data.distance : -1,
                accelX: data.accelX ?? data.accel?.x ?? 0,
                accelY: data.accelY ?? data.accel?.y ?? 0,
                accelZ: data.accelZ ?? data.accel?.z ?? 0,
                command: data.command || 'S',
                moving: Boolean(data.moving),
                timestamp: Date.now(),
              });
            } else if (msg.type === 'raw') {
              this.emit('log', msg.text);
            } else if (msg.type === 'ports') {
              this.emit('ports', msg.ports || []);
            }
          } catch (err) {
            console.error('[Bridge] Failed to parse message:', err);
          }
        };

        ws.onerror = (_err) => {
          if (!opened) {
            reject(new Error(`Cannot connect to Hardware Bridge at ${this.bridgeUrl}. Ensure 'npm run bridge' is running.`));
          }
        };

        ws.onclose = () => {
          this.isConnected = false;
          this.isBridgeAlive = false;
          this.emit('status', { connected: false, transport: 'bridge', bridgeOnline: false });
          this.emit('log', '[Bridge] Disconnected from Bridge Server.');
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  sendCommand(cmd) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'command', command: cmd }));
        return true;
      } catch (err) {
        console.error('[Bridge] Send error:', err);
        return false;
      }
    }
    return false;
  }

  disconnectPort() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'disconnect' }));
    }
  }

  disconnect() {
    if (this.ws) {
      try {
        this.sendCommand('S');
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.isConnected = false;
    this.emit('status', { connected: false, transport: 'bridge' });
  }
}

/**
 * Unified Robot Communication Manager
 */
export class RobotCommunication extends EventEmitter {
  constructor() {
    super();
    this.webSerialTransport = new WebSerialBluetoothTransport();
    this.bridgeTransport = new BridgeWebSocketTransport();

    // Default to Web Serial if browser supports it; otherwise bridge
    this.mode = WebSerialBluetoothTransport.isSupported() ? 'webserial' : 'bridge';
    this.activeTransport = this.mode === 'webserial' ? this.webSerialTransport : this.bridgeTransport;

    this._bindTransportEvents(this.webSerialTransport);
    this._bindTransportEvents(this.bridgeTransport);
  }

  _bindTransportEvents(transport) {
    transport.on('status', (data) => {
      if (transport === this.activeTransport) {
        this.emit('status', data);
      }
    });

    transport.on('telemetry', (data) => {
      if (transport === this.activeTransport) {
        this.emit('telemetry', data);
      }
    });

    transport.on('log', (msg) => {
      if (transport === this.activeTransport) {
        this.emit('log', msg);
      }
    });

    transport.on('ports', (ports) => {
      if (transport === this.activeTransport) {
        this.emit('ports', ports);
      }
    });
  }

  setTransportMode(mode) {
    if (this.isConnected()) {
      this.disconnect();
    }
    this.mode = mode;
    this.activeTransport = mode === 'webserial' ? this.webSerialTransport : this.bridgeTransport;
    this.emit('transport_change', { mode });
  }

  isWebSerialSupported() {
    return WebSerialBluetoothTransport.isSupported();
  }

  async connect(options = {}) {
    if (this.mode === 'webserial') {
      return await this.webSerialTransport.connect();
    } else {
      return await this.bridgeTransport.connect(options.port || '');
    }
  }

  async disconnect() {
    return await this.activeTransport.disconnect();
  }

  sendCommand(cmd) {
    return this.activeTransport.sendCommand(cmd);
  }

  isConnected() {
    return Boolean(this.activeTransport.isConnected);
  }

  async fetchBridgePorts() {
    return await this.bridgeTransport.fetchPorts();
  }
}

// Global shared singleton instance
export const robotComm = new RobotCommunication();
export default robotComm;
