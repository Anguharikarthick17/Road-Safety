'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Loader2, Send, MessageCircle, Phone, CheckCircle, User, Smartphone, Car, AlertCircle, Map } from 'lucide-react';
import { supabase } from '@/lib/supabase';


const problems = ['Battery Jumpstart','Fuel Delivery','Flat Tyre','Tow Truck Required','Accident Help','Engine Breakdown','Bike Breakdown','Car Lockout','Other Emergency'];

interface FormData { name: string; mobile: string; vehicle: string; problem: string; location: string; lat: number | null; lng: number | null; }

export default function RequestForm() {
  const [form, setForm] = useState<FormData>({ name: '', mobile: '', vehicle: '', problem: '', location: '', lat: null, lng: null });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle'|'success'|'error'>('idle');
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const getGPS = () => {
    if (!navigator.geolocation) { setGpsStatus('error'); return; }
    setGpsLoading(true); setGpsStatus('idle');
    navigator.geolocation.getCurrentPosition(
      pos => { const { latitude: lat, longitude: lng } = pos.coords; setForm(p => ({ ...p, lat, lng, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })); setGpsLoading(false); setGpsStatus('success'); },
      () => { setGpsLoading(false); setGpsStatus('error'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const sendWhatsApp = async () => {
    setWhatsappLoading(true);
    
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
          severity: (form.problem === 'Accident Help' || form.problem === 'Other Emergency') ? 'critical' : 'medium',
          status: 'pending',
          victims: form.problem === 'Accident Help' ? 1 : 0
        }
      ]);
      if (error) {
        console.error('Error inserting incident into Supabase:', error);
      }
    } catch (err) {
      console.error('Failed to submit incident:', err);
    }

    const locationUrl = form.lat && form.lng ? `https://maps.google.com/?q=${form.lat},${form.lng}` : form.location || 'Not provided';
    const message = `🚨 RoadSOS Emergency Request\n\nName: ${form.name||'Not provided'}\nMobile: ${form.mobile||'Not provided'}\nVehicle: ${form.vehicle||'Not provided'}\nProblem: ${form.problem||'Not specified'}\n\n📍 Live Location:\n${locationUrl}\n\nSent via RoadSOS Emergency Platform`;
    setWhatsappLoading(false);
    setSubmitted(true);
    window.open(`https://wa.me/918072522246?text=${encodeURIComponent(message)}`, '_blank');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputStyle: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 14px 14px 44px', color: '#0f172a', fontSize: '15px', width: '100%', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'all 0.3s' };
  const labelStyle: React.CSSProperties = { color: '#64748b', fontSize: '13px', fontWeight: 500, marginBottom: '8px', display: 'block' };
  const fieldWrap: React.CSSProperties = { position: 'relative', marginBottom: '20px' };
  const iconStyle: React.CSSProperties = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' };

  return (
    <section id="request" style={{ padding: '96px 0', background: '#f8fafc', position: 'relative' }}>
      {/* Background accents */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(59,130,246,0.04)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(6,182,212,0.04)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px', alignItems: 'center' }}>

          {/* Left info panel */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="section-badge" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              <Navigation size={13} /> Request Assistance
            </span>
            <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 900, color: '#0f172a', marginBottom: '20px', lineHeight: 1.15, letterSpacing: '-1px' }}>
              Help is just{' '}
              <span style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one message</span> away
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.8, marginBottom: '40px' }}>
              Fill out the quick form and we&apos;ll dispatch the nearest verified partner to your exact location within minutes.
            </p>

            {/* Steps */}
            {[
              { n: '01', title: 'Fill the form', desc: 'Enter your details and describe your problem' },
              { n: '02', title: 'Share location', desc: 'Use GPS auto-detect for precise pickup coordinates' },
              { n: '03', title: 'Get connected', desc: "We'll dispatch a partner and WhatsApp you the ETA" },
            ].map(s => (
              <motion.div key={s.n} whileHover={{ x: 5 }} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}

            {/* Contact pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '32px' }}>
              <a href="tel:+918072522246" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                <Phone size={15} color="#60a5fa" /> +91 8072522246
              </a>
              <a href="mailto:help@roadsos.in" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                <AlertCircle size={15} color="#06b6d4" /> help@roadsos.in
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>
              <h3 style={{ color: '#0f172a', fontWeight: 700, fontSize: '20px', marginBottom: '28px' }}>Emergency Request Form</h3>

              {/* Name */}
              <div><label style={labelStyle}>Full Name</label>
                <div style={fieldWrap}>
                  <User size={16} style={iconStyle} />
                  <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              {/* Mobile */}
              <div><label style={labelStyle}>Mobile Number</label>
                <div style={fieldWrap}>
                  <Smartphone size={16} style={iconStyle} />
                  <input name="mobile" type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={handleChange} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              {/* Vehicle */}
              <div><label style={labelStyle}>Vehicle Name</label>
                <div style={fieldWrap}>
                  <Car size={16} style={iconStyle} />
                  <input name="vehicle" type="text" placeholder="e.g. Honda City, Royal Enfield" value={form.vehicle} onChange={handleChange} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              {/* Problem */}
              <div><label style={labelStyle}>Problem Type</label>
                <div style={fieldWrap}>
                  <AlertCircle size={16} style={iconStyle} />
                  <select name="problem" value={form.problem} onChange={handleChange}
                    style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', background: '#ffffff' }}>
                    <option value="" disabled style={{ background: '#ffffff', color: '#64748b' }}>Select your problem</option>
                    {problems.map(p => <option key={p} value={p} style={{ background: '#ffffff', color: '#0f172a' }}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Location + GPS */}
              <div><label style={labelStyle}>Location / Coordinates</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <MapPin size={16} style={iconStyle} />
                    <input name="location" type="text" placeholder="Enter address or use GPS" value={form.location} onChange={handleChange} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                  <motion.button type="button" onClick={getGPS} disabled={gpsLoading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', flexShrink: 0, border: `1px solid ${gpsStatus === 'success' ? 'rgba(22,163,74,0.3)' : gpsStatus === 'error' ? 'rgba(220,38,38,0.3)' : 'rgba(29,78,216,0.3)'}`, background: gpsStatus === 'success' ? 'rgba(22,163,74,0.08)' : gpsStatus === 'error' ? 'rgba(220,38,38,0.08)' : 'rgba(29,78,216,0.08)', color: gpsStatus === 'success' ? '#16a34a' : gpsStatus === 'error' ? '#dc2626' : '#1d4ed8' }}>
                    {gpsLoading ? <Loader2 size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> : gpsStatus === 'success' ? <CheckCircle size={15} /> : <Navigation size={15} />}
                    GPS
                  </motion.button>
                </div>

                {form.lat && form.lng && (
                  <motion.a href={`https://maps.google.com/?q=${form.lat},${form.lng}`} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                    <Map size={14} /> Location detected — View on Maps
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(22,163,74,0.6)' }}>{form.lat.toFixed(4)}, {form.lng.toFixed(4)}</span>
                  </motion.a>
                )}
                {gpsStatus === 'error' && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>GPS access denied. Please enter location manually.</p>}
              </div>

              {/* Buttons */}
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.button type="button" onClick={sendWhatsApp} disabled={whatsappLoading || submitted}
                  whileHover={!whatsappLoading ? { scale: 1.02, boxShadow: '0 12px 36px rgba(22,163,74,0.3)' } : {}} whileTap={{ scale: 0.98 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: 'none', background: submitted ? 'linear-gradient(135deg,#15803d,#16a34a)' : 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#ffffff', fontWeight: 700, fontSize: '16px', cursor: 'pointer', width: '100%' }}>
                  {whatsappLoading ? <><Loader2 size={20} style={{ animation: 'spin-slow 1s linear infinite' }} /> Connecting...</> : submitted ? <><CheckCircle size={20} /> Message Sent!</> : <><MessageCircle size={20} /> Send via WhatsApp SOS</>}
                </motion.button>
                <motion.a href="tel:+918072522246"
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 36px rgba(29,78,216,0.3)' }} whileTap={{ scale: 0.98 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: '1px solid rgba(29,78,216,0.4)', background: 'rgba(29,78,216,0.1)', color: '#1d4ed8', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
                  <Phone size={20} /> Call Emergency Line
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
