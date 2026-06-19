// src/pages/runner/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';

export default function RunnerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const methodLabel = { foot: '🚶 On foot', bike: '🚲 Bicycle', motorbike: '🛵 Motorbike' };

  const menuItems = [
    { icon: '📊', label: 'My Earnings', sub: 'View income and debt', action: () => navigate('/runner/earnings') },
    { icon: '📦', label: 'Active Order', sub: 'Check your current order', action: () => navigate('/runner/active') },
    { icon: '🔔', label: 'Notifications', sub: 'Coming soon', disabled: true },
    { icon: '🔒', label: 'Change Password', sub: 'Coming soon', disabled: true },
    { icon: '📞', label: 'Support', sub: 'runit@ucc.edu.gh', action: () => window.open('mailto:runit@ucc.edu.gh') },
  ];

  return (
    <div style={{ background: 'var(--runit-bg)', minHeight: '100vh', color: 'var(--runit-text)', paddingBottom: 100 }}>
      <PillNavbar title="My Profile" subtitle="Runner account" />

      <div className="page-content">

        {/* Avatar + info */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--runit-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#0a1f1c', margin: '0 auto 12px' }}>
            {user?.name?.[0] || 'R'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 8 }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid var(--runit-border)', borderRadius: 50, padding: '4px 14px', fontSize: 11, color: 'var(--runit-accent)', fontWeight: 600 }}>
              Runner
            </span>
            <span style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid var(--runit-border)', borderRadius: 50, padding: '4px 14px', fontSize: 11, color: 'var(--runit-accent)', fontWeight: 600 }}>
              {methodLabel[user?.delivery_method] || '🚶 On foot'}
            </span>
          </div>
        </div>

        {/* Online status card */}
        <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Online Status</div>
            <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>You are currently visible in the feed</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.3)', borderRadius: 50, padding: '6px 14px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--runit-accent)' }} />
            <span style={{ fontSize: 12, color: 'var(--runit-accent)', fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* Menu */}
        <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, i) => (
            <div key={item.label}
              onClick={item.disabled ? undefined : item.action}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: i < menuItems.length - 1 ? '1px solid var(--runit-border)' : 'none', cursor: item.disabled ? 'default' : 'pointer', opacity: item.disabled ? 0.5 : 1 }}
              onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = 'rgba(0,201,167,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>{item.sub}</div>
              </div>
              {!item.disabled && <span style={{ color: 'var(--runit-muted)', fontSize: 16 }}>›</span>}
              {item.disabled && <span style={{ fontSize: 10, color: 'var(--runit-muted)', background: 'var(--runit-elevated)', borderRadius: 50, padding: '2px 8px' }}>Soon</span>}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, overflow: 'hidden' }}>
          <div onClick={() => setShowLogout(true)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,80,80,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 22 }}>🚪</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#ff8080' }}>Sign Out</div>
              <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>Log out of your runner account</div>
            </div>
          </div>
        </div>

        {/* Logout confirm modal */}
        {showLogout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
            <div style={{ background: 'var(--runit-elevated)', border: '1px solid var(--runit-border)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Sign out?</div>
              <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 24 }}>You won't receive new orders while signed out.</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '12px', borderRadius: 50, background: 'transparent', border: '1px solid var(--runit-border)', color: 'var(--runit-text)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { logout(); navigate('/'); }} style={{ flex: 1, padding: '12px', borderRadius: 50, background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff8080', fontWeight: 600, cursor: 'pointer' }}>Sign Out</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--runit-muted)' }}>
          RunIt v1.0 · Built for UCC 🎓
        </div>
      </div>
      <BottomPillNav />
    </div>
  );
}