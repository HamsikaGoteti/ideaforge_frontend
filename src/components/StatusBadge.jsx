import React from 'react';

export default function StatusBadge({ stage }) {
  const s = (stage || 'Concept').toLowerCase();

  let bg = 'rgba(100, 116, 139, 0.15)';
  let color = '#94a3b8';
  let border = 'rgba(100, 116, 139, 0.3)';

  if (s.includes('mvp') || s.includes('production') || s.includes('completed')) {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = '#34d399';
    border = 'rgba(16, 185, 129, 0.3)';
  } else if (s.includes('prototype') || s.includes('in progress')) {
    bg = 'rgba(37, 99, 235, 0.15)';
    color = '#60a5fa';
    border = 'rgba(37, 99, 235, 0.3)';
  } else if (s.includes('validation')) {
    bg = 'rgba(245, 158, 11, 0.15)';
    color = '#fbbf24';
    border = 'rgba(245, 158, 11, 0.3)';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        letterSpacing: '0.02em',
      }}
    >
      {stage || 'Concept'}
    </span>
  );
}
