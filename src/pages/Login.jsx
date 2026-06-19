// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // src/pages/Login.jsx — replace only the handleSubmit function
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost/runit-backend/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        login(data.user, data.token);
        if (data.user.role === 'user') navigate('/dashboard');
        if (data.user.role === 'runner') navigate('/runner');
        if (data.user.role === 'admin') navigate('/admin');
      }
    } catch {
      setError('Cannot connect to server. Make sure XAMPP is running.');
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--runit-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(16px, 5vw, 40px)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

        {/* Mobile back to home */}
        <div style={{ position: 'fixed', top: 12, left: 12, zIndex: 50 }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(15,46,41,0.8)',
            border: '0.5px solid rgba(0,201,167,0.18)',
            backdropFilter: 'blur(10px)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        </div>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--runit-accent)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 20, color: '#0a1f1c',
            }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--runit-text)' }}>RunIt</span>
          </Link>
          <p style={{ color: 'var(--runit-muted)', fontSize: 14, marginTop: 4 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--runit-surface)',
          border: '1px solid var(--runit-border)',
          borderRadius: 24, padding: 32,
        }}>
          {error && (
            <div style={{
              background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 20,
              color: '#ff8080', fontSize: 13,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--runit-muted)', display: 'block', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email" name="email" required
                placeholder="you@ucc.edu.gh"
                value={form.email} onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  background: 'var(--runit-elevated)', color: 'var(--runit-text)',
                  border: '1px solid var(--runit-border)', fontSize: 14, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--runit-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--runit-border)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: 'var(--runit-muted)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" name="password" required
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  background: 'var(--runit-elevated)', color: 'var(--runit-text)',
                  border: '1px solid var(--runit-border)', fontSize: 14, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--runit-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--runit-border)'}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 50,
              background: loading ? 'var(--runit-accent-dark)' : 'var(--runit-accent)',
              color: '#0a1f1c', fontWeight: 700, fontSize: 15,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--runit-border)' }} />
            <span style={{ color: 'var(--runit-muted)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--runit-border)' }} />
          </div>

          {/* Test credentials hint */}
          <div style={{
            background: 'rgba(0,201,167,0.05)', border: '1px solid var(--runit-border)',
            borderRadius: 12, padding: '12px 16px', fontSize: 12, color: 'var(--runit-muted)',
            lineHeight: 1.7,
          }}>
            <div style={{ color: 'var(--runit-accent)', fontWeight: 600, marginBottom: 4 }}>
              Test credentials
            </div>
            user@test.com / 1234<br />
            runner@test.com / 1234<br />
            admin@test.com / 1234
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--runit-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--runit-accent)', fontWeight: 600 }}>
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}