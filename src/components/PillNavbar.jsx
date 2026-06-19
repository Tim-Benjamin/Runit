// src/components/PillNavbar.jsx
import { useNavigate } from 'react-router-dom';

const pillStyle = {
  background: 'rgba(15,46,41,0.80)',
  border: '0.5px solid rgba(0,201,167,0.18)',
  borderRadius: 50,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function PillNavbar({ title, subtitle, avatar, actions = [] }) {
  const navigate = useNavigate();

  return (
    <div
      className="pill-navbar-desktop"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100, display: 'flex',
        alignItems: 'center', gap: 8,
        padding: '12px 16px',
        pointerEvents: 'none',
      }}
    >
      {/* Back pill */}
      <button
        onClick={() => navigate(-1)}
        style={{
          ...pillStyle,
          width: 40, height: 40,
          flexShrink: 0, cursor: 'pointer',
          pointerEvents: 'all',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Title pill — stretches to fill */}
      <div style={{
        ...pillStyle,
        flex: 1, gap: 10,
        padding: '0 16px', height: 40,
        justifyContent: 'flex-start',
        pointerEvents: 'all',
      }}>
        {avatar && (
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--runit-accent)', flexShrink: 0,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#0a1f1c',
          }}>{avatar}</div>
        )}
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontSize: 13, fontWeight: 700,
            color: 'var(--runit-text)', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontSize: 9, color: 'var(--runit-muted)',
              lineHeight: 1.2, marginTop: 1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{subtitle}</div>
          )}
        </div>
      </div>

      {/* Action pills — each separate */}
      {actions.map((action, i) => (
        <button key={i} onClick={action.onClick} style={{
          ...pillStyle,
          width: 40, height: 40,
          flexShrink: 0, cursor: 'pointer',
          pointerEvents: 'all',
        }}>
          {action.icon}
        </button>
      ))}
    </div>
  );
}