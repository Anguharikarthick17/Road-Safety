'use client';

import { motion } from 'framer-motion';
import { BatteryCharging, Fuel, CircleDot, Truck, ShieldAlert, Settings, Bike, KeyRound } from 'lucide-react';

const services = [
  { icon: BatteryCharging, title: 'Battery Jumpstart', desc: 'Dead battery? Our technicians carry professional jump-start equipment to get you back in minutes.', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', glow: 'rgba(59,130,246,0.3)' },
  { icon: Fuel, title: 'Fuel Delivery', desc: 'Ran out of fuel on the highway? We deliver fuel directly to your location — no need to walk.', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.3)' },
  { icon: CircleDot, title: 'Flat Tyre', desc: 'Puncture or burst tyre? We replace or repair your tyre on-site with certified spare equipment.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', glow: 'rgba(139,92,246,0.3)' },
  { icon: Truck, title: 'Tow Truck', desc: 'Vehicle not starting at all? Our flatbed tow trucks safely transport your car to the nearest workshop.', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)', glow: 'rgba(6,182,212,0.3)' },
  { icon: ShieldAlert, title: 'Accident Help', desc: 'Involved in an accident? We coordinate emergency services, towing, and insurance support.', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', glow: 'rgba(239,68,68,0.3)' },
  { icon: Settings, title: 'Engine Breakdown', desc: 'Car refusing to start or overheating? Our certified mechanics diagnose and fix issues on-spot.', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.3)' },
  { icon: Bike, title: 'Bike Breakdown', desc: 'Two-wheeler troubles? We cover motorcycles and scooters with the same premium 24x7 response.', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', glow: 'rgba(249,115,22,0.3)' },
  { icon: KeyRound, title: 'Car Lockout', desc: "Locked keys inside? Our locksmiths can safely open your vehicle without causing any damage.", color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', glow: 'rgba(236,72,153,0.3)' },
];

export default function Services() {
  return (
    <section id="services" style={{ padding: '96px 0', position: 'relative', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="section-badge" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Settings size={13} /> Our Services
          </span>
          <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#0f172a', margin: '16px 0 20px', letterSpacing: '-1px' }}>
            Every Problem,{' '}
            <span style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Solution</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            From dead batteries to flat tyres — certified professionals ready to help with every roadside situation.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -8, boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 32px ${s.glow}` }}
                style={{
                  background: '#f8fafc', border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: '18px', padding: '28px', cursor: 'default',
                  backdropFilter: 'blur(20px)', transition: 'border-color 0.3s',
                }}
                onHoverStart={e => { (e.target as HTMLElement).closest('[data-card]')?.setAttribute('style', `border-color: ${s.border}`); }}
              >
                {/* Icon box */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                }}>
                  <Icon size={26} color={s.color} />
                </div>
                <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '17px', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
                <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: s.color, opacity: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  className="card-cta"
                >
                  Request Service →
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        div:hover .card-cta { opacity: 1 !important; transition: opacity 0.2s; }
      `}</style>
    </section>
  );
}
