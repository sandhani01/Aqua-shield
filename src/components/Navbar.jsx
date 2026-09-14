import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowLeft, Radio } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isRobot = location.pathname === '/robot' || location.pathname === '/live-robot';
  const isSubpage = isRobot;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Problem', href: '#problem' },
    { name: 'Solution', href: '#solution' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Impact', href: '#impact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
          ? 'bg-[#050811]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
          : 'bg-[#050811]/80 backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                AQUA<span className="text-cyan-400">-SHIELD</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const targetHref = isSubpage ? `/${link.href}` : link.href;
              return (
                <a
                  key={link.name}
                  href={targetHref}
                  className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA: Live Robot */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {isRobot ? (
              <Link
                to="/"
                className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                <span>Overview</span>
              </Link>
            ) : (
              <Link
                to="/robot"
                className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-105"
              >
                <Radio className="w-3.5 h-3.5 mr-1.5 text-cyan-400 animate-pulse" />
                <span>Live Robot</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((link) => {
              const targetHref = isSubpage ? `/${link.href}` : link.href;
              return (
                <a
                  key={link.name}
                  href={targetHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white hover:border-cyan-500/40 transition-colors text-center"
                >
                  {link.name}
                </a>
              );
            })}
          </div>
          
          <div className="flex justify-center">
            {isRobot ? (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span>Overview</span>
              </Link>
            ) : (
              <Link
                to="/robot"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 rounded-xl transition-all"
              >
                <Radio className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span>Live Robot</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
