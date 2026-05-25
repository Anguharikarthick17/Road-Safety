'use client';

import { motion } from 'framer-motion';
import {
  Brain, CloudRain, TrendingUp, Activity, Zap,
  AlertTriangle, BarChart3, Wind
} from 'lucide-react';

interface Insight {
  id: number;
  title: string;
  detail: string;
  metric: string;
  metricLabel: string;
  confidence: number;
  icon: typeof Brain;
  color: string;
  bg: string;
  border: string;
  tag: string;
}

const insights: Insight[] = [
  {
    id: 1, title: 'AI Accident Prediction',
    detail: 'High accident probability on NH-44 corridor this weekend based on traffic + weather patterns.',
    metric: '73%', metricLabel: 'Risk probability',
    confidence: 87, icon: Brain,
    color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)',
    tag: 'AI Prediction',
  },
  {
    id: 2, title: 'Weather Impact Analysis',
    detail: 'Northeast monsoon reducing visibility by 40%. Accident rate historically spikes 28% during heavy rainfall.',
    metric: '+28%', metricLabel: 'Accident spike risk',
    confidence: 91, icon: CloudRain,
    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)',
    tag: 'Weather',
  },
  {
    id: 3, title: 'Traffic Density Analysis',
    detail: 'Peak congestion zones identified at 8 key intersections. Avg vehicle density 340% above baseline.',
    metric: '340%', metricLabel: 'Above baseline',
    confidence: 95, icon: TrendingUp,
    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)',
    tag: 'Traffic',
  },
  {
    id: 4, title: 'Response Efficiency',
    detail: 'Emergency response time improved by 12.4% this quarter due to optimized unit positioning.',
    metric: '+12.4%', metricLabel: 'Response improvement',
    confidence: 99, icon: Activity,
    color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)',
    tag: 'Performance',
  },
  {
    id: 5, title: 'Future Risk Forecast',
    detail: 'Predicted 18% increase in accidents in Chengalpattu district Q3 2026 due to new highway construction.',
    metric: '+18%', metricLabel: 'Predicted Q3 rise',
    confidence: 79, icon: AlertTriangle,
    color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)',
    tag: 'Forecast',
  },
  {
    id: 6, title: 'Wind Pattern Alert',
    detail: 'Strong crosswinds (>60 km/h) forecasted on ECR bridges this weekend. Deploy advisory panels.',
    metric: '60 km/h', metricLabel: 'Wind speed',
    confidence: 83, icon: Wind,
    color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)',
    tag: 'Environment',
  },
];

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#475569', fontSize: '10px', fontWeight: 600 }}>AI Confidence</span>
        <span style={{ color, fontSize: '10px', fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${color}60, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function SmartInsights() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px', padding: '22px',
      height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Brain size={16} color="#a78bfa" />
        </div>
        <div>
          <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }}>Smart City AI Insights</div>
          <div style={{ color: '#475569', fontSize: '11px' }}>Powered by ML prediction models</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '100px', padding: '3px 10px' }}>
          <Zap size={11} color="#a78bfa" />
          <span style={{ color: '#a78bfa', fontSize: '10px', fontWeight: 700 }}>AI Active</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              style={{
                background: `linear-gradient(135deg, ${insight.bg}, rgba(255,255,255,0.015))`,
                border: `1px solid ${insight.border}`,
                borderRadius: '14px', padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: insight.bg, border: `1px solid ${insight.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={insight.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '13px' }}>{insight.title}</div>
                    <span style={{
                      flexShrink: 0, padding: '1px 7px', borderRadius: '5px',
                      background: insight.bg, border: `1px solid ${insight.border}`,
                      color: insight.color, fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em',
                    }}>{insight.tag}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: insight.color, fontWeight: 900, fontSize: '18px' }}>{insight.metric}</span>
                    <span style={{ color: '#475569', fontSize: '10px' }}>{insight.metricLabel}</span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '11px', lineHeight: 1.5, marginBottom: '8px' }}>{insight.detail}</p>
                  <ConfidenceBar value={insight.confidence} color={insight.color} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
