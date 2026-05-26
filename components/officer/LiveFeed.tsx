'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance, Car, Flame, MapPin, Clock, User, CheckCircle,
  AlertTriangle, Loader2, Zap, ChevronRight, TriangleAlert
} from 'lucide-react';
import { mockIncidents, type Incident, type Severity, type IncidentStatus } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

const formatIncidentTime = (createdAtStr?: string, fallbackTime?: string) => {
  if (!createdAtStr) return fallbackTime || 'Just now';
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

const severityConfig: Record<Severity, { color: string; bg: string; border: string; label: string; glow: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.35)', label: 'CRITICAL', glow: 'rgba(239,68,68,0.3)' },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.28)', label: 'MEDIUM', glow: 'rgba(245,158,11,0.2)' },
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.22)', label: 'LOW', glow: 'none' },
};

const statusConfig: Record<IncidentStatus, { color: string; bg: string; label: string }> = {
  'pending': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Pending' },
  'assigned': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Assigned' },
  'in-progress': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', label: 'In Progress' },
  'resolved': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Resolved' },
};

const unitLabels = {
  ambulance: { label: 'Ambulance', Icon: Ambulance, color: '#ef4444', prefix: 'AMB' },
  police: { label: 'Police', Icon: Car, color: '#3b82f6', prefix: 'PCL' },
  fire: { label: 'Fire Rescue', Icon: Flame, color: '#f97316', prefix: 'FRU' },
};

interface AssignmentState {
  type: 'ambulance' | 'police' | 'fire';
  unit: string;
  eta: string;
}

export default function LiveFeed() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [assignments, setAssignments] = useState<Record<string, AssignmentState>>({});
  const [assigning, setAssigning] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Load incidents from Supabase & Subscribe to real-time changes
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching incidents from Supabase:', error);
          return;
        }

        if (data && data.length > 0) {
          const dbIncidents: Incident[] = data.map((item: any) => ({
            id: item.id,
            type: item.type,
            time: formatIncidentTime(item.created_at),
            location: item.location || 'Unknown Location',
            lat: item.lat || 12.97,
            lng: item.lng || 79.99,
            severity: item.severity as Severity,
            victims: item.victims || 0,
            status: item.status as IncidentStatus,
            vehicle: item.vehicle || 'Unknown',
            assigned: item.assigned || undefined,
            eta: item.eta || undefined
          }));

          setIncidents(prev => {
            const dbIds = new Set(dbIncidents.map(x => x.id));
            const filteredMock = mockIncidents.filter(x => !dbIds.has(x.id));
            return [...dbIncidents, ...filteredMock];
          });
        }
      } catch (err) {
        console.error('Failed to connect to Supabase database:', err);
      }
    };

    fetchIncidents();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new;
            const newIncident: Incident = {
              id: newItem.id,
              type: newItem.type,
              time: 'Just now',
              location: newItem.location || 'Unknown Location',
              lat: newItem.lat || 12.97,
              lng: newItem.lng || 79.99,
              severity: newItem.severity as Severity,
              victims: newItem.victims || 0,
              status: newItem.status as IncidentStatus,
              vehicle: newItem.vehicle || 'Unknown',
              assigned: newItem.assigned || undefined,
              eta: newItem.eta || undefined
            };
            setIncidents(prev => {
              if (prev.some(x => x.id === newIncident.id)) return prev;
              return [newIncident, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = payload.new;
            setIncidents(prev => prev.map(inc => {
              if (inc.id === updatedItem.id) {
                return {
                  ...inc,
                  status: updatedItem.status as IncidentStatus,
                  assigned: updatedItem.assigned || undefined,
                  eta: updatedItem.eta || undefined
                };
              }
              return inc;
            }));
          } else if (payload.eventType === 'DELETE') {
            const deletedItem = payload.old;
            setIncidents(prev => prev.filter(inc => inc.id !== deletedItem.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simulate real-time status changes
  useEffect(() => {
    const id = setInterval(() => {
      setIncidents(prev => prev.map(inc => {
        if (inc.status === 'assigned' && Math.random() > 0.7) {
          const nextStatus = 'in-progress' as IncidentStatus;
          if (inc.id.length > 10) {
            supabase.from('incidents').update({ status: nextStatus }).eq('id', inc.id).then();
          }
          return { ...inc, status: nextStatus };
        }
        if (inc.status === 'in-progress' && Math.random() > 0.85) {
          const nextStatus = 'resolved' as IncidentStatus;
          if (inc.id.length > 10) {
            supabase.from('incidents').update({ status: nextStatus }).eq('id', inc.id).then();
          }
          return { ...inc, status: nextStatus };
        }
        return inc;
      }));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const assign = async (incId: string, type: 'ambulance' | 'police' | 'fire') => {
    setAssigning(incId + type);
    const cfg = unitLabels[type];
    const unit = `${cfg.prefix}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`;
    const etaMins = Math.floor(Math.random() * 10) + 3;

    if (incId.length > 10) {
      try {
        const { error } = await supabase
          .from('incidents')
          .update({
            status: 'assigned',
            assigned: unit,
            eta: `${etaMins} min`
          })
          .eq('id', incId);
        if (error) {
          console.error('Error assigning unit in Supabase:', error);
        }
      } catch (err) {
        console.error('Failed to assign unit:', err);
      }
    }

    setTimeout(() => {
      setAssignments(prev => ({ ...prev, [incId]: { type, unit, eta: `${etaMins} min` } }));
      setIncidents(prev => prev.map(inc =>
        inc.id === incId ? { ...inc, status: 'assigned' as IncidentStatus, assigned: unit, eta: `${etaMins} min` } : inc
      ));
      setAssigning(null);
    }, 1800);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px', padding: '20px',
      height: '100%',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '11px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TriangleAlert size={18} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>Live Incident Feed</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Auto-updating every 8 seconds</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'liveDot 1.8s ease-in-out infinite', display: 'inline-block' }} />
          <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>LIVE</span>
          <span style={{ color: '#475569', fontSize: '12px' }}>· {incidents.length} incidents</span>
        </div>
      </div>

      {/* Incident Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
        <AnimatePresence>
          {incidents.map((inc, i) => {
            const sev = severityConfig[inc.severity];
            const stat = statusConfig[inc.status];
            const assignment = assignments[inc.id];
            const isExpanded = expanded === inc.id;
            const isCritical = inc.severity === 'critical';

            return (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ border: `1px solid ${isCritical && inc.status === 'pending' ? sev.color : 'rgba(15, 23, 42, 0.15)'}` }}
                style={{
                  background: `linear-gradient(135deg, ${sev.bg}, rgba(255, 255, 255, 0.8))`,
                  border: `1px solid ${isCritical && inc.status === 'pending' ? sev.color + '70' : '#e2e8f0'}`,
                  borderRadius: '16px', padding: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                }}
                onClick={() => setExpanded(isExpanded ? null : inc.id)}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, fontFamily: 'monospace' }}>{inc.id}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: '6px',
                        background: sev.bg, border: `1px solid ${sev.border}`,
                        color: sev.color, fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em',
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                      }}>
                        {isCritical && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sev.color, animation: 'dot 1.5s infinite', display: 'inline-block' }} />}
                        {sev.label}
                      </span>
                      <span style={{
                        padding: '2px 8px', borderRadius: '6px',
                        background: stat.bg, color: stat.color, fontSize: '10px', fontWeight: 600,
                      }}>
                        {stat.label}
                      </span>
                    </div>
                    <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px', marginBottom: '5px' }}>{inc.type}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '11px' }}>
                        <MapPin size={11} color="#3b82f6" /> {inc.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '11px' }}>
                        <Clock size={11} /> {inc.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '11px' }}>
                        <User size={11} /> {inc.victims} victim{inc.victims !== 1 ? 's' : ''}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '11px' }}>
                        <Car size={11} /> {inc.vehicle}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#475569', flexShrink: 0, marginTop: '2px' }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                </div>

                {/* Assignment info */}
                {(inc.assigned || assignment) && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '10px',
                    background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
                    marginBottom: '10px',
                  }}>
                    <Zap size={12} color="#60a5fa" />
                    <span style={{ color: '#1d4ed8', fontSize: '12px', fontWeight: 600 }}>
                      {(inc.assigned || assignment?.unit)} dispatched
                    </span>
                    {(inc.eta || assignment?.eta) && (
                      <span style={{ color: '#475569', fontSize: '11px' }}>· ETA: {inc.eta || assignment?.eta}</span>
                    )}
                  </div>
                )}

                {/* Expanded: Assign buttons */}
                <AnimatePresence>
                  {isExpanded && inc.status !== 'resolved' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '2px' }}>
                        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Dispatch Unit</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {(['ambulance', 'police', 'fire'] as const).map(type => {
                            const cfg = unitLabels[type];
                            const UIcon = cfg.Icon;
                            const isLoading = assigning === inc.id + type;
                            return (
                              <motion.button
                                key={type}
                                onClick={e => { e.stopPropagation(); assign(inc.id, type); }}
                                disabled={!!assigning}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '8px 14px', borderRadius: '10px',
                                  background: `${cfg.color}14`, border: `1px solid ${cfg.color}30`,
                                  color: cfg.color, fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                }}
                              >
                                {isLoading
                                  ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                                  : <UIcon size={13} />
                                }
                                {isLoading ? 'Assigning...' : `Assign ${cfg.label}`}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {isExpanded && inc.status === 'resolved' && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px', borderRadius: '10px', marginTop: '8px',
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                      }}
                    >
                      <CheckCircle size={14} color="#22c55e" />
                      <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>Incident resolved — units returned to base</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        @keyframes incidentPulse { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.3)} 50%{box-shadow:0 0 40px rgba(239,68,68,0.5)} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}
