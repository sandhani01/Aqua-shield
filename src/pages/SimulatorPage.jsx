import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import LiveDashboard from '../components/LiveDashboard';
import Footer from '../components/Footer';

export default function SimulatorPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <div className="pt-20">
        <LiveDashboard />
      </div>
      <Footer />
    </div>
  );
}
