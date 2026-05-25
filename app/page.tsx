'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle, Shield, BarChart2, ArrowRight, Loader2,
  Lock, Wifi, Satellite, CheckCircle2, Activity,
  Phone, MessageCircle, MapPin, AlertTriangle, AlertCircle, Plus, X, UploadCloud, Globe, Compass
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { login, type Role } from '@/lib/auth';

const ROLES = [
  {
    id: 'public' as Role,
    icon: UserCircle,
    badge: 'CITIZEN PORTAL',
    title: 'Public Citizen Portal',
    subtitle: 'Emergency Assistance Services',
    description: 'Access 24×7 emergency roadside assistance with live GPS tracking and instant dispatch coordination.',
    color: '#1d4ed8',
    glowColor: 'rgba(29, 78, 216, 0.15)',
    features: ['GPS Emergency SOS', 'WhatsApp Dispatch', 'Live Location Share', '24×7 Helpline'],
  },
  {
    id: 'officer' as Role,
    icon: Shield,
    badge: 'OFFICER ACCESS',
    title: 'Officer Command Center',
    subtitle: 'Emergency Response Dashboard',
    description: 'Coordinate real-time incident response. Dispatch ambulances, police and fire units across the district.',
    color: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.12)',
    features: ['Live Incident Feed', 'Unit Dispatch', 'AI Alert System', 'GPS Fleet Tracking'],
  },
  {
    id: 'government' as Role,
    icon: BarChart2,
    badge: 'OFFICIAL ACCESS',
    title: 'Government Analytics Hub',
    subtitle: 'Smart City Intelligence Center',
    description: 'District-level analytics, AI accident predictions, heatmaps and official PDF reports for policy decisions.',
    color: '#16a34a',
    glowColor: 'rgba(22, 163, 74, 0.12)',
    features: ['Accident Heatmaps', 'AI Predictions', 'District Reports', 'PDF Export'],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<Role | null>(null);
  const [hovered, setHovered] = useState<Role | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Floating menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // GPS coordinates state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('collision');
  const [reportSeverity, setReportSeverity] = useState('critical');
  const [reportLandmark, setReportLandmark] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submittingAlert, setSubmittingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Real-time chart data
  const [liveIncidents, setLiveIncidents] = useState([
    { time: '08:00', ActiveIncidents: 12, PredictedLoad: 15 },
    { time: '10:00', ActiveIncidents: 18, PredictedLoad: 20 },
    { time: '12:00', ActiveIncidents: 28, PredictedLoad: 26 },
    { time: '14:00', ActiveIncidents: 15, PredictedLoad: 17 },
    { time: '16:00', ActiveIncidents: 22, PredictedLoad: 23 },
    { time: '18:00', ActiveIncidents: 35, PredictedLoad: 31 },
    { time: '20:00', ActiveIncidents: 26, PredictedLoad: 28 },
  ]);

  const [responseTimeData, setResponseTimeData] = useState([
    { time: '08:00', DispatchTime: 18.2, Target: 15 },
    { time: '10:00', DispatchTime: 16.5, Target: 15 },
    { time: '12:00', DispatchTime: 21.0, Target: 15 },
    { time: '14:00', DispatchTime: 14.8, Target: 15 },
    { time: '16:00', DispatchTime: 17.5, Target: 15 },
    { time: '18:00', DispatchTime: 12.3, Target: 15 },
    { time: '20:00', DispatchTime: 13.9, Target: 15 },
  ]);

  useEffect(() => {
    setMounted(true);
    // Update live clock
    const updateTime = () => {
      const now = new Date();
      // Format to IST style
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }));
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // Simulate incoming telemetry data updates
    const telemetryInterval = setInterval(() => {
      setLiveIncidents(prev => {
        const nextData = [...prev];
        const lastIndex = nextData.length - 1;
        const offset = Math.floor(Math.random() * 5) - 2; // change by -2 to +2
        nextData[lastIndex] = {
          ...nextData[lastIndex],
          ActiveIncidents: Math.max(5, nextData[lastIndex].ActiveIncidents + offset)
        };
        return nextData;
      });

      setResponseTimeData(prev => {
        const nextData = [...prev];
        const lastIndex = nextData.length - 1;
        const offset = (Math.random() * 2 - 1).toFixed(1); // change by -1 to +1
        nextData[lastIndex] = {
          ...nextData[lastIndex],
          DispatchTime: Math.max(8, parseFloat((nextData[lastIndex].DispatchTime + parseFloat(offset)).toFixed(1)))
        };
        return nextData;
      });
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  const handleLogin = (role: Role) => {
    if (loading) return;
    setLoading(role);
    login(role);
    setTimeout(() => {
      router.push(role === 'public' ? '/public' : `/${role}`);
    }, 1300);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGpsLoading(false);
      },
      (error) => {
        console.error(error);
        setGpsError('Failed to capture GPS coordinates. Please check location permissions.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Build dynamic pre-filled WhatsApp link
  const getWhatsAppLink = () => {
    const baseText = "EMERGENCY SOS ALERT! I need immediate roadside assistance.";
    const locationText = coords 
      ? ` My current GPS location is: https://maps.google.com/?q=${coords.latitude},${coords.longitude} (Lat: ${coords.latitude.toFixed(6)}, Lng: ${coords.longitude.toFixed(6)})`
      : " (Location coordinates not attached. Please share live location via WhatsApp)";
    return `https://wa.me/918072522246?text=${encodeURIComponent(baseText + locationText)}`;
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAlert(true);
    setTimeout(() => {
      setSubmittingAlert(false);
      setAlertSuccess(true);
      // Auto-close after notification duration
      setTimeout(() => {
        setAlertSuccess(false);
        setReportModalOpen(false);
        setReportLandmark('');
        setReportDescription('');
        setFileName(null);
      }, 2500);
    }, 1800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', 'Manrope', ui-sans-serif, system-ui, sans-serif",
      color: '#0f172a',
    }}>
      {/* ── Rotating Ashoka Chakra Watermark ── */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(90vw, 750px)',
        height: 'min(90vw, 750px)',
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ animation: 'spinChakra 120s linear infinite', transformOrigin: 'center' }}>
          <circle cx="50" cy="50" r="45" stroke="#1d4ed8" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="#1d4ed8" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="8" stroke="#1d4ed8" strokeWidth="1" fill="none" />
          {Array.from({ length: 24 }).map((_, idx) => {
            const angle = (idx * 360) / 24;
            const x = 50 + 42 * Math.cos((angle * Math.PI) / 180);
            const y = 50 + 42 * Math.sin((angle * Math.PI) / 180);
            return (
              <g key={idx}>
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke="#1d4ed8"
                  strokeWidth="0.8"
                />
                <circle cx={x} cy={y} r="1" fill="#1d4ed8" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Smart Cyber Grid Background ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: 'linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        pointerEvents: 'none',
        zIndex: 0,
        animation: 'gridShift 30s linear infinite'
      }} />

      {/* ── Tricolor National Banner Line ── */}
      <div style={{ width: '100%', height: '5px', display: 'flex', position: 'relative', zIndex: 50 }}>
        <div style={{ flex: 1, background: '#FF9933' }} /> {/* Saffron */}
        <div style={{ flex: 1, background: '#FFFFFF' }} /> {/* White */}
        <div style={{ flex: 1, background: '#138808' }} /> {/* Green */}
      </div>

      {/* ── Header Area ── */}
      <header style={{
        width: '100%',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        zIndex: 40,
      }}>
        {/* Ministry Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(29, 78, 216, 0.2)'
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <div style={{
              color: '#475569',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '4px'
            }}>
              Ministry of Road Transport &amp; Highways
            </div>
            <div style={{
              color: '#0f172a',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.3px'
            }}>
              RoadSOS — National Portal
            </div>
          </div>
        </div>

        {/* Live Clock HUD */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(29, 78, 216, 0.15)',
          boxShadow: '0 4px 12px rgba(29, 78, 216, 0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
          borderRadius: '10px',
          padding: '8px 16px',
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'inline-block',
              boxShadow: '0 0 8px #16a34a',
              animation: 'livePulse 2s ease-in-out infinite'
            }} />
            <span style={{ fontWeight: 800, color: '#16a34a', letterSpacing: '0.05em' }}>LIVE IST</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(15,23,42,0.1)' }} />
          <div style={{ color: '#0f172a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{currentTime || '00:00:00'}</div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(15,23,42,0.1)' }} />
          <div style={{ color: '#475569', fontSize: '11px', fontWeight: 600 }}>{currentDate || 'Loading...'}</div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main style={{
        flex: 1,
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}>

        {/* Live Location Alert Bar if coords are shared */}
        {coords && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a' }}>
              <Compass size={18} className="animate-spin-slow" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                Live GPS Location Lock Active: <span style={{ fontFamily: 'monospace' }}>{coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}</span>
              </span>
            </div>
            <button
              onClick={() => setCoords(null)}
              style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', padding: '4px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Hero Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 42px)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            marginBottom: '12px'
          }}>
            National Smart Emergency <br />
            <span style={{
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Response &amp; Operations Portal
            </span>
          </h1>
          <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            AI-driven crisis dispatch, automated vehicle monitoring, and real-time smart city analytics. Select your administrative dashboard to proceed.
          </p>
        </div>

        {/* ── Glassmorphism Cards Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isHovered = hovered === role.id;
            const isLoading = loading === role.id;

            return (
              <div
                key={role.id}
                onMouseEnter={() => setHovered(role.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleLogin(role.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1.5px solid ${isHovered || isLoading ? role.color : 'rgba(15, 23, 42, 0.08)'}`,
                  borderRadius: '18px',
                  padding: '30px',
                  cursor: loading ? (isLoading ? 'wait' : 'not-allowed') : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered && !loading ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: isHovered || isLoading
                    ? `0 20px 40px rgba(15, 23, 42, 0.08), 0 0 20px ${role.glowColor}`
                    : '0 4px 20px rgba(15, 23, 42, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  opacity: loading && !isLoading ? 0.4 : 1,
                }}
              >
                {/* Visual Glow Layer */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  background: role.color,
                  filter: 'blur(45px)',
                  opacity: isHovered ? 0.25 : 0.08,
                  borderRadius: '50%',
                  transition: 'opacity 0.3s ease'
                }} />

                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: `1px solid rgba(15, 23, 42, 0.08)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
                  }}>
                    <Icon size={24} color={role.color} />
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    background: 'rgba(15,23,42,0.04)',
                    color: '#475569',
                    border: '1px solid rgba(15,23,42,0.06)'
                  }}>
                    {role.badge}
                  </span>
                </div>

                {/* Typography */}
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.3px' }}>
                  {role.title}
                </h3>
                <h4 style={{ fontSize: '10px', fontWeight: 800, color: role.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {role.subtitle}
                </h4>
                <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px', minHeight: '58px' }}>
                  {role.description}
                </p>

                {/* Features List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {role.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                      <CheckCircle2 size={13} color={role.color} style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <button
                  disabled={!!loading}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: isLoading ? 'rgba(15,23,42,0.05)' : role.color,
                    border: `1px solid ${isLoading ? 'rgba(15,23,42,0.08)' : role.color}`,
                    borderRadius: '10px',
                    color: isLoading ? role.color : '#ffffff',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    boxShadow: isLoading || loading ? 'none' : `0 4px 15px ${role.color}25`
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Accessing Command Center...
                    </>
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight size={15} style={{ transform: isHovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Recharts Command Telemetry Section ── */}
        <section style={{
          marginTop: '20px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 30px rgba(15, 23, 42, 0.02), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Activity size={20} color="#1d4ed8" />
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                National Command Telemetry Feed
              </h3>
              <p style={{ color: '#475569', fontSize: '12px' }}>
                Real-time incident updates and emergency response forecasts compiled from regional control centers.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
            {/* Chart 1: Line Chart */}
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(15,23,42,0.06)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Real-time Incident Load vs AI Forecast</span>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: '#eff6ff', color: '#1d4ed8' }}>AUTO REFRESH ACTIVE</span>
              </div>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveIncidents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="ActiveIncidents" stroke="#1d4ed8" strokeWidth={2.5} name="Active Incidents" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="PredictedLoad" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="AI Predicted Load" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Area Chart */}
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(15,23,42,0.06)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Avg Emergency Response Time (Minutes)</span>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626' }}>TARGET: &lt;15 MIN</span>
              </div>
              <div style={{ width: '100%', height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="DispatchTime" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResponse)" name="Dispatch Response" />
                    <Line type="monotone" dataKey="Target" stroke="#16a34a" strokeWidth={1.5} strokeDasharray="3 3" name="SLA Target" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '24px 0 10px',
          borderTop: '1px solid rgba(15,23,42,0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: '#ffffff',
            border: '1px solid rgba(15,23,42,0.08)',
            borderRadius: '8px',
            padding: '8px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {[
              { Icon: Lock, text: 'AES 256 Encryption' },
              { Icon: Wifi, text: 'Real-time GPS Sync' },
              { Icon: Satellite, text: 'Emergency SatLink' },
              { Icon: Activity, text: 'Active AI Load Balance' }
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '11.5px', fontWeight: 600 }}>
                <Icon size={12} color="#1d4ed8" />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5, maxWidth: '600px' }}>
            © 2026 National Smart Emergency Response System. Ministry of Road Transport &amp; Highways. Authorized personnel access only. Actions logged under Information Technology Act 2000.
          </p>
        </footer>

      </main>

      {/* ── Emergency Quick Action Widget (Bottom Right) ── */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px'
      }}>
        {/* Expanded Panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '4px'
              }}
            >
              {/* WhatsApp SOS Action */}
              <motion.a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #16a34a',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(22, 163, 74, 0.15)',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={15} color="#16a34a" fill="#16a34a" />
                </div>
                <span>WhatsApp SOS Dispatch</span>
              </motion.a>

              {/* Share GPS Location Action */}
              <motion.button
                onClick={handleShareLocation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: `1.5px solid ${coords ? '#16a34a' : '#1d4ed8'}`,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(29, 78, 216, 0.1)',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: coords ? '#f0fdf4' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {gpsLoading ? (
                    <Loader2 size={14} color="#1d4ed8" style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Compass size={15} color={coords ? '#16a34a' : '#1d4ed8'} />
                  )}
                </div>
                <span>
                  {gpsLoading ? 'Locking Location...' : coords ? 'GPS Coordinates Locked' : 'Share Live GPS Coordinates'}
                </span>
              </motion.button>

              {/* Call Ambulance Action */}
              <motion.a
                href="tel:+918072522246"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #dc2626',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.15)',
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={15} color="#dc2626" />
                </div>
                <span>Call Emergency Ambulance</span>
              </motion.a>

              {/* Report Accident Modal Trigger */}
              <motion.button
                onClick={() => {
                  setReportModalOpen(true);
                  setMenuOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #f59e0b',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.1)',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={15} color="#f59e0b" />
                </div>
                <span>Report Incident Form</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SOS Primary Button */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            background: menuOpen ? 'linear-gradient(135deg, #475569, #0f172a)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: menuOpen ? '0 8px 24px rgba(15,23,42,0.3)' : '0 8px 24px rgba(220, 38, 38, 0.4)',
            position: 'relative',
          }}
        >
          {menuOpen ? (
            <X size={26} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
              <AlertCircle size={22} />
              <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.05em' }}>SOS</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* ── Report Accident Popup Modal ── */}
      <AnimatePresence>
        {reportModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              style={{
                width: '100%',
                maxWidth: '540px',
                background: '#ffffff',
                border: '1px solid rgba(15, 23, 42, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Modal header */}
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
                padding: '20px 24px',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>Report Smart Highway Accident</h3>
                  <p style={{ opacity: 0.8, fontSize: '11px', margin: '2px 0 0' }}>Alert local dispatches with telemetry data</p>
                </div>
                <button
                  onClick={() => setReportModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleReportSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Geolocation autofill notifier */}
                <div style={{
                  background: coords ? '#f0fdf4' : '#eff6ff',
                  border: `1px solid ${coords ? '#bbf7d0' : '#bfdbfe'}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: coords ? '#16a34a' : '#1d4ed8', fontWeight: 700 }}>
                    <MapPin size={14} />
                    <span>{coords ? 'Live GPS Location Attached' : 'Auto-Capture GPS Coordinates'}</span>
                  </div>
                  {!coords && (
                    <button
                      type="button"
                      onClick={handleShareLocation}
                      style={{
                        padding: '4px 10px',
                        background: '#1d4ed8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {gpsLoading ? 'Locating...' : 'Get GPS'}
                    </button>
                  )}
                </div>

                {/* Grid Type + Severity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Accident Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Accident Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: '#f8fafc',
                        color: '#0f172a',
                      }}
                    >
                      <option value="collision">Vehicle Collision</option>
                      <option value="breakdown">Engine Breakdown</option>
                      <option value="fire">Fire / Spark Alert</option>
                      <option value="medical">Medical emergency</option>
                      <option value="hazard">Road Obstruction</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Severity Level</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['low', 'medium', 'critical'].map((sev) => {
                        const isSelected = reportSeverity === sev;
                        const colors: Record<string, string> = { low: '#16a34a', medium: '#f59e0b', critical: '#dc2626' };
                        return (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setReportSeverity(sev)}
                            style={{
                              flex: 1,
                              padding: '10px 0',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              borderRadius: '8px',
                              border: isSelected ? `2.5px solid ${colors[sev]}` : '1px solid #cbd5e1',
                              background: isSelected ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                              color: colors[sev],
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Landmark Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Highway Landmark / Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NH-48, km 42 near toll plaza"
                    value={reportLandmark}
                    onChange={(e) => setReportLandmark(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#ffffff',
                      color: '#0f172a'
                    }}
                  />
                </div>

                {/* Drag Drop File Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Attach Incident Photo (Optional)</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      width: '100%',
                      border: `2px dashed ${dragActive ? '#1d4ed8' : '#cbd5e1'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      textAlign: 'center',
                      background: dragActive ? '#f0fdf4' : '#f8fafc',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="file-upload"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <UploadCloud size={24} color="#64748b" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        {fileName ? fileName : 'Drag & Drop image here, or Browse'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>PNG, JPG up to 10MB</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Emergency Description / Details</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="State details such as injured counts, blockage status, vehicles involved..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#ffffff',
                      color: '#0f172a',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submittingAlert || alertSuccess}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: alertSuccess ? '#16a34a' : 'linear-gradient(135deg, #b91c1c, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: submittingAlert || alertSuccess ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: alertSuccess ? '0 4px 15px rgba(22, 163, 74, 0.3)' : '0 4px 15px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  {submittingAlert ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Broadcasting Emergency Alert...
                    </>
                  ) : alertSuccess ? (
                    <>
                      <CheckCircle2 size={16} />
                      Dispatched Successfully!
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} />
                      Submit Emergency Dispatch Broadcast
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spinChakra {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gridShift {
          0% { background-position: 0 0; }
          100% { background-position: 64px 64px; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.85); }
        }
        .animate-spin-slow {
          animation: spinChakra 12s linear infinite;
        }
      `}</style>
    </div>
  );
}