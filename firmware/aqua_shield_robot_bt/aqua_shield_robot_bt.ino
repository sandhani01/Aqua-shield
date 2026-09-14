/*
 * =====================================================================================
 *  AQUA-SHIELD: ESP32 Autonomous Drainage Inspection Robot
 *  BLUETOOTH CLASSIC SERIAL (SPP) FIRMWARE
 * =====================================================================================
 *
 *  Architecture:
 *    Browser (React / Vite Dashboard)
 *       │
 *       │ Bluetooth Classic SPP (Direct Web Serial COM or Bridge)
 *       ▼
 *    ESP32 Robot (BluetoothSerial SerialBT @ "ESP32_Robot_BT")
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
 *  Communication Protocol:
 *    - Device Name: "ESP32_Robot_BT"
 *    - Commands received (single-byte):
 *        'F' / 'f' -> Forward
 *        'B' / 'b' -> Backward
 *        'L' / 'l' -> Turn Left
 *        'R' / 'r' -> Turn Right
 *        'S' / 's' -> Stop
 *    - Telemetry sent (once every 1000ms, exactly one JSON object per line):
 *        {"type":"telemetry","voltage":7.30,"current":210.4,"gas":242,"distance":120,"command":"S","moving":false,"accel":{"x":-0.3,"y":2.3,"z":9.9}}\n
 *
 *  Safety Watchdog:
 *    - 1500 ms command timeout: If no movement command or heartbeat is
 * received, motors automatically halt.
 *    - Disconnect event: Motors halt immediately when Bluetooth link is
 * severed.
 * =====================================================================================
 */

#include "BluetoothSerial.h"
#include "soc/rtc_cntl_reg.h"
#include "soc/soc.h"
#include <Adafruit_INA219.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <Wire.h>

#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please enable Bluetooth in your board configuration.
#endif

// =====================================================================================
// 1. BLUETOOTH CONFIGURATION & OBJECTS
// =====================================================================================
const char *BT_DEVICE_NAME = "ESP32_Robot_BT";
BluetoothSerial SerialBT;
bool btConnected = false;

// =====================================================================================
// 2. HARDWARE PIN DEFINITIONS (PRESERVED EXACTLY)
// =====================================================================================
// HC-SR04 Ultrasonic Distance Sensor
const int tr = 15; // Trigger Pin
const int ec = 2;  // Echo Pin
const unsigned long ULTRASONIC_TIMEOUT_US =
    30000; // 30ms timeout = ~5.1m max range

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
unsigned long lastCommandTime = 0;
const unsigned long COMMAND_TIMEOUT = 1500;
bool isMoving = false;
char currentCommand = 'S';

// Telemetry Broadcast Timer (Every 1000 ms, non-blocking)
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 1000;

// =====================================================================================
// 4. MOTOR CONTROL FUNCTIONS (DIRECT CHASSIS KINEMATICS)
// =====================================================================================
void stopRobot() {
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void moveForward() {
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void moveBackward() {
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, HIGH);
}

void turnLeft() {
  digitalWrite(MOTOR_A_IN1, LOW);
  digitalWrite(MOTOR_A_IN2, HIGH);
  digitalWrite(MOTOR_B_IN3, HIGH);
  digitalWrite(MOTOR_B_IN4, LOW);
}

void turnRight() {
  digitalWrite(MOTOR_A_IN1, HIGH);
  digitalWrite(MOTOR_A_IN2, LOW);
  digitalWrite(MOTOR_B_IN3, LOW);
  digitalWrite(MOTOR_B_IN4, HIGH);
}

// Executes single-character motion command
void executeCommand(char cmd) {
  lastCommandTime = millis();

  switch (cmd) {
  case 'F':
  case 'f':
    currentCommand = 'F';
    moveForward();
    isMoving = true;
    Serial.println(F("[CMD] F (Forward)"));
    break;

  case 'B':
  case 'b':
    currentCommand = 'B';
    moveBackward();
    isMoving = true;
    Serial.println(F("[CMD] B (Backward)"));
    break;

  case 'L':
  case 'l':
    currentCommand = 'L';
    turnLeft();
    isMoving = true;
    Serial.println(F("[CMD] L (Turn Left)"));
    break;

  case 'R':
  case 'r':
    currentCommand = 'R';
    turnRight();
    isMoving = true;
    Serial.println(F("[CMD] R (Turn Right)"));
    break;

  case 'S':
  case 's':
  default:
    currentCommand = 'S';
    stopRobot();
    isMoving = false;
    Serial.println(F("[CMD] S (Stop)"));
    break;
  }
}

// =====================================================================================
// 5. SENSOR READERS
// =====================================================================================
// Non-blocking timeout-safe ultrasonic distance reading
int getDistance() {
  digitalWrite(tr, LOW);
  delayMicroseconds(2);
  digitalWrite(tr, HIGH);
  delayMicroseconds(10);
  digitalWrite(tr, LOW);

  // 30,000 microseconds timeout prevents main loop stalls
  long duration = pulseIn(ec, HIGH, ULTRASONIC_TIMEOUT_US);

  // Return -1 as sentinel when out of range, timed out, or disconnected
  if (duration == 0) {
    return -1;
  }

  int cm = (int)(duration / 58.2);
  return cm;
}

// Broadcasts single-line machine-readable JSON telemetry packet over Bluetooth
void sendTelemetry() {
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
    if (isnan(busVoltage) || busVoltage < 0)
      busVoltage = 0.0;
    if (isnan(current_mA) || current_mA < 0)
      current_mA = 0.0;
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

  // Send over Bluetooth Classic Serial terminated with newline
  SerialBT.println(jsonOutput);

  // Concise USB Serial debug output
  Serial.print(F("[TELEMETRY] V="));
  Serial.print(busVoltage, 2);
  Serial.print(F("V I="));
  Serial.print(current_mA, 1);
  Serial.print(F("mA Gas="));
  Serial.print(gasValue);
  Serial.print(F(" Dist="));
  Serial.println(distanceCm);
}

// =====================================================================================
// 6. BLUETOOTH CONNECTION EVENT CALLBACK
// =====================================================================================
void btCallback(esp_spp_cb_event_t event, esp_spp_cb_param_t *param) {
  if (event == ESP_SPP_SRV_OPEN_EVT) {
    btConnected = true;
    Serial.println(F("[BT] Client Connected. Sending instant handshake..."));
    // Send immediate handshake and telemetry so web console validates physical link instantly
    SerialBT.println(F("{\"type\":\"hello\",\"device\":\"ESP32_Robot_BT\",\"status\":\"online\"}"));
    sendTelemetry();
  } else if (event == ESP_SPP_CLOSE_EVT) {
    btConnected = false;
    Serial.println(F("[BT] Client Disconnected. Halting motors."));
    stopRobot();
    isMoving = false;
    currentCommand = 'S';
  }
}

// =====================================================================================
// 7. ARDUINO SETUP
// =====================================================================================
void setup() {
  // Disable brownout detector to prevent reboots during motor startup on
  // battery power
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200);
  delay(200);

  Serial.println();
  Serial.println(F("=================================================="));
  Serial.println(F("   AQUA-SHIELD ESP32 ROBOT — BLUETOOTH CLASSIC    "));
  Serial.println(F("=================================================="));

  // 1. Initialize ultrasonic pins
  pinMode(tr, OUTPUT);
  pinMode(ec, INPUT);
  digitalWrite(tr, LOW);

  // 2. Initialize motor driver pins
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_IN3, OUTPUT);
  pinMode(MOTOR_B_IN4, OUTPUT);

  // Failsafe: Motor boots in STOP state
  stopRobot();
  isMoving = false;
  currentCommand = 'S';
  Serial.println(F("[MOTORS] Initialized in locked STOP state."));

  // 3. Initialize I2C Bus on GPIO 21 (SDA) and GPIO 22 (SCL)
  Wire.begin(21, 22);
  Wire.setTimeOut(30);

  // Initialize MPU6050
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

  // Initialize INA219
  if (!ina219.begin()) {
    Serial.println(F("[WARN] INA219 chip not detected on I2C (0x40)."));
    inaAvailable = false;
  } else {
    Serial.println(F("[OK] INA219 Initialized."));
    inaAvailable = true;
  }

  // 4. Initialize Bluetooth Classic Serial
  SerialBT.register_callback(btCallback);
  if (!SerialBT.begin(BT_DEVICE_NAME)) {
    Serial.println(F("[ERROR] Failed to initialize Bluetooth Serial!"));
  } else {
    Serial.print(F("[BT] Bluetooth Serial Active. Advertising as: "));
    Serial.println(BT_DEVICE_NAME);
    Serial.println(F("[BT] Ready for pairing & serial commands."));
  }
}

// =====================================================================================
// 8. ARDUINO MAIN LOOP
// =====================================================================================
void loop() {
  // 1. Read incoming Bluetooth commands (non-blocking)
  while (SerialBT.available()) {
    char c = (char)SerialBT.read();

    // Ignore whitespace, carriage returns, and newlines
    if (c == '\r' || c == '\n' || c == ' ' || c == '\t') {
      continue;
    }

    // Ping / Handshake probe command from host
    if (c == 'P' || c == 'p') {
      SerialBT.println(F("{\"type\":\"pong\",\"status\":\"online\"}"));
      sendTelemetry();
      continue;
    }

    if (c == 'F' || c == 'B' || c == 'L' || c == 'R' || c == 'S' || c == 'f' ||
        c == 'b' || c == 'l' || c == 'r' || c == 's') {
      executeCommand(c);
    }
  }

  // 2. Hardware safety command watchdog
  // If moving and no command or heartbeat received within 1500 ms -> STOP!
  if (isMoving && (millis() - lastCommandTime > COMMAND_TIMEOUT)) {
    stopRobot();
    isMoving = false;
    currentCommand = 'S';
    Serial.println(
        F("[SAFETY] 1500ms command timeout exceeded. Motors halted."));
  }

  // 3. Periodic non-blocking telemetry broadcast (every 1000 ms)
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    // Only send if a Bluetooth client is connected to conserve power/CPU
    if (SerialBT.hasClient()) {
      sendTelemetry();
    }
  }
}
