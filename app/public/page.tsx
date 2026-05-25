'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SOSFlow from '@/components/SOSFlow';
import NearbyShops from '@/components/NearbyShops';
import Footer from '@/components/Footer';
import FloatingSOS from '@/components/FloatingSOS';

export default function PublicPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', background: '#f8fafc' }}
    >
      <Navbar />
      <SOSFlow />
      <NearbyShops />
      <Footer />
      <FloatingSOS />
    </motion.main>
  );
}
