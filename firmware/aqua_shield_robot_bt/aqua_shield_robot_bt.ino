#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_INA219.h>
#include <BluetoothSerial.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <FastLED.h>

// --- FastLED Config ---
#define NUM_LEDS     20
#define DIN_PIN      27
#define BRIGHTNESS   80

CRGB leds[NUM_LEDS];

// --- Hardware Serial2 Pins (To Arduino Remote) ---
#define RX2_PIN 16
#define TX2_PIN 17

// --- Ultrasonic Pins ---
int tr = 15;
int ec = 2;

// --- Bluetooth ---
BluetoothSerial SerialBT;

// --- Sensors & Modules ---
Adafruit_MPU6050 mpu;
Adafruit_INA219 ina219;

// --- Temperature Probe (DS18B20) ---
#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

// --- Gas Sensors ---
#define GAS_SENSOR_1_PIN 34
#define GAS_SENSOR_2_PIN 35

// --- Motor Driver Pins ---
#define MOTOR_A_IN1 32
#define MOTOR_A_IN2 33
#define MOTOR_B_IN3 25
#define MOTOR_B_IN4 26

// Optional Enable Pins for L298N (Set HIGH if jumpers are not present)
#define MOTOR_ENA   12
#define MOTOR_ENB   14

// --- Telemetry Timing ---
unsigned long lastTelemetryTime = 0;
const unsigned long telemetryInterval = 1000; // 1 second

// Function Prototypes
int dist();
void stopRobot();
void moveForward();
void moveBackward();
void turnLeft();
void turnRight();
void handleCommand(char command);

void setup() {
  Serial.begin(115200);                                // USB Debugging
  Serial2.begin(115200, SERIAL_8N1, RX2_PIN, TX2_PIN);  // Connection to Arduino Remote

  // FastLED Setup - Solid White Light
  FastLED.addLeds<WS2812B, DIN_PIN, GRB>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
  fill_solid(leds, NUM_LEDS, CRGB(255, 255, 255));
  FastLED.show();

  // Ultrasonic Pins
  pinMode(tr, OUTPUT);
  pinMode(ec, INPUT);

  // Initialize DS18B20 Probe
  ds18b20.begin();

  // Initialize Bluetooth
  SerialBT.begin("ESP32_Robot_BT");

  // Initialize Motor Control Pins
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  pinMode(MOTOR_B_IN3, OUTPUT);
  pinMode(MOTOR_B_IN4, OUTPUT);
  
  pinMode(MOTOR_ENA, OUTPUT);
  pinMode(MOTOR_ENB, OUTPUT);
  digitalWrite(MOTOR_ENA, HIGH); // Enable Motor A Driver
  digitalWrite(MOTOR_ENB, HIGH); // Enable Motor B Driver

  stopRobot();

  // Initialize I2C Bus (SDA=21, SCL=22)
  Wire.begin(21, 22);

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip!");
  } else {
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  }

  // Initialize INA219
  if (!ina219.begin()) {
    Serial.println("Failed to find INA219 chip!");
  }
}

void loop() {
  // 1. Process Commands from Arduino Remote (Serial2)
  while (Serial2.available() > 0) {
    char command = Serial2.read();
    if (command != '\r' && command != '\n') {
      handleCommand(command);
    }
  }

  // 2. Process Wireless Commands from Bluetooth
  while (SerialBT.available() > 0) {
    char command = SerialBT.read();
    if (command != '\r' && command != '\n') {
      handleCommand(command);
    }
  }

  // 3. Process USB Serial Commands (For testing directly from Serial Monitor)
  while (Serial.available() > 0) {
    char command = Serial.read();
    if (command != '\r' && command != '\n') {
      handleCommand(command);
    }
  }

  // 4. Send Comma-Separated Telemetry Every 1 Second
  if (millis() - lastTelemetryTime >= telemetryInterval) {
    lastTelemetryTime = millis();

    int distance = dist();
    int gas1Value = analogRead(GAS_SENSOR_1_PIN);
    int gas2Value = analogRead(GAS_SENSOR_2_PIN);

    ds18b20.requestTemperatures();
    float probeTemp = ds18b20.getTempCByIndex(0);

    float busVoltage = ina219.getBusVoltage_V();
    float current_mA = ina219.getCurrent_mA();

    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    String csvData = String(distance) + "," +
                     String(gas1Value) + "," +
                     String(gas2Value) + "," +
                     String(probeTemp, 1) + "," +
                     String(busVoltage, 1) + "," +
                     String(current_mA, 1) + "," +
                     String(a.acceleration.x, 1) + "," +
                     String(a.acceleration.y, 1) + "," +
                     String(a.acceleration.z, 1);

    Serial2.println(csvData);
    SerialBT.println(csvData);
    Serial.println(csvData);
  }
}

// Control Command Handler
void handleCommand(char command) {
  Serial.print("Executing Command: ");
  Serial.println(command);

  switch (command) {
    case 'F': case 'f': moveForward(); break;
    case 'B': case 'b': moveBackward(); break;
    case 'L': case 'l': turnLeft(); break;
    case 'R': case 'r': turnRight(); break;
    case 'S': case 's': stopRobot(); break;
    default: break;
  }
}

// Ultrasonic Sensor Function
int dist() {
  digitalWrite(tr, LOW);
  delayMicroseconds(2);
  digitalWrite(tr, HIGH);
  delayMicroseconds(10);
  digitalWrite(tr, LOW);
  long duration = pulseIn(ec, HIGH, 30000);
  if (duration == 0) return -1;
  return duration / 58.2;
}

// Robot Movement Functions
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