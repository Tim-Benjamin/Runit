// src/components/StatusBadge.jsx
const statusConfig = {
  pending:   { label: 'Pending',    bg: 'rgba(255,180,0,0.12)',   color: '#ffb400', border: 'rgba(255,180,0,0.3)' },
  accepted:  { label: 'Accepted',   bg: 'rgba(0,201,167,0.12)',   color: '#00c9a7', border: 'rgba(0,201,167,0.3)' },
  on_the_way:{ label: 'On the Way', bg: 'rgba(80,120,255,0.12)',  color: '#7090ff', border: 'rgba(80,120,255,0.3)' },
  arrived:   { label: 'Arrived',    bg: 'rgba(180,80,255,0.12)',  color: '#c060ff', border: 'rgba(180,80,255,0.3)' },
  delivered: { label: 'Delivered',  bg: 'rgba(0,201,167,0.08)',   color: '#00c9a7', border: 'rgba(0,201,167,0.2)' },
  cancelled: { label: 'Cancelled',  bg: 'rgba(255,80,80,0.1)',    color: '#ff6060', border: 'rgba(255,80,80,0.25)' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px', borderRadius: 50,
      background: config.bg, color: config.color,
      border: `1px solid ${config.border}`,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
    }}>
      {config.label}
    </span>
  );
}