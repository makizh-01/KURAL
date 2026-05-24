import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Calendar, User, BookOpen, Clock, PenSquare, X } from 'lucide-react';

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { token, showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        throw new Error('Failed to load dispatches');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not retrieve latest dispatches.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <section className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        padding: '40px',
        margin: '20px 0 48px 0',
        gap: '40px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Glowing aura */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          opacity: 0.05,
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div style={{ textAlign: 'left', zIndex: 1 }}>
          <span style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            color: 'var(--color-primary)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '12px'
          }}>
            Welcome to the Neo-Classical Studio
          </span>
          <h1 className="gradient-text" style={{
            fontSize: '3.2rem',
            lineHeight: 1.15,
            marginBottom: '16px',
            marginTop: 0,
            fontFamily: 'var(--font-heading)'
          }}>
            Express in Couplets & Chapters.
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '32px',
            maxWidth: '520px',
            lineHeight: 1.6
          }}>
            Kural brings voice-to-text dictation in Tamil, English, and beyond. Write, speak, and publish your modern dispatches instantly.
          </p>

          <button
            onClick={() => navigate('/write')}
            className="btn btn-primary"
            style={{
              padding: '14px 28px',
              fontSize: '1.05rem'
            }}
          >
            <PenSquare size={18} />
            Write a Blog
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: '100%',
          minHeight: '260px'
        }}>
          <img
            src="/kural_hero.png"
            alt="KURAL Creative Art"
            style={{
              width: '100%',
              maxHeight: '320px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ textAlign: 'left' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Latest Dispatch</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Freshly minted stories from Kural authors</p>
          </div>
          
          <button
            onClick={() => navigate('/write')}
            className="btn btn-outline"
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <PenSquare size={16} />
            New Dispatch
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Gathering dispatches...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '80px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <BookOpen size={48} color="var(--text-muted)" />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Latest Dispatch is empty</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
              No dispatches have been published yet. Be the pioneer and publish the very first blog post on KURAL!
            </p>
            <button
              onClick={() => navigate('/write')}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <PenSquare size={16} />
              Write First Blog
            </button>
          </div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="glass-panel blog-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="blog-card-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/kural_hero.png';
                    }}
                  />
                ) : (
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(168, 85, 247, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-glass)',
                    color: 'var(--text-muted)'
                  }}>
                    <BookOpen size={36} />
                  </div>
                )}
                
                <div className="blog-card-content">
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: 'var(--text-primary)',
                    marginBottom: '10px',
                    lineHeight: 1.3
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '20px',
                    flexGrow: 1
                  }}>
                    {blog.content}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-glass)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      {blog.author_name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {formatDate(blog.created_at)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }} onClick={() => setSelectedBlog(null)}>
          <div className="glass-panel fade-in" style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-secondary)',
            padding: '32px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedBlog(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            {selectedBlog.image_url && (
              <img
                src={selectedBlog.image_url}
                alt={selectedBlog.title}
                style={{
                  width: '100%',
                  maxHeight: '380px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid var(--border-glass)'
                }}
              />
            )}

            <div style={{ textAlign: 'left' }}>
              <h2 style={{
                fontSize: '2.2rem',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                lineHeight: 1.25
              }}>
                {selectedBlog.title}
              </h2>

              <div style={{
                display: 'flex',
                gap: '20px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: '24px',
                borderBottom: '1px solid var(--border-glass)',
                paddingBottom: '16px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} />
                  By <strong>{selectedBlog.author_name}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} />
                  Published {formatDate(selectedBlog.created_at)}
                </span>
              </div>

              <div style={{
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.2px'
              }}>
                {selectedBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
