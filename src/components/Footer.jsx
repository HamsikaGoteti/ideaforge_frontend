import React from 'react';
import { Layers, Database, Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-main)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Layers size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
              IdeaForge <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>v1.0.0</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Full-Stack Innovation & Idea Validation Platform • BTech AIML Capstone Project
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} style={{ color: '#60a5fa' }} /> Java 21 & Spring Boot 3
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={14} style={{ color: '#34d399' }} /> MySQL 8 Persistent
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} style={{ color: '#fbbf24' }} /> JWT Stateless Security
          </span>
        </div>
      </div>
    </footer>
  );
}
