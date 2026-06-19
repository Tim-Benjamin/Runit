// src/pages/user/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const editIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const menuItems = [
    { icon: '📦', label: 'My Orders', sub: 'View all your orders', action: () => navigate('/orders') },
    { icon: '🏪', label: 'Browse Shops', sub: 'See vendors near UCC', action: () => navigate('/shops') },
    { icon: '🔔', label: 'Notifications', sub: 'Coming soon', disabled: true },
    { icon: '🔒', label: 'Change Password', sub: 'Coming soon', disabled: true },
    { icon: '📞', label: 'Support', sub: 'runit@ucc.edu.gh', action: () => window.open('mailto:runit@ucc.edu.gh') },
  ];

  return (
    <div style={{ background: 'var(--runit-bg)', minHeight: '100vh', color: 'var(--runit-text)', paddingBottom: 100 }}>
      <PillNavbar title="Profile" subtitle="Account settings" actions={[{ icon: editIcon, onClick: () => {} }]} />

      <div className="page-content">

        {/* Avatar + name */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--runit-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#0a1f1c', margin: '0 auto 12px' }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 8 }}>{user?.email}</div>
          <span style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid var(--runit-border)', borderRadius: 50, padding: '4px 14px', fontSize: 11, color: 'var(--runit-accent)', fontWeight: 600 }}>
            Customer
          </span>
        </div>

        {/* Menu items */}
        <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          {menuItems.map((item, i) => (
            <div key={item.label}
              onClick={item.disabled ? undefined : item.action}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                borderBottom: i < menuItems.length - 1 ? '1px solid var(--runit-border)' : 'none',
                cursor: item.disabled ? 'default' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                transition: 'background 0.15s',
              }}
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
              <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>Log out of your account</div>
            </div>
          </div>
        </div>

        {/* Logout confirm */}
        {showLogout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
            <div style={{ background: 'var(--runit-elevated)', border: '1px solid var(--runit-border)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 340, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Sign out?</div>
              <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 24 }}>You'll need to sign in again to place orders.</div>
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