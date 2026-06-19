// src/pages/runner/Feed.jsx
import { useState, useEffect } from 'react';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';
import SSEListener from '../../components/SSEListener';

const categoryColors = {
  'Food & Drinks': { bg: 'rgba(255,150,50,0.1)', color: '#ff9632', border: 'rgba(255,150,50,0.25)' },
  'Errands': { bg: 'rgba(0,201,167,0.1)', color: '#00c9a7', border: 'rgba(0,201,167,0.25)' },
  'Shopping': { bg: 'rgba(150,100,255,0.1)', color: '#9664ff', border: 'rgba(150,100,255,0.25)' },
  'Custom': { bg: 'rgba(255,200,0,0.1)', color: '#ffc800', border: 'rgba(255,200,0,0.25)' },
};

export default function RunnerFeed() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState([]);
  const [countering, setCountering] = useState(null);
  const [counterFee, setCounterFee] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchFeed();
    // Poll every 10 seconds for new orders
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('runit_token');
      const res = await fetch('http://localhost/runit-backend/api/orders/list.php', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Only show pending unassigned orders
        const pending = (data.orders || []).filter(
          o => o.status === 'pending' && !o.runner_id
        );
        setOrders(pending);
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleAccept = async (order) => {
    try {
      const token = localStorage.getItem('runit_token');
      const res = await fetch('http://localhost/runit-backend/api/orders/accept.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setAccepted(a => [...a, order.id]);
        setActionMsg('Order accepted! Head to Active Orders.');
        setTimeout(() => setActionMsg(''), 4000);
        fetchFeed();
      } else {
        setActionMsg(data.error || 'Failed to accept order');
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch {
      setActionMsg('Connection error');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const dotsIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );

  return (
    <div style={{
      background: 'var(--runit-bg)', minHeight: '100vh',
      color: 'var(--runit-text)', paddingBottom: 100,
    }}>
      <PillNavbar
        title="Live Order Feed"
        subtitle="Pending orders near you"
        actions={[{ icon: dotsIcon, onClick: () => { } }]}
      />

      <div className="page-content">

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--runit-accent)',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{ fontSize: 13, color: 'var(--runit-muted)' }}>
            Live — refreshes every 10 seconds
          </span>
          <button onClick={fetchFeed} style={{
            marginLeft: 'auto', padding: '4px 12px', borderRadius: 50,
            background: 'transparent', border: '1px solid var(--runit-border)',
            color: 'var(--runit-muted)', fontSize: 11, cursor: 'pointer',
          }}>Refresh</button>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>

        {/* Action message toast */}
        {actionMsg && (
          <div style={{
            background: 'rgba(0,201,167,0.1)', border: '1px solid var(--runit-border-strong)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 16,
            color: 'var(--runit-accent)', fontSize: 13, fontWeight: 500,
          }}>{actionMsg}</div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--runit-muted)' }}>
            Loading orders...
          </div>
        )}

        {/* Order cards */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.filter(o => !accepted.includes(o.id)).map(order => {
              const cat = categoryColors[order.category] || categoryColors['Custom'];
              const isCountering = countering === order.id;

              return (
                <div key={order.id} style={{
                  background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
                  borderRadius: 20, padding: 18, transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--runit-border-strong)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--runit-border)'}
                >
                  {/* Category + time */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 10,
                  }}>
                    <span style={{
                      background: cat.bg, color: cat.color,
                      border: `1px solid ${cat.border}`,
                      borderRadius: 50, padding: '3px 12px',
                      fontSize: 11, fontWeight: 600,
                    }}>{order.category}</span>
                    <span style={{ fontSize: 11, color: 'var(--runit-muted)' }}>
                      {new Date(order.created_at).toLocaleTimeString('en-GH', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 14, lineHeight: 1.6,
                    marginBottom: 12, color: 'var(--runit-text)',
                  }}>{order.description}</p>

                  {/* Notes */}
                  {order.notes && (
                    <p style={{
                      fontSize: 12, color: 'var(--runit-muted)',
                      marginBottom: 12, fontStyle: 'italic',
                    }}>📝 {order.notes}</p>
                  )}

                  {/* Fee */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 14,
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--runit-muted)' }}>
                      Order #{order.id}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 16, fontWeight: 700,
                        color: 'var(--runit-accent)',
                      }}>GH₵ {parseFloat(order.proposed_fee).toFixed(2)}</div>
                      <div style={{ fontSize: 10, color: 'var(--runit-muted)' }}>
                        You keep GH₵ {(parseFloat(order.proposed_fee) * 0.8).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Counter fee input */}
                  {isCountering && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{
                        fontSize: 12, color: 'var(--runit-muted)', marginBottom: 6,
                      }}>Propose a different fee (GH₵):</div>
                      <input
                        type="number" value={counterFee}
                        onChange={e => setCounterFee(e.target.value)}
                        placeholder="e.g. 12"
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: 10,
                          background: 'var(--runit-elevated)', color: 'var(--runit-text)',
                          border: '1px solid var(--runit-border-strong)',
                          fontSize: 14, outline: 'none',
                        }}
                      />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleAccept(order)} style={{
                      flex: 1, padding: '11px', borderRadius: 50,
                      background: 'var(--runit-accent)', color: '#0a1f1c',
                      fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    }}>
                      {isCountering && counterFee
                        ? `Accept at GH₵ ${counterFee}`
                        : 'Accept Order'}
                    </button>
                    {!isCountering ? (
                      <button onClick={() => { setCountering(order.id); setCounterFee(''); }} style={{
                        padding: '11px 18px', borderRadius: 50,
                        background: 'transparent',
                        border: '1px solid var(--runit-border-strong)',
                        color: 'var(--runit-muted)', fontSize: 13, cursor: 'pointer',
                      }}>Counter</button>
                    ) : (
                      <button onClick={() => setCountering(null)} style={{
                        padding: '11px 18px', borderRadius: 50,
                        background: 'transparent',
                        border: '1px solid rgba(255,80,80,0.3)',
                        color: '#ff8080', fontSize: 13, cursor: 'pointer',
                      }}>Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {orders.filter(o => !accepted.includes(o.id)).length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                  All caught up!
                </div>
                <div style={{
                  color: 'var(--runit-muted)', fontSize: 14, marginBottom: 20,
                }}>No pending orders right now. Check back soon.</div>
                <button onClick={fetchFeed} style={{
                  padding: '10px 24px', borderRadius: 50,
                  background: 'transparent', border: '1px solid var(--runit-border)',
                  color: 'var(--runit-muted)', fontSize: 13, cursor: 'pointer',
                }}>Check again</button>
              </div>
            )}
          </div>
        )}
      </div>

      <SSEListener
        endpoint="http://localhost/runit-backend/api/sse/runner_feed.php"
        onMessage={(data) => {
          if (data.type === 'new_order') {
            setOrders(prev => {
              const exists = prev.find(o => o.id === data.order.id);
              if (exists) return prev;
              return [data.order, ...prev];
            });
          }
        }}
      />

      <BottomPillNav />
    </div>
  );
}