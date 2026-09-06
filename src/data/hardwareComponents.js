export const hardwareComponents = [
  {
    id: "esp32",
    name: "ESP32 Dual-Core MCU",
    category: "Compute & Control",
    tag: "Core Controller",
    specs: "240MHz Tensilica LX6, 520KB SRAM, Wi-Fi/BLE, Hardware I2C/SPI/UART",
    description: "The primary onboard compute brain. Reads all multi-sensor inputs concurrently, performs local edge sensor fusion, governs motor speed, and manages safety triggers.",
    icon: "Cpu",
    voltage: "3.3V Logic / 5V Regulated",
    highlight: "Real-time edge sensor fusion & fail-safe decision loop"
  },
  {
    id: "camera",
    name: "Wide-Angle Inspection Camera",
    category: "Vision Subsystem",
    tag: "Visual Telemetry",
    specs: "120° FOV, Low-light sensor, Submerged optical dome, 1080p/720p capability",
    description: "Provides forward-looking visual inspection of submerged pipe walls, structural fractures, silt build-up, and floating debris obstructions.",
    icon: "Camera",
    voltage: "3.3V / 5V DC",
    highlight: "Direct optical feed before human worker entry"
  },
  {
    id: "led-ring",
    name: "High-Lumen Waterproof LED Ring",
    category: "Vision Subsystem",
    tag: "Illumination",
    specs: "8-12 Ultra-bright 5000K LEDs, PWM Dimming, Concentric Lens Mount",
    description: "Cuts through murky water and pitch-dark drainage passages, illuminating up to 5 meters ahead without causing backscatter glare.",
    icon: "Sun",
    voltage: "5V Controlled (PWM)",
    highlight: "Adaptive lumen intensity based on optical reflectivity"
  },
  {
    id: "rotary-encoder",
    name: "Precision Rotary Distance Encoder",
    category: "Localization",
    tag: "Distance Tracker",
    specs: "Optical/Hall wheel encoder, ±2 cm resolution, Low-friction contact assembly",
    description: "Directly calculates capsule travel distance and tether unspooling length to accurately pinpoint blockage location (e.g. 25.4 m from entry manhole).",
    icon: "Gauge",
    voltage: "5V DC",
    highlight: "Sub-meter localization of underground blockages"
  },
  {
    id: "imu",
    name: "6-Axis IMU (MPU6050)",
    category: "Navigation & Kinematics",
    tag: "Orientation & Impact",
    specs: "3-axis Accelerometer + 3-axis Gyroscope, I2C digital motion processor",
    description: "Detects pitch and roll angles, turbulent tipping, capsule entrapment, collision impacts against culvert walls, and abnormal surge movement.",
    icon: "Compass",
    voltage: "3.3V I2C",
    highlight: "Continuous tilt & turbulent motion monitoring"
  },
  {
    id: "current-sensor",
    name: "Motor Current Sensor (ACS712 / INA219)",
    category: "Diagnostics",
    tag: "Load Monitor",
    specs: "Hall-effect current sensing, up to 5A bidirectional, 66-185mV/A sensitivity",
    description: "Monitors electrical current draw of thrusters. A sudden current spike indicates silt entanglement, propeller jamming, or strong counter-current head pressure.",
    icon: "Activity",
    voltage: "5V Analog / I2C",
    highlight: "Instant detection of mechanical drag & propeller stall"
  },
  {
    id: "flow-sensor",
    name: "Hydrodynamic Water Flow Sensor",
    category: "Environmental",
    tag: "Current & Flow",
    specs: "Hall-effect turbine / differential pitot, 1–30 L/min dynamic range",
    description: "Measures water current velocity inside the culvert. Differentiates between standing stagnant water, normal drain runoff, and dangerous flash-flood surges.",
    icon: "Waves",
    voltage: "5V Pulse Output",
    highlight: "Identifies dangerous water flow surges in real-time"
  },
  {
    id: "motors",
    name: "Geared Motors / Protected Thrusters",
    category: "Propulsion",
    tag: "Drive System",
    specs: "Dual sealed brushed/brushless drive units, 300 RPM high-torque, protective shrouds",
    description: "Propels capsule forward through standing and flowing water. Ingress-protected shrouds prevent plastic wrappers and floating twigs from tangling rotors.",
    icon: "Zap",
    voltage: "7.4V – 11.1V DC",
    highlight: "Protected grilles prevent debris ingestion"
  },
  {
    id: "servo-anchor",
    name: "Folding Anchor & Locking Servo",
    category: "Recovery & Safety",
    tag: "Fail-Safe Anchor",
    specs: "Metal-gear waterproof servo, Spring-assisted folding barb mechanism",
    description: "Mechanical safety brake. If dangerous flow surge or stall occurs, the servo deploys an articulated anchor to lock position against culvert walls or bed.",
    icon: "Anchor",
    voltage: "5V–6V High-Torque",
    highlight: "Prevents capsule from being swept away by flood torrents"
  },
  {
    id: "battery",
    name: "Lithium-Ion Battery Pack & BMS",
    category: "Power Subsystem",
    tag: "Energy Storage",
    specs: "7.4V 2S / 11.1V 3S 18650 cells, Integrated BMS with over-current/short protection",
    description: "Supplies clean, isolated power to compute, sensors, and thrusters for 45–60 minutes of active inspection per mission cycle.",
    icon: "BatteryCharging",
    voltage: "7.4V – 11.1V (2600mAh)",
    highlight: "Dedicated power isolation between MCU and motors"
  },
  {
    id: "microsd",
    name: "High-Speed microSD Data Logger",
    category: "Data Integrity",
    tag: "Black-Box Storage",
    specs: "SPI interface, FAT32 formatting, 50Hz telemetry CSV logging",
    description: "Local black-box storage. Ensures all sensor logs, video snapshots, and obstacle coordinates are safely recorded even if communication drops.",
    icon: "HardDrive",
    voltage: "3.3V SPI",
    highlight: "Guaranteed offline log preservation for incident review"
  },
  {
    id: "tether",
    name: "High-Tensile Reinforced Tether",
    category: "Recovery & Safety",
    tag: "Safety Line",
    specs: "Kevlar-reinforced braided outer jacket, 50kg tensile strength, dual core conductors",
    description: "Primary physical retrieval umbilical. Enables reliable mechanical winch return, depth stabilization, and continuous wired fail-safe connection.",
    icon: "GitFork",
    voltage: "Passive / Data Pass-through",
    highlight: "50kg tensile strength ensures guaranteed physical retrieval"
  },
  {
    id: "enclosure",
    name: "Waterproof Cylindrical Enclosure & Reel",
    category: "Chassis & Ingress",
    tag: "Hull & Reel",
    specs: "Acrylic & machined PVC body, Double O-ring seals, Manual/motorized spool reel",
    description: "Pressure-resistant cylindrical body engineered for low hydrodynamic drag. Includes ground deployment cable reel for smooth tether feeding.",
    icon: "Shield",
    voltage: "Mechanical Enclosure",
    highlight: "Double O-ring sealed chamber with low drag coefficient"
  }
];
