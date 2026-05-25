'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MapPin, Shield, Clock, Navigation, ChevronDown } from 'lucide-react';

const statusBadges = [
  { icon: Shield, label: 'Verified Partners' },
  { icon: Navigation, label: 'GPS Enabled' },
  { icon: Clock, label: '24x7 Service' },
  { icon: MapPin, label: 'Fast ETA' },
];

const stats = [
  { value: '15 min', label: 'Avg Response' },
  { value: '5,000+', label: 'Happy Drivers' },
  { value: '200+', label: 'City Coverage' },
  { value: '4.9 ★', label: 'Avg Rating' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  });

  return (
    <section id="hero" style={{
      minHeight: '88vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at 30% 40%, rgba(59,130,246,0.09) 0%, transparent 55%),
                   radial-gradient(ellipse at 75% 20%, rgba(6,182,212,0.06) 0%, transparent 55%),
                   #020409`,
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(6,182,212,0.04)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.015, backgroundImage: 'linear-gradient(rgba(99,179,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', padding: '80px 32px 48px', textAlign: 'center', width: '100%' }}>

        {/* Top badge */}
        <motion.div {...fade(0.1)} style={{ marginBottom: '28px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '100px', padding: '6px 18px',
            fontSize: '11px', fontWeight: 700, color: '#60a5fa',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 2s infinite', flexShrink: 0 }} />
            Emergency Roadside Assistance · 24x7
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fade(0.2)} style={{
          fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 900,
          color: '#0f172a', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-1.5px',
        }}>
          Stuck on the road?
          <span style={{
            display: 'block', marginTop: '4px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 60%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            We&apos;ll reach you fast.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p {...fade(0.3)} style={{
          color: '#64748b', fontSize: 'clamp(14px, 1.8vw, 16px)',
          maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.8, fontWeight: 400,
        }}>
          24×7 assistance for{' '}
          <span style={{ color: '#93c5fd' }}>Battery</span>,{' '}
          <span style={{ color: '#67e8f9' }}>Fuel</span>,{' '}
          <span style={{ color: '#a5b4fc' }}>Tyre</span> &{' '}
          <span style={{ color: '#86efac' }}>Towing</span>{' '}
          — dispatched to your GPS location instantly.
        </motion.p>

        {/* Status badges */}
        <motion.div {...fade(0.4)} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
          {statusBadges.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: '#f1f5f9', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '100px', padding: '7px 14px',
              fontSize: '12px', fontWeight: 500, color: '#64748b',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.8)', display: 'inline-block', flexShrink: 0 }} />
              <Icon size={12} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div {...fade(0.5)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: '16px', backdropFilter: 'blur(20px)', overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center', padding: '18px 8px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{
                fontSize: '20px', fontWeight: 800,
                background: 'linear-gradient(135deg,#60a5fa,#06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll arrow */}
      <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', color: '#1e3a5f' }}>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
