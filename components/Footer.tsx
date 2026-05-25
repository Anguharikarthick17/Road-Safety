'use client';

import { motion } from 'framer-motion';
import { Zap, Phone, MessageCircle, Mail, MapPin, Share2, AtSign, Briefcase, PlayCircle } from 'lucide-react';

const footerLinks = {
  Services: ['Battery Jumpstart', 'Fuel Delivery', 'Flat Tyre Repair', 'Tow Truck', 'Accident Help', 'Engine Breakdown', 'Bike Assistance', 'Car Lockout'],
  Company: ['About Us', 'How It Works', 'Partner With Us', 'Careers', 'Press Kit', 'Blog'],
  Support: ['Help Center', 'Safety Guidelines', 'Insurance Claims', 'Privacy Policy', 'Terms of Service', 'Refund Policy'],
};

const socials = [
  { icon: AtSign, label: 'Instagram' },
  { icon: Share2, label: 'Twitter' },
  { icon: Briefcase, label: 'LinkedIn' },
  { icon: PlayCircle, label: 'YouTube' },
];

const contacts = [
  { href: 'tel:+918072522246', icon: Phone, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: '+91 8072522246' },
  { href: 'https://wa.me/918072522246', icon: MessageCircle, color: '#16a34a', bg: 'rgba(22,163,74,0.1)', label: 'WhatsApp SOS', target: '_blank' },
  { href: 'mailto:help@roadsos.in', icon: Mail, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'help@roadsos.in' },
  { href: '#', icon: MapPin, color: '#64748b', bg: 'rgba(148,163,184,0.08)', label: 'Available in 200+ cities' },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'linear-gradient(160deg, #020617 0%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute', bottom: '-150px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', borderRadius: '50%',
        background: 'rgba(59,130,246,0.04)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Main 4-column grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '56px',
        }}>

          {/* Col 1 — Brand */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(29,78,216,0.35)' }}>
                <Zap size={17} color="white" />
              </div>
              <div>
                <div style={{ color: '#475569', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>NSER Platform</div>
                <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.3px' }}>Road<span style={{ color: '#3b82f6' }}>SOS</span></span>
              </div>
            </div>

            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.8, marginBottom: '24px', maxWidth: '260px' }}>
              India&apos;s most reliable 24x7 roadside assistance platform. Verified partners, GPS-enabled dispatch, and lightning-fast response times.
            </p>

            {/* Contact list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {contacts.map(c => (
                <a key={c.label} href={c.href}
                  target={(c as any).target || undefined}
                  rel={(c as any).target ? 'noopener noreferrer' : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d97706'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                >
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={13} color={c.color} />
                  </div>
                  {c.label}
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(s => (
                <motion.a key={s.label} href="#" aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(58,53,80,0.5)', border: '1px solid rgba(97,93,115,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#615d73', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#d8d7dc'}
                  onMouseLeave={e => e.currentTarget.style.color = '#615d73'}
                >
                  <s.icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Cols 2–4 — Link columns */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat}>
              <h4 style={{ color: '#93c5fd', fontWeight: 700, fontSize: '11px', marginBottom: '16px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {links.map(link => (
                  <a key={link} href="#"
                    style={{ color: '#475569', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Emergency banner ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', background: '#ffffff', border: '1px solid #e2e8f0',
          borderRadius: '16px', padding: '20px 24px', marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={16} color="#dc2626" />
            </div>
            <div>
              <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>24×7 Emergency Helpline</div>
              <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Immediate dispatch — No booking required</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="tel:+918072522246" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px', background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)', color: '#1d4ed8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              <Phone size={14} /> +91 8072522246
            </a>
            <a href="https://wa.me/918072522246" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', paddingTop: '24px', paddingBottom: '32px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{ color: '#64748b', fontSize: '12px' }}>
            © {new Date().getFullYear()} RoadSOS. All rights reserved. Built with care for Indian drivers.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            <span style={{ color: '#64748b', fontSize: '12px' }}>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
