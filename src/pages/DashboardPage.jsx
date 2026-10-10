import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ideaApi } from '../api/ideaApi';
import { useAuth } from '../context/AuthContext';
import ModeBadge from '../components/ModeBadge';
import StatusBadge from '../components/StatusBadge';
import ScoreMeter from '../components/ScoreMeter';
import {
  Search,
  PlusCircle,
  FolderOpen,
  TrendingUp,
  FlaskConical,
  MessageSquare,
  Sparkles,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
} from 'lucide-react';

const MODES = [
  { key: '', label: 'All Modes' },
  { key: 'HACKATHON', label: 'Hackathon' },
  { key: 'COLLEGE_PROJECT', label: 'College Project' },
  { key: 'STARTUP', label: 'Startup' },
  { key: 'VALIDATE_IDEA', label: 'Validate Idea' },
  { key: 'OPEN_INNOVATION', label: 'Open Innovation' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedMode, setSelectedMode] = useState(searchParams.get('mode') || '');
  const [onlyMine, setOnlyMine] = useState(searchParams.get('filter') === 'my');

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      let data = [];
      if (onlyMine) {
        data = await ideaApi.getMyIdeas();
        if (selectedMode) {
          data = data.filter((i) => i.mode === selectedMode);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          data = data.filter(
            (i) =>
              i.title?.toLowerCase().includes(q) ||
              i.tagline?.toLowerCase().includes(q) ||
              i.tags?.toLowerCase().includes(q)
          );
        }
      } else {
        data = await ideaApi.getAll({
          query: searchQuery.trim() || undefined,
          mode: selectedMode || undefined,
        });
      }
      setIdeas(data);
    } catch (err) {
      setError('Failed to fetch ideas from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [selectedMode, onlyMine]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIdeas();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await ideaApi.delete(id);
      setIdeas(ideas.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete idea.');
    }
  };

  // Real Database Aggregate Statistics
  const totalIdeas = ideas.length;
  const avgScore = totalIdeas > 0 ? Math.round(ideas.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalIdeas) : 0;
  const totalExperiments = ideas.reduce((acc, curr) => acc + (curr.experimentCount || 0), 0);
  const totalFeedback = ideas.reduce((acc, curr) => acc + (curr.feedbackCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Innovation Dashboard</h2>
          <p>Real-time idea registry, deterministic validation scores, and experiment tracking</p>
        </div>
        <Link to="/wizard" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          <PlusCircle size={16} />
          <span>Launch New Idea</span>
        </Link>
      </div>

      {/* Real Statistics Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Ideas
            </span>
            <FolderOpen size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
            {totalIdeas}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Average Score
            </span>
            <TrendingUp size={18} style={{ color: '#34d399' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: '#34d399' }}>
            {avgScore}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Experiments Run
            </span>
            <FlaskConical size={18} style={{ color: '#60a5fa' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
            {totalExperiments}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Peer Reviews
            </span>
            <MessageSquare size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
            {totalFeedback}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mode Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
              Mode:
            </span>
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelectedMode(m.key)}
                className={`btn ${selectedMode === m.key ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                {m.label}
              </button>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: onlyMine ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyMine}
                  onChange={(e) => setOnlyMine(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <span>My Ideas Only</span>
              </label>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search ideas by title, tagline, problem or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  ideaApi.getAll({ mode: selectedMode || undefined }).then(setIdeas);
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Idea Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '2rem', height: '2rem' }} />
          <p>Querying ideas from persistent database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : ideas.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={44} className="empty-state-icon" />
          <h3>No Ideas Found</h3>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            No ideas matched your current search filters. Create a new idea to start evaluating!
          </p>
          <Link to="/wizard" className="btn btn-primary">
            <PlusCircle size={15} />
            <span>Create New Idea</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {ideas.map((idea) => {
            const isOwner = user?.id === idea.userId || user?.role === 'ROLE_ADMIN';
            return (
              <div
                key={idea.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <ModeBadge mode={idea.mode} />
                    <ScoreMeter score={idea.overallScore} />
                  </div>

                  <h3 style={{ marginTop: '0.875rem', fontSize: '1.2rem' }}>
                    <Link to={`/ideas/${idea.id}`} style={{ color: 'inherit' }} className="hover-link">
                      {idea.title}
                    </Link>
                  </h3>

                  {idea.tagline && (
                    <p style={{ fontSize: '0.85rem', color: '#93c5fd', marginTop: '0.25rem', fontWeight: 500 }}>
                      {idea.tagline}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {idea.description}
                  </p>

                  {/* Tech stack & tags */}
                  {idea.techStack && (
                    <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {idea.techStack.split(',').slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.725rem',
                            backgroundColor: 'var(--bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '0.875rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge stage={idea.currentStage} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      by {idea.userName || 'Innovator'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {isOwner && (
                      <>
                        <Link
                          to={`/ideas/${idea.id}/edit`}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          title="Edit Idea"
                        >
                          <Edit3 size={13} />
                        </Link>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => handleDelete(idea.id, idea.title)}
                          title="Delete Idea"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                    <Link
                      to={`/ideas/${idea.id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                    >
                      <span>Explore</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
