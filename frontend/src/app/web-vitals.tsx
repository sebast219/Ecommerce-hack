'use client';

import { useReportWebVitals } from 'next/web-vitals';

const reportedMetrics = new Set<string>();

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Evitar duplicados - solo reportar una vez por ID
    if (reportedMetrics.has(metric.id)) return;
    reportedMetrics.add(metric.id);

    const colors: Record<string, string> = {
      good: '#22c55e',
      'needs-improvement': '#f59e0b',
      poor: '#ef4444',
    };

    const emoji: Record<string, string> = {
      good: '✅',
      'needs-improvement': '⚠️',
      poor: '❌',
    };
    const emojiIcon = emoji[metric.rating] || '⏱️';

    const value = metric.name === 'CLS' ? metric.value.toFixed(3) : `${Math.round(metric.value)}ms`;

    // Métricas desactivadas - no mostrar en consola
  });

  return null;
}
