// src/components/FAB.jsx
import { useNavigate } from 'react-router-dom';

export default function FAB({ label = '+ Place Order', to = '/place-order', onClick }) {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%',
      transform: 'translateX(-50%)', zIndex: 99,
    }}>
      <button
        onClick={onClick || (() => navigate(to))}
        style={{
          padding: '14px 36px', borderRadius: 50,
          background: 'var(--runit-accent)', color: '#0a1f1c',
          fontWeight: 700, fontSize: 15, border: 'none',
          cursor: 'pointer', whiteSpace: 'nowrap',
          boxShadow: '0 4px 30px rgba(0,201,167,0.35)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.04)';
          e.currentTarget.style.boxShadow = '0 6px 36px rgba(0,201,167,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,201,167,0.35)';
        }}
      >
        {label}
      </button>
    </div>
  );
}