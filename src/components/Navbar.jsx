import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Feather, BookOpen, FileText, Info, LogOut, PenSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="container" style={{ zIndex: 50, position: 'relative' }}>
      <nav className="navbar glass-panel">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Feather size={20} color="#0a0b10" />
          </div>
          <span className="gradient-text" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: 800,
            letterSpacing: '1px'
          }}>KURAL</span>
        </Link>

        <div className="nav-links">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isActive('/') ? 'var(--color-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'color 0.2s',
            borderBottom: isActive('/') ? '2px solid var(--color-primary)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            <BookOpen size={16} />
            Home
          </Link>

          <Link to="/drafts" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isActive('/drafts') ? 'var(--color-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'color 0.2s',
            borderBottom: isActive('/drafts') ? '2px solid var(--color-primary)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            <FileText size={16} />
            Drafts
          </Link>

          <Link to="/about" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isActive('/about') ? 'var(--color-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'color 0.2s',
            borderBottom: isActive('/about') ? '2px solid var(--color-primary)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            <Info size={16} />
            About
          </Link>
        </div>

        <div className="nav-actions">
          <span style={{
            fontSize: '0.85rem',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Writer: <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
          </span>

          <Link to="/write" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <PenSquare size={16} />
            Write a Blog
          </Link>

          <button
            onClick={logout}
            className="btn btn-outline"
            title="Log Out"
            style={{
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              borderColor: 'rgba(244, 63, 94, 0.2)',
              background: 'rgba(244, 63, 94, 0.05)'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}
