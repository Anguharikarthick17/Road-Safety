'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Ambulance, Car, Flame, MapPin, Navigation, Radio } from 'lucide-react';

interface MapVehicle {
  id: string;
  type: 'ambulance' | 'police' | 'fire';
  x: number; y: number;
  tx: number; ty: number;
  label: string;
  color: string;
}

interface MapIncident {
  id: string;
  x: number;
  y: number;
  severity: 'critical' | 'medium' | 'low';
}

const vehicleConfig = {
  ambulance: { Icon: Ambulance, color: '#ef4444' },
  police: { Icon: Car, color: '#3b82f6' },
  fire: { Icon: Flame, color: '#f97316' },
};

const initialVehicles: MapVehicle[] = [
  { id: 'AMB-01', type: 'ambulance', x: 15, y: 25, tx: 45, ty: 35, label: 'AMB-01', color: '#ef4444' },
  { id: 'AMB-02', type: 'ambulance', x: 70, y: 65, tx: 55, ty: 55, label: 'AMB-02', color: '#ef4444' },
  { id: 'PCL-01', type: 'police', x: 30, y: 60, tx: 40, ty: 40, label: 'PCL-01', color: '#3b82f6' },
  { id: 'PCL-02', type: 'police', x: 80, y: 20, tx: 60, ty: 30, label: 'PCL-02', color: '#3b82f6' },
  { id: 'FRU-01', type: 'fire', x: 50, y: 80, tx: 45, ty: 60, label: 'FRU-01', color: '#f97316' },
];

const incidents: MapIncident[] = [
  { id: 'INC-001', x: 45, y: 35, severity: 'critical' },
  { id: 'INC-002', x: 55, y: 55, severity: 'critical' },
  { id: 'INC-003', x: 75, y: 40, severity: 'medium' },
  { id: 'INC-004', x: 25, y: 70, severity: 'low' },
];

const hospitals = [
  { label: 'Apollo Hospital', x: 20, y: 40 },
  { label: 'Govt General Hospital', x: 62, y: 22 },
  { label: 'MIOT Hospital', x: 38, y: 72 },
];

const policeStations = [
  { label: 'Tambaram PS', x: 50, y: 68 },
  { label: 'Guindy PS', x: 68, y: 45 },
];

const severityColor = { critical: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

export default function MapPanel() {
  const [vehicles, setVehicles] = useState<MapVehicle[]>(initialVehicles);
  const [tick, setTick] = useState(0);

  // Animate vehicles moving
  useEffect(() => {
    const id = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        const dx = v.tx - v.x, dy = v.ty - v.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          // reached target — pick new target
          return {
            ...v,
            x: v.tx, y: v.ty,
            tx: Math.random() * 70 + 10,
            ty: Math.random() * 70 + 10,
          };
        }
        return {
          ...v,
          x: v.x + (dx / dist) * 1.5,
          y: v.y + (dy / dist) * 1.5,
        };
      }));
      setTick(t => t + 1);
    }, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px', padding: '20px',
      height: '100%',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={15} color="#60a5fa" />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>Live Dispatch Map</div>
            <div style={{ color: '#475569', fontSize: '11px' }}>Chennai Metro Area</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '100px' }}>
          <Radio size={11} color="#22c55e" />
          <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 600 }}>TRACKING</span>
        </div>
      </div>

      {/* Map Canvas */}
      <div style={{
        position: 'relative', width: '100%', paddingBottom: '65%',
        background: 'rgba(2,6,23,0.95)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '14px', overflow: 'hidden',
        marginBottom: '14px',
        boxShadow: 'none',
      }}>
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.06) 1px,transparent 1px)',
          backgroundSize: '12.5% 12.5%',
        }} />

        {/* Road lines (simulated) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Main roads */}
          <line x1="0%" y1="38%" x2="100%" y2="38%" stroke="rgba(59,130,246,0.15)" strokeWidth="2" />
          <line x1="0%" y1="62%" x2="100%" y2="62%" stroke="rgba(59,130,246,0.1)" strokeWidth="1.5" />
          <line x1="35%" y1="0%" x2="35%" y2="100%" stroke="rgba(59,130,246,0.15)" strokeWidth="2" />
          <line x1="65%" y1="0%" x2="65%" y2="100%" stroke="rgba(59,130,246,0.1)" strokeWidth="1.5" />
          {/* Diagonal highway */}
          <line x1="0%" y1="80%" x2="100%" y2="20%" stroke="rgba(6,182,212,0.12)" strokeWidth="2.5" strokeDasharray="8 4" />
          {/* Routes to incidents */}
          {vehicles.map(v => (
            <line
              key={v.id + '-route'}
              x1={`${v.x}%`} y1={`${v.y}%`}
              x2={`${v.tx}%`} y2={`${v.ty}%`}
              stroke={`${v.color}30`} strokeWidth="1.5" strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Incident markers */}
        {incidents.map(inc => (
          <div key={inc.id} style={{
            position: 'absolute',
            left: `${inc.x}%`, top: `${inc.y}%`,
            transform: 'translate(-50%,-50%)',
          }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: severityColor[inc.severity],
              border: '1.5px solid #ffffff',
            }} />
            <div style={{
              position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(2,6,23,0.9)', border: `1px solid ${severityColor[inc.severity]}40`,
              borderRadius: '4px', padding: '1px 5px',
              color: severityColor[inc.severity], fontSize: '8px', fontWeight: 700, whiteSpace: 'nowrap',
            }}>{inc.id}</div>
          </div>
        ))}

        {/* Hospital markers */}
        {hospitals.map(h => (
          <div key={h.label} style={{
            position: 'absolute', left: `${h.x}%`, top: `${h.y}%`,
            transform: 'translate(-50%,-50%)',
          }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '4px',
              background: 'rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#4ade80', fontSize: '10px', fontWeight: 900,
            }}>H</div>
          </div>
        ))}

        {/* Police station markers */}
        {policeStations.map(ps => (
          <div key={ps.label} style={{
            position: 'absolute', left: `${ps.x}%`, top: `${ps.y}%`,
            transform: 'translate(-50%,-50%)',
          }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '4px',
              background: 'rgba(59,130,246,0.3)', border: '1px solid rgba(59,130,246,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#60a5fa', fontSize: '10px', fontWeight: 900,
            }}>P</div>
          </div>
        ))}

        {/* Moving vehicles */}
        {vehicles.map(v => {
          const cfg = vehicleConfig[v.type];
          return (
            <div
              key={v.id}
              style={{
                position: 'absolute',
                left: `${v.x}%`, top: `${v.y}%`,
                transform: 'translate(-50%,-50%)',
                transition: 'left 0.2s linear, top 0.2s linear',
                zIndex: 10,
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: `${v.color}25`, border: `1.5px solid ${v.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'none',
              }}>
                <cfg.Icon size={11} color={v.color} />
              </div>
              <div style={{
                position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                background: `${v.color}20`, border: `1px solid ${v.color}40`,
                borderRadius: '3px', padding: '1px 4px',
                color: v.color, fontSize: '7px', fontWeight: 700, whiteSpace: 'nowrap',
              }}>{v.label}</div>
            </div>
          );
        })}

        {/* Overlay label */}
        <div style={{
          position: 'absolute', bottom: '8px', right: '10px',
          color: '#64748b', fontSize: '10px', fontWeight: 500,
        }}>
          Simulation Map — Chennai Metro
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {[
          { color: '#ef4444', label: 'Ambulance' },
          { color: '#3b82f6', label: 'Police' },
          { color: '#f97316', label: 'Fire Rescue' },
          { color: '#22c55e', label: 'Hospital' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color, boxShadow: `0 0 5px ${l.color}` }} />
            <span style={{ color: '#475569', fontSize: '11px', fontWeight: 500 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes incPulse { 0%,100%{box-shadow:0 0 12px rgba(239,68,68,0.8)} 50%{box-shadow:0 0 24px rgba(239,68,68,1)} }
      `}</style>
    </div>
  );
}
