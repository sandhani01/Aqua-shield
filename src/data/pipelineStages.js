export const pipelineStages = [
  {
    step: 1,
    id: "deploy",
    title: "1. DEPLOY",
    subtitle: "Manhole Surface Ingress",
    badge: "Stage 01",
    description: "The lightweight capsule is safely lowered into the flooded drainage manhole or road culvert opening via the reinforced tether line. Ground operators confirm telemetry lock and sensor zeroing before thrusters engage.",
    telemetryFocus: "IMU Gyro Calibration • Battery 98% • Tether Zero-Point",
    hardwareActive: ["ESP32 Controller", "Ground Cable Reel", "Tether Line", "Li-ion Battery"],
    actionPrompt: "Operators inspect water entry point and initiate primary telemetry handshake."
  },
  {
    step: 2,
    id: "move",
    title: "2. MOVE",
    subtitle: "Controlled Submerged Propulsion",
    badge: "Stage 02",
    description: "Protected shrouded thrusters spin up, delivering smooth forward propulsion through standing or low-velocity drain runoff. Rotary encoder tracks distance as tether unspools without snagging.",
    telemetryFocus: "Motor Current: 240 mA • Speed: 0.25 m/s • Rotary Ticks: Active",
    hardwareActive: ["Geared Motors / Thrusters", "Rotary Encoder", "Waterproof Enclosure"],
    actionPrompt: "Capsule moves into dark culvert, tracking precise travel distance from manhole."
  },
  {
    step: 3,
    id: "inspect",
    title: "3. INSPECT",
    subtitle: "Optical & Environmental Scanning",
    badge: "Stage 03",
    description: "The ultra-bright LED ring penetrates murky water, illuminating the drain conduit. The wide-angle camera captures continuous video while the flow sensor tracks water velocity and the IMU logs conduit inclination.",
    telemetryFocus: "Video Stream: 30 FPS • Illumination: 100% PWM • Flow: 15.6 L/min",
    hardwareActive: ["Wide-Angle Camera", "High-Lumen LED Ring", "Flow Sensor", "MPU6050 IMU"],
    actionPrompt: "Continuous visual logging of pipe walls, silt deposits, and water currents."
  },
  {
    step: 4,
    id: "detect",
    title: "4. DETECT",
    subtitle: "Multi-Sensor Obstacle Sensing",
    badge: "Stage 04",
    description: "As the capsule nears a choked section, the camera detects visual occlusion, the water flow sensor registers backpressure and hydraulic choking, and the motor current sensor detects resistance from submerged silt.",
    telemetryFocus: "Obstruction: INCOMING • Current: 440 mA (RISING) • Flow: 26.5 L/min",
    hardwareActive: ["Current Sensor", "Flow Sensor", "Wide-Angle Camera", "ESP32 ADC"],
    actionPrompt: "Multiple sensor channels simultaneously flag environmental abnormalities."
  },
  {
    step: 5,
    id: "localize",
    title: "5. LOCALIZE",
    subtitle: "Precise Sub-Meter Distance Pinpointing",
    badge: "Stage 05",
    description: "Rather than guessing where the drain is blocked, the rotary encoder and tether unspool counter triangulate the exact distance from the insertion point (e.g. exactly 25.4 metres downline).",
    telemetryFocus: "Encoder Distance: 25.4 m (±2 cm) • Odometry Integrity: VERIFIED",
    hardwareActive: ["Rotary Encoder", "microSD Logger", "ESP32 Hardware Timer"],
    actionPrompt: "Exact spatial coordinates recorded to eliminate unnecessary street digging."
  },
  {
    step: 6,
    id: "assess",
    title: "6. ASSESS",
    subtitle: "Multi-Parametric Risk Evaluation",
    badge: "Stage 06",
    description: "The onboard ESP32 evaluates all incoming parameters: motor current spikes past 900 mA (motor stall danger), water flow surge indicates impounded flood waters, and IMU reports abnormal pitch tilt.",
    telemetryFocus: "Motor Load: HIGH • Surge: DETECTED • Tilt Pitch: 14.8° • Risk: HIGH",
    hardwareActive: ["ESP32 Dual-Core", "ACS712 Sensor", "MPU6050", "Flow Sensor"],
    actionPrompt: "Sensor fusion rules calculate compound safety risk level."
  },
  {
    step: 7,
    id: "decide",
    title: "7. DECIDE",
    subtitle: "Autonomous Fail-Safe Threshold Logic",
    badge: "Stage 07",
    description: "The firmware determines that human worker entry would be hazardous and capsule forward progress is blocked. The ESP32 triggers emergency safety protocol: cut thrusters and deploy the folding mechanical anchor.",
    telemetryFocus: "Decision: ABORT & ANCHOR • Thruster Power: 0% • Safety Lock: ENGAGED",
    hardwareActive: ["ESP32 Safety Loop", "Servo Motor", "Folding Recovery Anchor"],
    actionPrompt: "Capsule automatically prevents itself from being swept downline or trapped."
  },
  {
    step: 8,
    id: "return",
    title: "8. RETURN",
    subtitle: "Safe Controlled Tether Retrieval",
    badge: "Stage 08",
    description: "With position secured and data logged, the ground cable reel spools in the high-tensile tether, bringing the capsule safely back to the entry manhole. A comprehensive inspection report is ready for the municipal team.",
    telemetryFocus: "Retrieval Speed: 0.3 m/s • Return Distance: 25.4m -> 0m • Data: STORED",
    hardwareActive: ["Tether Umbilical", "Ground Cable Reel", "microSD Black-Box"],
    actionPrompt: "Zero human worker exposure. Safe capsule retrieval with actionable data."
  }
];
