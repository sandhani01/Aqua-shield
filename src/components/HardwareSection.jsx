import React from 'react';
import { 
  Cpu, 
  Camera, 
  Sun, 
  Activity, 
  Zap, 
  Waves, 
  Compass, 
  Settings, 
  BatteryCharging, 
  Anchor, 
  ArrowRight, 
  Layers 
} from 'lucide-react';

export default function HardwareSection() {
  const components = [
    {
      name: "ESP32-S3 Microcontroller",
      category: "Main Processing Unit",
      spec: "Dual-Core 240MHz • Wi-Fi / Bluetooth • FreeRTOS",
      role: "Coordinates sensors, telemetry, and deterministic sensor fusion engine.",
      icon: Cpu
    },
    {
      name: "OV2640 Optical Camera",
      category: "Visual Imaging",
      spec: "2MP Sensor • 120° Wide-Angle • 1080P Stream",
      role: "Streams real-time visual inspection footage through transparent dome.",
      icon: Camera
    },
    {
      name: "12-LED Concentric Ring",
      category: "Submerged Illumination",
      spec: "12x High-Lumen White LEDs • PWM Dimming",
      role: "Cuts through pitch-dark and murky drainage water.",
      icon: Sun
    },
    {
      name: "MPU6050 6-DOF IMU",
      category: "Attitude & Tilt Gyro",
      spec: "±250°/s Gyro • ±2g Accelerometer • I2C",
      role: "Detects abnormal tilt (>8.5° threshold) to prevent capsizing.",
      icon: Activity
    },
    {
      name: "ACS712 Current Sensor",
      category: "Motor Load Shunt",
      spec: "Hall-Effect Current Sensing • 0–5A Range",
      role: "Detects increased motor drag (1.8A) indicating physical blockage.",
      icon: Zap
    },
    {
      name: "Turbine Flow Sensor",
      category: "Hydrodynamic Velocity",
      spec: "Hall Turbine Wheel • 1–30 L/min Baseline",
      role: "Monitors rushing water velocity and sudden hydraulic choke surges.",
      icon: Waves
    },
    {
      name: "Rotary Encoder",
      category: "Spatial Odometry",
      spec: "Optical Quadrature • ±2 cm Spatial Precision",
      role: "Calculates exact downline travel distance from entrance.",
      icon: Compass
    },
    {
      name: "4 Geared DC Motors",
      category: "Propulsion & Traction",
      spec: "12V High-Torque Geared DC • Protected Enclosure",
      role: "Drives 4 rugged wheels through flooded drainage channel beds.",
      icon: Settings
    },
    {
      name: "3S Li-ion Battery & BMS",
      category: "Onboard Power",
      spec: "11.6V Pack • Integrated BMS Overcurrent Protection",
      role: "Powers all electronics for >45 minutes of continuous inspection.",
      icon: BatteryCharging
    },
    {
      name: "Titanium Servo Anchor",
      category: "Fail-Safe Actuator",
      spec: "High-Torque Waterproof Servo • Articulated Flukes",
      role: "Locks into conduit invert during emergencies to prevent drift.",
      icon: Anchor
    }
  ];

  return (
    <section id="technology" className="py-20 md:py-28 bg-[#070b16] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>HARDWARE STACK &amp; ARCHITECTURE</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 font-heading">
            HOW WE BUILT IT
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-normal">
            A modular architecture pairing commercial off-the-shelf electronics with deterministic edge fusion.
          </p>
        </div>

        {/* CLEAN ARCHITECTURE DIAGRAM (CAMERA → ESP32 → SENSOR FUSION → SAFETY DECISION → MOTOR / ANCHOR) */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#091226] via-[#060b18] to-[#091226] border border-cyan-500/30 shadow-xl overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] gap-2 font-mono text-xs">
            
            {/* 1. CAMERA */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-center flex-1">
              <Camera className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="font-bold text-white block">CAMERA</span>
              <span className="text-[10px] text-slate-400">OV2640 + LEDs</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0" />

            {/* 2. ESP32 */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/40 text-center flex-1">
              <Cpu className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <span className="font-bold text-white block">ESP32-S3</span>
              <span className="text-[10px] text-slate-400">Dual-Core 240MHz</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0" />

            {/* 3. SENSOR FUSION */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/40 text-center flex-1">
              <Activity className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="font-bold text-white block">SENSOR FUSION</span>
              <span className="text-[10px] text-slate-400">Encoder + Shunt + IMU</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0" />

            {/* 4. SAFETY DECISION */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/40 text-center flex-1">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="font-bold text-white block">SAFETY DECISION</span>
              <span className="text-[10px] text-slate-400">&lt;20ms Logic Loop</span>
            </div>

            <ArrowRight className="w-4 h-4 text-cyan-500/60 shrink-0" />

            {/* 5. MOTOR / ANCHOR */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-center flex-1">
              <Anchor className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="font-bold text-white block">MOTOR / ANCHOR</span>
              <span className="text-[10px] text-slate-400">H-Bridge + Servo Lock</span>
            </div>

          </div>
        </div>

        {/* Compact Hardware Cards (Grid of Key Components) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {components.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#091122] to-[#050a16] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">{c.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 font-heading">
                    {c.name}
                  </h3>

                  <p className="text-xs font-mono text-cyan-300 font-semibold mb-2">
                    {c.spec}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {c.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
