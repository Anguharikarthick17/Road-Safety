'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { login } from '@/lib/auth';

export default function OfficerLoginPage() {
  const router = useRouter();
  const [officerId, setOfficerId] = useState('OFFICER-101');
  const [password, setPassword] = useState('safety-ai-2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Check if already logged in
    const role = localStorage.getItem('roadsos_role');
    const token = localStorage.getItem('roadsos_token');
    if (role === 'officer' && token) {
      router.push('/officer');
    }

    // Live clock
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!officerId.trim()) {
      setError('Please enter a valid Officer ID');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login('officer');
      setLoading(false);
      router.push('/officer');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0b1528 0%, #070b13 100%)',
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Smart Cyber Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundImage: 'linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Rotating Ashoka Chakra Watermark */}
      <div style={{
        position: 'absolute',
        width: 'min(90vw, 600px)',
        height: 'min(90vw, 600px)',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ animation: 'spinChakra 180s linear infinite', transformOrigin: 'center' }}>
          <circle cx="50" cy="50" r="45" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
          <circle cx="50" cy="50" r="8" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = (idx * 360) / 24;
            const x = 50 + 45 * Math.cos((angle * Math.PI) / 180);
            const y = 50 + 45 * Math.sin((angle * Math.PI) / 180);
            return (
              <line
                key={idx}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="#3b82f6"
                strokeWidth="0.8"
              />
            );
          })}
        </svg>
      </div>

      {/* Tricolor Government Border top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', display: 'flex', zIndex: 10 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: '#FFFFFF' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>

      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37, 99, 235, 0.1)',
          zIndex: 5,
          position: 'relative',
        }}
      >
        {/* Emblem Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
          }}>
            <Shield size={28} color="#ffffff" />
          </div>
          <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Govt. of India · Emergency Portal
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', textAlign: 'center', margin: 0 }}>
            SAFETY AI
          </h2>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textAlign: 'center', marginTop: '2px' }}>
            Accident Detection &amp; Response Portal
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fca5a5',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Officer ID Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              OFFICER CREDENTIAL ID
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <User size={16} />
              </span>
              <input
                type="text"
                value={officerId}
                onChange={e => setOfficerId(e.target.value)}
                placeholder="Enter Officer ID"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              SECURITY ACCESS TOKEN PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Access Password"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'}
              />
            </div>
          </div>

          {/* Info tip */}
          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4, textAlign: 'center' }}>
            Authorized personnel only. Access logs are archived for national security compliance.
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)'}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Establishing SatLink...
              </>
            ) : (
              <>
                Access Safety AI Command Center
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Floating clock HUD */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 600,
        background: 'rgba(15, 23, 42, 0.4)',
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        System Clock: <span style={{ color: '#93c5fd', fontVariantNumeric: 'tabular-nums' }}>{currentTime || '00:00:00'} IST</span>
      </div>

      <style>{`
        @keyframes spinChakra {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
