/*
 * =====================================================================================
 *  AQUA-SHIELD: ESP32 Autonomous Drainage Inspection Robot
 *  LOCAL WI-FI & WEBSOCKET FIRMWARE (CASE 1: LAN / SAME WI-FI NETWORK)
 * =====================================================================================
 *
 *  Target Architecture:
 *    Browser (React / Vite Dashboard @ http://localhost:5173/robot)
 *       │
 *       │ Direct WebSocket over Local Wi-Fi (ws://ROBOT_IP:81/ws)
 *       ▼
 *    ESP32 Robot (Station Mode connected to same Wi-Fi router)
 *       ├── 4-Wheel Geared Motor Drive (L298N / Dual H-Bridge)
 *       ├── Ultrasonic Obstacle Ranger (HC-SR04)
 *       ├── Hazardous Gas Sniffer (MQ-Series ADC)
 *       ├── 6-DOF IMU Pitch/Roll Inclinometer (MPU6050 I2C)
 *       └── High-Side Bus Voltage & Current Shunt (INA219 I2C)
 *
 *  Hardware Pin Preservation (EXACT ORIGINAL PINS):
 *    - Motor A (Left):   IN1 -> GPIO 32, IN2 -> GPIO 33
 *    - Motor B (Right):  IN3 -> GPIO 25, IN4 -> GPIO 26
 *    - Gas Sensor:       Analog AOUT -> GPIO 34 (ADC1_CH6)
 *    - HC-SR04:          Trigger -> GPIO 15, Echo -> GPIO 2
 *    - I2C Bus:          SDA -> GPIO 21, SCL -> GPIO 22
 *    - Sensors on I2C:   MPU6050 (0x68), INA219 (0x40)
 *
 *  Required Libraries (Install via Arduino IDE Library Manager):
 *    1. WebSockets by Markus Sattler (v2.4.1 or higher)
 *    2. ArduinoJson by Benoit Blanchon (v6.x or v7.x)
 *    3. Adafruit MPU6050 & Adafruit Unified Sensor
 *    4. Adafruit INA219
 *    5. WiFi (Built-in to ESP32 Arduino Core)
 * =====================================================================================
 */

#include <Adafruit_INA219.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <WebSocketsServer.h>
#include <WiFi.h>
#include <Wire.h>
#include "esp_wifi.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

// =====================================================================================
// 1. WI-FI CREDENTIALS & NETWORK CONFIGURATION
// =====================================================================================
// NOTE: Enter your local Wi-Fi router name and password below.
// Ensure your laptop and the ESP32 are connected to the EXACT same 2.4 GHz
// Wi-Fi network.
const char *WIFI_SSID = "esp32";
const char *WIFI_PASSWORD = "12345678";

// STATIC IP OVERRIDE CONFIGURATION:
// - Set USE_STATIC_IP to true to guarantee the robot is ALWAYS 192.168.4.2
//   (CRITICAL when connected to ESP32-CAM soft-AP "esp32" with subnet 192.168.4.x).
const bool USE_STATIC_IP = true;
const IPAddress STATIC_IP(192, 168, 4, 2);
const IPAddress STATIC_GATEWAY(192, 168, 4, 1);
const IPAddress STATIC_SUBNET(255, 255, 255, 0);
const IPAddress STATIC_DNS(192, 168, 4, 1);

// WI-FI TRANSMISSION POWER:
// Lowered to 15dBm to dramatically reduce peak current spikes (from ~320mA down to ~160mA)
// on the battery/3.3V regulator rail, preventing voltage dips during motor draw!
const wifi_power_t WIFI_TX_POWER = WIFI_POWER_15dBm;

// HARDWARE BROWNOUT DETECTION:
// Set to false for battery-powered operation!
// When running solely on battery, DC motor inrush current (500mA-800mA) causes a transient
// voltage dip. Enabling brownout detection causes the ESP32 to enter a constant reboot/disconnect loop!
#define ENABLE_BROWNOUT_DETECTOR false

// WebSocket Server Port (Port 81 is the standard RFC-compliant non-privileged port)
const uint16_t WEBSOCKET_PORT = 81;
WebSocketsServer webSocket(WEBSOCKET_PORT);

// =====================================================================================
// 2. HARDWARE PIN DEFINITIONS (PRESERVED EXACTLY)
// =====================================================================================
// HC-SR04 Ultrasonic Distance Sensor
const int tr = 15; // Trigger Pin
const int ec = 2;  // Echo Pin

// MQ Hazardous Gas Sensor
#define GAS_SENSOR_PIN 34

// Motor Driver H-Bridge Pins
#define MOTOR_A_IN1 32
#define MOTOR_A_IN2 33
#define MOTOR_B_IN3 25
#define MOTOR_B_IN4 26

// I2C Sensors
Adafruit_MPU6050 mpu;
Adafruit_INA219 ina219;
bool mpuAvailable = false;
bool inaAvailable = false;

// =====================================================================================
// 3. SAFETY FAILSAFE & NON-BLOCKING TIMERS
// =====================================================================================
// Command Timeout: If no valid movement command or hold heartbeat is received
// within 1500 ms, the ESP32 halts motor drive to prevent runaway.
// (1500ms protects against typical 2.4GHz Wi-Fi jitter and motor EMI without sacrificing safety)
unsigned long lastCommandTime = 0;
const unsigned long COMMAND_TIMEOUT_MS = 1500;
bool isMoving = false;
char currentCommand = 'S';

// Telemetry Broadcast Timer (approx. once per second)
unsigned long lastTelemetryTime = 0;
const unsigned long telemetryInterval = 1000;

// Wi-Fi Reconnection Watchdog
unsigned long lastWifiCheckTime = 0;
const unsigned long WIFI_CHECK_INTERVAL = 5000;

// =====================================================================================
// 4. MOTOR CONTROL FUNCTIONS (CHASSIS ORIENTATION CALIBRATED)
// =====================================================================================
// CHASSIS KINEMATICS CALIBRATION:
// Pin assignments calibrated directly:
// - moveForward() (Command 'F'): Both motors forward (IN1=HIGH, IN2=LOW, IN3=HIGH, IN4=LOW)
// - moveBackward() (Command 'B'): Both motors reverse (IN1=LOW, IN2=HIGH, IN3=LOW, IN4=HIGH)
// - turnLeft()    (Command 'L'): Spin Left (IN1=LOW, IN2=HIGH, IN3=HIGH, IN4=LOW)
// - turnRight()   (Command 'R'): Spin Right (IN1=HIGH, IN2=LOW, IN3=LOW, IN4=HIGH)

void stopRobot() {
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void moveForward() {
  // Drives robot FORWARD (Both motors forward)
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void moveBackward() {
  // Drives robot BACKWARD (Both motors reverse)
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, HIGH);
}

void turnLeft() {
  // Spins robot LEFT (Motor A reverse, Motor B forward)
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void turnRight() {
  // Spins robot RIGHT (Motor A forward, Motor B reverse)
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, HIGH);
}

// Executes a validated single-character motion command
void executeCommand(char cmd) {
  currentCommand = cmd;
  lastCommandTime = millis();

  switch (cmd) {
  case 'F':
  case 'f':
    moveForward();
    isMoving = true;
    break;

  case 'B':
  case 'b':
    moveBackward();
    isMoving = true;
    break;

  case 'L':
  case 'l':
    turnLeft();
    isMoving = true;
    break;

  case 'R':
  case 'r':
    turnRight();
    isMoving = true;
    break;

  case 'S':
  case 's':
  default:
    stopRobot();
    isMoving = false;
    break;
  }
}

// =====================================================================================
// 5. NON-BLOCKING SENSOR READERS
// =====================================================================================
// HC-SR04 Ultrasonic Ranger Configuration
// 20,000 microseconds timeout = ~3.4 meters max range.
// (Binds pulseIn blocking to max 20ms once per second without delaying motor watchdog)
const unsigned long ULTRASONIC_TIMEOUT_US = 20000;

int getDistance() {
  digitalWrite(tr, LOW);
  delayMicroseconds(2);
  digitalWrite(tr, HIGH);
  delayMicroseconds(10);
  digitalWrite(tr, LOW);

  long duration = pulseIn(ec, HIGH, ULTRASONIC_TIMEOUT_US);

  // Return -1 as an explicit sentinel for timeout or sensor disconnected.
  // Avoids conflating 0cm (physical contact) with timeout/out-of-range.
  if (duration == 0) {
    return -1;
  }

  int cm = (int)(duration / 58.2);
  return cm;
}

// Broadcasts JSON telemetry packet to all connected browser clients
void broadcastTelemetry() {
  // PERFORMANCE: If no clients are connected, skip sensor reads and serialization
  if (webSocket.connectedClients() == 0) {
    return;
  }

  // Read analog gas sensor
  int gasValue = analogRead(GAS_SENSOR_PIN);

  // Read non-blocking ultrasonic distance
  int distanceCm = getDistance();

  // Read INA219 Voltage and Current safely
  float busVoltage = 0.0;
  float current_mA = 0.0;
  if (inaAvailable) {
    busVoltage = ina219.getBusVoltage_V();
    current_mA = ina219.getCurrent_mA();
    if (isnan(busVoltage) || busVoltage < 0) busVoltage = 0.0;
    if (isnan(current_mA) || current_mA < 0) current_mA = 0.0;
  }

  // Read MPU6050 Accelerometer safely
  float ax = 0.0, ay = 0.0, az = 9.8;
  if (mpuAvailable) {
    sensors_event_t a, g, temp;
    if (mpu.getEvent(&a, &g, &temp)) {
      ax = a.acceleration.x;
      ay = a.acceleration.y;
      az = a.acceleration.z;
    }
  }

  // Build JSON telemetry packet
  // Compatible with both ArduinoJson v6 and v7
#if ARDUINOJSON_VERSION_MAJOR >= 7
  JsonDocument doc;
#else
  StaticJsonDocument<384> doc;
#endif

  doc["type"] = "telemetry";
  doc["voltage"] = round(busVoltage * 100.0) / 100.0;
  doc["current"] = round(current_mA * 10.0) / 10.0;
  doc["gas"] = gasValue;
  doc["distance"] = distanceCm;
  doc["command"] = String(currentCommand);
  doc["moving"] = isMoving;

  JsonObject accel = doc.createNestedObject("accel");
  accel["x"] = round(ax * 10.0) / 10.0;
  accel["y"] = round(ay * 10.0) / 10.0;
  accel["z"] = round(az * 10.0) / 10.0;

  String jsonOutput;
  serializeJson(doc, jsonOutput);

  // Broadcast over WebSocket directly to React browser
  webSocket.broadcastTXT(jsonOutput);

  // Print telemetry to USB Serial for debugging
  Serial.print(F("[TELEMETRY JSON] "));
  Serial.println(jsonOutput);
}

// =====================================================================================
// 6. WEBSOCKET EVENT DISPATCHER
// =====================================================================================
void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload,
                    size_t length) {
  switch (type) {
  case WStype_DISCONNECTED: {
    Serial.printf("[WebSocket] Client #%u disconnected. Active clients: %u\n", num, webSocket.connectedClients());
    // Immediate safety stop: If robot was actively moving, immediately halt on ANY disconnect
    // (since the disconnected client could be the driving operator).
    // Also guarantees halt when the last client disconnects.
    if (isMoving || webSocket.connectedClients() == 0) {
      stopRobot();
      isMoving = false;
      currentCommand = 'S';
      Serial.println(F("[SAFETY] Disconnect detected. Motors halted."));
    }
    break;
  }

  case WStype_CONNECTED: {
    IPAddress ip = webSocket.remoteIP(num);
    Serial.printf("[WebSocket] Client #%u connected from %s, url: %s\n", num,
                  ip.toString().c_str(), payload);

    // Send initial status message confirming Wi-Fi IP and ready state
#if ARDUINOJSON_VERSION_MAJOR >= 7
    JsonDocument doc;
#else
    StaticJsonDocument<256> doc;
#endif
    doc["type"] = "status";
    doc["wifi"] = true;
    doc["ip"] = WiFi.localIP().toString();
    doc["port"] = WEBSOCKET_PORT;
    doc["robot"] = "AQUA-SHIELD";
    doc["reset_reason"] = (int)esp_reset_reason();

    String statusMsg;
    serializeJson(doc, statusMsg);
    webSocket.sendTXT(num, statusMsg);
    break;
  }

  case WStype_TEXT: {
    if (length == 0) break;

    // 1. Strict Fast Path: Single-byte command ('F', 'B', 'L', 'R', 'S')
    // Trims optional trailing newline/carriage return or whitespace (e.g. from serial/telnet tools)
    size_t cmdLen = length;
    while (cmdLen > 0 && (payload[cmdLen - 1] == '\r' || payload[cmdLen - 1] == '\n' || payload[cmdLen - 1] == ' ')) {
      cmdLen--;
    }

    if (cmdLen == 1) {
      char c = (char)payload[0];
      if (c == 'F' || c == 'B' || c == 'L' || c == 'R' || c == 'S' ||
          c == 'f' || c == 'b' || c == 'l' || c == 'r' || c == 's') {
        executeCommand(c);
        break;
      }
    }

    // 2. Standard JSON Path: Only parse JSON if payload starts with '{'
    // Format: {"command": "F"}
    if (payload[0] == '{') {
#if ARDUINOJSON_VERSION_MAJOR >= 7
      JsonDocument doc;
#else
      StaticJsonDocument<128> doc;
#endif
      DeserializationError error = deserializeJson(doc, payload, length);

      if (!error && doc.containsKey("command")) {
        const char *cmdStr = doc["command"];
        if (cmdStr && cmdStr[0] != '\0') {
          char c = cmdStr[0];
          if (c == 'F' || c == 'B' || c == 'L' || c == 'R' || c == 'S' ||
              c == 'f' || c == 'b' || c == 'l' || c == 'r' || c == 's') {
            executeCommand(c);
          }
        }
      }
    }
    // Any other text, logs, status strings, or corrupted packets are safely ignored!
    break;
  }

  case WStype_BIN:
    // Binary payload not used
    break;

  case WStype_ERROR:
    Serial.printf("[WebSocket] Error on client #%u\n", num);
    stopRobot();
    isMoving = false;
    break;

  default:
    break;
  }
}

// =====================================================================================
// 7. ARDUINO SETUP
// =====================================================================================
void setup() {
#if !ENABLE_BROWNOUT_DETECTOR
  // OPTIONAL OVERRIDE: Brownout detection disabled.
  // WARNING: If motor inrush sags rail below ~2.8V, ESP32 may hang with GPIOs stuck HIGH!
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.println(F("[WARN] Hardware brownout detector is DISABLED."));
#else
  // Brownout detector active (hardware default). Protects H-bridge and flash from rail sag.
#endif

  Serial.begin(115200);
  delay(300);

  Serial.println();
  Serial.println(F("=================================================="));
  Serial.println(F("     AQUA-SHIELD ESP32 ROBOT — LOCAL WI-FI        "));
  Serial.println(F("=================================================="));

  esp_reset_reason_t rstReason = esp_reset_reason();
  Serial.print(F("[SYSTEM] ESP32 Reset Reason: "));
  Serial.println((int)rstReason);
  if (rstReason == ESP_RST_BROWNOUT) {
    Serial.println(F("[WARN] LAST RESET WAS A BROWNOUT! 3.3V rail dropped below ~2.8V."));
    Serial.println(F("[WARN] Remedy: Power ESP32 from a separate regulated 5V buck converter and add a 470uF+ capacitor."));
  }

  // 1. Initialize ultrasonic pins
  pinMode(tr, OUTPUT);
  pinMode(ec, INPUT);
  digitalWrite(tr, LOW);

  // 2. Initialize motor driver pins
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_IN3, OUTPUT);
  pinMode(MOTOR_B_IN4, OUTPUT);

  // CRITICAL REQUIREMENT: Motor boots in STOP state. NEVER start moving on boot!
  stopRobot();
  isMoving = false;
  currentCommand = 'S';
  Serial.println(F("[MOTORS] Initialized in locked STOP state."));

  // 3. Initialize I2C Bus on GPIO 21 (SDA) and GPIO 22 (SCL)
  Wire.begin(21, 22);
  Wire.setTimeOut(30); // Prevent I2C bus lockup from motor noise blocking main loop

  // Initialize MPU6050 Inclinometer
  if (!mpu.begin()) {
    Serial.println(F("[WARN] MPU6050 chip not detected on I2C (0x68)."));
    mpuAvailable = false;
  } else {
    Serial.println(F("[OK] MPU6050 Initialized."));
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
    mpuAvailable = true;
  }

  // Initialize INA219 Current/Voltage Shunt
  if (!ina219.begin()) {
    Serial.println(F("[WARN] INA219 chip not detected on I2C (0x40)."));
    inaAvailable = false;
  } else {
    Serial.println(F("[OK] INA219 Initialized."));
    inaAvailable = true;
  }

  // 4. Initialize Wi-Fi in Station Mode
  WiFi.mode(WIFI_STA);
  WiFi.persistent(false);
  WiFi.setAutoReconnect(true);
  WiFi.disconnect(true);
  delay(100);

  // Static IP Configuration (decoupled from SSID text)
  if (USE_STATIC_IP) {
    if (WiFi.config(STATIC_IP, STATIC_GATEWAY, STATIC_SUBNET, STATIC_DNS)) {
      Serial.print(F("[WIFI] Static IP locked: "));
      Serial.println(STATIC_IP);
    } else {
      Serial.println(F("[WARN] Static IP configuration failed, falling back to DHCP."));
    }
  }

  Serial.println();
  Serial.print(F("Connecting to Wi-Fi SSID: "));
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  uint8_t wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 30) {
    delay(500);
    Serial.print(F("."));
    wifiAttempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println(F("=================================================="));
    Serial.println(F("WiFi connected"));
    Serial.print(F("Robot IP: "));
    Serial.println(WiFi.localIP());
    Serial.print(F("WebSocket URL: ws://"));
    Serial.print(WiFi.localIP());
    Serial.print(F(":"));
    Serial.print(WEBSOCKET_PORT);
    Serial.println(F("/ws"));
    Serial.println(F("=================================================="));

    // CRITICAL: Permanently disable modem sleep & power saving on ESP32 radio!
    // Must be set AFTER connection so ESP-IDF doesn't re-enable it.
    WiFi.setSleep(false);
    esp_wifi_set_ps(WIFI_PS_NONE);

    // Configure Wi-Fi transmission power
    WiFi.setTxPower(WIFI_TX_POWER);
  } else {
    Serial.println();
    Serial.println(
        F("[ERROR] Failed to connect to Wi-Fi. Check SSID/Password."));
    Serial.println(F("[WARN] Entering Wi-Fi reconnect loop in background."));
  }

  // 5. Start WebSocket Server on Port 81
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  // Relaxed heartbeat (5000ms interval, 5000ms timeout, 4 retries):
  // Prevents premature disconnections from motor EMI and battery Wi-Fi jitter!
  webSocket.enableHeartbeat(5000, 5000, 4);
  Serial.printf("[WebSocket] Server started on port %u (Heartbeat 5s/5s)\n", WEBSOCKET_PORT);
  Serial.println(F("AQUA-SHIELD Robot ready for browser commands."));
}

// =====================================================================================
// 8. ARDUINO MAIN LOOP
// =====================================================================================
void loop() {
  // 1. Maintain WebSocket pump (non-blocking)
  webSocket.loop();

  // 2. HARDWARE-SIDE MOTOR SAFETY TIMEOUT FAILSAFE
  // If moving and no heartbeat or command received in last 1500 ms -> STOP!
  if (isMoving && (millis() - lastCommandTime > COMMAND_TIMEOUT_MS)) {
    stopRobot();
    isMoving = false;
    currentCommand = 'S';
    Serial.println(F("[SAFETY] 1500ms command timeout exceeded. Robot halted."));
  }

  // 3. Robust Wi-Fi Status Watchdog
  // Only triggers reconnect after 4 consecutive failed checks (20s total) to avoid
  // dropping the active WebSocket during transient radio beacon jitter!
  static uint8_t wifiDisconnectCounter = 0;
  if (millis() - lastWifiCheckTime >= WIFI_CHECK_INTERVAL) {
    lastWifiCheckTime = millis();
    if (WiFi.status() != WL_CONNECTED) {
      wifiDisconnectCounter++;
      if (wifiDisconnectCounter >= 4) {
        Serial.println(F("[WIFI] Persistent connection loss detected. Reconnecting..."));
        stopRobot();
        isMoving = false;
        WiFi.reconnect();
        wifiDisconnectCounter = 0;
      }
    } else {
      wifiDisconnectCounter = 0;
    }
  }

  // 4. Periodic Telemetry Broadcast (Every 1000 ms, Non-Blocking)
  if (millis() - lastTelemetryTime >= telemetryInterval) {
    lastTelemetryTime = millis();
    broadcastTelemetry();
  }
}

