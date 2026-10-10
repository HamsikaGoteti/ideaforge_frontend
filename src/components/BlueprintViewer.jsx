import React, { useState } from 'react';
import { Copy, Check, Download, Cpu, ShieldCheck } from 'lucide-react';

export default function BlueprintViewer({ blueprintJson, source }) {
  const [copied, setCopied] = useState(false);

  if (!blueprintJson) {
    return null;
  }

  let data = null;
  try {
    data = typeof blueprintJson === 'string' ? JSON.parse(blueprintJson) : blueprintJson;
  } catch (e) {
    return (
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <p style={{ color: 'var(--danger)' }}>Failed to parse blueprint JSON payload.</p>
        <pre style={{ fontSize: '0.8rem', overflowX: 'auto', marginTop: '0.5rem' }}>{blueprintJson}</pre>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.ideaTitle || 'idea').toLowerCase().replace(/\s+/g, '-')}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFallback = source?.includes('FALLBACK') || data.generator?.includes('FALLBACK');

  return (
    <div className="card" style={{ marginTop: '1.5rem', border: '1px solid var(--border-light)' }}>
      {/* Blueprint Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h3 style={{ margin: 0 }}>Generated Strategic Blueprint</h3>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isFallback ? 'rgba(245, 158, 11, 0.12)' : 'rgba(37, 99, 235, 0.15)',
                color: isFallback ? '#fbbf24' : '#60a5fa',
                border: `1px solid ${isFallback ? 'rgba(245, 158, 11, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                fontWeight: 600,
              }}
            >
              {isFallback ? <ShieldCheck size={13} /> : <Cpu size={13} />}
              <span>{isFallback ? 'Deterministic Fallback Engine' : (source || 'AI Provider')}</span>
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', marginTop: '0.25rem' }}>
            Mode: <strong>{data.modeTitle || data.mode}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={handleCopy} title="Copy Raw JSON">
            {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadJson} title="Download JSON File">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Blueprint Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {Object.entries(data).map(([key, value]) => {
          if (['mode', 'modeTitle', 'ideaTitle', 'tagline', 'generator'].includes(key)) return null;

          const title = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());

          return (
            <div
              key={key}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', color: '#93c5fd', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                {title}
              </h4>

              {Array.isArray(value) ? (
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {value.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>
                      {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    </li>
                  ))}
                </ul>
              ) : typeof value === 'object' && value !== null ? (
                <div style={{ fontSize: '0.85rem' }}>
                  {Object.entries(value).map(([subK, subV]) => (
                    <div key={subK} style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                        {subK.replace(/([A-Z])/g, ' $1')}:{' '}
                      </span>
                      {Array.isArray(subV) ? (
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                          {subV.map((item, i) => (
                            <li key={i}>{String(item)}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>{String(subV)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {String(value)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
