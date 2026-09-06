import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import PipelineSection from './components/PipelineSection';
import HardwareSection from './components/HardwareSection';
import SensorFusionSection from './components/SensorFusionSection';
import LiveDashboard from './components/LiveDashboard';
import FailSafeSection from './components/FailSafeSection';
import ChannelSimulation from './components/ChannelSimulation';
import ComparisonSection from './components/ComparisonSection';
import UseCasesSection from './components/UseCasesSection';
import PrototypeSection from './components/PrototypeSection';
import BudgetSection from './components/BudgetSection';
import RoadmapSection from './components/RoadmapSection';
import ResearchGapSection from './components/ResearchGapSection';
import TeamSection from './components/TeamSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <PipelineSection />
        <HardwareSection />
        <SensorFusionSection />
        <LiveDashboard />
        <FailSafeSection />
        <ChannelSimulation />
        <ComparisonSection />
        <UseCasesSection />
        <PrototypeSection />
        <BudgetSection />
        <RoadmapSection />
        <ResearchGapSection />
        <TeamSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
