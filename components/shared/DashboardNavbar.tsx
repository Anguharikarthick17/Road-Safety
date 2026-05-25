'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, Bell, Shield, BarChart2, Clock, UserCircle, Activity } from 'lucide-react';
import { logout, getRole, type Role } from '@/lib/auth';

const roleConfig: Record<Role, { label: string; color: string; bg: string; border: string; icon: typeof Shield }> = {
  officer:    { label: 'Officer',    color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: Shield },
  government: { label: 'Government', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: BarChart2 },
  public:     { label: 'Public',     color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', icon: UserCircle },
};

export default function DashboardNavbar({ notificationCount = 0 }: { notificationCount?: number }) {
  const router = useRouter();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    setRole(getRole());
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => { logout(); router.replace('/'); };
  const cfg = role ? roleConfig[role] : null;
  const RoleIcon = cfg?.icon ?? Shield;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'sticky', top: 0, zIndex: 9999, background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Gov blue top line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #1e3a8a, #1d4ed8, #2563eb)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Back Button */}
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              background: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <ArrowLeft size={13} /> Back
          </button>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(29,78,216,0.25)' }}>
              <Shield size={16} color="white" />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>NSER Platform</div>
              <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px' }}>
                Road<span style={{ color: '#1d4ed8' }}>SOS</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {cfg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '6px', padding: '5px 12px' }}>
              <RoleIcon size={12} color={cfg.color} />
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{cfg.label} Dashboard</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>
            <Clock size={11} color="#94a3b8" />
            <span>{time}</span>
            <span style={{ color: '#e2e8f0', margin: '0 2px' }}>·</span>
            <span style={{ color: '#64748b' }}>{date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '4px 10px' }}>
            <Activity size={11} color="#16a34a" />
            <span style={{ color: '#16a34a', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em' }}>LIVE</span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={15} />
            </button>
            {notificationCount > 0 && (
              <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'white' }}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </div>
            )}
          </div>
          <motion.button onClick={handleLogout} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '7px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={12} /> Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
