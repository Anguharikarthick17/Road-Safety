'use client';

import RoleGuard from '@/components/shared/RoleGuard';
import DashboardNavbar from '@/components/shared/DashboardNavbar';
import AIAlerts from '@/components/officer/AIAlerts';
import StatsBar from '@/components/officer/StatsBar';
import LiveFeed from '@/components/officer/LiveFeed';
import MapPanel from '@/components/officer/MapPanel';
import NotificationPanel from '@/components/officer/NotificationPanel';
import { motion } from 'framer-motion';

function OfficerDashboardContent() {
  return (
    <div style={{ minHeight: '100vh', background: '#060814', overflowX: 'hidden', color: '#f8fafc' }}>
      <DashboardNavbar notificationCount={5} theme="dark" />

      {/* Background glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(29,78,216,0.08)', filter: 'blur(140px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(220,38,38,0.06)', filter: 'blur(140px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(59,130,246,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.15) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '28px 24px' }}
      >
        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)',
              borderRadius: '6px', padding: '4px 14px',
              fontSize: '10px', fontWeight: 700, color: '#f87171', letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: '0 0 12px rgba(220,38,38,0.15)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'liveDot 1.8s ease-in-out infinite', display: 'inline-block' }} />
              Emergency Command Center
            </div>
          </div>
          <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: 'clamp(22px,3vw,32px)', letterSpacing: '-1px', margin: 0 }}>
            Officer Command Center
            <span style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> — Live Operations</span>
          </h1>
        </div>

        {/* AI Alerts banner */}
        <AIAlerts />

        {/* Stats bar */}
        <StatsBar />

        {/* Main grid: LiveFeed + Right panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start',
        }} className="officer-grid">
          {/* Left: Live Feed */}
          <div>
            <LiveFeed />
          </div>

          {/* Right: Map + Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <MapPanel />
            <NotificationPanel />
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @media (max-width: 1024px) {
          .officer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function OfficerPage() {
  return (
    <RoleGuard requiredRole="officer">
      <OfficerDashboardContent />
    </RoleGuard>
  );
}
