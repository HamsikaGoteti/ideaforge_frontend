import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ideaApi } from '../api/ideaApi';
import { scoreApi } from '../api/scoreApi';
import { similarityApi } from '../api/similarityApi';
import { feedbackApi } from '../api/feedbackApi';
import { experimentApi } from '../api/experimentApi';
import { aiApi } from '../api/aiApi';
import { useAuth } from '../context/AuthContext';
import ModeBadge from '../components/ModeBadge';
import StatusBadge from '../components/StatusBadge';
import ScoreMeter from '../components/ScoreMeter';
import BlueprintViewer from '../components/BlueprintViewer';
import {
  Sparkles,
  BarChart3,
  Search,
  MessageSquare,
  FlaskConical,
  Edit3,
  Trash2,
  RefreshCw,
  Plus,
  Star,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Download,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Send,
} from 'lucide-react';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [idea, setIdea] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [similarIdeas, setSimilarIdeas] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('score'); // 'score', 'blueprint', 'similar', 'feedback', 'experiments'

  // AI & Blueprint States
  const [generatingBp, setGeneratingBp] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [reassessing, setReassessing] = useState(false);

  // Feedback Form States
  const [fbCategory, setFbCategory] = useState('STRENGTHS');
  const [fbContent, setFbContent] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [submittingFb, setSubmittingFb] = useState(false);

  // Experiment Form States
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expHypothesis, setExpHypothesis] = useState('');
  const [expObjective, setExpObjective] = useState('');
  const [expSteps, setExpSteps] = useState('');
  const [expCriteria, setExpCriteria] = useState('');
  const [submittingExp, setSubmittingExp] = useState(false);

  // Active Experiment Updating
  const [selectedExpForUpdate, setSelectedExpForUpdate] = useState(null);
  const [expObservations, setExpObservations] = useState('');
  const [expResults, setExpResults] = useState('');
  const [expEvidenceLinks, setExpEvidenceLinks] = useState('');
  const [expStatus, setExpStatus] = useState('COMPLETED');
  const [updatingExp, setUpdatingExp] = useState(false);

  const loadAllData = async () => {
    try {
      const [ideaRes, scoreRes, simRes, fbRes, expRes] = await Promise.all([
        ideaApi.getById(id),
        scoreApi.getScore(id),
        similarityApi.getSimilar(id, 15),
        feedbackApi.getByIdea(id),
        experimentApi.getByIdea(id),
      ]);

      setIdea(ideaRes);
      setScoreData(scoreRes);
      setSimilarIdeas(simRes);
      setFeedbacks(fbRes);
      setExperiments(expRes);
    } catch (err) {
      console.error('Error loading idea hub data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [id]);

  const isOwner = user?.id === idea?.userId || user?.role === 'ROLE_ADMIN';

  const handleDeleteIdea = async () => {
    if (!window.confirm(`Are you sure you want to delete "${idea.title}"?`)) return;
    try {
      await ideaApi.delete(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete idea.');
    }
  };

  const handleGenerateBlueprint = async () => {
    setGeneratingBp(true);
    try {
      const res = await aiApi.generateBlueprint(id, customPrompt);
      setIdea((prev) => ({
        ...prev,
        blueprintJson: res.blueprintJson,
        blueprintSource: res.source,
      }));
      // Refresh score since blueprint presence affects readiness
      const refreshedScore = await scoreApi.getScore(id);
      setScoreData(refreshedScore);
      setActiveTab('blueprint');
    } catch (err) {
      alert('Failed to generate blueprint. Falling back to deterministic generator.');
    } finally {
      setGeneratingBp(false);
    }
  };

  const handleReassessScore = async () => {
    setReassessing(true);
    try {
      const res = await scoreApi.reassess(id);
      setScoreData(res);
      setIdea((prev) => ({ ...prev, overallScore: res.overallScore }));
    } catch (err) {
      alert('Failed to recalculate score.');
    } finally {
      setReassessing(false);
    }
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!fbContent.trim()) return;
    setSubmittingFb(true);
    try {
      const newFb = await feedbackApi.add(id, {
        category: fbCategory,
        content: fbContent.trim(),
        rating: fbRating,
      });
      setFeedbacks([newFb, ...feedbacks]);
      setFbContent('');
      // Refresh score
      const refreshedScore = await scoreApi.getScore(id);
      setScoreData(refreshedScore);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post feedback.');
    } finally {
      setSubmittingFb(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Delete this feedback review?')) return;
    try {
      await feedbackApi.delete(feedbackId);
      setFeedbacks(feedbacks.filter((f) => f.id !== feedbackId));
      const refreshedScore = await scoreApi.getScore(id);
      setScoreData(refreshedScore);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete feedback.');
    }
  };

  const handleCreateExperiment = async (e) => {
    e.preventDefault();
    if (!expTitle.trim() || !expHypothesis.trim() || !expObjective.trim()) return;
    setSubmittingExp(true);
    try {
      const newExp = await experimentApi.create(id, {
        title: expTitle.trim(),
        hypothesis: expHypothesis.trim(),
        objective: expObjective.trim(),
        steps: expSteps.trim(),
        successCriteria: expCriteria.trim(),
        status: 'PLANNED',
      });
      setExperiments([newExp, ...experiments]);
      setShowExpModal(false);
      setExpTitle('');
      setExpHypothesis('');
      setExpObjective('');
      setExpSteps('');
      setExpCriteria('');
      // Refresh score
      const refreshedScore = await scoreApi.getScore(id);
      setScoreData(refreshedScore);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create experiment.');
    } finally {
      setSubmittingExp(false);
    }
  };

  const handleUpdateExperimentResults = async (e) => {
    e.preventDefault();
    if (!selectedExpForUpdate) return;
    setUpdatingExp(true);
    try {
      const updated = await experimentApi.update(selectedExpForUpdate.id, {
        ...selectedExpForUpdate,
        observations: expObservations,
        results: expResults,
        evidenceLinks: expEvidenceLinks,
        status: expStatus,
      });
      setExperiments(experiments.map((e) => (e.id === updated.id ? updated : e)));
      setSelectedExpForUpdate(null);
      // Refresh score
      const refreshedScore = await scoreApi.getScore(id);
      setScoreData(refreshedScore);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update experiment results.');
    } finally {
      setUpdatingExp(false);
    }
  };

  const handleExportMarkdown = () => {
    let md = `# IDEA: ${idea.title}\n\n`;
    md += `**Tagline:** ${idea.tagline || 'N/A'}\n`;
    md += `**Mode:** ${idea.mode}\n`;
    md += `**Current Stage:** ${idea.currentStage}\n`;
    md += `**Overall Deterministic Score:** ${idea.overallScore}/100\n\n`;
    md += `## Abstract / Overview\n${idea.description}\n\n`;
    md += `## Problem Statement\n${idea.problemStatement || 'N/A'}\n\n`;
    md += `## Proposed Solution\n${idea.proposedSolution || 'N/A'}\n\n`;
    md += `## Technology Stack\n${idea.techStack || 'N/A'}\n\n`;
    if (scoreData) {
      md += `## Scoring Breakdown (${scoreData.scoringVersion})\n`;
      md += `- Innovation: ${scoreData.innovationScore}/100\n`;
      md += `- Feasibility: ${scoreData.feasibilityScore}/100\n`;
      md += `- Impact: ${scoreData.impactScore}/100\n`;
      md += `- Market Demand: ${scoreData.marketDemandScore}/100\n`;
      md += `- Readiness: ${scoreData.readinessScore}/100\n`;
      md += `- Validation Evidence: ${scoreData.evidenceScore}/100\n\n`;
    }
    if (idea.blueprintJson) {
      md += `## Generated Strategic Blueprint (${idea.blueprintSource})\n\`\`\`json\n${idea.blueprintJson}\n\`\`\`\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${idea.title.toLowerCase().replace(/\s+/g, '-')}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem', width: '2.5rem', height: '2.5rem' }} />
        <p>Loading Idea Validation Hub...</p>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Idea Not Found</h3>
        <p style={{ marginTop: '0.5rem' }}>This idea may have been removed or does not exist.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <ModeBadge mode={idea.mode} />
              <StatusBadge stage={idea.currentStage} />
            </div>
            <h1 style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>{idea.title}</h1>
            {idea.tagline && (
              <p style={{ fontSize: '1.05rem', color: '#93c5fd', marginTop: '0.35rem', fontWeight: 500 }}>
                {idea.tagline}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Created by <strong>{idea.userName || 'Innovator'}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} /> {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ScoreMeter score={idea.overallScore} size="lg" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button className="btn btn-outline" onClick={handleExportMarkdown} title="Export Markdown Report">
                <Download size={14} />
                <span>Export Report</span>
              </button>
              {isOwner && (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Link to={`/ideas/${idea.id}/edit`} className="btn btn-secondary" style={{ padding: '0.45rem 0.75rem' }}>
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </Link>
                  <button className="btn btn-danger" onClick={handleDeleteIdea} style={{ padding: '0.45rem 0.75rem' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'score', label: 'Score Breakdown', icon: BarChart3, count: `${idea.overallScore}/100` },
            { id: 'blueprint', label: 'Strategic Blueprint', icon: Sparkles, count: idea.blueprintJson ? 'Ready' : 'Not Generated' },
            { id: 'similar', label: 'Similar Ideas', icon: Search, count: similarIdeas.length },
            { id: 'feedback', label: 'Peer Feedback', icon: MessageSquare, count: feedbacks.length },
            { id: 'experiments', label: 'Validation Experiments', icon: FlaskConical, count: experiments.length },
          ].map((t) => {
            const Icon = t.icon;
            const isTabActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`btn ${isTabActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Icon size={15} />
                <span>{t.label}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isTabActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)',
                    marginLeft: '0.25rem',
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SCORE BREAKDOWN */}
      {activeTab === 'score' && scoreData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Deterministic Evaluation Matrix</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Engine Version: <code>{scoreData.scoringVersion}</code> • Mode Weights Applied: <strong>{idea.mode}</strong>
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleReassessScore} disabled={reassessing}>
              <RefreshCw size={14} className={reassessing ? 'spinner' : ''} />
              <span>{reassessing ? 'Re-evaluating...' : 'Reassess Score'}</span>
            </button>
          </div>

          {/* 6 Criteria Progress Bars */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>Criterion Breakdown & Weights</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                { key: 'innovation', label: 'Innovation & Differentiation', score: scoreData.innovationScore },
                { key: 'feasibility', label: 'Feasibility & Architecture', score: scoreData.feasibilityScore },
                { key: 'impact', label: 'Potential Impact', score: scoreData.impactScore },
                { key: 'marketDemand', label: 'User Need & Assumptions', score: scoreData.marketDemandScore },
                { key: 'readiness', label: 'Implementation Readiness', score: scoreData.readinessScore },
                { key: 'evidence', label: 'Validation Evidence', score: scoreData.evidenceScore },
              ].map((c) => {
                const critDetail = scoreData.criteria?.[c.key];
                return (
                  <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: c.score >= 70 ? '#34d399' : c.score >= 50 ? '#fbbf24' : '#f87171' }}>
                        {c.score}/100 {critDetail ? `(${(critDetail.weight * 100).toFixed(0)}% weight)` : ''}
                      </span>
                    </div>
                    {/* Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${c.score}%`,
                          height: '100%',
                          backgroundColor: c.score >= 70 ? '#10b981' : c.score >= 50 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    {critDetail?.explanation && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {critDetail.explanation}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths, Weaknesses & Actionable Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#34d399' }}>
                <CheckCircle2 size={18} />
                <h4 style={{ margin: 0 }}>Identified Strengths</h4>
              </div>
              {scoreData.strengths?.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {scoreData.strengths.map((s, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.85rem' }}>Add more structural features or experiments to build recognized strengths.</p>
              )}
            </div>

            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#fbbf24' }}>
                <AlertTriangle size={18} />
                <h4 style={{ margin: 0 }}>Areas for Improvement</h4>
              </div>
              {scoreData.weaknesses?.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {scoreData.weaknesses.map((w, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.85rem' }}>No major critical weaknesses detected.</p>
              )}
            </div>

            <div className="card" style={{ borderLeft: '4px solid #3b82f6', gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#60a5fa' }}>
                <Lightbulb size={18} />
                <h4 style={{ margin: 0 }}>Actionable Next Steps</h4>
              </div>
              {scoreData.recommendations?.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {scoreData.recommendations.map((r, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.85rem' }}>Maintain continuous experiment execution and gather peer feedback.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRATEGIC BLUEPRINT */}
      {activeTab === 'blueprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Generation Control Bar */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h3>Mode-Specific Blueprint Synthesizer</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Synthesize an IEEE/hackathon/startup technical roadmap matching your idea profile.
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleGenerateBlueprint}
                disabled={generatingBp}
              >
                {generatingBp ? <div className="spinner" /> : <Sparkles size={16} />}
                <span>{generatingBp ? 'Synthesizing...' : (idea.blueprintJson ? 'Regenerate Blueprint' : 'Generate Blueprint')}</span>
              </button>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Optional Custom Instructions for AI Synthesizer</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Focus specifically on differential privacy mathematical proofs and sub-100ms REST latency"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </div>

          {/* Blueprint Display */}
          {idea.blueprintJson ? (
            <BlueprintViewer blueprintJson={idea.blueprintJson} source={idea.blueprintSource} />
          ) : (
            <div className="empty-state">
              <Sparkles size={40} className="empty-state-icon" />
              <h3>No Blueprint Generated Yet</h3>
              <p style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
                Click "Generate Blueprint" to synthesize an end-to-end mode-specific architecture roadmap.
              </p>
              <button className="btn btn-primary" onClick={handleGenerateBlueprint} disabled={generatingBp}>
                <span>Generate {idea.mode} Blueprint</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SIMILAR IDEAS DISCOVERY */}
      {activeTab === 'similar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3>Platform-Internal Similarity Discovery</h3>
            <p style={{ fontSize: '0.85rem' }}>
              Deterministic token and tag overlap across other registered platform ideas.
            </p>
          </div>

          {similarIdeas.length === 0 ? (
            <div className="empty-state">
              <Search size={40} className="empty-state-icon" />
              <h3>No Overlapping Ideas Found</h3>
              <p style={{ maxWidth: '420px', margin: '0.5rem auto' }}>
                This idea appears highly differentiated! No other project in the system exceeds the similarity matching threshold.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {similarIdeas.map((sim) => (
                <div key={sim.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <ModeBadge mode={sim.mode} />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: sim.matchPercentage > 40 ? '#f59e0b' : '#38bdf8',
                        }}
                      >
                        {sim.matchPercentage}% Match
                      </span>
                    </div>

                    <h4>{sim.title}</h4>
                    {sim.tagline && <p style={{ fontSize: '0.8rem', color: '#93c5fd', marginTop: '0.2rem' }}>{sim.tagline}</p>}

                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Match Reason: </strong>
                      <span>{sim.matchReason}</span>
                    </div>

                    {sim.commonKeywords?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                        {sim.commonKeywords.map((kw, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(56, 189, 248, 0.1)',
                              color: '#38bdf8',
                              padding: '0.1rem 0.4rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Owner: {sim.ownerName}</span>
                    <Link to={`/ideas/${sim.id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                      <span>Inspect Idea</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PEER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Feedback Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Submit Peer Review & Validation Feedback</h4>
            <form onSubmit={handleAddFeedback}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Review Category</label>
                  <select
                    className="form-control"
                    value={fbCategory}
                    onChange={(e) => setFbCategory(e.target.value)}
                  >
                    <option value="STRENGTHS">Strengths & Unique Merits</option>
                    <option value="CONCERNS">Concerns & Risks</option>
                    <option value="FEASIBILITY">Feasibility & Technical Bounds</option>
                    <option value="SUGGESTIONS">Improvement Suggestions</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Overall Rating (1 to 5 Stars)</label>
                  <select
                    className="form-control"
                    value={fbRating}
                    onChange={(e) => setFbRating(Number(e.target.value))}
                  >
                    <option value={5}>★★★★★ (5 Stars — Outstanding)</option>
                    <option value={4}>★★★★☆ (4 Stars — Strong)</option>
                    <option value={3}>★★★☆☆ (3 Stars — Promising)</option>
                    <option value={2}>★★☆☆☆ (2 Stars — Needs Refinement)</option>
                    <option value={1}>★☆☆☆☆ (1 Star — High Risk)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Constructive Feedback Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Provide specific feedback on architecture, user appeal, or potential roadblocks..."
                  value={fbContent}
                  onChange={(e) => setFbContent(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submittingFb}>
                {submittingFb ? <div className="spinner" /> : <Send size={15} />}
                <span>Post Review</span>
              </button>
            </form>
          </div>

          {/* Feedback Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={36} className="empty-state-icon" />
                <h3>No Peer Reviews Yet</h3>
                <p>Be the first reviewer to leave constructive feedback for this idea!</p>
              </div>
            ) : (
              feedbacks.map((fb) => {
                const canDelete = user?.id === fb.authorId || isOwner;
                return (
                  <div key={fb.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor:
                              fb.category === 'STRENGTHS' ? 'rgba(16, 185, 129, 0.15)' :
                              fb.category === 'CONCERNS' ? 'rgba(239, 68, 68, 0.15)' :
                              fb.category === 'FEASIBILITY' ? 'rgba(37, 99, 235, 0.15)' :
                              'rgba(245, 158, 11, 0.15)',
                            color:
                              fb.category === 'STRENGTHS' ? '#34d399' :
                              fb.category === 'CONCERNS' ? '#f87171' :
                              fb.category === 'FEASIBILITY' ? '#60a5fa' :
                              '#fbbf24',
                          }}
                        >
                          {fb.category}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{fb.authorName}</span>
                        <span style={{ color: '#fbbf24', fontSize: '0.8rem' }}>
                          {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                        {canDelete && (
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.45rem', color: 'var(--danger)' }}
                            onClick={() => handleDeleteFeedback(fb.id)}
                            title="Delete Feedback"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
                      {fb.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 5: VALIDATION EXPERIMENTS */}
      {activeTab === 'experiments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Hypothesis & Evidence Tracker</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Run structured experiments to test critical assumptions. Completed experiments elevate the idea score.
              </p>
            </div>
            {isOwner && (
              <button className="btn btn-primary" onClick={() => setShowExpModal(true)}>
                <Plus size={15} />
                <span>Plan New Experiment</span>
              </button>
            )}
          </div>

          {/* New Experiment Modal/Form */}
          {showExpModal && (
            <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--primary-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4>Plan Validation Experiment</h4>
                <button className="btn btn-outline" onClick={() => setShowExpModal(false)} style={{ padding: '0.3rem 0.6rem' }}>
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateExperiment}>
                <div className="form-group">
                  <label className="form-label">Experiment Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Cellular Latency Benchmark under 300ms Jitter"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Testable Hypothesis *</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. Telemetry payload remains under 4KB/sec and reconnects within 200ms over roaming LTE."
                    value={expHypothesis}
                    onChange={(e) => setExpHypothesis(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Objective *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Verify emergency telemetry stability without dropping trauma alerts."
                    value={expObjective}
                    onChange={(e) => setExpObjective(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Execution Steps</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="1. Emulate 50 vital streams.\n2. Introduce packet delay.\n3. Measure p99 response time."
                    value={expSteps}
                    onChange={(e) => setExpSteps(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Success Criteria</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Zero message drop and average latency under 200ms"
                    value={expCriteria}
                    onChange={(e) => setExpCriteria(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submittingExp}>
                  {submittingExp ? <div className="spinner" /> : <FlaskConical size={15} />}
                  <span>Save Planned Experiment</span>
                </button>
              </form>
            </div>
          )}

          {/* Record Results Form if editing */}
          {selectedExpForUpdate && (
            <div className="card" style={{ padding: '1.75rem', border: '1px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h4>Record Empirical Results for: "{selectedExpForUpdate.title}"</h4>
                <button className="btn btn-outline" onClick={() => setSelectedExpForUpdate(null)} style={{ padding: '0.3rem 0.6rem' }}>
                  Cancel
                </button>
              </div>

              <form onSubmit={handleUpdateExperimentResults}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={expStatus}
                    onChange={(e) => setExpStatus(e.target.value)}
                  >
                    <option value="COMPLETED">COMPLETED (Hypothesis Verified / Tested)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Currently Running)</option>
                    <option value="ABANDONED">ABANDONED</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Observations</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="What did you observe during execution?"
                    value={expObservations}
                    onChange={(e) => setExpObservations(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantitative Results</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. 100% of telemetry packets arrived safely; mean latency was 142ms."
                    value={expResults}
                    onChange={(e) => setExpResults(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Evidence Links or Test Log URLs</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. https://github.com/org/repo/benchmarks.json or Drive Link"
                    value={expEvidenceLinks}
                    onChange={(e) => setExpEvidenceLinks(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={updatingExp}>
                  {updatingExp ? <div className="spinner" /> : <CheckCircle2 size={15} />}
                  <span>Submit Results & Re-Score</span>
                </button>
              </form>
            </div>
          )}

          {/* Experiments List */}
          {experiments.length === 0 ? (
            <div className="empty-state">
              <FlaskConical size={40} className="empty-state-icon" />
              <h3>No Validation Experiments Logged</h3>
              <p style={{ maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                De-risk your concept by designing an experiment to test your core technical or user assumptions.
              </p>
              {isOwner && (
                <button className="btn btn-primary" onClick={() => setShowExpModal(true)}>
                  <span>Plan First Experiment</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {experiments.map((exp) => (
                <div key={exp.id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <StatusBadge stage={exp.status} />
                        <h4 style={{ margin: 0 }}>{exp.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Created {new Date(exp.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {isOwner && (
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                        onClick={() => {
                          setSelectedExpForUpdate(exp);
                          setExpObservations(exp.observations || '');
                          setExpResults(exp.results || '');
                          setExpEvidenceLinks(exp.evidenceLinks || '');
                          setExpStatus(exp.status || 'COMPLETED');
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Update Evidence</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase' }}>
                        Hypothesis
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                        {exp.hypothesis}
                      </p>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase' }}>
                        Objective & Criteria
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                        {exp.objective}
                      </p>
                      {exp.successCriteria && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          <strong>Criteria:</strong> {exp.successCriteria}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Results & Evidence */}
                  {(exp.results || exp.observations || exp.evidenceLinks) && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.875rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                        Recorded Findings & Evidence
                      </span>
                      {exp.observations && (
                        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          <strong>Observations:</strong> {exp.observations}
                        </p>
                      )}
                      {exp.results && (
                        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          <strong>Results:</strong> {exp.results}
                        </p>
                      )}
                      {exp.evidenceLinks && (
                        <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                          <strong>Evidence Source: </strong>
                          <a href={exp.evidenceLinks} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                            {exp.evidenceLinks}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
