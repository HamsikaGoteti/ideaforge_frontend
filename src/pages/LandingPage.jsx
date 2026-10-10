import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  GraduationCap,
  Rocket,
  CheckCircle2,
  Globe2,
  ArrowRight,
  Cpu,
  BarChart3,
  Search,
  FlaskConical,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import ModeBadge from '../components/ModeBadge';

const MODES = [
  {
    id: 'HACKATHON',
    title: 'Hackathon',
    icon: Sparkles,
    badgeClass: 'badge-hackathon',
    color: '#fbbf24',
    summary: 'Sprint-focused prototype design, MVP scoping, differentiator pitch, and demo flow.',
    features: ['Prototype 24-hr Roadmap', 'Team Task Suggestions', '3-Minute Demo Pitch Outline', 'MVP Feature Scope'],
  },
  {
    id: 'COLLEGE_PROJECT',
    title: 'College Project',
    icon: GraduationCap,
    badgeClass: 'badge-college',
    color: '#34d399',
    summary: 'Academic rigor, IEEE Software Requirements (SRS), system architecture, and semester milestones.',
    features: ['IEEE Abstract & SRS', 'Architecture & DB Schema', 'Semester Milestone Plan', 'Viva Presentation Deck'],
  },
  {
    id: 'STARTUP',
    title: 'Startup',
    icon: Rocket,
    badgeClass: 'badge-startup',
    color: '#818cf8',
    summary: 'Customer pain point validation, business model, go-to-market strategy, and unit economics.',
    features: ['Value Proposition Canvas', 'Freemium/B2B Revenue Streams', 'Go-To-Market Stages', 'CAC/LTV Validation KPIs'],
  },
  {
    id: 'VALIDATE_IDEA',
    title: 'Validate Idea',
    icon: CheckCircle2,
    badgeClass: 'badge-validate',
    color: '#38bdf8',
    summary: 'Stress-test core assumptions, isolate feasibility constraints, and design testable user experiments.',
    features: ['Core Assumption Audits', '3 User Research Questions', 'Hypothesis Test Protocols', 'Empirical Evidence Rules'],
  },
  {
    id: 'OPEN_INNOVATION',
    title: 'Open Innovation',
    icon: Globe2,
    badgeClass: 'badge-open',
    color: '#c084fc',
    summary: 'Multi-stakeholder ecosystem impact, trade-off analysis, and crowd-sourced validation protocols.',
    features: ['Systemic Impact Mapping', 'Alternative Solution Trade-offs', 'Ecosystem Partner Plan', 'Open Prototype Guide'],
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [selectedMode, setSelectedMode] = useState(MODES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          maxWidth: '920px',
          margin: '2rem auto 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: '#93c5fd',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} />
          <span>Deterministic Scoring • Real AI Integration • MySQL Persistence</span>
        </div>

        <h1 style={{ fontSize: '3.25rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          Turn Raw Concepts into <br />
          <span style={{ color: 'var(--primary)' }}>Verifiable Innovations</span>
        </h1>

        <p style={{ fontSize: '1.15rem', maxWidth: '720px', color: 'var(--text-secondary)' }}>
          IdeaForge is the all-in-one platform for developing, scoring, stress-testing, and validating software
          ideas across 5 specialized engineering modes.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={isAuthenticated ? '/wizard' : '/register'} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            <span>{isAuthenticated ? 'Create New Idea' : 'Get Started Free'}</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            <span>Explore Innovation Hub</span>
          </Link>
        </div>
      </section>

      {/* 5 First-Class Modes Showcase */}
      <section className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: 700 }}>
            Five First-Class Engineering Modes
          </span>
          <h2 style={{ marginTop: '0.35rem' }}>Tailored Blueprints for Every Innovation Context</h2>
          <p style={{ maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Each mode alters the underlying architectural framework, deterministic scoring weights, and validation benchmarks.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMode.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-subtle)',
                  border: `1px solid ${isSelected ? m.color : 'var(--border-light)'}`,
                  color: isSelected ? 'var(--text-main)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={16} style={{ color: m.color }} />
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Mode Detail Showcase */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <ModeBadge mode={selectedMode.id} />
            <h3 style={{ marginTop: '0.875rem', fontSize: '1.4rem' }}>{selectedMode.title} Blueprint Framework</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{selectedMode.summary}</p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to={isAuthenticated ? `/wizard?mode=${selectedMode.id}` : '/register'} className="btn btn-outline">
                <span>Start in {selectedMode.title} Mode</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
            }}
          >
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Generated Artifacts & Benchmarks:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {selectedMode.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={16} style={{ color: selectedMode.color }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <BarChart3 size={28} />
          </div>
          <h3>Transparent Deterministic Scoring</h3>
          <p style={{ marginTop: '0.5rem' }}>
            6-factor scoring engine: Innovation, Feasibility, Impact, Market Demand, Readiness, and Validation Evidence.
            Mode-specific weights produce actionable weaknesses and improvements.
          </p>
        </div>

        <div className="card">
          <div style={{ color: '#38bdf8', marginBottom: '1rem' }}>
            <Search size={28} />
          </div>
          <h3>Internal Similarity Discovery</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Deterministic keyword overlap, tag matching, and mode weighting detect potential duplication across the platform
            with clear match percentage reasons.
          </p>
        </div>

        <div className="card">
          <div style={{ color: '#34d399', marginBottom: '1rem' }}>
            <FlaskConical size={28} />
          </div>
          <h3>Hypothesis & Evidence Tracker</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Track experiments with defined hypotheses, steps, success criteria, observations, results, and evidence links.
            Completed experiments tangibly raise the idea score.
          </p>
        </div>

        <div className="card">
          <div style={{ color: '#fbbf24', marginBottom: '1rem' }}>
            <Cpu size={28} />
          </div>
          <h3>Genuine AI with Offline Fallback</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Pluggable OpenAI-compatible REST adapter configured via environment variables. If no key is set, seamless
            deterministic fallback ensures 100% reliable operation.
          </p>
        </div>
      </section>
    </div>
  );
}
