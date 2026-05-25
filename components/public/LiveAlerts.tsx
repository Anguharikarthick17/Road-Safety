'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Ambulance, Flame, Car, Activity,
  ShieldAlert, Zap, Clock, TrendingUp
} from 'lucide-react';

type Severity = 'low' | 'medium' | 'critical';

interface Alert {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: Severity;
  detail: string;
  icon: typeof AlertTriangle;
}

const initialAlerts: Alert[] = [
  { id: 1, type: 'High-Speed Collision', location: 'NH-44, Sriperumbudur', time: '2 min ago', severity: 'critical', detail: 'Multi-vehicle accident detected. Ambulance dispatched. ETA 8 min.', icon: Car },
  { id: 2, type: 'Vehicle Fire Detected', location: 'OMR, Sholinganallur', time: '8 min ago', severity: 'critical', detail: 'Possible fuel leak and fire. Fire rescue unit en route.', icon: Flame },
  { id: 3, type: 'Traffic Congestion Alert', location: 'GST Road, Tambaram', time: '14 min ago', severity: 'medium', detail: 'Heavy congestion detected. Divert via Pallavaram route.', icon: TrendingUp },
  { id: 4, type: 'Medical Emergency', location: 'Anna Salai, Gemini', time: '21 min ago', severity: 'medium', detail: 'Pedestrian medical emergency. Ambulance response initiated.', icon: Ambulance },
  { id: 5, type: 'Road Hazard Warning', location: 'ECR, Mahabalipuram', time: '30 min ago', severity: 'low', detail: 'Debris on road reported. Traffic management notified.', icon: AlertTriangle },
  { id: 6, type: 'Accident Resolved', location: 'Rajiv Gandhi Salai', time: '38 min ago', severity: 'low', detail: 'Earlier incident cleared. Road reopened to traffic.', icon: ShieldAlert },
];

const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string; glow: string }> = {
  critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Critical', glow: 'rgba(220,38,38,0.1)' },
  medium:   { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Medium',   glow: 'rgba(245,158,11,0.1)' },
  low:      { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Low',      glow: 'rgba(22,163,74,0.1)' },
};

export default function LiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [ticker, setTicker] = useState(0);

  // Simulate new alerts coming in
  useEffect(() => {
    const extraAlerts: Alert[] = [
      { id: 100, type: 'AI Accident Prediction', location: 'Poonamallee High Road', time: 'Just now', severity: 'medium', detail: 'AI model predicts 73% accident probability in next 2 hours based on weather + traffic.', icon: Activity },
      { id: 101, type: 'Emergency Dispatch', location: 'Vandalur, Chennai', time: 'Just now', severity: 'critical', detail: 'Emergency unit dispatched. Three victims confirmed. Air ambulance on standby.', icon: Ambulance },
    ];
    let idx = 0;
    const id = setInterval(() => {
      if (idx < extraAlerts.length) {
        setAlerts(prev => [{ ...extraAlerts[idx], time: 'Just now' }, ...prev.slice(0, 7)]);
        idx++;
      }
    }, 12000);
    const tick = setInterval(() => setTicker(t => t + 1), 1000);
    return () => { clearInterval(id); clearInterval(tick); };
  }, []);

  return (
    <section style={{ background: '#f1f5f9', padding: '72px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#eff6ff', border: '1px solid rgba(29,78,216,0.2)',
                  borderRadius: '6px', padding: '4px 14px',
                  fontSize: '10px', fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite', display: 'inline-block', boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
                  Live AI Emergency Feed
                </div>
              </div>
              <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(20px,2.8vw,30px)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                Real-Time Accident Alerts
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                AI-powered monitoring — updated every few seconds
              </p>
            </div>

            {/* Live counter */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#ffffff', border: '1px solid #e2e8f0',
              borderRadius: '12px', padding: '12px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                  {alerts.filter(a => a.severity === 'critical').length}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Critical</div>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                  {alerts.filter(a => a.severity === 'medium').length}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medium</div>
              </div>
              <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#22c55e', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                  {alerts.filter(a => a.severity === 'low').length}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Low</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          <AnimatePresence>
            {alerts.slice(0, 6).map((alert, i) => {
              const cfg = severityConfig[alert.severity];
              const Icon = alert.icon;
              const isCritical = alert.severity === 'critical';
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${cfg.border}`,
                    borderRadius: '12px',
                    padding: '18px',
                    boxShadow: isCritical ? `0 4px 16px ${cfg.glow}` : '0 1px 4px rgba(0,0,0,0.05)',
                    animation: isCritical ? 'criticalPulse 3s ease-in-out infinite' : 'none',
                  }}
                >
                  {/* Top glow line */}
                  <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: cfg.bg, border: `1px solid ${cfg.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: isCritical ? `0 0 16px ${cfg.glow}` : 'none',
                    }}>
                      <Icon size={20} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', lineHeight: 1.3 }}>{alert.type}</div>
                        <span style={{
                          flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '2px 8px', borderRadius: '6px',
                          background: cfg.bg, border: `1px solid ${cfg.border}`,
                          color: cfg.color, fontSize: '10px', fontWeight: 700,
                        }}>
                          {isCritical && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginBottom: '8px' }}>
                        <Zap size={11} color="#3b82f6" />
                        {alert.location}
                        <span>·</span>
                        <Clock size={11} />
                        {alert.time}
                      </div>
                      <p style={{ color: '#475569', fontSize: '12px', lineHeight: 1.6 }}>{alert.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes criticalPulse {
          0%,100%{box-shadow:0 0 30px rgba(239,68,68,0.4),0 8px 24px rgba(0,0,0,0.4)}
          50%{box-shadow:0 0 50px rgba(239,68,68,0.6),0 8px 24px rgba(0,0,0,0.4)}
        }
      `}</style>
    </section>
  );
}
