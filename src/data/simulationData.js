export const simulationTimeline = [
  {
    step: 0,
    distance: 0.0,
    waterLevel: 1.2,
    flowRate: 12.4, // L/min
    flowStatus: "NORMAL",
    currentAmps: 0.8, // Normal DC motor draw
    motorCurrent: 800, // mA
    motorStatus: "NOMINAL",
    motorSpeed: 60, // %
    motorRunning: true,
    battery: 78,
    voltage: 11.6,
    gasH2S: 2.4, // ppm
    gasStatus: "NORMAL",
    turbidity: 18,
    temperature: 24.6,
    speed: 0.4,
    direction: "FORWARD",
    tiltPitch: 2.1,
    tiltRoll: 0.4,
    tiltStatus: "STABLE",
    obstacleDetected: false,
    obstacleType: "None (Entrance Clear)",
    systemStatus: "DEPLOYED — READY",
    systemRisk: "LOW RISK",
    riskLevel: "low",
    recommendation: "PROCEED WITH FORWARD SCAN",
    anchorDeployed: false,
    tetherTension: 4.2, // N
    cameraViewNote: "Entrance point. LED lights ON. Clear drainage channel visible.",
    timestamp: "10:32:10",
    detectedCounts: { leaves: 0, plastic: 0, metal: 0, other: 0 },
    activeAlerts: [
      { id: 1, type: "normal", text: "System operating normally", time: "10:32:10" }
    ],
    logs: [
      { time: "10:32:10", text: "DEPLOYED: Robot placed at drainage entrance", dot: "green" },
      { time: "10:32:12", text: "Encoder reset to 0.0 m • Camera streaming live", dot: "cyan" }
    ]
  },
  {
    step: 1,
    distance: 5.0,
    waterLevel: 1.2,
    flowRate: 13.8,
    flowStatus: "NORMAL",
    currentAmps: 0.8,
    motorCurrent: 820,
    motorStatus: "NOMINAL",
    motorSpeed: 60,
    motorRunning: true,
    battery: 77,
    voltage: 11.6,
    gasH2S: 2.4,
    gasStatus: "NORMAL",
    turbidity: 24,
    temperature: 24.7,
    speed: 0.5,
    direction: "FORWARD",
    tiltPitch: 2.2,
    tiltRoll: 0.8,
    tiltStatus: "STABLE",
    obstacleDetected: false,
    obstacleType: "None (Clean Channel Section)",
    systemStatus: "STEADY ADVANCE — 5m",
    systemRisk: "LOW RISK",
    riskLevel: "low",
    recommendation: "CONTINUE INSPECTION",
    anchorDeployed: false,
    tetherTension: 6.5,
    cameraViewNote: "5m Mark: Transparent dome clear. Minor floating leaf debris identified.",
    timestamp: "10:32:25",
    detectedCounts: { leaves: 2, plastic: 1, metal: 0, other: 0 },
    activeAlerts: [
      { id: 1, type: "normal", text: "System operating normally", time: "10:32:10" }
    ],
    logs: [
      { time: "10:32:25", text: "5 m REACHED: DC geared motors rolling steady", dot: "green" },
      { time: "10:32:25", text: "Rotary encoder odometry logged: 5.0 m", dot: "cyan" }
    ]
  },
  {
    step: 2,
    distance: 10.0,
    waterLevel: 1.2,
    flowRate: 15.2,
    flowStatus: "NORMAL",
    currentAmps: 0.9,
    motorCurrent: 900,
    motorStatus: "NOMINAL",
    motorSpeed: 60,
    motorRunning: true,
    battery: 76,
    voltage: 11.5,
    gasH2S: 2.4,
    gasStatus: "NORMAL",
    turbidity: 32,
    temperature: 24.7,
    speed: 0.5,
    direction: "FORWARD",
    tiltPitch: 2.3,
    tiltRoll: 1.0,
    tiltStatus: "STABLE",
    obstacleDetected: false,
    obstacleType: "Scattered Silt",
    systemStatus: "NOMINAL TRANSIT — 10m",
    systemRisk: "LOW RISK",
    riskLevel: "low",
    recommendation: "CONTINUE INSPECTION",
    anchorDeployed: false,
    tetherTension: 9.0,
    cameraViewNote: "10m Mark: Optical feed nominal. Loose leaves and silt bed visible.",
    timestamp: "10:32:42",
    detectedCounts: { leaves: 4, plastic: 3, metal: 0, other: 0 },
    activeAlerts: [
      { id: 1, type: "normal", text: "System operating normally", time: "10:32:10" }
    ],
    logs: [
      { time: "10:32:42", text: "10 m REACHED: Distance confirmed by rotary encoder", dot: "green" },
      { time: "10:32:42", text: "IMU Tilt: 2.3° (STABLE) • MicroSD logging active", dot: "cyan" }
    ]
  },
  {
    step: 3,
    distance: 15.0,
    waterLevel: 1.2,
    flowRate: 17.5,
    flowStatus: "NORMAL",
    currentAmps: 1.0,
    motorCurrent: 1000,
    motorStatus: "NOMINAL",
    motorSpeed: 60,
    motorRunning: true,
    battery: 75,
    voltage: 11.5,
    gasH2S: 2.5,
    gasStatus: "NORMAL",
    turbidity: 42,
    temperature: 24.8,
    speed: 0.5,
    direction: "FORWARD",
    tiltPitch: 2.4,
    tiltRoll: 1.2,
    tiltStatus: "STABLE",
    obstacleDetected: false,
    obstacleType: "Plastic Bottle Clutter",
    systemStatus: "ADVANCING — 15m",
    systemRisk: "LOW RISK",
    riskLevel: "low",
    recommendation: "MAINTAIN CRUISE SPEED",
    anchorDeployed: false,
    tetherTension: 12.0,
    cameraViewNote: "15m Mark: Plastic bottles and mud clumps on channel invert.",
    timestamp: "10:33:02",
    detectedCounts: { leaves: 6, plastic: 5, metal: 1, other: 0 },
    activeAlerts: [
      { id: 1, type: "normal", text: "System operating normally", time: "10:32:10" }
    ],
    logs: [
      { time: "10:33:02", text: "15 m REACHED: Flow sensor reading nominal", dot: "green" },
      { time: "10:33:02", text: "Gas sensor: 2.5 ppm (preliminary check normal)", dot: "cyan" }
    ]
  },
  {
    step: 4,
    distance: 20.0,
    waterLevel: 1.3,
    flowRate: 24.0,
    flowStatus: "ELEVATED",
    currentAmps: 1.2, // Motor load rising
    motorCurrent: 1200,
    motorStatus: "INCREASING RESISTANCE",
    motorSpeed: 50,
    motorRunning: true,
    battery: 74,
    voltage: 11.4,
    gasH2S: 2.6,
    gasStatus: "NORMAL",
    turbidity: 65,
    temperature: 24.8,
    speed: 0.4,
    direction: "FORWARD",
    tiltPitch: 2.4,
    tiltRoll: 1.5,
    tiltStatus: "STABLE",
    obstacleDetected: false,
    obstacleType: "Restriction Approaching",
    systemStatus: "WARNING — APPROACHING CHOKE",
    systemRisk: "MODERATE RISK",
    riskLevel: "warning",
    recommendation: "REDUCE SPEED / SAMPLE SENSORS",
    anchorDeployed: false,
    tetherTension: 15.5,
    cameraViewNote: "20m Mark: Water flow accelerating. Heavy debris silhouette ahead.",
    timestamp: "10:33:21",
    detectedCounts: { leaves: 8, plastic: 6, metal: 2, other: 1 },
    activeAlerts: [
      { id: 2, type: "warning", text: "Flow velocity elevated ahead (24 L/min)", time: "10:33:21" }
    ],
    logs: [
      { time: "10:33:21", text: "20 m REACHED: Water velocity increasing", dot: "amber" },
      { time: "10:33:25", text: "Current sensor detects slight drag: 1.2 A", dot: "amber" }
    ]
  },
  {
    step: 5,
    distance: 27.0, // EXACT BENCHMARK FROM USER SPECIFICATION
    waterLevel: 1.4,
    flowRate: 38.5,
    flowStatus: "HIGH (CHOKE SURGE)",
    currentAmps: 1.8, // 1.8 A HIGH LOAD
    motorCurrent: 1800, // mA
    motorStatus: "HIGH MOTOR LOAD",
    motorSpeed: 10,
    motorRunning: false, // Stopped by overcurrent protection
    battery: 73,
    voltage: 11.3,
    gasH2S: 3.8,
    gasStatus: "ELEVATED",
    turbidity: 120,
    temperature: 25.0,
    speed: 0.0,
    direction: "STOPPED (OBSTRUCTION)",
    tiltPitch: 2.4, // STABLE TILT
    tiltRoll: 1.8,
    tiltStatus: "STABLE (2.4°)",
    obstacleDetected: true,
    obstacleType: "Debris Dam: Plastic Bags, Bottles & Mud Choke",
    systemStatus: "BLOCKAGE DETECTED — APPROX. 27 m",
    systemRisk: "HIGH RISK — BLOCKAGE CONFIRMED",
    riskLevel: "danger",
    recommendation: "STOP & SECURE / PREPARE RETURN",
    anchorDeployed: false,
    tetherTension: 28.0,
    cameraViewNote: "27.0m: OBSTRUCTION VISIBLE. Culvert choked by dense plastic bags and silt.",
    timestamp: "10:33:56",
    detectedCounts: { leaves: 12, plastic: 8, metal: 3, other: 2 },
    activeAlerts: [
      { id: 3, type: "danger", text: "BLOCKAGE DETECTED @ APPROX. 27 m", time: "10:33:56" },
      { id: 4, type: "danger", text: "HIGH MOTOR LOAD: 1.8 A (Threshold: >1.5 A)", time: "10:33:54" }
    ],
    logs: [
      { time: "10:33:54", text: "HIGH MOTOR LOAD: Current spiked to 1.8 A", dot: "red" },
      { time: "10:33:56", text: "BLOCKAGE DETECTED: Obstruction confirmed at 27.0 m", dot: "red" },
      { time: "10:33:56", text: "LOCATION: ≈ 27.0 m logged by encoder", dot: "red" }
    ]
  },
  {
    step: 6,
    distance: 27.0,
    waterLevel: 1.4,
    flowRate: 42.0,
    flowStatus: "HIGH FLOW",
    currentAmps: 0.1, // Motors cut off
    motorCurrent: 0,
    motorStatus: "MOTORS HALTED — ANCHOR ARMED",
    motorSpeed: 0,
    motorRunning: false,
    battery: 73,
    voltage: 11.3,
    gasH2S: 3.8,
    gasStatus: "ELEVATED",
    turbidity: 125,
    temperature: 25.0,
    speed: 0.0,
    direction: "SECURED / ANCHORED",
    tiltPitch: 2.4,
    tiltRoll: 1.8,
    tiltStatus: "STABLE",
    obstacleDetected: true,
    obstacleType: "Blockage Confirmed @ 27.0m",
    systemStatus: "INSPECTION ABORTED — RETURN INITIATED",
    systemRisk: "HIGH RISK — SECURED",
    riskLevel: "danger",
    recommendation: "COMMENCE TETHER WINCH RETRIEVAL",
    anchorDeployed: true,
    tetherTension: 45.0,
    cameraViewNote: "27.0m: Anchor engaged to prevent drift. Surface crew signaled.",
    timestamp: "10:34:00",
    detectedCounts: { leaves: 12, plastic: 8, metal: 3, other: 2 },
    activeAlerts: [
      { id: 5, type: "danger", text: "INSPECTION ABORTED — RETURN INITIATED", time: "10:34:00" },
      { id: 3, type: "danger", text: "BLOCKAGE DETECTED @ APPROX. 27 m", time: "10:33:56" }
    ],
    logs: [
      { time: "10:34:00", text: "INSPECTION ABORTED: Motor power cut within 20ms", dot: "red" },
      { time: "10:34:02", text: "Fail-safe mechanical anchor locked to channel bed", dot: "amber" }
    ]
  },
  {
    step: 7,
    distance: 20.0,
    waterLevel: 1.3,
    flowRate: 30.0,
    flowStatus: "CONTROLLED",
    currentAmps: 0.4,
    motorCurrent: 0, // Winch pulling back
    motorStatus: "TETHER REEL WINCHING",
    motorSpeed: 0,
    motorRunning: false,
    battery: 72,
    voltage: 11.3,
    gasH2S: 2.8,
    gasStatus: "NORMAL",
    turbidity: 80,
    temperature: 24.9,
    speed: 0.5,
    direction: "RETURNING (TETHER REEL)",
    tiltPitch: 2.2,
    tiltRoll: 1.0,
    tiltStatus: "STABLE",
    obstacleDetected: true,
    obstacleType: "Blockage Logged at 27.0m",
    systemStatus: "CONTROLLED RETURN — 20m",
    systemRisk: "RETURN IN PROGRESS",
    riskLevel: "warning",
    recommendation: "MAINTAIN WINCH TENSION",
    anchorDeployed: false,
    tetherTension: 35.0,
    cameraViewNote: "20m Return: Capsule smoothly winched backward along the 30m tether.",
    timestamp: "10:34:10",
    detectedCounts: { leaves: 12, plastic: 8, metal: 3, other: 2 },
    activeAlerts: [
      { id: 6, type: "warning", text: "Tether recovery active (reeling back)", time: "10:34:10" }
    ],
    logs: [
      { time: "10:34:10", text: "RETURNING: Tether line being winched back", dot: "cyan" },
      { time: "10:34:15", text: "Passing 20 m marker under winch control", dot: "cyan" }
    ]
  },
  {
    step: 8,
    distance: 10.0,
    waterLevel: 1.2,
    flowRate: 18.0,
    flowStatus: "NORMALIZING",
    currentAmps: 0.4,
    motorCurrent: 0,
    motorStatus: "TETHER REEL WINCHING",
    motorSpeed: 0,
    motorRunning: false,
    battery: 72,
    voltage: 11.3,
    gasH2S: 2.4,
    gasStatus: "NORMAL",
    turbidity: 40,
    temperature: 24.8,
    speed: 0.5,
    direction: "RETURNING (TETHER REEL)",
    tiltPitch: 2.1,
    tiltRoll: 0.6,
    tiltStatus: "STABLE",
    obstacleDetected: true,
    obstacleType: "Blockage Logged at 27.0m",
    systemStatus: "CONTROLLED RETURN — 10m",
    systemRisk: "RETURN IN PROGRESS",
    riskLevel: "low",
    recommendation: "APPROACHING SURFACE MANHOLE",
    anchorDeployed: false,
    tetherTension: 22.0,
    cameraViewNote: "10m Return: Telemetry and images fully preserved on MicroSD module.",
    timestamp: "10:34:30",
    detectedCounts: { leaves: 12, plastic: 8, metal: 3, other: 2 },
    activeAlerts: [
      { id: 6, type: "warning", text: "Tether recovery active (reeling back)", time: "10:34:10" }
    ],
    logs: [
      { time: "10:34:30", text: "Passing 10 m marker • MicroSD data verified", dot: "cyan" },
      { time: "10:34:35", text: "Winch speed steady at 0.5 m/s", dot: "cyan" }
    ]
  },
  {
    step: 9,
    distance: 0.0, // SAFE RETURN COMPLETE AT ENTRANCE
    waterLevel: 1.2,
    flowRate: 12.0,
    flowStatus: "NORMAL",
    currentAmps: 0.0,
    motorCurrent: 0,
    motorStatus: "MISSION COMPLETE / RETRIEVED",
    motorSpeed: 0,
    motorRunning: false,
    battery: 72,
    voltage: 11.2,
    gasH2S: 2.4,
    gasStatus: "NORMAL",
    turbidity: 20,
    temperature: 24.6,
    speed: 0.0,
    direction: "RETRIEVED AT ENTRANCE",
    tiltPitch: 0.5,
    tiltRoll: 0.2,
    tiltStatus: "STABLE (SURFACE)",
    obstacleDetected: true,
    obstacleType: "Blockage Stamped at 27.0m",
    systemStatus: "MISSION COMPLETE — DOSSIER READY",
    systemRisk: "SAFE RECOVERY ACHIEVED",
    riskLevel: "success",
    recommendation: "DOWNLOAD FINAL INSPECTION REPORT",
    anchorDeployed: false,
    tetherTension: 0,
    cameraViewNote: "Entrance reached. Capsule safely collected by operators. Human risk avoided.",
    timestamp: "10:34:55",
    detectedCounts: { leaves: 12, plastic: 8, metal: 3, other: 2 },
    activeAlerts: [
      { id: 7, type: "normal", text: "Safe return complete — Inspection report ready", time: "10:34:55" }
    ],
    logs: [
      { time: "10:34:55", text: "ROBOT RETRIEVED: Safely back at drainage entrance", dot: "green" },
      { time: "10:34:55", text: "INSPECTION REPORT COMPILED: Blockage at 27.0 m", dot: "green" }
    ]
  }
];

// Sensor Fusion Decision Rules
export const sensorFusionRules = [
  {
    sensor: "ESP32 Camera",
    input: "Visual obstruction / debris dam visible in transparent dome",
    weight: "Primary Visual Evidence",
    state: "Obstruction Visible"
  },
  {
    sensor: "Rotary Encoder",
    input: "Travel distance logged at 27.0 m from entrance",
    weight: "Spatial Localization (±2 cm)",
    state: "Approx. 27.0 m"
  },
  {
    sensor: "Current Sensor (ACS712)",
    input: "Geared DC motors drawing 1.8 A (Threshold: >1.5 A)",
    weight: "Mechanical Resistance / Stall Load",
    state: "HIGH MOTOR LOAD (1.8 A)"
  },
  {
    sensor: "IMU (MPU6050)",
    input: "Tilt measured at 2.4° (Normal threshold: <8.5°)",
    weight: "Chassis Orientation & Stability",
    state: "STABLE (2.4°)"
  },
  {
    sensor: "Flow Sensor",
    input: "Water velocity elevated due to upstream choke (38.5 L/min)",
    weight: "Hydrodynamic Condition",
    state: "HIGH (CHOKE SURGE)"
  }
];

// 9 Modular Prototype Tests specified by User
export const prototypeTests = [
  {
    id: "test1",
    num: "TEST 1",
    name: "Camera & Transparent Dome",
    desc: "Verify camera inspects dark drain with dual LED illumination.",
    status: "PASSED",
    readout: "CAMERA: ONLINE • LED: ON • VIDEO: LIVE",
    quote: "First, we verify that AQUA-SHIELD can visually inspect a dark drainage passage without requiring immediate human entry."
  },
  {
    id: "test2",
    num: "TEST 2",
    name: "DC Motors & Protected Wheels",
    desc: "Verify 4 geared DC motors drive through channel (Forward/Reverse/Stop).",
    status: "PASSED",
    readout: "MOTOR: RUNNING • DIR: FORWARD • SPEED: 60%",
    quote: "Wheels provide simple, reliable movement for student drain inspection."
  },
  {
    id: "test3",
    num: "TEST 3",
    name: "Encoder Distance Measurement",
    desc: "Rotary encoder measures exact travel downline up to 27.0m blockage.",
    status: "PASSED",
    readout: "ODOMETER: 27.0 m (±2cm accuracy)",
    quote: "The encoder provides exact distance; camera & sensors provide supporting evidence."
  },
  {
    id: "test4",
    num: "TEST 4",
    name: "Current Sensor (ACS712) / Motor Load",
    desc: "Detects increased resistance: 0.8A Normal → 1.8A High Load.",
    status: "PASSED",
    readout: "0.8A NORMAL → 1.8A HIGH LOAD",
    quote: "Combines Camera + Encoder + Current Sensor for robust blockage confirmation."
  },
  {
    id: "test5",
    num: "TEST 5",
    name: "IMU (MPU6050) Tilt & Vibration",
    desc: "Monitors abnormal movement or excessive tilt (>8.5° threshold).",
    status: "PASSED",
    readout: "TILT: 2.4° • STATUS: STABLE",
    quote: "Prevents capsule rollover in turbulent stormwater runoff."
  },
  {
    id: "test6",
    num: "TEST 6",
    name: "Turbine Flow Sensor",
    desc: "Classifies water conditions: NORMAL FLOW → HIGH FLOW → CRITICAL FLOW.",
    status: "PASSED",
    readout: "FLOW: NORMAL (12.4 L/min) → HIGH (38.5 L/min)",
    quote: "High flow + abnormal movement flags critical risk to trigger recovery."
  },
  {
    id: "test7",
    num: "TEST 7",
    name: "Gas Sensor Inlet",
    desc: "Protected sensing inlet monitors air/gas conditions (H2S indication).",
    status: "PASSED",
    readout: "GAS LEVEL: 2.4 ppm • STATUS: NORMAL",
    quote: "Provides preliminary environmental condition monitoring to support decisions."
  },
  {
    id: "test8",
    num: "TEST 8",
    name: "Li-ion Battery & BMS Monitoring",
    desc: "Monitors 11.6V 3S pack; auto-triggers return if battery reaches low threshold.",
    status: "PASSED",
    readout: "BATTERY: 78% • 11.6 V • STATUS: NORMAL",
    quote: "Prevents the robot from ever becoming stranded inside the test channel."
  },
  {
    id: "test9",
    num: "TEST 9",
    name: "30m High-Tensile Tether & Recovery",
    desc: "Guarantees 100% fail-safe mechanical recovery even if electronics lose power.",
    status: "PASSED",
    readout: "TETHER: 30m RATED (50kg) • WINCH: READY",
    quote: "Mechanical tether guarantees physical retrieval under all failure modes."
  }
];

// Sample downloadable inspection report text generator
export const generateInspectionReport = (stepData) => {
  return `===================================================================
AQUA-SHIELD — FIRST-RESPONSE DRAIN INSPECTION DOSSIER
Municipal Engineering & Sanitation Division Telemetry Log
===================================================================
Generated: ${new Date().toLocaleString()}
Inspection Mode: First-Response Reconnaissance (Pre-Human Entry)
Capsule ID: AQUA-SHIELD-PROTO-01 (ESP32-S3 / 4 Geared DC Wheels)
Test Channel: 30.0 Metre Testbed Conduit

1. TRAVERSE METRICS:
-------------------------------------------------------------------
- Distance Travelled     : ${stepData.distance.toFixed(1)} metres
- Blockage Status        : ${stepData.obstacleDetected ? "DETECTED" : "CLEAR"}
- Blockage Location      : Approx. ${stepData.distance.toFixed(1)} metres from entrance
- Choke Restriction Ratio: 85% conduit aperture obstruction
- Obstruction Type       : Plastic Bags, Tree Branches, Construction Silt

2. MULTI-SENSOR FUSION LOG (AT LOCALIZATION POINT):
-------------------------------------------------------------------
- Camera Viewport        : Obstruction confirmed visible through dome
- Rotary Encoder         : Exact position stamped at ${stepData.distance.toFixed(1)} m (±2cm)
- Motor Current (ACS712) : ${stepData.currentAmps.toFixed(1)} A (${stepData.currentAmps >= 1.5 ? "HIGH MOTOR LOAD" : "NORMAL LOAD"})
- Incline Tilt (MPU6050) : ${stepData.tiltPitch}° (${stepData.tiltPitch > 8.5 ? "ABNORMAL MOVEMENT" : "STABLE"})
- Water Flow Velocity    : ${stepData.flowRate.toFixed(1)} L/min (${stepData.flowStatus})
- Gas Sensor Indicator   : ${stepData.gasH2S.toFixed(1)} ppm (${stepData.gasStatus})
- Battery Level & Pack   : ${stepData.battery}% (${stepData.voltage} V)

3. DECISION-SUPPORT RECOMMENDATION:
-------------------------------------------------------------------
- Human Intervention    : DIRECT HUMAN ENTRY STRICTLY PROHIBITED
- Action Taken           : Robot halted, mechanical bed anchor secured
- Municipal Solution     : Position vacuum suction truck at surface coordinates
                           corresponding to ${stepData.distance.toFixed(1)} metres downline.
- Recovery Mechanism     : 30-metre high-tensile safety tether reeled capsule
                           safely back to entrance with zero worker exposure.

===================================================================
STATUS: SAFE RECOVERY ACHIEVED • ALL TELEMETRY DIGITALLY CERTIFIED
===================================================================`;
};
