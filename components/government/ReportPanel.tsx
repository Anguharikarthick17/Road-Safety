'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, FileSpreadsheet, Calendar,
  MapPin, BarChart3, CheckCircle, Loader2
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  icon: typeof FileText;
  color: string;
  bg: string;
}

const reports: Report[] = [
  { id: 'r1', name: 'Monthly Accident Report — May 2026', type: 'PDF', size: '2.4 MB', date: '01 Jun 2026', icon: FileText, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { id: 'r2', name: 'Yearly District Analysis 2025', type: 'XLSX', size: '4.8 MB', date: '15 Jan 2026', icon: FileSpreadsheet, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { id: 'r3', name: 'Emergency Response Efficiency Q1', type: 'PDF', size: '1.9 MB', date: '01 Apr 2026', icon: BarChart3, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'r4', name: 'Hotspot Zone Assessment 2026', type: 'PDF', size: '3.2 MB', date: '20 May 2026', icon: MapPin, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 'r5', name: 'Severity Classification Annual', type: 'XLSX', size: '5.1 MB', date: '31 Dec 2025', icon: Calendar, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
];

const exportButtons = [
  { label: 'Export PDF', Icon: FileText, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  { label: 'Export Excel', Icon: FileSpreadsheet, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  { label: 'Download All', Icon: Download, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
];

export default function ReportPanel() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(prev => [...prev, id]);
      setTimeout(() => setDownloaded(prev => prev.filter(d => d !== id)), 3000);

      // If it is a PDF export or a PDF report, trigger print
      const isExportPdf = id === 'export-Export PDF';
      const isReportPdf = id === 'r1' || id === 'r3' || id === 'r4';
      if (isExportPdf || isReportPdf) {
        if (typeof window !== 'undefined') {
          window.print();
        }
      }
    }, 1800);
  };

  const handleExport = (label: string) => {
    handleDownload('export-' + label);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px', padding: '22px',
      height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} color="#60a5fa" />
        </div>
        <div>
          <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>Report Generation</div>
          <div style={{ color: '#475569', fontSize: '11px' }}>Download & export analytics</div>
        </div>
      </div>

      {/* Export buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {exportButtons.map(({ label, Icon, color, bg, border }) => {
          const key = 'export-' + label;
          const isLoading = downloading === key;
          const isDone = downloaded.includes(key);
          return (
            <motion.button
              key={label}
              onClick={() => handleExport(label)}
              disabled={!!downloading}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 16px', borderRadius: '12px',
                background: isDone ? 'rgba(34,197,94,0.1)' : bg,
                border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : border}`,
                color: isDone ? '#4ade80' : color,
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {isLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                : isDone ? <CheckCircle size={14} />
                  : <Icon size={14} />}
              {isDone ? 'Downloaded!' : label}
            </motion.button>
          );
        })}
      </div>

      {/* Reports list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {reports.map((report, i) => {
          const Icon = report.icon;
          const isLoading = downloading === report.id;
          const isDone = downloaded.includes(report.id);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: report.bg, border: `1px solid ${report.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={15} color={report.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#0f172a', fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.name}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
                  <span style={{ color: '#475569', fontSize: '10px' }}>{report.type}</span>
                  <span style={{ color: '#475569', fontSize: '10px' }}>·</span>
                  <span style={{ color: '#475569', fontSize: '10px' }}>{report.size}</span>
                  <span style={{ color: '#475569', fontSize: '10px' }}>·</span>
                  <span style={{ color: '#475569', fontSize: '10px' }}>{report.date}</span>
                </div>
              </div>
              <motion.button
                onClick={() => handleDownload(report.id)}
                disabled={!!downloading}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: isDone ? 'rgba(34,197,94,0.12)' : '#f8fafc',
                  border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: isDone ? '#22c55e' : '#64748b',
                  flexShrink: 0,
                }}
              >
                {isLoading
                  ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  : isDone ? <CheckCircle size={13} />
                    : <Download size={13} />
                }
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
