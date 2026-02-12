import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { ProposerDashboard } from './pages/ProposerDashboard';
import { VoterDashboard } from './pages/VoterDashboard';
import { useApp } from './context/AppContext';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, isLoading } = useApp();

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />; // Redirect if wrong role

  return children;
}

function App() {
  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <VoterDashboard />
            </ProtectedRoute>
        } />
        <Route path="/create" element={
            <ProtectedRoute role="PROPOSER">
                <ProposerDashboard />
            </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
