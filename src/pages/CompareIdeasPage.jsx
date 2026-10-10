import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ideaApi } from '../api/ideaApi';
import { scoreApi } from '../api/scoreApi';
import ModeBadge from '../components/ModeBadge';
import StatusBadge from '../components/StatusBadge';
import ScoreMeter from '../components/ScoreMeter';
import { Scale, ArrowRight, ExternalLink } from 'lucide-react';

export default function CompareIdeasPage() {
  const [allIdeas, setAllIdeas] = useState([]);
  const [ideaAId, setIdeaAId] = useState('');
  const [ideaBId, setIdeaBId] = useState('');

  const [ideaA, setIdeaA] = useState(null);
  const [ideaB, setIdeaB] = useState(null);
  const [scoreA, setScoreA] = useState(null);
  const [scoreB, setScoreB] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ideaApi.getAll().then((data) => {
      setAllIdeas(data);
      if (data.length >= 2) {
        setIdeaAId(data[0].id.toString());
        setIdeaBId(data[1].id.toString());
      } else if (data.length === 1) {
        setIdeaAId(data[0].id.toString());
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (ideaAId) {
      ideaApi.getById(ideaAId).then(setIdeaA);
      scoreApi.getScore(ideaAId).then(setScoreA);
    } else {
      setIdeaA(null);
      setScoreA(null);
    }
  }, [ideaAId]);

  useEffect(() => {
    if (ideaBId) {
      ideaApi.getById(ideaBId).then(setIdeaB);
      scoreApi.getScore(ideaBId).then(setScoreB);
    } else {
      setIdeaB(null);
      setScoreB(null);
    }
  }, [ideaBId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        <p>Loading ideas for comparative assessment...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
          <Scale size={24} style={{ color: 'var(--primary)' }} />
          <h2>Comparative Idea Analysis</h2>
        </div>
        <p>Compare two ideas side-by-side to evaluate architectural differentiation and score profiles.</p>
      </div>

      {/* Selectors Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Select Idea A</label>
            <select
              className="form-control"
              value={ideaAId}
              onChange={(e) => setIdeaAId(e.target.value)}
            >
              <option value="">-- Choose Idea A --</option>
              {allIdeas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} ({i.mode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Select Idea B</label>
            <select
              className="form-control"
              value={ideaBId}
              onChange={(e) => setIdeaBId(e.target.value)}
            >
              <option value="">-- Choose Idea B --</option>
              {allIdeas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} ({i.mode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      {ideaA && ideaB ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Card A */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <ModeBadge mode={ideaA.mode} />
              <ScoreMeter score={ideaA.overallScore} size="lg" />
            </div>

            <div>
              <h3>{ideaA.title}</h3>
              {ideaA.tagline && <p style={{ fontSize: '0.85rem', color: '#93c5fd', marginTop: '0.2rem' }}>{ideaA.tagline}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <StatusBadge stage={ideaA.currentStage} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {ideaA.userName}</span>
            </div>

            {/* Criteria Scores */}
            {scoreA && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Criterion Metrics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Innovation & Novelty:</span>
                    <strong>{scoreA.innovationScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Technical Feasibility:</span>
                    <strong>{scoreA.feasibilityScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>User Need & Market:</span>
                    <strong>{scoreA.marketDemandScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Validation Evidence:</span>
                    <strong>{scoreA.evidenceScore}/100</strong>
                  </div>
                </div>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tech Stack:
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{ideaA.techStack || 'Not specified'}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Abstract:
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{ideaA.description}</p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <Link to={`/ideas/${ideaA.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                <span>Open Idea A Full Hub</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>

          {/* Card B */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <ModeBadge mode={ideaB.mode} />
              <ScoreMeter score={ideaB.overallScore} size="lg" />
            </div>

            <div>
              <h3>{ideaB.title}</h3>
              {ideaB.tagline && <p style={{ fontSize: '0.85rem', color: '#93c5fd', marginTop: '0.2rem' }}>{ideaB.tagline}</p>}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <StatusBadge stage={ideaB.currentStage} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {ideaB.userName}</span>
            </div>

            {/* Criteria Scores */}
            {scoreB && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Criterion Metrics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Innovation & Novelty:</span>
                    <strong>{scoreB.innovationScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Technical Feasibility:</span>
                    <strong>{scoreB.feasibilityScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>User Need & Market:</span>
                    <strong>{scoreB.marketDemandScore}/100</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Validation Evidence:</span>
                    <strong>{scoreB.evidenceScore}/100</strong>
                  </div>
                </div>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tech Stack:
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{ideaB.techStack || 'Not specified'}</p>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Abstract:
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{ideaB.description}</p>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <Link to={`/ideas/${ideaB.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                <span>Open Idea B Full Hub</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Please select two ideas from the dropdowns above to trigger comparative analysis.</p>
        </div>
      )}
    </div>
  );
}
