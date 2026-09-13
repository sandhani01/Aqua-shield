import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import PipelineSection from '../components/PipelineSection';
import DashboardGateway from '../components/DashboardGateway';
import ComparisonSection from '../components/ComparisonSection';
import UseCasesSection from '../components/UseCasesSection';
import HardwareSection from '../components/HardwareSection';
import BudgetSection from '../components/BudgetSection';
import RoadmapSection from '../components/RoadmapSection';
import ResearchGapSection from '../components/ResearchGapSection';
import TeamSection from '../components/TeamSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main>
        {/* 1. HERO: First-Response Robot for Flooded Drains */}
        <Hero />

        {/* 2. THE PROBLEM: Urban Flooding, Invisible Chokepoints, Human Risk */}
        <ProblemSection />

        {/* 3. THE SOLUTION: AQUA-SHIELD Goes First */}
        <SolutionSection />

        {/* 4. HOW IT WORKS: 5-Stage Autonomous Operational Sequence */}
        <PipelineSection />

        {/* 5. DEDICATED LIVE TELEMETRY GATEWAY: Launch Standalone Console */}
        <DashboardGateway />

        {/* 7. WHY AQUA-SHIELD? (IMPACT): Safer, Faster, Cheaper, Scalable */}
        <ComparisonSection />

        {/* 8. WHERE IT DEPLOYS: 6 Real-World Municipal Scenarios */}
        <UseCasesSection />

        {/* 9. HOW WE BUILT IT: Hardware Stack & Architecture */}
        <HardwareSection />

        {/* 10. COST & SOURCING: ₹8,250 BOM Breakdown */}
        <BudgetSection />

        {/* 11. ROADMAP: 6-Phase Scalability Progression */}
        <RoadmapSection />

        {/* 12. RESEARCH GAP: Academic & Industrial Differentiation */}
        <ResearchGapSection />

        {/* 13. ENGINEERING TEAM: Multidisciplinary SIH Innovators */}
        <TeamSection />

        {/* 14. FINAL CALL TO ACTION: The Pitch */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
