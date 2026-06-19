// src/pages/runner/Earnings.jsx
import { useState, useEffect } from 'react';
import PillNavbar from '../../components/PillNavbar';
import BottomPillNav from '../../components/BottomPillNav';

export default function RunnerEarnings() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('summary');

  useEffect(() => { fetchEarnings(); }, []); // eslint-disable-line

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('runit_token');
      const res   = await fetch('http://localhost/runit-backend/api/runner/earnings.php', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) setData(json);
    } catch { /* silent */ }
    setLoading(false);
  };

  const dotsIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="var(--runit-text)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );

  const outstanding = Math.max(0,
    parseFloat(data?.totals?.total_platform_cut || 0) -
    parseFloat(data?.totals?.total_settled || 0)
  );

  return (
    <div style={{
      background: 'var(--runit-bg)', minHeight: '100vh',
      color: 'var(--runit-text)', paddingBottom: 100,
    }}>
      <PillNavbar
        title="My Earnings"
        subtitle="Delivery income tracker"
        actions={[{ icon: dotsIcon, onClick: () => {} }]}
      />

      <div className="page-content">

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--runit-muted)' }}>
            Loading earnings...
          </div>
        ) : (
          <div>

            {/* Outstanding debt alert */}
            {outstanding > 0.01 && (
              <div style={{
                background: 'rgba(255,180,0,0.08)',
                border: '1px solid rgba(255,180,0,0.25)',
                borderRadius: 16, padding: '14px 16px', marginBottom: 20,
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#ffb400', marginBottom: 4 }}>
                    GH₵ {outstanding.toFixed(2)} platform commission owed
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--runit-muted)', lineHeight: 1.5 }}>
                    Send via Mobile Money to settle before Sunday.
                    Unsettled accounts are auto-suspended.
                  </div>
                </div>
              </div>
            )}

            {outstanding < 0.01 && data?.totals?.total_orders > 0 && (
              <div style={{
                background: 'rgba(0,201,167,0.07)',
                border: '1px solid rgba(0,201,167,0.2)',
                borderRadius: 16, padding: '14px 16px', marginBottom: 20,
                display: 'flex', gap: 10, alignItems: 'center',
              }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div style={{ fontSize: 13, color: 'var(--runit-accent)', fontWeight: 600 }}>
                  All commissions settled — you're clear!
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, marginBottom: 20,
            }}>
              {[
                {
                  label: 'Total Earned',
                  value: 'GH₵ ' + parseFloat(data?.totals?.total_runner_cut || 0).toFixed(2),
                  sub: 'Your 80% across all orders',
                  color: 'var(--runit-accent)',
                },
                {
                  label: 'Orders Done',
                  value: data?.totals?.total_orders || 0,
                  sub: 'Completed deliveries',
                  color: 'var(--runit-text)',
                },
                {
                  label: 'Platform Owed',
                  value: 'GH₵ ' + parseFloat(data?.totals?.total_platform_cut || 0).toFixed(2),
                  sub: '20% commission total',
                  color: '#ffb400',
                },
                {
                  label: 'Settled',
                  value: 'GH₵ ' + parseFloat(data?.totals?.total_settled || 0).toFixed(2),
                  sub: 'Amount paid to platform',
                  color: '#00c9a7',
                },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--runit-surface)',
                  border: '1px solid var(--runit-border)',
                  borderRadius: 16, padding: '16px 14px',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginBottom: 6 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 2 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--runit-muted)', lineHeight: 1.4 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Outstanding balance card */}
            <div style={{
              background: 'var(--runit-surface)',
              border: '1px solid ' + (outstanding > 0 ? 'rgba(255,180,0,0.3)' : 'var(--runit-border)'),
              borderRadius: 20, padding: 20, marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Outstanding Balance</span>
                <span style={{
                  fontSize: 20, fontWeight: 800,
                  color: outstanding > 0 ? '#ffb400' : '#00c9a7',
                }}>
                  GH₵ {outstanding.toFixed(2)}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--runit-muted)', marginBottom: 4 }}>
                  <span>Settled</span>
                  <span>
                    {data?.totals?.total_platform_cut > 0
                      ? Math.round((parseFloat(data.totals.total_settled) / parseFloat(data.totals.total_platform_cut)) * 100)
                      : 100}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--runit-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: outstanding > 0 ? '#ffb400' : '#00c9a7',
                    width: data?.totals?.total_platform_cut > 0
                      ? Math.min(100, Math.round((parseFloat(data.totals.total_settled) / parseFloat(data.totals.total_platform_cut)) * 100)) + '%'
                      : '100%',
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>

              {outstanding > 0 && (
                <div style={{ fontSize: 12, color: 'var(--runit-muted)', lineHeight: 1.5 }}>
                  Send <strong style={{ color: '#ffb400' }}>GH₵ {outstanding.toFixed(2)}</strong> via
                  Mobile Money to admin to clear your balance.
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { key: 'summary', label: 'Order History' },
                { key: 'settlements', label: 'Settlements' },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  flex: 1, padding: '10px', borderRadius: 50,
                  border: '1px solid',
                  borderColor: tab === t.key ? 'var(--runit-accent)' : 'var(--runit-border)',
                  background: tab === t.key ? 'rgba(0,201,167,0.12)' : 'transparent',
                  color: tab === t.key ? 'var(--runit-accent)' : 'var(--runit-muted)',
                  fontWeight: tab === t.key ? 700 : 400,
                  fontSize: 13, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>

            {/* Order history tab */}
            {tab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(data?.earnings || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--runit-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>No deliveries yet</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Accept orders from the feed to start earning
                    </div>
                  </div>
                ) : (data.earnings || []).map(e => (
                  <div key={e.id} style={{
                    background: 'var(--runit-surface)',
                    border: '1px solid var(--runit-border)',
                    borderRadius: 16, padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ flex: 1, marginRight: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginBottom: 3 }}>
                          Order #{e.order_id} · {e.category}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>
                          {e.description
                            ? (e.description.length > 55 ? e.description.slice(0, 55) + '...' : e.description)
                            : 'Delivery'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--runit-accent)' }}>
                          +GH₵ {parseFloat(e.runner_cut).toFixed(2)}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--runit-muted)' }}>
                          Platform: GH₵ {parseFloat(e.platform_cut).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      borderTop: '1px solid var(--runit-border)', paddingTop: 8,
                      fontSize: 11, color: 'var(--runit-muted)',
                    }}>
                      <span>Total fee: GH₵ {parseFloat(e.delivery_fee).toFixed(2)}</span>
                      <span>{new Date(e.created_at).toLocaleDateString('en-GH', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Settlements tab */}
            {tab === 'settlements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(data?.settlements || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--runit-muted)' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>No settlements yet</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      Admin will record your MoMo payments here
                    </div>
                  </div>
                ) : (data.settlements || []).map(s => (
                  <div key={s.id} style={{
                    background: 'var(--runit-surface)',
                    border: '1px solid var(--runit-border)',
                    borderRadius: 16, padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                        GH₵ {parseFloat(s.amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--runit-muted)' }}>
                        {new Date(s.period_start).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
                        {' – '}
                        {new Date(s.period_end).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
                      </div>
                      {s.marked_at && (
                        <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginTop: 2 }}>
                          Recorded: {new Date(s.marked_at).toLocaleDateString('en-GH')}
                        </div>
                      )}
                    </div>
                    <span style={{
                      background: 'rgba(0,201,167,0.1)',
                      border: '1px solid rgba(0,201,167,0.3)',
                      color: '#00c9a7', borderRadius: 50,
                      padding: '4px 14px', fontSize: 11, fontWeight: 600,
                    }}>Settled</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
      <BottomPillNav />
    </div>
  );
}