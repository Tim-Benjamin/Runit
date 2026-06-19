// src/pages/user/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';
import StatusBadge from '../../components/StatusBadge';
import SSEListener from '../../components/SSEListener';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'accepted', label: 'Runner Assigned', icon: '🏃' },
  { key: 'on_the_way', label: 'On The Way', icon: '🛵' },
  { key: 'arrived', label: 'Arrived', icon: '📍' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchOrder(); }, []); // eslint-disable-line

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('runit_token');
      const res = await fetch(`http://localhost/runit-backend/api/orders/get.php?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setOrder(data.order);
      else setError(data.error || 'Order not found');
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  };

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem('runit_token');
      const res = await fetch('http://localhost/runit-backend/api/orders/cancel.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_id: parseInt(id) }),
      });
      const data = await res.json();
      if (res.ok) fetchOrder();
      else setError(data.error || 'Failed to cancel');
    } catch {
      setError('Connection error');
    }
    setCancelling(false);
  };

  const stepIndex = STATUS_STEPS.findIndex(s => s.key === order?.status);

  return (
    <div style={{ background: 'var(--runit-bg)', minHeight: '100vh', color: 'var(--runit-text)', paddingBottom: 100 }}>
      <PillNavbar
        title={'Order #' + id}
        subtitle="Order details"
      />

      <div className="page-content">

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#ff8080', fontSize: 13 }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--runit-muted)' }}>Loading...</div>
        )}

        {!loading && order && (
          <div>

            {/* Status tracker */}
            <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Order Status</span>
                <StatusBadge status={order.status} />
              </div>

              {order.status !== 'cancelled' && (
                <div>
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i <= stepIndex;
                    const isActive = i === stepIndex;
                    return (
                      <div key={step.key} style={{ display: 'flex', gap: 14, marginBottom: i < STATUS_STEPS.length - 1 ? 0 : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            background: isDone ? 'rgba(0,201,167,0.15)' : 'var(--runit-elevated)',
                            border: '2px solid ' + (isDone ? 'var(--runit-accent)' : 'var(--runit-border)'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isActive ? 16 : 14,
                            transition: 'all 0.3s',
                          }}>
                            {step.icon}
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{ width: 2, flex: 1, minHeight: 28, background: i < stepIndex ? 'var(--runit-accent)' : 'var(--runit-border)', margin: '4px 0' }} />
                          )}
                        </div>
                        <div style={{ paddingTop: 6, paddingBottom: i < STATUS_STEPS.length - 1 ? 20 : 0 }}>
                          <div style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isDone ? 'var(--runit-text)' : 'var(--runit-muted)' }}>
                            {step.label}
                          </div>
                          {isActive && (
                            <div style={{ fontSize: 11, color: 'var(--runit-accent)', marginTop: 2 }}>Current status</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {order.status === 'cancelled' && (
                <div style={{ textAlign: 'center', padding: '12px 0', color: '#ff8080' }}>
                  This order was cancelled
                </div>
              )}
            </div>

            {/* Order info */}
            <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 12, fontWeight: 600 }}>Order Details</div>

              <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{order.description}</div>

              {order.notes && (
                <div style={{ fontSize: 13, color: 'var(--runit-muted)', fontStyle: 'italic', marginBottom: 14, padding: '10px 14px', background: 'var(--runit-elevated)', borderRadius: 10 }}>
                  📝 {order.notes}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Category', value: order.category },
                  { label: 'Proposed Fee', value: 'GH₵ ' + parseFloat(order.proposed_fee).toFixed(2) },
                  { label: 'Final Fee', value: order.final_fee ? 'GH₵ ' + parseFloat(order.final_fee).toFixed(2) : 'Pending agreement' },
                  { label: 'Placed', value: new Date(order.created_at).toLocaleString('en-GH') },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px solid var(--runit-border)', paddingBottom: 8 }}>
                    <span style={{ color: 'var(--runit-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Runner info */}
            {order.runner_name && (
              <div style={{ background: 'var(--runit-surface)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--runit-muted)', marginBottom: 12, fontWeight: 600 }}>Your Runner</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--runit-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: '#0a1f1c' }}>
                      {order.runner_name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{order.runner_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>{order.delivery_method || 'Runner'}</div>
                    </div>
                  </div>
                  <a href={'tel:' + order.runner_phone} style={{ padding: '10px 16px', borderRadius: 50, background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.3)', color: 'var(--runit-accent)', fontWeight: 600, fontSize: 13 }}>
                    📞 Call
                  </a>
                </div>
              </div>
            )}

            {/* Payment info */}
            <div style={{ background: 'rgba(0,201,167,0.05)', border: '1px solid var(--runit-border)', borderRadius: 20, padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>💵</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Cash on delivery</div>
                  <div style={{ fontSize: 13, color: 'var(--runit-muted)', lineHeight: 1.5 }}>
                    Pay your runner GH₵ {parseFloat(order.final_fee || order.proposed_fee).toFixed(2)} in cash when they arrive.
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel button */}
            {order.status === 'pending' && (
              <button onClick={cancelOrder} disabled={cancelling} style={{ width: '100%', padding: '13px', borderRadius: 50, background: 'transparent', border: '1px solid rgba(255,80,80,0.35)', color: '#ff8080', fontWeight: 600, fontSize: 14, cursor: cancelling ? 'not-allowed' : 'pointer' }}>
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

          </div>
        )}
      </div>

      <SSEListener
        endpoint={`http://localhost/runit-backend/api/sse/order_status.php&order_id=${id}`}
        enabled={!!order && !['delivered', 'cancelled'].includes(order?.status)}
        onMessage={(data) => {
          if (data.type === 'status_update') {
            setOrder(prev => prev ? { ...prev, ...data.order } : prev);
          }
        }}
      />
      <BottomPillNav />
    </div>
  );
}