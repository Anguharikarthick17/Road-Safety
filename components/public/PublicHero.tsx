'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  MapPin, Shield, Clock, Navigation, ChevronDown,
  MessageCircle, Phone, Share2, Activity, Wifi, CheckCircle2, Radio
} from 'lucide-react';

const statusBadges = [
  { icon: Shield,     label: 'Verified Partners', color: '#1d4ed8' },
  { icon: Navigation, label: 'GPS Enabled',       color: '#16a34a' },
  { icon: Clock,      label: '24×7 Service',      color: '#2563eb' },
  { icon: MapPin,     label: 'Fast ETA',          color: '#f59e0b' },
];

const stats = [
  { value: '15 min',   label: 'Avg Response' },
  { value: '12,000+',  label: 'Emergencies Resolved' },
  { value: '200+',     label: 'City Coverage' },
  { value: '4.9 ★',   label: 'Avg Rating' },
];

export default function PublicHero() {
  const [mounted, setMounted] = useState(false);
  const [gpsShared, setGpsShared] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const handleShareLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
      setGpsShared(true);
    });
  };

  const handleWhatsApp = () => {
    const loc = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : 'Location not shared';
    const msg = `🚨 *RoadSOS Emergency Alert*\n\n📍 *Live Location:*\n${loc}\n\n⏱️ Requested at: ${new Date().toLocaleTimeString('en-IN')}\n\n_Sent via RoadSOS NSER Platform_`;
    window.open(`https://wa.me/918072522246?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  });

  return (
    <section id="hero" style={{
      minHeight: '92vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: `radial-gradient(ellipse at 30% 40%, rgba(29,78,216,0.09) 0%, transparent 60%),
                   radial-gradient(ellipse at 75% 20%, rgba(37,99,235,0.06) 0%, transparent 60%),
                   radial-gradient(ellipse at 50% 80%, rgba(22,163,74,0.05) 0%, transparent 60%),
                   linear-gradient(160deg, #020617 0%, #0f172a 100%)`,
      paddingTop: '80px',
    }}>
      {/* Background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '2%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(29,78,216,0.05)', filter: 'blur(120px)', animation: 'heroFloat 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '2%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(22,163,74,0.04)', filter: 'blur(110px)', animation: 'heroFloat 15s ease-in-out infinite reverse' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.02, backgroundImage: 'linear-gradient(rgba(148,163,184,1) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Radar rings */}
        {mounted && [1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: `${i * 200}px`, height: `${i * 200}px`, borderRadius: '50%',
            border: `1px solid rgba(29,78,216,${0.05 - i * 0.012})`,
            animation: `ringExpand ${4 + i}s ease-in-out infinite ${i * 1}s`,
          }} />
        ))}
      </div>

      {/* Emergency pulse dot */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 12px rgba(220,38,38,0.6)', animation: 'emergencyPulse 2.5s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', padding: '80px 32px 48px', textAlign: 'center', width: '100%' }}>

        {/* Top badge */}
        <motion.div {...fade(0.1)} style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '6px', padding: '6px 18px',
            fontSize: '11px', fontWeight: 700, color: '#fca5a5',
            letterSpacing: '0.09em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', display: 'inline-block', animation: 'emergencyPulse 1.8s ease-in-out infinite', flexShrink: 0 }} />
            <Radio size={11} />
            AI Emergency Response · 24×7 Active
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fade(0.2)} style={{
          fontSize: 'clamp(32px,5.5vw,62px)', fontWeight: 900,
          color: '#ffffff', lineHeight: 1.08, marginBottom: '16px', letterSpacing: '-2px',
        }}>
          24×7 Smart Emergency
          <span style={{
            display: 'block', marginTop: '4px',
            background: 'linear-gradient(135deg, #93c5fd 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Assistance
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p {...fade(0.3)} style={{
          color: '#64748b', fontSize: 'clamp(14px,1.7vw,16px)',
          maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.8, fontWeight: 400,
        }}>
          Fast roadside emergency response with{' '}
          <span style={{ color: '#93c5fd', fontWeight: 500 }}>live GPS tracking</span>{' '}
          and AI-powered accident management.
        </motion.p>

        {/* GPS shared info */}
        {gpsShared && lat && lng && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)',
              borderRadius: '6px', padding: '8px 16px',
              fontSize: '12px', color: '#86efac', fontWeight: 500, marginBottom: '20px',
            }}
          >
            <CheckCircle2 size={14} color="#16a34a" />
            Location shared · {lat.toFixed(4)}, {lng.toFixed(4)}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div {...fade(0.4)} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '14px 28px', borderRadius: '9px', background: '#16a34a', border: 'none', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(22,163,74,0.3)', transition: 'all 0.25s' }}
          >
            <MessageCircle size={18} /> WhatsApp SOS
          </motion.button>

          <motion.a
            href="tel:+918072522246"
            whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(29,78,216,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '14px 28px', borderRadius: '9px', background: '#1d4ed8', border: '1px solid rgba(29,78,216,0.5)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 14px rgba(29,78,216,0.25)', transition: 'all 0.25s' }}
          >
            <Phone size={18} /> Call Emergency
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShareLocation}
            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '14px 24px', borderRadius: '9px', background: gpsShared ? 'rgba(22,163,74,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${gpsShared ? 'rgba(22,163,74,0.35)' : 'rgba(255,255,255,0.12)'}`, color: gpsShared ? '#86efac' : '#94a3b8', fontWeight: 600, fontSize: '15px', cursor: 'pointer', transition: 'all 0.25s' }}
          >
            <Share2 size={18} /> {gpsShared ? 'Location Shared' : 'Share Live Location'}
          </motion.button>
        </motion.div>

        {/* Status badges */}
        <motion.div {...fade(0.5)} style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {statusBadges.map(({ icon: Icon, label, color }) => (
            <div key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f1f5f9', border: '1px solid #e2e8f0',
              borderRadius: '6px', padding: '6px 14px',
              fontSize: '12px', fontWeight: 500, color: '#64748b',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
              <Icon size={11} color={color} />
              {label}
            </div>
          ))}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#86efac' }}>
            <Activity size={11} /> All Systems Operational
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div {...fade(0.6)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(15,23,42,0.6)', border: '1px solid #e2e8f0',
          borderRadius: '12px', overflow: 'hidden', backdropFilter: 'blur(16px)',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              textAlign: 'center', padding: '20px 8px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{
                fontSize: '22px', fontWeight: 900,
                background: 'linear-gradient(135deg, #93c5fd, #1d4ed8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '11px', marginTop: '5px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', color: '#334155', cursor: 'pointer' }}
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown size={22} />
      </motion.div>

      <style>{`
        @keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes emergencyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes ringExpand { 0%{opacity:0.5;transform:translate(-50%,-50%) scale(0.8)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)} }
      `}</style>
    </section>
  );
}
