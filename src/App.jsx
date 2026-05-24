import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import WriteBlogPage from './pages/WriteBlogPage';
import DraftsPage from './pages/DraftsPage';
import AboutPage from './pages/AboutPage';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kural_token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('kural_token', userToken);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kural_token');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0b10', color: '#f8fafc' }}>
        <div className="gradient-text" style={{ fontSize: '2.5rem', fontFamily: 'Outfit', fontWeight: 800 }}>KURAL...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, showToast }}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {user && <Navbar />}
          <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
            <Routes>
              <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
              <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
              
              <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/write" element={user ? <WriteBlogPage /> : <Navigate to="/login" />} />
              <Route path="/drafts" element={user ? <DraftsPage /> : <Navigate to="/login" />} />
              <Route path="/about" element={user ? <AboutPage /> : <Navigate to="/login" />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Toast Notification */}
          {toast && (
            <div className="alert-toast fade-in" style={{ borderLeft: toast.type === 'error' ? '4px solid #f43f5e' : '4px solid #14b8a6' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
            </div>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
