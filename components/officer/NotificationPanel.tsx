'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Zap, Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { notifications } from '@/lib/mockData';
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


type NType = 'alert' | 'dispatch' | 'resolved';

interface Notification {
  id: number;
  msg: string;
  type: NType;
  time: string;
}

const typeConfig: Record<NType, { color: string; bg: string; border: string; icon: typeof Bell }> = {
  alert: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', icon: AlertTriangle },
  dispatch: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', icon: Shield },
  resolved: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', icon: CheckCircle },
};

export default function NotificationPanel() {
  const [items, setItems] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          setItems(notifications as Notification[]);
          return;
        }

        if (data && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            msg: item.msg,
            type: item.type as NType,
            time: formatRelativeTime(item.created_at)
          }));
          setItems(formatted);
        } else {
          setItems(notifications as Notification[]);
        }
      } catch (err) {
        console.error('Failed to connect to Supabase for notifications:', err);
        setItems(notifications as Notification[]);
      }
    };

    fetchNotifications();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('schema-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload: any) => {
          const newItem = payload.new;
          setItems(prev => [
            {
              id: newItem.id,
              msg: newItem.msg,
              type: newItem.type as NType,
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

  const visible = items.filter(n => !dismissed.includes(n.id));

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px', padding: '20px',
      height: '100%',
      boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={15} color="#60a5fa" />
          </div>
          <div>
            <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>Notifications</div>
            <div style={{ color: '#475569', fontSize: '11px' }}>{visible.length} unread</div>
          </div>
        </div>
        <span style={{
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '100px', padding: '2px 8px', color: '#f87171', fontSize: '11px', fontWeight: 700,
        }}>
          {visible.filter(n => n.type === 'alert').length} Critical
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
        <AnimatePresence>
          {visible.map(notif => {
            const cfg = typeConfig[notif.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: '12px', padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                }}>
                  <Icon size={13} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#1e293b', fontSize: '12px', fontWeight: 500, lineHeight: 1.5, marginBottom: '3px' }}>{notif.msg}</p>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{notif.time}</span>
                </div>
                <button
                  onClick={() => setDismissed(d => [...d, notif.id])}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#475569', fontSize: '13px' }}>
            <CheckCircle size={24} color="#1e293b" style={{ margin: '0 auto 8px' }} />
            All notifications cleared
          </div>
        )}
      </div>
    </div>
  );
}
