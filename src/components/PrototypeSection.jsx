import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function PrototypeSection() {
  const specs = [
    { name: 'Optical Vision Port', spec: 'OV2640 / Wide-Angle 120° low-light camera with anti-fog acrylic dome' },
    { name: 'Active Illumination', spec: '12-LED 5000K high-lumen ring with PWM brightness regulation' },
    { name: 'Cylindrical Enclosure', spec: '90mm OD cast acrylic hull with silicone dual O-ring compression seals' },
    { name: 'Propulsion Assembly', spec: 'Dual shrouded DC thrusters with debris-filtering intake grilles' },
    { name: 'Power Architecture', spec: '2S2P 7.4V 4400mAh Li-ion battery pack with integrated BMS cutoff' },
    { name: 'Compute Controller', spec: '240MHz dual-core ESP32 executing deterministic sensor fusion logic' },
    { name: 'Sensor Array', spec: 'MPU6050 6-Axis IMU, ACS712 Current, Hall Flow Sensor, and Rotary Encoder' },
    { name: 'Physical Tether Line', spec: '30m high-tensile (50kg rated) braided cord with signal conductors' },
    { name: 'Mechanical Anchor', spec: 'Waterproof metal-gear servo actuated articulated recovery anchor' }
  ];

  return (
    <section id="prototype" className="py-16 md:py-24 bg-[#090d16] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Prototype Architecture & Specifications
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Constructed with precision-machined acrylic and commercial off-the-shelf mechatronics for rapid fabrication, low maintenance, and repeatable testbed demonstration.
          </p>
        </div>

        {/* 9 Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 font-semibold text-white mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {item.spec}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
