'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { monthlyAccidents, yearlyTrend, accidentTypes } from '@/lib/mockData';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = { bar: '#1d4ed8', bar2: '#64748b', line: '#0f172a', area: '#3b82f6' };

const customTooltipStyle = {
  background: 'rgba(2,6,23,0.97)',
  border: '1px solid rgba(29,78,216,0.2)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#e2e8f0',
  fontSize: '13px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={customTooltipStyle}>
      <p style={{ color: '#64748b', fontWeight: 600, marginBottom: '6px', fontSize: '11px' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, fontWeight: 700, margin: '2px 0' }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const CustomPiTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={customTooltipStyle}>
      <p style={{ color: payload[0].payload.fill || '#fff', fontWeight: 700 }}>
        {payload[0].name}: {payload[0].value}%
      </p>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: typeof BarChart3;
  color: string;
  children: React.ReactNode;
  delay?: number;
}

function ChartCard({ title, subtitle, icon: Icon, color, children, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px', padding: '22px',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: `${color}18`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={color} />
        </div>
        <div>
          <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '14px' }}>{title}</div>
          <div style={{ color: '#475569', fontSize: '11px' }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function AccidentCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '28px' }}>

      {/* Monthly Accidents Bar Chart */}
      <ChartCard title="Monthly Accidents 2025" subtitle="Accidents vs solved cases" icon={BarChart3} color="#3b82f6" delay={0}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyAccidents} barGap={4} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#64748b', fontSize: '11px' }} />
            <Bar dataKey="accidents" name="Total" fill="#ef4444" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="solved" name="Solved" fill="#22c55e" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Yearly Trend Line Chart */}
      <ChartCard title="5-Year Accident Trend" subtitle="2021 – 2025 historical data" icon={TrendingUp} color="#22c55e" delay={0.08}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={yearlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#64748b', fontSize: '11px' }} />
            <Line type="monotone" dataKey="accidents" name="Total Accidents" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Accident Types Pie Chart */}
      <ChartCard title="Accident Type Breakdown" subtitle="By category — 2025" icon={PieIcon} color="#8b5cf6" delay={0.14}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ResponsiveContainer width="55%" height={200}>
            <PieChart>
              <Pie
                data={accidentTypes}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {accidentTypes.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip content={<CustomPiTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {accidentTypes.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: t.color, flexShrink: 0 }} />
                <span style={{ color: '#64748b', fontSize: '12px', flex: 1 }}>{t.name}</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '12px' }}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      {/* Response Time Area Chart */}
      <ChartCard title="Emergency Response Time" subtitle="Average minutes per month (2025)" icon={Activity} color="#f59e0b" delay={0.2}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyAccidents}>
            <defs>
              <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={[7, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="response" name="Avg Response (min)" stroke="#f59e0b" strokeWidth={2.5} fill="url(#responseGrad)" dot={{ fill: '#f59e0b', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
