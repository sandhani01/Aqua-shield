import React from 'react';
import { 
  Waves, 
  ZapOff, 
  BatteryLow, 
  Compass, 
  UserX, 
  RadioTower
} from 'lucide-react';

export default function FailSafeSection() {
  const loopSteps = [
    {
      stepNum: "01",
      title: "Normal Transit",
      desc: "Capsule moves through the culvert logging odometry and streaming telemetry.",
    },
    {
      stepNum: "02",
      title: "Fault Detected",
      desc: "Sensor anomaly threshold reached: motor spike, flood surge, or tilt anomaly.",
    },
    {
      stepNum: "03",
      title: "Instant Stop",
      desc: "ESP32 cuts thruster power within 20ms to prevent cavitation or motor burnout.",
    },
    {
      stepNum: "04",
      title: "Deploy Anchor",
      desc: "Waterproof servo locks folding anchor flukes against the culvert bed.",
    },
    {
      stepNum: "05",
      title: "Controlled Return",
      desc: "Tether line is winched back to the surface entry point with complete logs.",
    }
  ];

  const triggers = [
    {
      title: "High Water Flow",
      icon: Waves,
      threshold: "> 35 L/min Surge",
      desc: "Prevents capsule from being swept away downline during sudden stormwater runoff."
    },
    {
      title: "Motor Overload",
      icon: ZapOff,
      threshold: "> 850 mA Current",
      desc: "Immediately halts drive H-bridge to avoid motor overheating or coil damage."
    },
    {
      title: "Low Battery",
      icon: BatteryLow,
      threshold: "< 15% Capacity",
      desc: "Issues automated return command before onboard microcontroller loses power."
    },
    {
      title: "Abnormal Tilt",
      icon: Compass,
      threshold: "> 15° Pitch/Roll",
      desc: "Halts forward motion to avoid wedging inside irregular conduit cracks."
    },
    {
      title: "Operator Abort",
      icon: UserX,
      threshold: "Manual GUI Command",
      desc: "Emergency brake override triggered instantly from the surface mission control."
    },
    {
      title: "Communication Timeout",
      icon: RadioTower,
      threshold: "> 3000ms Heartbeat",
      desc: "Autonomous failsafe timer engages recovery anchor if signal is interrupted."
    }
  ];

  return (
    <section id="fail-safe" className="py-16 md:py-24 bg-[#090d16] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Fail-Safe Recovery Loop
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            In hazardous flooded drains, getting stuck is unacceptable. AQUA-SHIELD treats return capability as a foundational engineering constraint.
          </p>
        </div>

        {/* 5-Step Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-12">
          {loopSteps.map((step) => (
            <div 
              key={step.stepNum}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between text-xs"
            >
              <div>
                <span className="font-mono text-cyan-400 font-bold text-sm block mb-1">
                  {step.stepNum}
                </span>
                <h3 className="font-semibold text-white mb-1.5 text-sm">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 6 Trigger Conditions */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-slate-300">
              6 Deterministic Failsafe Triggers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {triggers.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {t.title}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400/90 mt-0.5 mb-1">
                        Trigger: {t.threshold}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
