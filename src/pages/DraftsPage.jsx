import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FileText, Calendar, PenSquare, Trash2, ArrowRight } from 'lucide-react';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/blogs/drafts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      } else {
        throw new Error('Failed to load drafts');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve your drafts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (e, id) => {
    e.stopPropagation(); // Avoid triggering openDraft
    if (!window.confirm('Are you sure you want to delete this draft?')) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        showToast('Draft deleted successfully.');
        setDrafts(drafts.filter(d => d.id !== id));
      } else {
        throw new Error('Failed to delete draft');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  const openDraft = (draft) => {
    navigate('/write', { state: { draft } });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container fade-in" style={{ textAlign: 'left' }}>
      <div style={{
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '16px',
        marginBottom: '32px'
      }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Saved Drafts</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your unpublished writings and raw ideas</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Loading drafts...</span>
        </div>
      ) : drafts.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '80px 40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <FileText size={48} color="var(--text-muted)" />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Your drafts folder is empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
            Whenever you are composing a blog, you can click "Save as Draft" to store it here and refine it later.
          </p>
          <button
            onClick={() => navigate('/write')}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.95rem' }}
          >
            <PenSquare size={16} />
            Compose New Blog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="glass-panel"
              onClick={() => openDraft(draft)}
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {draft.title}
                </h3>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '12px'
                }}>
                  {draft.content || <em style={{ color: 'var(--text-muted)' }}>Empty content</em>}
                </p>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    Saved: {formatDate(draft.created_at)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDraft(draft);
                  }}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Edit
                  <ArrowRight size={14} />
                </button>
                
                <button
                  className="btn btn-outline"
                  onClick={(e) => deleteDraft(e, draft.id)}
                  style={{
                    padding: '8px',
                    borderColor: 'rgba(244, 63, 94, 0.2)',
                    background: 'rgba(244, 63, 94, 0.05)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete Draft"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
