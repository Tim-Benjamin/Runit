// src/pages/runner/ActiveOrder.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';
import StatusBadge from '../../components/StatusBadge';

const STATUS_FLOW = [
  { key: 'accepted',   next: 'on_the_way', action: 'Mark On The Way' },
  { key: 'on_the_way', next: 'arrived',    action: 'Mark Arrived' },
  { key: 'arrived',    next: 'delivered',  action: 'Mark Delivered' },
  { key: 'delivered',  next: null,         action: null },
];

export default function ActiveOrder() {
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg]           = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchActiveOrder(); }, []); // eslint-disable-line

  const fetchActiveOrder = async () => {
    try {
      const token = localStorage.getItem('runit_token');
      const res   = await fetch('http://localhost/runit-backend/api/orders/list.php', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const active = (data.orders || []).find(o =>
          ['accepted', 'on_the_way', 'arrived'].includes(o.status)
        );
        setOrder(active || null);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem('runit_token');
      const res   = await fetch('http://localhost/runit-backend/api/orders/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: order.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(newStatus === 'delivered' ? 'Order delivered! Great work.' : 'Status updated.');
        fetchActiveOrder();
      } else {
        setMsg(data.error || 'Failed to update');
      }
    } catch {
      setMsg('Connection error');
    }
    setTimeout(() => setMsg(''), 3000);
    setUpdating(false);
  };

  const currentStep = STATUS_FLOW.find(s => s.key === order?.status);
  const stepIndex   = STATUS_FLOW.findIndex(s => s.key === order?.status);

  return (
    <div style={{ background: 'var(--runit-bg)', minHeight: '100vh', color: 'var(--runit-text)', paddingBottom: 100 }}>
      <PillNavbar
        title="Active Order"
        subtitle={order ? 'Order #' + order.id : 'No active order'}
        actions={[
          { icon: '??', onClick: () => order?.user_phone && window.open('tel:' + order.user_phone) },
        ]}
      />

      <div className="page-content">

        {msg !== '' && (
          <div style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid var(--runit-border-strong)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: 'var(--runit-accent)', fontSize: 13 }}>
            {msg}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--runit-muted)' }}>Loading...</div>
        )}

        {!loading && !order && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>??</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No active order</div>
            <div style={{ color: 'var(--runit-muted)', fontSize: 14, marginBottom: 24 }}>Accept an order from the feed to see it here</div>
            <button onClick={() => navigate('/runner/feed')} style={{ padding: '12px 28px', borderRadius: 50, background: 'var(--runit-accent)', color: '#0a1f1c', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Go to Feed</button>
          </div>
        )}

        {!loading && order && (
          <div>

            <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Order #{order.id}</span>
                <StatusBadge status={order.status} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                {STATUS_FLOW.map((step, i) => (
                  <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: i === stepIndex ? 14 : 10, height: i === stepIndex ? 14 : 10, borderRadius: '50%', flexShrink: 0, background: i <= stepIndex ? 'var(--runit-accent)' : 'var(--runit-elevated)', border: '2px solid ' + (i <= stepIndex ? 'var(--runit-accent)' : 'var(--runit-border)') }} />
                    {i < STATUS_FLOW.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--runit-accent)' : 'var(--runit-border)' }} />
                    )}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{order.description}</div>

              {order.notes && (
                <div style={{ fontSize: 12, color: 'var(--runit-muted)', fontStyle: 'italic', marginBottom: 12 }}>Note: {order.notes}</div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--runit-border)', paddingTop: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--runit-muted)' }}>Your cut</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--runit-accent)' }}>GH? {(parseFloat(order.final_fee || order.proposed_fee) * 0.8).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 12 }}>Customer</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{order.user_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--runit-muted)' }}>{order.user_phone}</div>
                </div>
                <a href={'tel:' + order.user_phone} style={{ padding: '10px 18px', borderRadius: 50, background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.3)', color: 'var(--runit-accent)', fontWeight: 600, fontSize: 13 }}>Call</a>
              </div>
            </div>

            {order.delivery_lat && order.delivery_lng && (
              <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 12 }}>Delivery location</div>
                <a href={'https://www.google.com/maps?q=' + order.delivery_lat + ',' + order.delivery_lng} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 14, background: 'var(--runit-elevated)', border: '1px solid var(--runit-border)', color: 'var(--runit-accent)', fontWeight: 600, fontSize: 14 }}>
                  Open in Google Maps
                </a>
              </div>
            )}

            {currentStep && currentStep.next && (
              <button onClick={() => updateStatus(currentStep.next)} disabled={updating} style={{ width: '100%', padding: '15px', borderRadius: 50, background: updating ? 'var(--runit-accent-dark)' : 'var(--runit-accent)', color: '#0a1f1c', fontWeight: 700, fontSize: 15, border: 'none', cursor: updating ? 'not-allowed' : 'pointer', marginBottom: 12 }}>
                {updating ? 'Updating...' : currentStep.action}
              </button>
            )}

            {order.status === 'delivered' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>??</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Order delivered!</div>
                <div style={{ color: 'var(--runit-muted)', fontSize: 13 }}>Collect GH? {parseFloat(order.final_fee || order.proposed_fee).toFixed(2)} cash from the customer</div>
              </div>
            )}

          </div>
        )}

      </div>

      <BottomPillNav />
    </div>
  );
}
