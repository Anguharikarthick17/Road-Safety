'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How fast do you arrive after I request help?', a: 'Our average nationwide response time is 15 minutes. In metro cities, we typically reach you within 8–12 minutes. We always dispatch the nearest available technician immediately.' },
  { q: 'Is GPS location sharing required?', a: 'GPS sharing is recommended for the fastest response, but not mandatory. You can also type your address manually. However, GPS ensures our technicians reach your exact location without any confusion.' },
  { q: 'Do you provide assistance for motorcycles and bikes?', a: 'Absolutely! RoadSOS covers all two-wheelers including motorcycles, scooters, and e-bikes with the same 24x7 availability — tyre changes, battery jumpstart, and towing included.' },
  { q: 'Is the service available 24 hours a day, 7 days a week?', a: "Yes, RoadSOS operates 24x7, 365 days a year — including all public holidays. Emergencies don't follow schedules, and neither do we." },
  { q: 'How do I pay for the service?', a: "Payment is made directly to the technician after service is completed. We accept cash, UPI, card, and digital wallets. No upfront booking fees — you'll receive a transparent quote before dispatch." },
  { q: 'What areas do you cover?', a: 'We currently operate in 200+ cities across India including all major metros and tier-2 cities, as well as major national highways.' },
  { q: 'Can I trust the technicians you send?', a: 'All partner technicians are verified, background-checked, and trained. They carry official RoadSOS ID cards and you receive their details before they arrive.' },
  { q: 'What happens if my vehicle cannot be repaired on the spot?', a: "Our tow truck service will transport your vehicle to the nearest authorized service center or a workshop of your choice. We also assist with insurance claim paperwork." },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ background: open ? 'rgba(59,130,246,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${open ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s', marginBottom: '10px' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: open ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
            <HelpCircle size={15} color={open ? '#60a5fa' : '#64748b'} />
          </div>
          <span style={{ color: open ? 'white' : '#cbd5e1', fontWeight: 600, fontSize: '15px', transition: 'color 0.2s' }}>{faq.q}</span>
        </div>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          style={{ width: '28px', height: '28px', borderRadius: '8px', background: open ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Plus size={16} color={open ? '#60a5fa' : '#64748b'} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 24px 24px 70px', color: '#64748b', fontSize: '14px', lineHeight: 1.8, borderLeft: '2px solid rgba(59,130,246,0.2)', marginLeft: '46px', paddingLeft: '24px', paddingBottom: '24px', paddingRight: '24px' }}>
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" style={{ padding: '96px 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="section-badge" style={{ marginBottom: '20px', display: 'inline-flex' }}><HelpCircle size={13} /> FAQ</span>
          <h2 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#0f172a', margin: '16px 0 16px', letterSpacing: '-1px' }}>
            Questions?{' '}
            <span style={{ background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We&apos;ve got answers</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '17px' }}>Everything you need to know about our roadside assistance service.</p>
        </motion.div>

        <div>{faqs.map((faq, i) => <FAQItem key={faq.q} faq={faq} index={i} />)}</div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginTop: '48px', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px' }}>
          <p style={{ color: '#64748b', fontSize: '17px', marginBottom: '20px' }}>Still have questions? We&apos;re here to help anytime.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <a href="https://wa.me/918072522246" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Chat on WhatsApp
            </a>
            <a href="mailto:help@roadsos.in"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
