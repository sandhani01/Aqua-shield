export const budgetItems = [
  {
    category: "Main Processing Unit",
    item: "ESP32 Dual-Core NodeMCU (Wi-Fi + BLE + FreeRTOS)",
    qty: 1,
    unitPrice: 550,
    totalPrice: 550,
    source: "Commercially available off-the-shelf microcontroller",
    impact: "Edge sensor fusion & multi-threaded sensor polling"
  },
  {
    category: "Vision & Illumination",
    item: "ESP32-CAM / OV2640 Module + 12-LED High Lumen Ring Light",
    qty: 1,
    unitPrice: 950,
    totalPrice: 950,
    source: "Standard 2MP low-light camera with PWM LED controller",
    impact: "Real-time video & forward obstacle optical inspection"
  },
  {
    category: "Kinematics & Localization",
    item: "MPU6050 6-Axis IMU + Optical Wheel Rotary Encoder",
    qty: 1,
    unitPrice: 650,
    totalPrice: 650,
    source: "I2C 6-DOF sensor and custom 3D-printed encoder hub",
    impact: "Precise sub-meter distance logging & tilt/impact detection"
  },
  {
    category: "Diagnostics & Flow",
    item: "ACS712 Current Sensor + Hall-Effect Water Flow Sensor",
    qty: 1,
    unitPrice: 750,
    totalPrice: 750,
    source: "Inline Hall turbine flow meter + current shunt module",
    impact: "Detects pipe blockage choke points & motor overload"
  },
  {
    category: "Propulsion & Drive System",
    item: "Dual Sealed Geared High-Torque Motors + L298N Driver",
    qty: 2,
    unitPrice: 600,
    totalPrice: 1200,
    source: "Waterproofed high-torque DC motors with sealed shaft couplers",
    impact: "Reliable forward thrust through standing drain water"
  },
  {
    category: "Power Subsystem",
    item: "18650 Li-ion Cells (2S2P 7.4V 4400mAh) + BMS Protection Board",
    qty: 1,
    unitPrice: 850,
    totalPrice: 850,
    source: "High-drain rechargeable cells with overcharge/short-circuit protection",
    impact: "60 minutes autonomous mission run time"
  },
  {
    category: "Chassis & Ingress Protection",
    item: "Machined Acrylic Tube (90mm OD) + 3D Printed End-caps & Dual O-Rings",
    qty: 1,
    unitPrice: 1400,
    totalPrice: 1400,
    source: "Cast acrylic cylindrical tube, silicone gaskets, and end-cap clamps",
    impact: "Tested waterproof pressure barrier for submerged inspection"
  },
  {
    category: "Safety & Recovery Mechanism",
    item: "Waterproof Metal Gear Servo + Articulated Folding Anchor",
    qty: 1,
    unitPrice: 750,
    totalPrice: 750,
    source: "MG996R sealed servo with stainless steel folding anchor flukes",
    impact: "Emergency stationary lock during sudden water flow surges"
  },
  {
    category: "Tether & Deployment Reel",
    item: "30-Metre Reinforced Braided Polyethylene Safety Tether + Spool Reel",
    qty: 1,
    unitPrice: 650,
    totalPrice: 650,
    source: "High-tensile (50kg rated) braided cord with ground-level spool",
    impact: "Guaranteed mechanical retrieval and physical fail-safe"
  },
  {
    category: "Storage & Ancillary Electronics",
    item: "microSD SPI Module, 32GB Card, Step-Down Buck Regulators & Wiring",
    qty: 1,
    unitPrice: 500,
    totalPrice: 500,
    source: "Standard electronic hardware & marine-grade wire glands",
    impact: "Guaranteed local offline black-box data preservation"
  }
];

export const totalTargetBudget = budgetItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
