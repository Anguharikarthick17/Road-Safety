'use client';

import { motion } from 'framer-motion';
import { MapPin, TriangleAlert, TrendingUp, Clock } from 'lucide-react';
import { hotspots as mockHotspots, districtData, type Severity } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'HIGH RISK' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', label: 'MODERATE' },
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'LOW RISK' },
};

function RiskMeter({ score }: { score: number }) {
  const color = score >= 80 ? '#ef4444' : score >= 60 ? '#f59e0b' : '#22c55e';
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 600 }}>Risk Score</span>
        <span style={{ color, fontWeight: 800, fontSize: '13px' }}>{score}/100</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function HeatmapPanel() {
  const [spots, setSpots] = useState<any[]>(mockHotspots);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const { data, error } = await supabase
          .from('hotspots')
          .select('*')
          .order('risk_score', { ascending: false });

        if (error) {
          console.error('Error fetching hotspots from Supabase:', error);
          return;
        }

        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            road: item.road,
            riskScore: item.risk_score,
            accidents: item.accidents,
            peak: item.peak,
            severity: item.severity as Severity
          }));
          setSpots(formatted);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase for hotspots:', err);
      }
    };

    fetchHotspots();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>

      {/* Accident Hotspots */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px', padding: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TriangleAlert size={16} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>Accident Hotspots</div>
            <div style={{ color: '#475569', fontSize: '11px' }}>Repeated accident zones · Tamil Nadu</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {spots.map((spot, i) => {
            const cfg = severityConfig[spot.severity];
            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '14px', padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '8px', background: cfg.bg, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
                    <MapPin size={13} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                      <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spot.road}</div>
                      <span style={{
                        flexShrink: 0, padding: '1px 7px', borderRadius: '5px',
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        color: cfg.color, fontSize: '9px', fontWeight: 800, letterSpacing: '0.06em',
                      }}>{cfg.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TriangleAlert size={10} /> {spot.accidents} accidents
                      </span>
                      <span style={{ color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> Peak: {spot.peak}
                      </span>
                    </div>
                    <RiskMeter score={spot.riskScore} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* District Risk Map */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px', padding: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={16} color="#60a5fa" />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>District Risk Analysis</div>
            <div style={{ color: '#475569', fontSize: '11px' }}>Accident density by district</div>
          </div>
        </div>

        {/* Simulated district heatmap */}
        <div style={{
          position: 'relative',
          background: 'rgba(2,6,23,0.8)',
          borderRadius: '14px', overflow: 'hidden',
          marginBottom: '18px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Grid heatmap simulation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px', marginBottom: '12px' }}>
            {Array.from({ length: 64 }).map((_, idx) => {
              const intensity = Math.random();
              const r = Math.floor(intensity * 239);
              const g = Math.floor((1 - intensity) * 197);
              const color = `rgba(${r}, ${g}, 68, ${0.15 + intensity * 0.5})`;
              return (
                <div key={idx} style={{
                  height: '18px', borderRadius: '3px',
                  background: color,
                  transition: 'background 1s',
                }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#475569' }}>
            <span>Low Risk</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {['#22c55e40', '#f59e0b60', '#ef444490', '#ef4444bb'].map((c, i) => (
                <div key={i} style={{ width: '20px', height: '8px', background: c, borderRadius: '2px' }} />
              ))}
            </div>
            <span>High Risk</span>
          </div>
        </div>

        {/* District list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {districtData.map((d, i) => {
            const color = d.risk >= 80 ? '#ef4444' : d.risk >= 60 ? '#f59e0b' : '#22c55e';
            return (
              <motion.div
                key={d.district}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ width: '130px', color: '#64748b', fontSize: '12px', fontWeight: 500, flexShrink: 0 }}>{d.district}</div>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.risk}%` }}
                    transition={{ duration: 1.2, delay: i * 0.07, ease: 'easeOut' }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: '4px' }}
                  />
                </div>
                <div style={{ color, fontWeight: 700, fontSize: '12px', width: '36px', textAlign: 'right', flexShrink: 0 }}>{d.risk}</div>
                <div style={{ color: '#475569', fontSize: '11px', width: '60px', flexShrink: 0 }}>{d.accidents} cases</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
