import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !secretCode) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secret_code: secretCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      padding: '40px 24px'
    }}>
      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow orb */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          opacity: 0.1,
          filter: 'blur(40px)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="gradient-text" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '10px'
          }}>KURAL</span>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.95rem' }}>
            Enter your credentials to break into the writing studio.
          </p>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'var(--color-accent)',
              fontSize: '0.9rem',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  id="email-input"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="name@writer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" htmlFor="code-input">Secret Code</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  id="code-input"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="••••••••"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.05rem',
                marginBottom: '24px'
              }}
              disabled={submitting}
            >
              {submitting ? 'Unlocking...' : "Let's Break In"}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <Link
              to="/signup"
              id="signup-link"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Already have account? <strong style={{ color: 'var(--color-primary)' }}>Create Account</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
