import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !secretCode) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, secret_code: secretCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Trigger premium confetti animation
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#a855f7', '#f43f5e']
      });

      login(data.user, data.token);
      showToast(`Welcome to KURAL, ${name}! Your journey has begun.`);
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
        maxWidth: '480px',
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-50px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'var(--color-secondary)',
          opacity: 0.08,
          filter: 'blur(50px)',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '6px',
            color: 'var(--text-primary)'
          }}>
            Welcome TO KURAL
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }}>
            Unleash your voice. Record your thoughts. Connect in any language.
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
              <label className="form-label" htmlFor="writer-name">Writer's Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  id="writer-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Thiruvalluvar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="writer-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  id="writer-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="thiruvalluvar@kural.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" htmlFor="writer-code">Secret Code</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-muted)" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  id="writer-code"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                  placeholder="Create your secret code"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              id="signup-btn"
              type="submit"
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1.05rem',
                marginBottom: '24px'
              }}
              disabled={submitting}
            >
              {submitting ? 'Setting Up...' : "Writer's Journey Begins"}
              {!submitting && <Sparkles size={18} />}
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
            <Link
              to="/login"
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
              Already have an account? <strong style={{ color: 'var(--color-primary)' }}>Log In</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
