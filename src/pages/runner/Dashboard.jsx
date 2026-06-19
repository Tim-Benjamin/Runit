// src/pages/runner/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';
import StatusBadge from '../../components/StatusBadge';

export default function RunnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('runit_token');

      const [eRes, oRes] = await Promise.all([
        fetch('http://localhost/runit-backend/api/runner/earnings.php', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost/runit-backend/api/orders/list.php', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const eData = await eRes.json();
      const oData = await oRes.json();

      if (eRes.ok) setEarnings(eData);
      if (oRes.ok) setOrders(oData.orders || []);
    } catch { /* silent */ }
  };

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
    <div style={{ background: 'var(--runit-bg)', minHeight: '100vh', color: 'var(--runit-text)', paddingBottom: 100 }}>

      <PillNavbar
        title="Runner Dashboard"
        subtitle={`${user?.name?.split(' ')[0]} · Online`}
        actions={[
          { icon: bellIcon, onClick: () => { } },
          { icon: dotsIcon, onClick: logout },
        ]}
      />

      <div className="page-content">

        {/* Greeting + status */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Hey {user?.name?.split(' ')[0]} 🏃‍♂️
            </h1>
            <p style={{ color: 'var(--runit-muted)', fontSize: 14 }}>You're online and ready</p>
          </div>
          {/* Online toggle pill */}
          <div style={{
            background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.3)',
            borderRadius: 50, padding: '6px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--runit-accent)' }} />
            <span style={{ fontSize: 12, color: 'var(--runit-accent)', fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* Today's stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {[
            { label: "This Week's Orders", value: earnings?.week?.week_orders || 0 },
            { label: 'Earned This Week', value: 'GH₵ ' + parseFloat(earnings?.week?.week_earned || 0).toFixed(2) },
            { label: 'Commission Owed', value: 'GH₵ ' + Math.max(0, parseFloat(earnings?.totals?.total_platform_cut || 0) - parseFloat(earnings?.totals?.total_settled || 0)).toFixed(2) },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
              borderRadius: 16, padding: '16px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--runit-accent)' }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'var(--runit-muted)', marginTop: 2, lineHeight: 1.3 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Go to feed CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,201,167,0.12), rgba(0,121,107,0.08))',
          border: '1px solid var(--runit-border-strong)',
          borderRadius: 20, padding: 20, marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>New orders waiting</div>
            <div style={{ color: 'var(--runit-muted)', fontSize: 13 }}>Check the live feed to accept</div>
          </div>
          <button onClick={() => navigate('/runner/feed')} style={{
            padding: '10px 20px', borderRadius: 50,
            background: 'var(--runit-accent)', color: '#0a1f1c',
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
          }}>View Feed</button>
        </div>

        {/* Today's completed orders */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Today's Orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--runit-muted)', fontSize: 14 }}>
                No orders yet — check the feed!
              </div>
            ) : orders.slice(0, 5).map(order => (
              <div key={order.id} style={{
                background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
                    {order.description.length > 50 ? order.description.slice(0, 50) + '...' : order.description}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--runit-muted)' }}>
                    {new Date(order.created_at).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })}
                    {' · GH₵ '}
                    {parseFloat(order.final_fee || order.proposed_fee).toFixed(2)}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomPillNav />
    </div>
  );
}