'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Phone, MessageCircle, X, AlertTriangle } from 'lucide-react';

export default function FloatingSOS() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      <AnimatePresence>
        {open && (
          <motion.div key="menu" initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.92 }} transition={{ duration: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            <motion.a href="tel:+918072522246" whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(29,78,216,0.18)' }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #bfdbfe', color: '#0f172a', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={15} color="#1d4ed8" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>Emergency Call</div>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '1px' }}>+91 8072522246</div>
              </div>
            </motion.a>

            <motion.a href="https://wa.me/918072522246" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(22,163,74,0.18)' }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #bbf7d0', color: '#0f172a', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={15} color="#16a34a" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>WhatsApp SOS</div>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '1px' }}>Instant dispatch</div>
              </div>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={open ? {} : {
          boxShadow: ['0 0 0 0 rgba(220,38,38,0.4)', '0 0 0 12px rgba(220,38,38,0)', '0 0 0 0 rgba(220,38,38,0)']
        }}
        transition={{ boxShadow: { duration: 2.2, repeat: Infinity } }}
        style={{
          width: '58px', height: '58px', borderRadius: '12px',
          background: open ? '#f8fafc' : '#dc2626',
          border: open ? '1px solid #e2e8f0' : '1px solid #b91c1c',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '2px',
          color: open ? '#475569' : 'white',
          boxShadow: open ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 16px rgba(220,38,38,0.35)',
          transition: 'all 0.25s',
        }}
        aria-label="Emergency SOS"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
                <X size={22} />
              </motion.div>
            : <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                <AlertTriangle size={19} />
                <span style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em' }}>SOS</span>
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
