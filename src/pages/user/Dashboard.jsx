// src/pages/user/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomPillNav from '../../components/BottomPillNav';
import PillNavbar from '../../components/PillNavbar';
import StatusBadge from '../../components/StatusBadge';


export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('runit_token');
        const res = await fetch('http://localhost/runit-backend/api/orders/list.php', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
      } catch { /* silent */ }
    };
    fetchOrders();
  }, []);

  const active = orders.filter(o => ['pending', 'accepted', 'on_the_way', 'arrived'].includes(o.status));
  const delivered = orders.filter(o => o.status === 'delivered');
  const recent = orders.slice(0, 3);

  const bellIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );

  const dotsIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  );

  return (
    <div style={{
      background: 'var(--runit-bg)', minHeight: '100vh',
      color: 'var(--runit-text)', paddingBottom: 100,
    }}>

      {/* Pill Navbar */}
      <PillNavbar
        title="My Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(' ')[0]}`}
        actions={[
          { icon: bellIcon, onClick: () => { } },
          { icon: dotsIcon, onClick: logout },
        ]}
      />

      {/* Content */}
      <div className="page-content">

        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            Hey {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--runit-muted)', fontSize: 14 }}>
            What do you need today?
          </p>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginBottom: 28,
        }}>
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Active', value: active.length },
            { label: 'Delivered', value: delivered.length },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
              borderRadius: 16, padding: '16px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--runit-accent)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 14,
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Orders</h2>
            <button onClick={() => navigate('/orders')} style={{
              background: 'none', border: 'none', color: 'var(--runit-accent)',
              fontSize: 13, cursor: 'pointer', fontWeight: 500,
            }}>See all →</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--runit-muted)', fontSize: 14 }}>
                No orders yet — place your first one!
              </div>
            ) : recent.map(order => (
              <div key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{
                  background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
                  borderRadius: 16, padding: '14px 16px',
                  cursor: 'pointer', transition: 'border-color 0.2s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--runit-border-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--runit-border)'}
              >
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
                    {order.description}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>
                    {order.category} · {order.fee}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
            {recent.length > 0 && null}
          </div>
        </div>

      </div>

      {/* Floating Place Order button */}
      <div style={{
        position: 'fixed', bottom: 90, left: '50%',
        transform: 'translateX(-50%)', zIndex: 99,
      }}>
        <button
          onClick={() => navigate('/place-order')}
          style={{
            padding: '14px 36px', borderRadius: 50,
            background: 'var(--runit-accent)', color: '#0a1f1c',
            fontWeight: 700, fontSize: 15, border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 30px rgba(0,201,167,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          + Place Order
        </button>
      </div>

      {/* Bottom pill nav */}
      <BottomPillNav />
    </div>
  );
}