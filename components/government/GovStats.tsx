'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TriangleAlert, CheckCircle, Clock, BarChart3, TrendingUp,
  Activity, ArrowUp, ArrowDown
} from 'lucide-react';
import { govStats } from '@/lib/mockData';

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: string;
  bg: string;
  border: string;
  icon: typeof TriangleAlert;
}

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1800 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

const cards: StatCard[] = [
  { label: 'Total Accidents', value: 2847, sub: 'All time recorded', trend: 'up', trendValue: '8.3% vs last year', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.22)', icon: TriangleAlert },
  { label: 'Solved Cases', value: 2614, sub: '91.8% resolution rate', trend: 'up', trendValue: '+4.2% efficiency', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.22)', icon: CheckCircle },
  { label: 'Pending Cases', value: 233, sub: 'Under investigation', trend: 'down', trendValue: '-12 from last month', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)', icon: Clock },
  { label: 'This Month', value: 214, sub: 'May 2026', trend: 'down', trendValue: '-6.5% vs April', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.22)', icon: BarChart3 },
  { label: 'Yearly Trend', value: govStats.yearlyTrend, sub: 'Compared to 2024', trend: 'up', trendValue: 'Road infrastructure issue', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.22)', icon: TrendingUp },
  { label: 'Response Rate', value: govStats.responseRate, sub: 'Emergency dispatch SLA', trend: 'up', trendValue: '+2.1% improvement', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.22)', icon: Activity },
];

export default function GovStats() {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          const isNumeric = typeof card.value === 'number';
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                background: `linear-gradient(135deg, ${card.bg}, rgba(255,255,255,0.02))`,
                border: `1px solid ${card.border}`,
                borderRadius: '18px', padding: '22px 20px',
                position: 'relative', overflow: 'hidden',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: card.bg, filter: 'blur(30px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '11px',
                  background: card.bg, border: `1px solid ${card.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={card.color} />
                </div>
                {card.trend && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    padding: '2px 8px', borderRadius: '6px',
                    background: card.trend === 'up' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: card.trend === 'up' ? '#4ade80' : '#f87171',
                    fontSize: '10px', fontWeight: 700,
                  }}>
                    {card.trend === 'up' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  </div>
                )}
              </div>
              <div style={{ color: card.color, fontWeight: 900, fontSize: '30px', lineHeight: 1, marginBottom: '5px' }}>
                {isNumeric ? <AnimatedCounter target={card.value as number} /> : card.value}
              </div>
              <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>{card.label}</div>
              <div style={{ color: '#475569', fontSize: '11px', lineHeight: 1.4 }}>{card.sub}</div>
              {card.trendValue && (
                <div style={{
                  marginTop: '10px', padding: '5px 8px', borderRadius: '7px',
                  background: '#f8fafc', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#475569', fontSize: '10px', fontWeight: 500,
                }}>
                  {card.trendValue}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
