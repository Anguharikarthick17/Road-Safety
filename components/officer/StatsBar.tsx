'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Car, ShieldCheck, Ambulance, Flame, Activity, TriangleAlert,
  Settings, Bike, MapPin
} from 'lucide-react';
import { officerStats } from '@/lib/mockData';

interface StatCard {
  label: string;
  value: number;
  suffix?: string;
  color: string;
  bg: string;
  border: string;
  icon: typeof Car;
  pulse?: boolean;
}

const cards: StatCard[] = [
  { label: 'Total Accidents Today', value: officerStats.totalAccidents, color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)', icon: TriangleAlert, pulse: true },
  { label: 'Active Alerts', value: officerStats.activeAlerts, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: Activity, pulse: true },
  { label: 'Pending Requests', value: officerStats.pendingRequests, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: Settings },
  { label: 'Solved Cases', value: officerStats.solvedCases, color: '#16a34a', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.2)', icon: ShieldCheck },
  { label: 'Ambulances Active', value: officerStats.ambulancesActive, color: '#dc2626', bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.18)', icon: Ambulance },
  { label: 'Police Units Active', value: officerStats.policeUnitsActive, color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)', border: 'rgba(29,78,216,0.2)', icon: Car },
  { label: 'Fire Rescue Active', value: officerStats.fireRescueActive, color: '#f97316', bg: 'rgba(249,115,22,0.07)', border: 'rgba(249,115,22,0.18)', icon: Flame },
];

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count}</>;
}

export default function StatsBar() {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{
                background: '#ffffff',
                border: `1px solid ${card.border}`,
                borderRadius: '10px', padding: '18px 16px',
                position: 'relative', overflow: 'hidden',
                boxShadow: card.pulse ? `0 4px 14px ${card.color}15` : '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '70px', height: '70px', borderRadius: '50%', background: card.bg, filter: 'blur(20px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: card.bg, border: `1px solid ${card.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={card.color} />
                </div>
                {card.pulse && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: card.color, boxShadow: `0 0 8px ${card.color}`, animation: 'dot 1.5s ease-in-out infinite', display: 'inline-block' }} />
                )}
              </div>
              <div style={{ color: card.color, fontWeight: 900, fontSize: '28px', lineHeight: 1, marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedCounter target={card.value} />
              </div>
              <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.03em', lineHeight: 1.3 }}>{card.label}</div>
            </motion.div>
          );
        })}
      </div>
      <style>{`
        @keyframes statPulse { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.15)} 50%{box-shadow:0 0 30px rgba(239,68,68,0.3)} }
        @keyframes dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
      `}</style>
    </div>
  );
}
