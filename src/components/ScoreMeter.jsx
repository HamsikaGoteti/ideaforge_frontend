import React from 'react';

export default function ScoreMeter({ score, size = 'md' }) {
  let scoreClass = 'score-low';
  let label = 'Needs Focus';

  if (score >= 75) {
    scoreClass = 'score-high';
    label = 'Ready';
  } else if (score >= 50) {
    scoreClass = 'score-mid';
    label = 'Developing';
  }

  const isLg = size === 'lg';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        className={`score-badge ${scoreClass}`}
        style={isLg ? { fontSize: '1.5rem', padding: '0.5rem 1rem' } : {}}
      >
        <span>{score ?? 0}</span>
        <span style={{ fontSize: isLg ? '0.85rem' : '0.7rem', opacity: 0.8, marginLeft: '2px' }}>/100</span>
      </div>
      {isLg && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {label}
        </span>
      )}
    </div>
  );
}
