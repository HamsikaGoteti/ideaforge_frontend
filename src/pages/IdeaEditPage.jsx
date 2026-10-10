import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ideaApi } from '../api/ideaApi';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function IdeaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    mode: 'COLLEGE_PROJECT',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
    keyFeatures: '',
    techStack: '',
    currentStage: 'Concept',
    tags: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const data = await ideaApi.getById(id);
        setFormData({
          title: data.title || '',
          tagline: data.tagline || '',
          description: data.description || '',
          mode: data.mode || 'COLLEGE_PROJECT',
          targetAudience: data.targetAudience || '',
          problemStatement: data.problemStatement || '',
          proposedSolution: data.proposedSolution || '',
          keyFeatures: data.keyFeatures || '',
          techStack: data.techStack || '',
          currentStage: data.currentStage || 'Concept',
          tags: data.tags || '',
        });
      } catch (err) {
        setError('Failed to load idea details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setSaving(true);
    try {
      await ideaApi.update(id, formData);
      navigate(`/ideas/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update idea.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem' }} />
        <p>Loading idea for editing...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '1rem auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-outline" onClick={() => navigate(`/ideas/${id}`)} style={{ padding: '0.4rem 0.7rem' }}>
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
        <h2>Edit Idea Specifications</h2>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Idea Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Tagline</label>
            <input
              type="text"
              name="tagline"
              className="form-control"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Abstract / Overview *</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mode</label>
            <select
              name="mode"
              className="form-control"
              value={formData.mode}
              onChange={handleChange}
            >
              <option value="HACKATHON">Hackathon</option>
              <option value="COLLEGE_PROJECT">College Project</option>
              <option value="STARTUP">Startup</option>
              <option value="VALIDATE_IDEA">Validate Idea</option>
              <option value="OPEN_INNOVATION">Open Innovation</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Current Stage</label>
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
            <label className="form-label">Problem Statement</label>
            <textarea
              name="problemStatement"
              className="form-control"
              rows={3}
              value={formData.problemStatement}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Proposed Solution</label>
            <textarea
              name="proposedSolution"
              className="form-control"
              rows={3}
              value={formData.proposedSolution}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tech Stack</label>
            <input
              type="text"
              name="techStack"
              className="form-control"
              value={formData.techStack}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <input
              type="text"
              name="tags"
              className="form-control"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/ideas/${id}`)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? <div className="spinner" /> : <Save size={15} />}
            <span>Save & Recalculate Score</span>
          </button>
        </div>
      </form>
    </div>
  );
}
