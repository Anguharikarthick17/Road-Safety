'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/lib/auth';

interface RoleGuardProps {
  requiredRole: Role;
  children: React.ReactNode;
}

export default function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('roadsos_role');
    const token = localStorage.getItem('roadsos_token');
    if (role === requiredRole && token) {
      setAuthorized(true);
    } else {
      if (requiredRole === 'officer') {
        router.replace('/officer/login');
      } else {
        router.replace('/');
      }
    }
    setChecking(false);
  }, [requiredRole, router]);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f8fafc', color: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid rgba(59,130,246,0.2)',
          borderTopColor: '#3b82f6',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#475569', fontSize: '13px' }}>Verifying access...</p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
