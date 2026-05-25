'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, TrendingUp, Activity, ChevronRight, X } from 'lucide-react';
import { aiAlerts } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

const formatRelativeTime = (createdAtStr?: string) => {
  if (!createdAtStr) return 'Just now';
  const created = new Date(createdAtStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return created.toLocaleDateString();
};


export default function AIAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('ai_alerts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching AI alerts:', error);
          setAlerts(aiAlerts);
          return;
        }

        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            msg: item.msg,
            severity: item.severity,
            time: formatRelativeTime(item.created_at)
          }));
          setAlerts(formatted);
        } else {
          setAlerts(aiAlerts);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase for AI alerts:', err);
        setAlerts(aiAlerts);
      }
    };

    fetchAlerts();

    // Subscribe to realtime database changes
    const channel = supabase
      .channel('schema-ai-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_alerts',
        },
        (payload) => {
          const newItem = payload.new;
          setAlerts(prev => [
            {
              id: newItem.id,
              msg: newItem.msg,
              severity: newItem.severity,
              time: 'Just now'
            },
            ...prev
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (alerts.length === 0) return;
    const id = setInterval(() => {
      setCurrentIdx(i => (i + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(id);
  }, [alerts]);

  const activeAlerts = alerts.filter(a => !dismissed.includes(a.id));
  if (!visible || activeAlerts.length === 0) return null;

  const current = activeAlerts[currentIdx % activeAlerts.length];
  if (!current) return null;

  const severityMap = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: AlertTriangle },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: Activity },
    low: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: TrendingUp },
  };
  const severityStyle = severityMap[current.severity as keyof typeof severityMap] ?? severityMap.low;

  const Icon = severityStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: severityStyle.bg,
        border: `1px solid ${severityStyle.border}`,
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px', position: 'relative',
        boxShadow: current.severity === 'critical' ? `0 0 24px rgba(239,68,68,0.25)` : 'none',
        animation: current.severity === 'critical' ? 'aiAlertPulse 2.5s ease-in-out infinite' : 'none',
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${severityStyle.color}18`, border: `1px solid ${severityStyle.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={severityStyle.color} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          background: `${severityStyle.color}15`, border: `1px solid ${severityStyle.color}25`,
          borderRadius: '6px', padding: '2px 8px',
          color: severityStyle.color, fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {current.severity === 'critical' && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: severityStyle.color, animation: 'pulse 1.5s infinite', display: 'inline-block' }} />}
          AI Alert
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 600 }}>{current.msg}</span>
        <span style={{ color: '#475569', fontSize: '12px', marginLeft: '10px' }}>{current.time}</span>
      </div>

      {/* Alert counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {activeAlerts.slice(0, 5).map((_, i) => (
            <div key={i} style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: i === currentIdx % activeAlerts.length ? severityStyle.color : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <button
          onClick={() => setDismissed(d => [...d, current.id])}
          style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
        >
          <X size={14} />
        </button>
      </div>

      <style>{`
        @keyframes aiAlertPulse { 0%,100%{box-shadow:0 0 24px rgba(239,68,68,0.25)} 50%{box-shadow:0 0 40px rgba(239,68,68,0.45)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>
    </motion.div>
  );
}
