import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Anchor, 
  AlertTriangle, 
  ArrowDown, 
  ZapOff, 
  BatteryLow, 
  Compass, 
  RadioTower, 
  UserX, 
  CheckCircle2, 
  Waves 
} from 'lucide-react';

export default function FailSafeSection() {
  const [selectedTrigger, setSelectedTrigger] = useState(0);

  const loopSteps = [
    {
      id: "normal",
      stepNum: "01",
      title: "NORMAL",
      badge: "STEADY STATE",
      desc: "Capsule advances forward under nominal motor current and laminar stormwater runoff. Odometry logs distance.",
      color: "border-emerald-500 bg-emerald-950/40 text-emerald-400"
    },
    {
      id: "abnormal",
      stepNum: "02",
      title: "ABNORMAL CONDITION",
      badge: "FAULT DETECTED",
      desc: "Anomalous threshold breached: motor overload, sudden flash surge, tilt anomaly, or low battery voltage.",
      color: "border-amber-500 bg-amber-950/40 text-amber-400"
    },
    {
      id: "stop",
      stepNum: "03",
      title: "STOP",
      badge: "IMMEDIATE CUTOFF",
      desc: "ESP32 cuts thruster PWM to 0% within 20 milliseconds to prevent propeller cavitation or motor burnout.",
      color: "border-red-500 bg-red-950/40 text-red-400"
    },
    {
      id: "anchor",
      stepNum: "04",
      title: "ANCHOR",
      badge: "HYDRAULIC LOCK",
      desc: "Metal-gear waterproof servo releases folding titanium anchor flukes, locking capsule position against the culvert bed.",
      color: "border-cyan-500 bg-cyan-950/40 text-cyan-400"
    },
    {
      id: "controlled-return",
      stepNum: "05",
      title: "CONTROLLED RETURN",
      badge: "SAFE RETRIEVAL",
      desc: "Ground reel winches high-tensile (50kg rated) tether back to manhole. Full sensor logs preserved.",
      color: "border-blue-500 bg-blue-950/40 text-blue-400"
    }
  ];

  const triggers = [
    {
      title: "High Water Flow",
      icon: Waves,
      threshold: "> 35 L/min Sudden Inundation",
      response: "Locks position to prevent capsule from being swept uncontrollably downline."
    },
    {
      title: "Motor Overload",
      icon: ZapOff,
      threshold: "> 850 mA Silt Entanglement",
      response: "Shuts off drive H-bridge immediately to prevent motor coil burnout."
    },
    {
      title: "Low Battery",
      icon: BatteryLow,
      threshold: "< 15% Battery Reserve",
      response: "Autonomous auto-return command issued before MCU loses power."
    },
    {
      title: "Abnormal Movement",
      icon: Compass,
      threshold: "> 15° Pitch Tilt or Gyro Roll",
      response: "Halts forward motion to avoid wedging between conduit irregularities."
    },
    {
      title: "Operator Abort",
      icon: UserX,
      threshold: "Manual GUI Abort Command",
      response: "Instant emergency brake override triggered from surface control station."
    },
    {
      title: "Communication Problem",
      icon: RadioTower,
      threshold: "> 3000ms Heartbeat Timeout",
      response: "Failsafe timer engages anchor and prepares tether reel recovery."
    }
  ];

  return (
    <section id="fail-safe" className="relative py-20 md:py-28 bg-[#070c18] border-t border-cyan-950/80">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECTION 07 // FAIL-SAFE RECOVERY LOOP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading">
            Designed to <span className="text-cyan-400">Come Back</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            In hazardous flooded environments, getting stuck is catastrophic. AQUA-SHIELD treats return capability not as an afterthought, but as the foundational engineering constraint.
          </p>
        </div>

        {/* Five-Stage Fail-Safe Loop: NORMAL -> ABNORMAL -> STOP -> ANCHOR -> RETURN */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Autonomous Failsafe Sequence (Hardware State Transition)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
            {loopSteps.map((s, idx) => (
              <div key={s.id} className="relative flex flex-col">
                <div className={`p-4 rounded-xl border ${s.color} h-full flex flex-col justify-between backdrop-blur-sm shadow-lg hover:scale-105 transition-transform`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold">{s.stepNum}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white font-heading mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>

                {idx < loopSteps.length - 1 && (
                  <div className="my-1 lg:my-0 lg:absolute lg:top-1/2 lg:-right-2.5 lg:-translate-y-1/2 z-20 flex justify-center text-slate-500">
                    <ArrowDown className="w-3.5 h-3.5 lg:-rotate-90 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emphasized Quote Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d172e] via-[#091122] to-[#0d172e] border border-cyan-500/40 text-center my-10 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <blockquote className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight italic">
            “Recoverability is part of the design.”
          </blockquote>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Traditional crawlers often become expensive underground liabilities when wheels get stuck. AQUA-SHIELD’s passive tether tension + active servo anchor ensures guaranteed physical retrieval under any circumstance.
          </p>
        </div>

        {/* Six Possible Trigger Conditions Grid */}
        <div>
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              6 Deterministic Failsafe Triggers Monitored Concurrently
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {triggers.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {t.title}
                      </h4>
                      <div className="text-[11px] font-mono text-amber-400 mt-0.5">
                        TRIGGER: {t.threshold}
                      </div>
                      <p className="mt-1 text-xs text-slate-300 leading-snug">
                        {t.response}
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
