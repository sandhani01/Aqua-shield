export const roadmapPhases = [
  {
    phase: "Phase 1",
    status: "CURRENT PROTOTYPE",
    badge: "SIH Validation",
    active: true,
    title: "Low-Cost Student Proof-of-Concept",
    cost: "Target ₹7,000 – ₹10,000",
    milestones: [
      "ESP32-based multi-sensor integration (IMU, Current, Flow, Encoder, Camera)",
      "Sensor fusion status state machine for risk detection",
      "Controlled 20m–30m testbed channel demonstration",
      "Mechanical folding anchor & tether retrieval mechanism"
    ]
  },
  {
    phase: "Phase 2",
    status: "NEXT DEVELOPMENT",
    badge: "Hardware Hardening",
    active: false,
    title: "IP68 Enclosure & High-Speed Tether Link",
    cost: "Target ₹15,000",
    milestones: [
      "Precision CNC anodized aluminum / polycarbonate IP68 chamber",
      "Differential RS-485 / twisted-pair high-speed digital tether",
      "Magnetic contactless charging and quick-swap battery dock",
      "Enhanced high-torque reversible thrusters with silicone lip seals"
    ]
  },
  {
    phase: "Phase 3",
    status: "R&D PIPELINE",
    badge: "Edge Intelligence",
    active: false,
    title: "AI-Based Edge Blockage Classification",
    cost: "Target ₹22,000",
    milestones: [
      "Edge AI accelerator (e.g. ESP32-S3 / K210 / Hailo-8L) for real-time vision",
      "Debris classification model: Plastic bags, tree root intrusions, sediment, construction rubble",
      "Autonomous optical turbidity compensation in murky water",
      "Automated severe blockage volume estimation"
    ]
  },
  {
    phase: "Phase 4",
    status: "FUTURE WORK",
    badge: "Geospatial SLAM",
    active: false,
    title: "Automatic 3D Inspection Mapping & Culvert Profiling",
    cost: "Target ₹35,000",
    milestones: [
      "Submerged acoustic sonar / 1D LiDAR profile reconstruction",
      "Digital twin creation of underground municipal stormwater network",
      "GIS GPS-tagged blockage coordinates for municipal works department",
      "Automated pipe deformation and silt cross-section reports"
    ]
  },
  {
    phase: "Phase 5",
    status: "FUTURE WORK",
    badge: "Worker Safety Certified",
    active: false,
    title: "Industrial-Grade Hazardous Environment Sensors",
    cost: "Target ₹50,000+",
    milestones: [
      "Submerged multi-gas sensor suite (H2S, CH4, CO, O2 deficiency)",
      "Intrinsically safe ATEX / Zone 1 explosion-proof rated housing",
      "Thermal infrared sensor to detect illegal industrial thermal discharges",
      "Safety certification compliance with National Sanitation Standards"
    ]
  },
  {
    phase: "Phase 6",
    status: "VISION",
    badge: "Smart City Scale",
    active: false,
    title: "Municipal Drainage Monitoring & Fleet Platform",
    cost: "Municipal Infrastructure",
    milestones: [
      "Cloud-connected municipal command center dashboard",
      "Multi-capsule rapid deployment fleet stationed at fire / stormwater depots",
      "Predictive monsoon flood warning based on historical drainage choke trends",
      "Integrated work-order dispatch for vacuum de-silting trucks"
    ]
  }
];

export const comparisonData = [
  {
    criterion: "Primary Purpose",
    manual: "Direct human worker entry into manhole / flooded culvert",
    existingRobots: "Robotic visual pipe inspection & structural crack assessment",
    aquaShield: "First-response hazard assessment & blockage localization before worker enters",
    highlight: true
  },
  {
    criterion: "Worker Safety Risk",
    manual: "EXTREME: High exposure to toxic gases, murky deep water & sudden flash surges",
    existingRobots: "Low (Machine deployed from street van)",
    aquaShield: "OPTIMAL: Zero human entry until capsule completes preliminary inspection",
    highlight: true
  },
  {
    criterion: "Deployment Cost",
    manual: "High recurring health risk & manual labor cost",
    existingRobots: "Very High: Commercial crawlers cost ₹5,00,000 – ₹25,00,000+",
    aquaShield: "Extremely Low: ₹7,000 – ₹10,000 student proof-of-concept target",
    highlight: true
  },
  {
    criterion: "Equipment Weight & Logistics",
    manual: "Requires protective suits, ropes, manual torches, ventilation fans",
    existingRobots: "Heavy: 15–40 kg crawler tractors requiring specialized support trucks",
    aquaShield: "Ultra-Portable: < 2.5 kg compact capsule deployable by a 2-person crew",
    highlight: false
  },
  {
    criterion: "Blockage Localization",
    manual: "Rough guesswork based on rod insertion or street ponding",
    existingRobots: "Often requires expensive optical odometer or cable counter console",
    aquaShield: "Direct rotary encoder + tether logging (e.g. exactly 25.4 m marked)",
    highlight: true
  },
  {
    criterion: "Multi-Sensor Environmental Fusion",
    manual: "None (Relies on human observation)",
    existingRobots: "Primarily optical camera feed with pan-tilt zoom",
    aquaShield: "Real-time fusion: Camera + IMU + Flow + Current + Rotary Encoder",
    highlight: true
  },
  {
    criterion: "Fail-Safe Recovery Mechanism",
    manual: "Emergency rope tether on worker",
    existingRobots: "Relies on manual crawler wheel reverse; easily stuck in deep debris",
    aquaShield: "Triple Fail-Safe: Motor stall cutoff + Active folding anchor + High-tensile tether reel",
    highlight: true
  },
  {
    criterion: "Data Storage & Accessibility",
    manual: "Manual clipboard inspection notes",
    existingRobots: "Proprietary software suite requiring heavy workstation",
    aquaShield: "Onboard microSD black-box + live lightweight web telemetry dashboard",
    highlight: false
  }
];
