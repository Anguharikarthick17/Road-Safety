'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#request' },
    { label: 'Coverage', href: '#testimonials' },
    { label: 'Help', href: '#faq' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: '#ffffff',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${scrolled ? '#bfdbfe' : '#e2e8f0'}`,
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Gov blue top accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #1e3a8a, #1d4ed8, #2563eb)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(29,78,216,0.3)' }}>
            <Shield size={17} color="white" />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>NSER Platform</div>
            <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px' }}>
              Road<span style={{ color: '#1d4ed8' }}>SOS</span>
            </span>
          </div>
        </a>
      </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }} className="hide-mobile">
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              style={{ color: '#64748b', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >{link.label}</a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="hide-mobile">
          <a href="tel:+918072522246" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '7px', border: '1px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontSize: '12px', fontWeight: 500, background: '#f8fafc', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.color = '#1d4ed8'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <Phone size={13} /> Helpline
          </a>
          <motion.a href="https://wa.me/918072522246" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '7px', background: '#16a34a', color: 'white', textDecoration: 'none', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(22,163,74,0.25)' }}>
            <MessageCircle size={13} /> WhatsApp SOS
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'none' }} className="show-mobile">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#ffffff' }}>
              {navLinks.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{ color: '#475569', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>{l.label}</a>
              ))}
              <a href="tel:+918072522246" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', borderRadius: '7px', border: '1px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontSize: '13px', marginTop: '6px', background: '#f8fafc' }}>
                <Phone size={14} /> Helpline
              </a>
              <a href="https://wa.me/918072522246" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', borderRadius: '7px', background: '#16a34a', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <MessageCircle size={14} /> WhatsApp SOS
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: block !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </motion.nav>
  );
}
