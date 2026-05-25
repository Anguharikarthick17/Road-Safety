'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clock, MapPin, Zap, Navigation, AlertCircle } from 'lucide-react';

const partners = [
  { name: 'RajeshMech Auto Services', distance: '1.2 km', eta: '8 min', rating: 4.9, jobs: 1240 },
  { name: 'SpeedFix Roadside', distance: '2.1 km', eta: '12 min', rating: 4.8, jobs: 890 },
  { name: 'QuickHelp Motors', distance: '3.4 km', eta: '18 min', rating: 4.7, jobs: 2100 },
];

export default function ETAWidget() {
  const [active, setActive] = useState(0);
  const [eta, setEta] = useState(15);

  useEffect(() => {
    const i1 = setInterval(() => setActive(p => (p + 1) % partners.length), 4000);
    const i2 = setInterval(() => setEta(d => d > 1 ? d - 1 : 15), 8000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);

  return (
    <section style={{ padding: '80px 0', background: '#f8fafc', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-badge" style={{ marginBottom: '16px', display: 'inline-flex' }}><Navigation size={13} /> Live ETA</span>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, color: '#0f172a', marginBottom: '10px', letterSpacing: '-1px' }}>
            Nearest Partners — <span style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ready Now</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Real-time availability of verified assistance partners near you</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* ETA Dashboard */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Radar rings */}
            {[70,130,190,250].map((s,i) => (
              <div key={i} style={{ position: 'absolute', width: `${s}px`, height: `${s}px`, borderRadius: '50%', border: '1px solid rgba(59,130,246,0.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            ))}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '12px', justifyContent: 'center' }}>
                <AlertCircle size={13} color="#ef4444" /> Emergency Response Time
              </div>
              <motion.div key={eta} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '42px', fontWeight: 900, background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {eta} min
              </motion.div>
              <div style={{ color: '#475569', fontSize: '13px', marginTop: '6px' }}>Average ETA nationwide</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', padding: '8px 18px', borderRadius: '100px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>47 units active nearby</span>
              </div>
            </div>
          </motion.div>

          {/* Partner list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 2' }}>
            {partners.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setActive(i)} whileHover={{ scale: 1.01 }}
                style={{ background: active === i ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active === i ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', padding: '20px 24px', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(6,182,212,0.2))', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>{p.name[0]}</div>
                    <div>
                      <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {p.distance}</span>
                        <span>·</span>
                        <span style={{ color: '#fbbf24' }}>★ {p.rating}</span>
                        <span>·</span>
                        <span>{p.jobs.toLocaleString()} jobs</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#06b6d4', fontWeight: 700, fontSize: '18px' }}><Clock size={15} />{p.eta}</div>
                      <div style={{ color: '#475569', fontSize: '11px' }}>ETA</div>
                    </div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      <Zap size={13} /> Dispatch
                    </motion.button>
                  </div>
                </div>
                {active === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4ade80', fontWeight: 500 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                    En route to 3 customers — Next available in 4 min
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
