'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  BatteryCharging, Fuel, CircleDot, Truck, ShieldAlert, Settings, Bike, KeyRound,
  Navigation, Loader2, MessageCircle, Phone, CheckCircle, MapPin, Map, User, Smartphone, Car, AlertCircle, Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';


/* ── Problem cards ──────────────────────────────── */
const problems = [
  { id: 'battery', label: 'Battery Jump-Start', sub: 'Dead battery / won\'t start', icon: BatteryCharging, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', glow: 'rgba(29,78,216,0.1)' },
  { id: 'fuel', label: 'Fuel Delivery', sub: 'Petrol / Diesel ran out', icon: Fuel, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', glow: 'rgba(245,158,11,0.1)' },
  { id: 'tyre', label: 'Flat Tyre', sub: 'Puncture / spare fit', icon: CircleDot, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', glow: 'rgba(124,58,237,0.1)' },
  { id: 'tow', label: 'Tow Truck', sub: 'Breakdown / accident', icon: Truck, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', glow: 'rgba(8,145,178,0.1)' },
  { id: 'accident', label: 'Accident Help', sub: 'First-response & tow', icon: ShieldAlert, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', glow: 'rgba(220,38,38,0.1)' },
  { id: 'breakdown', label: 'General Breakdown', sub: 'Engine / overheat etc.', icon: Settings, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', glow: 'rgba(5,150,105,0.1)' },
  { id: 'bike', label: 'Bike Breakdown', sub: 'Two-wheeler assistance', icon: Bike, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', glow: 'rgba(234,88,12,0.1)' },
  { id: 'lockout', label: 'Car Lockout', sub: 'Keys locked inside', icon: KeyRound, color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8', glow: 'rgba(219,39,119,0.1)' },
];

/* ── Problem detail info ────────────────────────── */
const problemDetails: Record<string, { eta: string; cost: string; info: string; steps: string[] }> = {
  battery:   { eta: '10–15 min', cost: '₹299 – ₹599', info: 'Our technician arrives with professional jump-start cables and a portable power pack. Works on all car & bike batteries.', steps: ['Technician arrives with jump pack', 'Battery terminals checked & cleaned', 'Vehicle jump-started safely', 'Alternator & charging tested'] },
  fuel:      { eta: '15–25 min', cost: '₹149 + fuel cost', info: 'We deliver Petrol or Diesel to your exact GPS location. You only pay for fuel + a small delivery fee.', steps: ['Confirm fuel type (Petrol/Diesel)', 'Dispatch nearest fuel partner', 'Fuel delivered in approved container', 'Vehicle verified & running'] },
  tyre:      { eta: '12–20 min', cost: '₹249 – ₹499', info: 'Certified tyre technician fits your spare or patches the puncture on-site. Includes balancing check.', steps: ['Technician arrives with tools', 'Puncture assessed on-site', 'Spare fitted or puncture patched', 'Tyre pressure & balance checked'] },
  tow:       { eta: '20–35 min', cost: '₹799 – ₹1,999', info: 'Flatbed or wheel-lift tow truck dispatched to your location. Safe transport to your preferred workshop.', steps: ['Flatbed truck dispatched', 'Vehicle loaded safely', 'Transported to preferred workshop', 'Drop & handover confirmed'] },
  accident:  { eta: '8–15 min', cost: 'Free assessment', info: 'First responder + tow truck dispatched immediately. We also assist with police report & insurance coordination.', steps: ['First responder dispatched urgently', 'Scene secured & occupants assisted', 'Tow truck summoned if needed', 'Insurance & police coordination'] },
  breakdown: { eta: '15–25 min', cost: '₹399 – ₹999', info: 'Certified mechanic diagnoses engine, overheating, electrical, or starting issues on-site. Minor repairs done immediately.', steps: ['Mechanic with diagnostic tools', 'Engine & electrical assessed', 'Minor repairs done on-spot', 'Tow arranged if major repair needed'] },
  bike:      { eta: '10–18 min', cost: '₹199 – ₹449', info: 'Covers all two-wheelers — motorcycles, scooters, and e-bikes. Same fast response as car services.', steps: ['Two-wheeler specialist dispatched', 'Problem diagnosed on-site', 'Repairs / tyre / battery handled', 'Test ride confirmed before leaving'] },
  lockout:   { eta: '12–22 min', cost: '₹349 – ₹649', info: 'Licensed automotive locksmith opens your car without any damage. Works on all car brands and key types.', steps: ['Licensed locksmith dispatched', 'Vehicle entry method confirmed', 'Car opened without damage', 'Spare key advice provided'] },
};

interface FormData {
  name: string; mobile: string; vehicle: string; problem: string; location: string; lat: number | null; lng: number | null;
}

export default function SOSFlow() {
  const formRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({ name: '', mobile: '', vehicle: '', problem: '', location: '', lat: null, lng: null });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // When card selected → prefill problem and scroll to form
  const selectProblem = (p: typeof problems[0]) => {
    setSelected(p.id);
    setForm(f => ({ ...f, problem: p.label }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getGPS = () => {
    if (!navigator.geolocation) { setGpsStatus('error'); return; }
    setGpsLoading(true); setGpsStatus('idle');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setForm(f => ({ ...f, lat, lng, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
        setGpsLoading(false); setGpsStatus('success');
      },
      () => { setGpsLoading(false); setGpsStatus('error'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedProblem = problems.find(p => p.id === selected);
  const detail = selected ? problemDetails[selected] : null;

  const sendWhatsApp = async () => {
    setSending(true);

    try {
      const { error } = await supabase.from('incidents').insert([
        {
          type: form.problem || 'Other Emergency',
          name: form.name || null,
          mobile: form.mobile || null,
          vehicle: form.vehicle || null,
          location: form.location || null,
          lat: form.lat,
          lng: form.lng,
          severity: selected === 'accident' ? 'critical' : (selected === 'tow' || selected === 'breakdown') ? 'medium' : 'low',
          status: 'pending',
          victims: selected === 'accident' ? 1 : 0
        }
      ]);
      if (error) {
        console.error('Error inserting incident into Supabase:', error);
      }
    } catch (err) {
      console.error('Failed to submit incident:', err);
    }

    const mapsLink = form.lat && form.lng
      ? `https://maps.google.com/?q=${form.lat},${form.lng}`
      : form.location || 'Location not shared';

    const msg =
`🚨 *RoadSOS Emergency Request*

👤 *Name:* ${form.name || 'Not provided'}
📱 *Mobile:* ${form.mobile || 'Not provided'}
🚗 *Vehicle:* ${form.vehicle || 'Not provided'}
🔧 *Problem:* ${form.problem || 'Not specified'}

📍 *Live GPS Location:*
${mapsLink}

⏱️ *Requested at:* ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}

_Sent via RoadSOS Emergency Platform_`;

    setSending(false);
    setSent(true);
    window.open(`https://wa.me/918072522246?text=${encodeURIComponent(msg)}`, '_blank');
    setTimeout(() => setSent(false), 5000);
  };

  /* ── styles ── */
  const S = {
    section: { background: '#f8fafc', padding: '72px 0' } as React.CSSProperties,
    wrap: { maxWidth: '1100px', margin: '0 auto', padding: '0 32px' } as React.CSSProperties,
    sectionTitle: { color: '#0f172a', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', marginBottom: '6px', letterSpacing: '-0.5px' } as React.CSSProperties,
    sectionSub: { color: '#64748b', fontSize: '14px', marginBottom: '28px' } as React.CSSProperties,
    input: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '13px 13px 13px 42px', color: '#0f172a', fontSize: '14px', width: '100%', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.25s' } as React.CSSProperties,
    label: { color: '#64748b', fontSize: '11px', fontWeight: 600, marginBottom: '7px', display: 'block', letterSpacing: '0.06em', textTransform: 'uppercase' } as React.CSSProperties,
    iconWrap: { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' } as React.CSSProperties,
  };

  return (
    <>
      {/* ── CHOOSE PROBLEM ──────────────────────────── */}
      <section id="services" style={{ ...S.section, paddingTop: '80px', paddingBottom: '60px' }}>
        <div style={S.wrap}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Step 1</p>
            <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(20px,3vw,30px)', marginBottom: '4px', letterSpacing: '-0.5px' }}>What&apos;s your problem?</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>Tap a card to prefill the request form below</p>
          </motion.div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {problems.map((p, i) => {
              const Icon = p.icon;
              const isActive = selected === p.id;
              return (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 24px ${p.glow}` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectProblem(p)}
                  style={{
                    background: isActive ? p.bg : '#ffffff',
                    border: `2px solid ${isActive ? p.color : '#e2e8f0'}`,
                    borderRadius: '14px', padding: '20px', cursor: 'pointer',
                    transition: 'all 0.25s',
                    boxShadow: isActive ? `0 4px 16px ${p.glow}` : '0 1px 4px rgba(0,0,0,0.06)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  {isActive && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', width: '22px', height: '22px', borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={14} color="white" />
                    </div>
                  )}
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: p.bg, border: `1px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Icon size={20} color={p.color} />
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{p.label}</div>
                  <div style={{ color: '#64748b', fontSize: '12px' }}>{p.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROBLEM DETAIL CARD ─────────────────────── */}
      <AnimatePresence>
        {selected && detail && selectedProblem && (
          <motion.section key={selected} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}
            style={{ overflow: 'hidden', background: '#f8fafc' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 40px' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                style={{ background: `linear-gradient(135deg, ${selectedProblem.bg}, rgba(255,255,255,0.02))`, border: `1px solid ${selectedProblem.border}`, borderRadius: '20px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', alignItems: 'start' }}>
                {/* Problem info */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', gridColumn: 'span 2' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: selectedProblem.bg, border: `1px solid ${selectedProblem.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <selectedProblem.icon size={28} color={selectedProblem.color} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '20px', marginBottom: '6px' }}>{selectedProblem.label}</div>
                    <div style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{detail.info}</div>
                  </div>
                </div>

                {/* ETA & Cost */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ background: '#f1f5f9', borderRadius: '14px', padding: '16px 20px', flex: 1, minWidth: '120px' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Est. Arrival</div>
                    <div style={{ color: selectedProblem.color, fontWeight: 800, fontSize: '20px' }}>{detail.eta}</div>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: '14px', padding: '16px 20px', flex: 1, minWidth: '120px' }}>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Approx Cost</div>
                    <div style={{ color: '#16a34a', fontWeight: 800, fontSize: '20px' }}>{detail.cost}</div>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>What happens next</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {detail.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${selectedProblem.color}25`, border: `1px solid ${selectedProblem.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedProblem.color, fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── REQUEST FORM ────────────────────────────── */}
      <section id="request" ref={formRef} style={{ ...S.section, paddingTop: selected ? '40px' : '80px' }}>
        <div style={S.wrap}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Step 2</p>
            <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(20px,3vw,30px)', marginBottom: '4px', letterSpacing: '-0.5px' }}>Request help</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>We&apos;ll share your live location with the nearest partner</p>
          </motion.div>
 
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: '#ffffff', border: `1px solid ${selectedProblem ? selectedProblem.border : '#e2e8f0'}`, borderRadius: '20px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)', transition: 'border-color 0.4s' }}>
 
            {/* Row 1: Name + Mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ ...S.label, fontSize: '11px' }}>Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={S.iconWrap as React.CSSProperties} />
                  <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = selectedProblem?.color || 'rgba(29,78,216,0.6)'; e.target.style.boxShadow = `0 0 0 3px ${selectedProblem?.color || 'rgba(29,78,216,0.15)'}20`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div>
                <label style={{ ...S.label, fontSize: '11px' }}>Mobile</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={16} style={S.iconWrap as React.CSSProperties} />
                  <input name="mobile" type="tel" placeholder="+91" value={form.mobile} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = selectedProblem?.color || 'rgba(29,78,216,0.6)'; e.target.style.boxShadow = `0 0 0 3px ${selectedProblem?.color || 'rgba(29,78,216,0.15)'}20`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
            </div>
 
            {/* Row 2: Problem + Vehicle */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ ...S.label, fontSize: '11px' }}>Problem</label>
                <div style={{ position: 'relative' }}>
                  <AlertCircle size={16} style={S.iconWrap as React.CSSProperties} />
                  <select name="problem" value={form.problem} onChange={handleChange}
                    style={{ ...S.input, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', background: '#ffffff', borderColor: selectedProblem ? selectedProblem.color + '60' : '#e2e8f0' }}>
                    <option value="" disabled style={{ background: '#ffffff', color: '#64748b' }}>Select problem</option>
                    {problems.map(p => <option key={p.id} value={p.label} style={{ background: '#ffffff', color: '#0f172a' }}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ ...S.label, fontSize: '11px' }}>Vehicle</label>
                <div style={{ position: 'relative' }}>
                  <Car size={16} style={S.iconWrap as React.CSSProperties} />
                  <input name="vehicle" type="text" placeholder="Car/Bike, No., Model" value={form.vehicle} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = selectedProblem?.color || 'rgba(29,78,216,0.6)'; e.target.style.boxShadow = `0 0 0 3px ${selectedProblem?.color || 'rgba(29,78,216,0.15)'}20`; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
            </div>
 
            {/* Row 3: Location + GPS */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ ...S.label, fontSize: '11px' }}>Location</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <MapPin size={16} style={S.iconWrap as React.CSSProperties} />
                  <input name="location" type="text" placeholder="Tap Get GPS or type landmark" value={form.location} onChange={handleChange} style={S.input}
                    onFocus={e => { e.target.style.borderColor = selectedProblem?.color || 'rgba(29,78,216,0.6)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                </div>
                <motion.button type="button" onClick={getGPS} disabled={gpsLoading}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderRadius: '12px', border: `1px solid ${gpsStatus === 'success' ? 'rgba(22,163,74,0.3)' : gpsStatus === 'error' ? 'rgba(220,38,38,0.3)' : 'rgba(29,78,216,0.3)'}`, background: gpsStatus === 'success' ? 'rgba(22,163,74,0.08)' : gpsStatus === 'error' ? 'rgba(220,38,38,0.08)' : 'rgba(29,78,216,0.08)', color: gpsStatus === 'success' ? '#16a34a' : gpsStatus === 'error' ? '#dc2626' : '#1d4ed8', fontWeight: 700, fontSize: '14px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {gpsLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : gpsStatus === 'success' ? <CheckCircle size={16} /> : <Navigation size={16} />}
                  Get GPS
                </motion.button>
              </div>
 
              {/* GPS preview */}
              <AnimatePresence>
                {form.lat && form.lng && (
                  <motion.a href={`https://maps.google.com/?q=${form.lat},${form.lng}`} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                    <Map size={14} />
                    Live location detected — {form.lat.toFixed(5)}, {form.lng.toFixed(5)} · View on Maps
                  </motion.a>
                )}
              </AnimatePresence>
              {gpsStatus === 'error' && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>GPS access denied. Please enter address manually.</p>}
            </div>
 
            {/* ── 2 Action buttons at bottom ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              {/* WhatsApp SOS */}
              <motion.button type="button" onClick={sendWhatsApp} disabled={sending || sent}
                whileHover={!sending ? { scale: 1.02, boxShadow: '0 12px 36px rgba(22,163,74,0.3)' } : {}} whileTap={{ scale: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', borderRadius: '14px', border: 'none', background: sent ? 'linear-gradient(135deg,#15803d,#16a34a)' : 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#ffffff', fontWeight: 700, fontSize: '15px', cursor: sending || sent ? 'default' : 'pointer' }}>
                {sending ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                  : sent ? <><CheckCircle size={18} /> Sent!</>
                  : <><MessageCircle size={18} /> Send WhatsApp SOS</>}
              </motion.button>
 
              {/* Call Now */}
              <motion.a href="tel:+918072522246"
                whileHover={{ scale: 1.02, boxShadow: '0 12px 36px rgba(29,78,216,0.3)' }} whileTap={{ scale: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', borderRadius: '14px', background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', color: '#ffffff', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                <Phone size={18} /> Call Now
              </motion.a>
            </div>
 
            <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center' }}>
              By proceeding, you agree to be contacted by RoadSOS partners for assistance. Charges are shown before confirmation.
            </p>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
