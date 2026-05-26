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

export default function DashboardNavbar({ notificationCount = 0, theme = 'light' }: { notificationCount?: number; theme?: 'light' | 'dark' }) {
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

  const isDark = theme === 'dark';
  const navBg = isDark ? '#0b111e' : '#ffffff';
  const borderBottomColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';
  const shadow = isDark ? '0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(29,78,216,0.06)' : '0 2px 8px rgba(0,0,0,0.06)';
  
  const logoTitleColor = isDark ? '#ffffff' : '#0f172a';
  const logoSubColor = isDark ? '#94a3b8' : '#64748b';
  const timeColor = isDark ? '#cbd5e1' : '#64748b';
  const backBtnBg = isDark ? 'rgba(30, 41, 59, 0.45)' : '#f8fafc';
  const backBtnBorder = isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1';
  const backBtnText = isDark ? '#cbd5e1' : '#334155';
  const bellBg = isDark ? 'rgba(30, 41, 59, 0.45)' : '#f8fafc';
  const bellBorder = isDark ? 'rgba(255, 255, 255, 0.15)' : '#e2e8f0';
  const bellColor = isDark ? '#94a3b8' : '#64748b';

  const roleBadgeBg = isDark ? 'rgba(220, 38, 38, 0.15)' : cfg?.bg;
  const roleBadgeBorder = isDark ? 'rgba(220, 38, 38, 0.35)' : cfg?.border;
  const roleBadgeText = isDark ? '#f87171' : cfg?.color;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'sticky', top: 0, zIndex: 9999, background: navBg, borderBottom: `1px solid ${borderBottomColor}`, boxShadow: shadow }}
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
              border: `1px solid ${backBtnBorder}`,
              color: backBtnText,
              fontSize: '12px',
              fontWeight: 600,
              background: backBtnBg,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? 'rgba(30, 41, 59, 0.7)' : '#f1f5f9';
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.25)' : '#94a3b8';
              e.currentTarget.style.color = isDark ? '#ffffff' : '#0f172a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = backBtnBg;
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : backBtnBorder;
              e.currentTarget.style.color = backBtnText;
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
              <div style={{ color: logoSubColor, fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>NSER Platform</div>
              <span style={{ color: logoTitleColor, fontWeight: 800, fontSize: '15px', letterSpacing: '-0.3px' }}>
                Road<span style={{ color: '#1d4ed8' }}>SOS</span>
              </span>
            </div>
          </a>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {cfg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: roleBadgeBg, border: `1px solid ${roleBadgeBorder}`, borderRadius: '6px', padding: '5px 12px' }}>
              <RoleIcon size={12} color={roleBadgeText} />
              <span style={{ color: roleBadgeText, fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{cfg.label} Dashboard</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: timeColor, fontSize: '12px', fontFamily: 'monospace' }}>
            <Clock size={11} color={isDark ? '#4b5563' : '#94a3b8'} />
            <span>{time}</span>
            <span style={{ color: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', margin: '0 2px' }}>·</span>
            <span style={{ color: timeColor }}>{date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', border: isDark ? '1px solid rgba(34,197,94,0.3)' : '1px solid #bbf7d0', borderRadius: '6px', padding: '4px 10px' }}>
            <Activity size={11} color="#16a34a" />
            <span style={{ color: '#16a34a', fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em' }}>LIVE</span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '8px', background: bellBg, border: bellBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: bellColor }}>
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
