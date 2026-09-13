import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SimulatorPage from './pages/SimulatorPage';
import PhysicalRobotPage from './pages/PhysicalRobotPage';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/robot" element={<PhysicalRobotPage />} />
        <Route path="/live-robot" element={<Navigate to="/robot" replace />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/dashboard" element={<Navigate to="/simulator" replace />} />
        <Route path="/live-dashboard" element={<Navigate to="/simulator" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
