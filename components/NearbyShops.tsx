'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Loader2, ExternalLink, Store, Star, Clock, Phone, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const mockShops = [
  { name: 'RajeshMech Auto Services', dist: '1.2 km', rating: 4.9, jobs: 1240, eta: '8 min', color: '#3b82f6', initial: 'R' },
  { name: 'SpeedFix Roadside', dist: '2.1 km', rating: 4.8, jobs: 890, eta: '12 min', color: '#8b5cf6', initial: 'S' },
  { name: 'QuickHelp Motors', dist: '3.4 km', rating: 4.7, jobs: 2100, eta: '18 min', color: '#06b6d4', initial: 'Q' },
  { name: 'FastTrack Auto Care', dist: '3.9 km', rating: 4.6, jobs: 670, eta: '20 min', color: '#10b981', initial: 'F' },
];


export default function NearbyShops() {
  const [loading, setLoading] = useState(false);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [shops, setShops] = useState(mockShops);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data, error } = await supabase.from('shops').select('*');
        if (error) {
          console.error('Error fetching shops:', error);
          return;
        }
        if (data && data.length > 0) {
          setShops(data);
        }
      } catch (err) {
        console.error('Failed to fetch shops:', err);
      }
    };
    fetchShops();
  }, []);

  const detect = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported by this browser.'); return; }
    setLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(
      pos => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLoading(false); },
      () => { setError('Location access denied. Please allow location permission.'); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const mapSrc = loc
    ? `https://maps.google.com/maps?q=car+mechanic+auto+repair+near+${loc.lat},${loc.lng}&output=embed&z=14`
    : `https://maps.google.com/maps?q=car+mechanic+auto+repair+shop&output=embed&z=13`;

  const mapsUrl = loc
    ? `https://www.google.com/maps/search/auto+repair+mechanic/@${loc.lat},${loc.lng},14z`
    : `https://www.google.com/maps/search/auto+repair+mechanic`;

  return (
    <section id="nearby" style={{ background: '#f8fafc', padding: '72px 0', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ marginBottom: '36px' }}>
          <p style={{ color: '#1d4ed8', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Live Map
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', marginBottom: '6px', letterSpacing: '-0.5px' }}>
                Nearby Shops &amp;{' '}
                <span style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Service Centers
                </span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                {loc ? `Showing auto repair shops near your location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})` : 'Enable GPS to see real shops near you on the map'}
              </p>
            </div>
            <motion.button onClick={detect} disabled={loading}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '12px', border: `1px solid ${loc ? 'rgba(22,163,74,0.3)' : 'rgba(29,78,216,0.3)'}`, background: loc ? 'rgba(22,163,74,0.08)' : 'rgba(29,78,216,0.08)', color: loc ? '#16a34a' : '#1d4ed8', fontWeight: 600, fontSize: '14px', cursor: loading ? 'default' : 'pointer' }}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : loc ? <CheckCircle size={16} /> : <Navigation size={16} />}
              {loading ? 'Detecting...' : loc ? 'Location Detected' : 'Detect My Location'}
            </motion.button>
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
        </motion.div>

        {/* Map + list grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* Map iframe */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', background: '#ffffff' }}>
            <iframe
              src={mapSrc}
              width="100%" height="420" style={{ border: 'none', display: 'block' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Nearby auto repair shops"
            />
            {/* Open in maps button */}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px', background: '#ffffff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', color: '#1d4ed8', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
              <ExternalLink size={13} /> Open in Google Maps
            </a>
          </motion.div>

          {/* Partner list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{shops.length} partners ready nearby</span>
            </div>
            {shops.map((shop, i) => (
              <motion.div key={shop.name}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${shop.color}20`, border: `1px solid ${shop.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: shop.color, fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                    {shop.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shop.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '11px' }}>
                        <MapPin size={10} /> {shop.dist}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontSize: '11px' }}>
                        <Star size={10} fill="#f59e0b" /> {shop.rating}
                      </span>
                      <span style={{ color: '#475569', fontSize: '11px' }}>{shop.jobs.toLocaleString()} jobs</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1d4ed8', fontSize: '13px', fontWeight: 700 }}>
                      <Clock size={11} /> {shop.eta}
                    </div>
                    <div style={{ color: '#475569', fontSize: '10px', marginTop: '2px' }}>ETA</div>
                  </div>
                </div>
                <motion.a href={`https://wa.me/918072522246?text=${encodeURIComponent(`🚨 Dispatch ${shop.name} to my location`)}`}
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '10px', background: `${shop.color}15`, border: `1px solid ${shop.color}30`, color: shop.color, textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>
                  <Phone size={12} /> Dispatch Now
                </motion.a>
              </motion.div>
            ))}

            {/* Find more */}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#475569', textDecoration: 'none', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>
              <Store size={14} /> Find more on Google Maps
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          #nearby .nearby-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
