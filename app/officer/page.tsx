'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, AlertTriangle, Ambulance, Car, Flame, CheckCircle,
  LogOut, Bell, MapPin, Clock, Info, ShieldAlert,
  Volume2, RefreshCw, Layers, Compass, Plus, Send, Radio
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RoleGuard from '@/components/shared/RoleGuard';

interface Accident {
  id: string;
  status: string;
  location: string;
  severity: string;
  time: string;
  ambulance: string | null;
  police: string | null;
  fireforce: string | null;
  resolved: boolean;
}

// Location coordinates lookup for tactical radar plotting
const locationCoords: Record<string, { lat: number; lng: number; offset: { x: number; y: number } }> = {
  'Chennai Highway': { lat: 13.06, lng: 80.18, offset: { x: 45, y: 35 } },
  'OMR Road near Sholinganallur': { lat: 12.89, lng: 80.22, offset: { x: 55, y: 70 } },
  'GST Road, Tambaram': { lat: 12.92, lng: 80.11, offset: { x: 30, y: 55 } },
  'ECR, Pondicherry': { lat: 11.94, lng: 79.80, offset: { x: 20, y: 85 } },
  'NH-44, Sriperumbudur': { lat: 12.97, lng: 79.99, offset: { x: 15, y: 45 } },
};

export default function OfficerDashboard() {
  const router = useRouter();
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [systemAlert, setSystemAlert] = useState<{ msg: string; type: string } | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'radar' | 'google'>('radar');
  const [currentTime, setCurrentTime] = useState('');
  const lastAccidentsLength = useRef<number>(0);

  // Play Emergency Siren synthesis
  const playSiren = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq: number, duration: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        // Modulate pitch slightly for warning feel
        osc.frequency.linearRampToValueAtTime(freq + 100, ctx.currentTime + delay + duration * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + delay + duration);

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Sound play sequence
      playTone(800, 0.4, 0);
      playTone(600, 0.4, 0.45);
      playTone(800, 0.4, 0.9);
      playTone(600, 0.4, 1.35);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  };

  // Fetch from Supabase with 2s polling backup for extreme resilience
  const fetchAccidents = async (isInitial = false) => {
    try {
      const { data, error } = await supabase
        .from('accidents')
        .select('*')
        .order('time', { ascending: false });

      if (error) {
        console.error('Error loading accidents:', error);
        return;
      }

      if (data) {
        const formattedData: Accident[] = data.map((item: any) => ({
          id: item.id,
          status: item.status,
          location: item.location,
          severity: item.severity,
          time: item.time,
          ambulance: item.ambulance,
          police: item.police,
          fireforce: item.fireforce,
          resolved: item.resolved,
        }));

        // Detect new accidents for sirens and banners
        if (!isInitial && formattedData.length > lastAccidentsLength.current) {
          const newIncident = formattedData[0];
          if (!newIncident.resolved) {
            setSystemAlert({
              msg: `🚨 NEW CRITICAL ACCIDENT DETECTED AT ${newIncident.location.toUpperCase()}!`,
              type: newIncident.severity
            });
            playSiren();
          }
        }

        lastAccidentsLength.current = formattedData.length;
        setAccidents(formattedData);
      }
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAccidents(true);

    // Live clock update
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    // Polling every 2 seconds as requested (Rule 7)
    const pollInterval = setInterval(() => {
      fetchAccidents(false);
    }, 2000);

    // Supabase Real-time listener
    const channel = supabase
      .channel('schema-accidents-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'accidents' },
        () => {
          fetchAccidents(false);
        }
      )
      .subscribe();

    return () => {
      clearInterval(clockInterval);
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Logout routine
  const handleLogout = () => {
    localStorage.removeItem('roadsos_role');
    localStorage.removeItem('roadsos_token');
    router.replace('/officer/login');
  };

  // Dispatch resource helper
  const handleAssignResource = async (accId: string, type: 'ambulance' | 'police' | 'fireforce') => {
    setAssigning(accId + type);
    const prefix = type === 'ambulance' ? 'AMB' : type === 'police' ? 'PCL' : 'FRU';
    const unitNo = `${prefix}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`;

    try {
      const { error } = await supabase
        .from('accidents')
        .update({
          [type]: unitNo,
          status: 'ASSIGNED'
        })
        .eq('id', accId);

      if (error) {
        console.error('Update failed:', error);
      } else {
        await fetchAccidents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(null);
    }
  };

  // Resolve incident helper
  const handleResolveIncident = async (accId: string) => {
    setAssigning(accId + 'resolve');
    try {
      const { error } = await supabase
        .from('accidents')
        .update({
          resolved: true,
          status: 'RESOLVED'
        })
        .eq('id', accId);

      if (error) {
        console.error('Resolve failed:', error);
      } else {
        await fetchAccidents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(null);
    }
  };

  // Stats calculation
  const totalAccidents = accidents.length;
  const activeEmergencies = accidents.filter(a => !a.resolved).length;
  const ambulancesDispatched = accidents.filter(a => !a.resolved && a.ambulance).length;
  const policeDispatched = accidents.filter(a => !a.resolved && a.police).length;
  const fireDispatched = accidents.filter(a => !a.resolved && a.fireforce).length;

  // Filtered accidents for listing
  const filteredAccidents = accidents.filter(a => {
    if (activeTab === 'active') return !a.resolved;
    if (activeTab === 'resolved') return a.resolved;
    return true;
  });

  return (
    <RoleGuard requiredRole="officer">
      <div style={{
        minHeight: '100vh',
        background: '#f1f5f9', // Clean slate-blue background
        color: '#0f172a',      // Dark slate primary text
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflowX: 'hidden'
      }}>
        {/* Tricolor National Border Header */}
        <div style={{ width: '100%', height: '4px', display: 'flex', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
          <div style={{ flex: 1, background: '#FF9933' }} />
          <div style={{ flex: 1, background: '#FFFFFF' }} />
          <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* Top Navbar */}
        <header style={{
          position: 'fixed',
          top: '4px',
          left: 0,
          right: 0,
          height: '70px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 999,
        }}>
          {/* Logo Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)'
            }}>
              <ShieldAlert size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '9px', color: '#1d4ed8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>
                Smart Accident Detection &amp; Response System
              </span>
              <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px', margin: '4px 0 0' }}>
                SAFETY AI <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: 700 }}>● COMMAND CENTER</span>
              </h1>
            </div>
          </div>

          {/* Stats Clock & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: 'rgba(29, 78, 216, 0.05)',
              border: '1px solid rgba(29, 78, 216, 0.18)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.8s infinite' }} />
              LIVE IST: <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentTime || '00:00:00'}</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#dc2626',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Main Area */}
        <main style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '110px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* New Incident Flash Alert Banner */}
          <AnimatePresence>
            {systemAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                style={{
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse 1.2s infinite'
                  }}>
                    <AlertTriangle size={18} color="#ffffff" />
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b' }}>
                      {systemAlert.msg}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSystemAlert(null)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.22)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. Main Stats Panel Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px'
          }}>
            {[
              { label: 'Total Accidents Today', count: totalAccidents, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.05)', border: '#e2e8f0' },
              { label: 'Active Emergencies', count: activeEmergencies, color: '#dc2626', bg: 'rgba(220, 38, 38, 0.05)', border: '#fca5a5', pulse: true },
              { label: 'Ambulance Assigned', count: ambulancesDispatched, color: '#d97706', bg: 'rgba(217, 119, 6, 0.05)', border: '#e2e8f0' },
              { label: 'Police Dispatched', count: policeDispatched, color: '#2563eb', bg: 'rgba(37, 99, 235, 0.05)', border: '#e2e8f0' },
              { label: 'Fire Force Dispatched', count: fireDispatched, color: '#ea580c', bg: 'rgba(234, 88, 12, 0.05)', border: '#e2e8f0' }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${stat.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {stat.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {stat.pulse && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color, animation: 'pulse 1.5s infinite' }} />}
                    <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                      {stat.count}
                    </h3>
                  </div>
                </div>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  background: stat.bg, border: `1px solid ${stat.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {idx === 0 && <AlertTriangle size={20} color={stat.color} />}
                  {idx === 1 && <Radio size={20} color={stat.color} className="animate-pulse" />}
                  {idx === 2 && <Ambulance size={20} color={stat.color} />}
                  {idx === 3 && <Car size={20} color={stat.color} />}
                  {idx === 4 && <Flame size={20} color={stat.color} />}
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Layout Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
            gap: '24px',
            alignItems: 'start'
          }} className="dashboard-grid">
            
            {/* Left Column: Live Accident Alerts Feed */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)'
            }}>
              {/* Header block */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Radio size={18} color="#ef4444" className="animate-pulse" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Live Accident Alerts
                    </h2>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Updated instantly via Supabase channels</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.04)', borderRadius: '8px', padding: '3px', border: '1px solid #e2e8f0' }}>
                  {(['all', 'active', 'resolved'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: activeTab === tab ? '#2563eb' : 'transparent',
                        color: activeTab === tab ? '#ffffff' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        transition: 'all 0.2s'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accident Alerts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredAccidents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '13px' }}>
                    No accident alerts found for the current filter.
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredAccidents.map((acc, idx) => {
                      const isExpanded = expandedCard === acc.id;
                      const isHigh = acc.severity === 'HIGH' || acc.severity === 'critical';
                      const isMedium = acc.severity === 'MEDIUM' || acc.severity === 'medium';
                      const sevColor = isHigh ? '#dc2626' : isMedium ? '#d97706' : '#16a34a';
                      const sevBg = isHigh ? 'rgba(220, 38, 38, 0.06)' : isMedium ? 'rgba(217, 119, 6, 0.06)' : 'rgba(22, 163, 74, 0.06)';
                      const isResolved = acc.resolved;

                      return (
                        <motion.div
                          key={acc.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => setExpandedCard(isExpanded ? null : acc.id)}
                          style={{
                            background: isResolved ? 'rgba(16, 185, 129, 0.04)' : '#ffffff',
                            border: `1.5px solid ${isResolved ? 'rgba(16, 185, 129, 0.2)' : isHigh ? 'rgba(220, 38, 38, 0.22)' : '#e2e8f0'}`,
                            borderRadius: '16px',
                            padding: '18px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)'
                          }}
                        >
                          {/* Top Row info */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                <span style={{
                                  background: sevBg,
                                  border: `1px solid ${sevColor}30`,
                                  color: sevColor,
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em'
                                }}>
                                  {acc.severity} SEVERITY
                                </span>
                                <span style={{
                                  background: isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(220, 38, 38, 0.12)',
                                  color: isResolved ? '#16a34a' : '#dc2626',
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase'
                                }}>
                                  {acc.status}
                                </span>
                              </div>

                              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '4px 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {!isResolved && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', animation: 'pulse 1s infinite' }} />}
                                🚨 Accident Detected
                              </h3>

                              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569' }}>
                                  <MapPin size={12} color="#1d4ed8" /> {acc.location}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#475569' }}>
                                  <Clock size={12} /> {new Date(acc.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dispatch / Unit Tracker display */}
                          {(acc.ambulance || acc.police || acc.fireforce) && (
                            <div style={{
                              background: 'rgba(29, 78, 216, 0.04)',
                              border: '1px solid rgba(29, 78, 216, 0.12)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              marginTop: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}>
                              <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.04em' }}>
                                DISPATCHED RESOURCES:
                              </span>
                              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {acc.ambulance && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#b91c1c', fontWeight: 600 }}>
                                    <Ambulance size={12} /> Ambulance ({acc.ambulance})
                                  </span>
                                )}
                                {acc.police && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#1d4ed8', fontWeight: 600 }}>
                                    <Car size={12} /> Police ({acc.police})
                                  </span>
                                )}
                                {acc.fireforce && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#c2410c', fontWeight: 600 }}>
                                    <Flame size={12} /> Fire Force ({acc.fireforce})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons Expanded Block */}
                          <AnimatePresence>
                            {isExpanded && !isResolved && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ overflow: 'hidden', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}
                              >
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                                  EMERGENCY ACTIONS
                                </span>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  {/* Ambulance */}
                                  <button
                                    onClick={e => { e.stopPropagation(); handleAssignResource(acc.id, 'ambulance'); }}
                                    disabled={!!assigning}
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.22)',
                                      borderRadius: '8px', padding: '8px 12px', color: '#dc2626', fontSize: '12px',
                                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                  >
                                    <Ambulance size={12} />
                                    {acc.ambulance ? 'Reassign Ambulance' : 'Assign Ambulance'}
                                  </button>
                                  {/* Police */}
                                  <button
                                    onClick={e => { e.stopPropagation(); handleAssignResource(acc.id, 'police'); }}
                                    disabled={!!assigning}
                                    style={{
                                      background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.22)',
                                      borderRadius: '8px', padding: '8px 12px', color: '#2563eb', fontSize: '12px',
                                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                  >
                                    <Car size={12} />
                                    {acc.police ? 'Reassign Police' : 'Assign Police'}
                                  </button>
                                  {/* Fire Force */}
                                  <button
                                    onClick={e => { e.stopPropagation(); handleAssignResource(acc.id, 'fireforce'); }}
                                    disabled={!!assigning}
                                    style={{
                                      background: 'rgba(249, 115, 22, 0.05)', border: '1px solid rgba(249, 115, 22, 0.22)',
                                      borderRadius: '8px', padding: '8px 12px', color: '#ea580c', fontSize: '12px',
                                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                  >
                                    <Flame size={12} />
                                    {acc.fireforce ? 'Reassign Fire' : 'Assign Fire Force'}
                                  </button>
                                  {/* Mark Resolved */}
                                  <button
                                    onClick={e => { e.stopPropagation(); handleResolveIncident(acc.id); }}
                                    disabled={!!assigning}
                                    style={{
                                      background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)',
                                      borderRadius: '8px', padding: '8px 12px', color: '#16a34a', fontSize: '12px',
                                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                      marginLeft: 'auto'
                                    }}
                                  >
                                    <CheckCircle size={12} />
                                    Mark Resolved
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Right Column: Live Map Section + Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Google Maps / Radar Panel */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Compass size={18} color="#3b82f6" />
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Live Emergency Map Tracker
                    </h2>
                  </div>
                  
                  {/* Map Type Switcher */}
                  <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.04)', borderRadius: '6px', padding: '2px' }}>
                    <button
                      onClick={() => setMapType('radar')}
                      style={{
                        padding: '4px 10px', fontSize: '10.5px', fontWeight: 700, borderRadius: '4px', border: 'none', cursor: 'pointer',
                        background: mapType === 'radar' ? '#2563eb' : 'transparent', color: mapType === 'radar' ? '#ffffff' : '#475569'
                      }}
                    >
                      Radar View
                    </button>
                    <button
                      onClick={() => setMapType('google')}
                      style={{
                        padding: '4px 10px', fontSize: '10.5px', fontWeight: 700, borderRadius: '4px', border: 'none', cursor: 'pointer',
                        background: mapType === 'google' ? '#2563eb' : 'transparent', color: mapType === 'google' ? '#ffffff' : '#475569'
                      }}
                    >
                      Google Maps
                    </button>
                  </div>
                </div>

                {/* Map Display area */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', height: '340px', overflow: 'hidden', position: 'relative' }}>
                  {mapType === 'radar' ? (
                    // Vector Tactical Radar Grid Map
                    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Grid Background */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 0), radial-gradient(rgba(37, 99, 235, 0.05) 2px, transparent 0)',
                        backgroundSize: '24px 24px', opacity: 0.6
                      }} />

                      {/* Moving radar scanning sweeps */}
                      <div style={{
                        position: 'absolute', width: '280px', height: '280px', borderRadius: '50%',
                        border: '1.5px dashed rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.1)' }} />
                        <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(59, 130, 246, 0.08)' }} />
                        <div style={{
                          position: 'absolute', inset: 0, borderRadius: '50%',
                          background: 'conic-gradient(from 0deg, rgba(37, 99, 235, 0.05) 0deg, transparent 90deg)',
                          animation: 'spinRadar 8s linear infinite'
                        }} />
                      </div>

                      {/* Plot active accident nodes */}
                      {accidents.map(acc => {
                        const coords = locationCoords[acc.location] || { offset: { x: 50, y: 50 } };
                        return (
                          <div
                            key={acc.id}
                            style={{
                              position: 'absolute',
                              left: `${coords.offset.x}%`,
                              top: `${coords.offset.y}%`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 10
                            }}
                          >
                            <span style={{
                              width: '12px', height: '12px', borderRadius: '50%',
                              background: acc.resolved ? '#16a34a' : '#dc2626',
                              display: 'block',
                              boxShadow: acc.resolved ? '0 0 8px rgba(22, 163, 74, 0.2)' : '0 0 10px rgba(220, 38, 38, 0.2)',
                              animation: acc.resolved ? 'none' : 'pulse 1.2s infinite'
                            }} />
                            <div style={{
                              position: 'absolute', left: '16px', top: '-6px', background: 'rgba(255, 255, 255, 0.95)',
                              padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700,
                              whiteSpace: 'nowrap', border: '1px solid #cbd5e1', color: '#0f172a'
                            }}>
                              {acc.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Real Google Map Embed via FREE standard iframe loader (no key needed)
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://maps.google.com/maps?q=Chennai%20Highway&t=&z=10&ie=UTF8&iwloc=&output=embed"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* District Emergency Dispatch Nodes logs */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Bell size={18} color="#3b82f6" />
                  <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Emergency Logs Feed
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {accidents.map((acc, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        borderLeft: `3px solid ${acc.resolved ? '#16a34a' : '#dc2626'}`,
                        fontSize: '11.5px',
                        color: '#334155'
                      }}
                    >
                      {acc.resolved ? (
                        <span>
                          <strong>RESOLVED</strong>: Accident scene at <strong>{acc.location}</strong> has been cleared. Resources returned.
                        </span>
                      ) : (
                        <span>
                          <strong>CRITICAL</strong>: Accident detected at <strong>{acc.location}</strong>. Dispatches: {acc.ambulance ? `AMB (${acc.ambulance})` : 'Pending'}, {acc.police ? `PCL (${acc.police})` : 'Pending'}.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.9); }
          }
          @keyframes spinRadar {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (max-width: 1024px) {
            .dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </RoleGuard>
  );
}
