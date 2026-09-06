import React, { useState, useEffect } from 'react';
import { Shield, Activity, Radio, Cpu, Menu, X, Terminal, ChevronRight } from 'lucide-react';

export default function Navbar({ onOpenDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Problem', href: '#problem' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pipeline', href: '#pipeline' },
    { name: 'Hardware', href: '#hardware' },
    { name: 'Sensor Fusion', href: '#sensor-fusion' },
    { name: 'Live Dashboard', href: '#live-dashboard' },
    { name: 'Fail-Safe', href: '#fail-safe' },
    { name: '30m Demo', href: '#channel-demo' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Budget', href: '#budget' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050811]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-gradient-to-b from-[#050811] to-transparent border-b border-transparent'
      }`}
    >
      {/* Top Telemetry Ticker */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-[#09101f] text-[11px] font-mono border-b border-cyan-950/60 text-slate-400">
        <div className="flex items-center space-x-6">
          <span className="flex items-center text-cyan-400">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SIH ENGINEERING DEMO: TESTBED VALIDATED (20–30M)
          </span>
          <span className="text-slate-500">|</span>
          <span>CHASSIS: CYLINDRICAL (90mm OD)</span>
          <span className="text-slate-500">|</span>
          <span>COMPUTE: ESP32 DUAL-CORE (240MHz)</span>
          <span className="text-slate-500">|</span>
          <span>ESTIMATED BOM: ₹7,750 (TARGET &lt; ₹10k)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-emerald-400 flex items-center">
            <Radio className="w-3 h-3 mr-1 animate-pulse" /> SENSOR FUSION ENGINE: ACTIVE
          </span>
          <span className="text-slate-600">ID: AQ-SHIELD-V1</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Branding */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl md:text-2xl font-extrabold tracking-wider text-white font-heading">
                  AQUA<span className="text-cyan-400">-SHIELD</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 hidden sm:inline-block">
                  PROTOTYPE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight font-mono -mt-1 hidden sm:block">
                FIRST-RESPONSE DRAIN INSPECTION SYSTEM
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/40 px-2.5 py-1.5 rounded-md transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="#live-dashboard"
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-lg hover:from-cyan-300 hover:to-cyan-200 transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.4)] group overflow-hidden"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Live Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070c18] border-b border-cyan-500/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs rounded-md bg-slate-900/60 border border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800">
            <a
              href="#live-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Activity className="w-4 h-4 mr-2" /> Launch Live Dashboard Simulation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
