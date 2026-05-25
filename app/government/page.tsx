'use client';

import RoleGuard from '@/components/shared/RoleGuard';
import DashboardNavbar from '@/components/shared/DashboardNavbar';
import GovStats from '@/components/government/GovStats';
import AccidentCharts from '@/components/government/AccidentCharts';
import HeatmapPanel from '@/components/government/HeatmapPanel';
import ReportPanel from '@/components/government/ReportPanel';
import SmartInsights from '@/components/government/SmartInsights';
import { motion } from 'framer-motion';

function GovDashboardContent() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden' }}>
      <DashboardNavbar notificationCount={3} />

      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(22,163,74,0.04)', filter: 'blur(130px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(29,78,216,0.04)', filter: 'blur(130px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'rgba(37,99,235,0.03)', filter: 'blur(130px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 24px' }}
      >
        {/* Page title */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.22)',
              borderRadius: '6px', padding: '4px 14px',
              fontSize: '10px', fontWeight: 700, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)', animation: 'liveDot 1.8s ease-in-out infinite', display: 'inline-block' }} />
              Smart City Analytics
            </div>
          </div>
          <h1 style={{ color: '#0f172a', fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '-1px', margin: 0 }}>
            Government Analytics Hub
            <span style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> — Smart City Intelligence</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '13px', marginTop: '6px' }}>
            Tamil Nadu Emergency Response Analytics · AI-Powered Predictions
          </p>
        </div>

        {/* Stats cards */}
        <GovStats />

        {/* Charts grid */}
        <AccidentCharts />

        {/* Bottom grid: Heatmap + Insights + Reports */}
        <div style={{ marginBottom: '28px' }}>
          <HeatmapPanel />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
          gap: '20px',
        }} className="gov-bottom-grid">
          <SmartInsights />
          <ReportPanel />
        </div>
      </motion.div>

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @media (max-width: 1024px) {
          .gov-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .gov-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function GovernmentPage() {
  return (
    <RoleGuard requiredRole="government">
      <GovDashboardContent />
    </RoleGuard>
  );
}
