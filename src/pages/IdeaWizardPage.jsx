import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ideaApi } from '../api/ideaApi';
import { aiApi } from '../api/aiApi';
import {
  Sparkles,
  GraduationCap,
  Rocket,
  CheckCircle2,
  Globe2,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const MODES = [
  {
    id: 'HACKATHON',
    title: 'Hackathon',
    icon: Sparkles,
    badgeClass: 'badge-hackathon',
    color: '#fbbf24',
    summary: 'Fast-paced prototype, MVP differentiation, team tasks & demo pitch',
    problemPrompt: 'What urgent bottleneck does your hackathon team solve in 24-48 hours?',
    solutionPrompt: 'What is the core working prototype & demo differentiator?',
  },
  {
    id: 'COLLEGE_PROJECT',
    title: 'College Project',
    icon: GraduationCap,
    badgeClass: 'badge-college',
    color: '#34d399',
    summary: 'Academic rigor, SRS, system architecture, milestones & testing',
    problemPrompt: 'What is the academic problem statement, research gap, or existing system limitation?',
    solutionPrompt: 'What is the proposed system architecture, module division, and implementation plan?',
  },
  {
    id: 'STARTUP',
    title: 'Startup',
    icon: Rocket,
    badgeClass: 'badge-startup',
    color: '#818cf8',
    summary: 'Value proposition, business model, go-to-market, costs & validation metrics',
    problemPrompt: 'What acute customer pain point do people have, and who specifically suffers from it?',
    solutionPrompt: 'What is your value proposition, revenue model assumption, and MVP scope?',
  },
  {
    id: 'VALIDATE_IDEA',
    title: 'Validate Idea',
    icon: CheckCircle2,
    badgeClass: 'badge-validate',
    color: '#38bdf8',
    summary: 'Assumptions, risk analysis, user research questions & evidence tests',
    problemPrompt: 'What unverified assumptions are you making about customer behavior or feasibility?',
    solutionPrompt: 'How will you test these assumptions before committing engineering resources?',
  },
  {
    id: 'OPEN_INNOVATION',
    title: 'Open Innovation',
    icon: Globe2,
    badgeClass: 'badge-open',
    color: '#c084fc',
    summary: 'Problem definition, multi-angle trade-offs, impact & ecosystem collaboration',
    problemPrompt: 'What broader community or cross-disciplinary challenge are you addressing?',
    solutionPrompt: 'How can contributors, community partners, and open-source tooling collaborate on the solution?',
  },
];

export default function IdeaWizardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode = searchParams.get('mode') || 'COLLEGE_PROJECT';
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
    keyFeatures: '',
    techStack: 'React, Spring Boot, MySQL',
    currentStage: 'Concept',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentModeConfig = MODES.find((m) => m.id === mode) || MODES[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and Description are required fields.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Idea in MySQL
      const idea = await ideaApi.create({
        ...formData,
        mode,
      });

      // 2. Automatically generate the mode-specific blueprint (AI or Fallback)
      try {
        await aiApi.generateBlueprint(idea.id);
      } catch (genErr) {
        console.warn('Blueprint auto-generation note:', genErr);
      }

      // 3. Redirect to Idea Details Hub
      navigate(`/ideas/${idea.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create idea. Please review your entries.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '1rem auto', width: '100%' }}>
      {/* Wizard Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2>Create & Validate Innovation</h2>
        <p style={{ marginTop: '0.25rem' }}>
          Step {step} of 2 — {step === 1 ? 'Choose Engineering Mode' : `Configure ${currentModeConfig.title} Specifications`}
        </p>

        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <div
            style={{
              width: '80px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'var(--primary)',
            }}
          />
          <div
            style={{
              width: '80px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: step === 2 ? 'var(--primary)' : 'var(--border-light)',
            }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Mode Selection */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    borderColor: isSelected ? m.color : 'var(--border-light)',
                    backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-card)',
                    boxShadow: isSelected ? `0 0 16px ${m.color}33` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: `${m.color}22`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: m.color,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      {isSelected && (
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: m.color,
                            color: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.1rem' }}>{m.title}</h3>
                    <p style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>{m.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <span>Continue with {currentModeConfig.title}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Mode-Specific Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: currentModeConfig.color, fontWeight: 700 }}>
                Configuring Mode
              </span>
              <h3 style={{ marginTop: '0.2rem' }}>{currentModeConfig.title} Specification</h3>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep(1)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={14} />
              <span>Change Mode</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Idea Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. RapidPulse EMT Real-Time Acuity Triage"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">One-Line Tagline</label>
              <input
                type="text"
                name="tagline"
                className="form-control"
                placeholder="e.g. Sub-second telemetry streaming directly to trauma emergency rooms"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Abstract & Overview *</label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                placeholder="Describe what the system does, who uses it, and its primary technical capabilities..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience / Users</label>
              <input
                type="text"
                name="targetAudience"
                className="form-control"
                placeholder="e.g. Paramedics, ER trauma surgeons"
                value={formData.targetAudience}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Maturity Stage</label>
              <select
                name="currentStage"
                className="form-control"
                value={formData.currentStage}
                onChange={handleChange}
              >
                <option value="Concept">Concept</option>
                <option value="In Validation">In Validation</option>
                <option value="Prototype">Prototype</option>
                <option value="MVP Ready">MVP Ready</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Problem Statement ({currentModeConfig.title} Context)</label>
              <textarea
                name="problemStatement"
                className="form-control"
                rows={3}
                placeholder={currentModeConfig.problemPrompt}
                value={formData.problemStatement}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Proposed Solution & Differentiation</label>
              <textarea
                name="proposedSolution"
                className="form-control"
                rows={3}
                placeholder={currentModeConfig.solutionPrompt}
                value={formData.proposedSolution}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technology Stack</label>
              <input
                type="text"
                name="techStack"
                className="form-control"
                placeholder="e.g. React, Spring Boot, MySQL, WebSockets"
                value={formData.techStack}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Search & Similarity Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                placeholder="e.g. healthcare, telemetry, iot, real-time"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Synthesizing Blueprint & Scoring...</span>
                </>
              ) : (
                <>
                  <span>Create & Generate Blueprint</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
