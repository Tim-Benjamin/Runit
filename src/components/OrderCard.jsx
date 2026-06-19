// src/components/OrderCard.jsx
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function OrderCard({ order, role = 'user', onClick }) {
  const navigate = useNavigate();

  const handleClick = onClick || (() => {
    if (role === 'user') navigate('/orders/' + order.id);
    if (role === 'runner') navigate('/runner/active');
  });

  const categoryColors = {
    'Food & Drinks': '#ff9632',
    'Errands':       '#00c9a7',
    'Shopping':      '#9664ff',
    'Custom':        '#ffc800',
  };

  const dotColor = categoryColors[order.category] || '#00c9a7';

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'var(--runit-surface)',
        border: '1px solid var(--runit-border)',
        borderRadius: 18, padding: '16px',
        cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--runit-border-strong)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--runit-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, marginRight: 10 }}>

          {/* Category dot + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'var(--runit-muted)' }}>{order.category}</span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: 'var(--runit-text)' }}>
            {order.description.length > 70
              ? order.description.slice(0, 70) + '...'
              : order.description}
          </div>

          {/* Show user/runner name depending on role */}
          {role === 'admin' && order.user_name && (
            <div style={{ fontSize: 12, color: 'var(--runit-muted)', marginTop: 4 }}>
              👤 {order.user_name}
              {order.runner_name ? ' · 🏃 ' + order.runner_name : ' · Unassigned'}
            </div>
          )}
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* Bottom row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--runit-border)', paddingTop: 10,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--runit-accent)' }}>
          GH₵ {parseFloat(order.final_fee || order.proposed_fee).toFixed(2)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--runit-muted)' }}>
          {new Date(order.created_at).toLocaleDateString('en-GH', {
            day: 'numeric', month: 'short',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}