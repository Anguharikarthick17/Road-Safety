'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: 'Arjun Menon', role: 'Software Engineer, Bangalore', avatar: 'AM', rating: 5, text: 'My car died at 2 AM on the highway. RoadSOS sent a technician in just 11 minutes. Absolutely life-saving service. The WhatsApp SOS feature made it super easy to share my location.', color: '#3b82f6' },
  { name: 'Priya Sharma', role: 'Business Owner, Mumbai', avatar: 'PS', rating: 5, text: 'Flat tyre on my way to an important meeting. RoadSOS to the rescue — professional, fast, and affordable. I was back on the road in under 20 minutes. Highly recommended!', color: '#8b5cf6' },
  { name: 'Karthik R.', role: 'Delivery Professional, Chennai', avatar: 'KR', rating: 5, text: 'As a delivery driver, breakdowns are my worst nightmare. RoadSOS has saved my income multiple times. The fuel delivery service is fast and GPS tracking is incredibly accurate.', color: '#06b6d4' },
  { name: 'Neha Gupta', role: 'Teacher, Delhi', avatar: 'NG', rating: 5, text: 'Got locked out of my car in the middle of nowhere. RoadSOS lockout service was prompt and professional. The team was very courteous and the app interface is super clean.', color: '#10b981' },
  { name: 'Ravi Patel', role: 'Marketing Manager, Ahmedabad', avatar: 'RP', rating: 5, text: 'Engine breakdown during a family trip. Called RoadSOS and they not only fixed the issue but also helped coordinate with our insurance company. Beyond expectations!', color: '#f59e0b' },
  { name: 'Divya Krishnan', role: 'Doctor, Hyderabad', avatar: 'DK', rating: 5, text: 'Was rushing to the hospital when my bike broke down. RoadSOS bike assistance arrived in 9 minutes and helped me get a cab. Compassionate and incredibly fast.', color: '#ec4899' },
];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '96px 0', background: '#f8fafc', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.2),transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.2),transparent)' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span className="section-badge" style={{ marginBottom: '20px', display: 'inline-flex' }}><Star size={13} /> Testimonials</span>
          <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#0f172a', margin: '16px 0 20px', letterSpacing: '-1px' }}>
            Trusted by <span style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5,000+ Drivers</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '17px', maxWidth: '520px', margin: '0 auto' }}>Real stories from real drivers who experienced our emergency roadside assistance firsthand.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(0,0,0,0.4), 0 0 32px ${t.color}18` }}
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Quote icon */}
              <div style={{ position: 'absolute', top: '20px', right: '20px', color: t.color, opacity: 0.12 }}>
                <Quote size={44} />
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              {/* Text */}
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.8, flex: 1, marginBottom: '24px' }}>
                &ldquo;{t.text}&rdquo;
              </p>
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg,${t.color}80,${t.color}40)`, border: `1px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '56px' }}>
          {[{ v: '4.9/5', l: 'Average Rating' }, { v: '98%', l: 'Response Rate' }, { v: '5,000+', l: 'Rescues Done' }, { v: '200+', l: 'Cities Served' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center', padding: '20px 36px' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.v}</div>
              <div style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
