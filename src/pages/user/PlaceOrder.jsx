// src/pages/user/PlaceOrder.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PillNavbar from '../../components/PillNavbar';

const CATEGORIES = ['Food & Drinks', 'Errands', 'Shopping', 'Custom'];

const BASE_FEES = {
  'Food & Drinks': 5,
  'Errands': 8,
  'Shopping': 10,
  'Custom': 0,
};

export default function PlaceOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    description: searchParams.get('description') || '',
    category: searchParams.get('category') || 'Food & Drinks',
    notes: '',
    proposed_fee: BASE_FEES['Food & Drinks'],
  });

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update base fee when category changes
  useEffect(() => {
    setForm(f => ({
      ...f,
      proposed_fee: BASE_FEES[f.category] || 0,
    }));
  }, [form.category]);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    setLocating(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError('Location access denied. Please allow location to place an order.');
        setLocating(false);
      }
    );
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!location) {
      setError('Location is required. Please allow location access.');
      return;
    }
    if (!form.description.trim()) {
      setError('Please describe what you need.');
      return;
    }
    if (form.proposed_fee < 1) {
      setError('Delivery fee must be at least GH₵ 1.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('runit_token');
      const res = await fetch('http://localhost/runit-backend/api/orders/create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: form.description,
          category: form.category,
          notes: form.notes,
          proposed_fee: parseFloat(form.proposed_fee),
          delivery_lat: location.lat,
          delivery_lng: location.lng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to place order.');
      } else {
        navigate('/orders');
      }
    } catch {
      setError('Cannot connect to server. Make sure XAMPP is running.');
    }

    setSubmitting(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'var(--runit-elevated)', color: 'var(--runit-text)',
    border: '1px solid var(--runit-border)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: 13, color: 'var(--runit-muted)',
    display: 'block', marginBottom: 6,
  };

  return (
    <div style={{
      background: 'var(--runit-bg)', minHeight: '100vh',
      color: 'var(--runit-text)', paddingBottom: 40,
    }}>
      <PillNavbar
        title="Place Order"
        subtitle="Describe what you need"
      />

      <div className="page-content">

        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
            color: '#ff8080', fontSize: 13,
          }}>{error}</div>
        )}

        {/* Location status */}
        <div style={{
          background: location
            ? 'rgba(0,201,167,0.07)'
            : 'rgba(255,180,0,0.07)',
          border: `1px solid ${location ? 'rgba(0,201,167,0.2)' : 'rgba(255,180,0,0.2)'}`,
          borderRadius: 14, padding: '12px 16px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{location ? '📍' : locating ? '⏳' : '⚠️'}</span>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: location ? 'var(--runit-accent)' : '#ffb400',
              }}>
                {location ? 'Location captured' : locating ? 'Getting your location...' : 'Location required'}
              </div>
              {locationError && (
                <div style={{ fontSize: 11, color: '#ff8080', marginTop: 2 }}>{locationError}</div>
              )}
              {location && (
                <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginTop: 2 }}>
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </div>
              )}
            </div>
          </div>
          {!location && !locating && (
            <button onClick={requestLocation} style={{
              padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 600,
              background: 'rgba(255,180,0,0.15)', border: '1px solid rgba(255,180,0,0.3)',
              color: '#ffb400', cursor: 'pointer',
            }}>Retry</button>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>What do you need? *</label>
            <textarea
              name="description" required
              rows={4}
              placeholder="e.g. Buy 2 meat pies and a Voltic water from the canteen near Senate Building"
              value={form.description} onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--runit-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--runit-border)'}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  style={{
                    padding: '10px 12px', borderRadius: 12, fontSize: 13,
                    fontWeight: form.category === cat ? 600 : 400,
                    border: '1px solid',
                    borderColor: form.category === cat ? 'var(--runit-accent)' : 'var(--runit-border)',
                    background: form.category === cat ? 'rgba(0,201,167,0.12)' : 'var(--runit-elevated)',
                    color: form.category === cat ? 'var(--runit-accent)' : 'var(--runit-muted)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Extra details / notes (optional)</label>
            <textarea
              name="notes" rows={2}
              placeholder="e.g. Please call me when you arrive. Room 204."
              value={form.notes} onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--runit-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--runit-border)'}
            />
          </div>

          {/* Delivery fee */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>
              Delivery fee (GH₵) *
              <span style={{ color: 'var(--runit-muted)', fontWeight: 400, marginLeft: 6 }}>
                — base fee: GH₵ {BASE_FEES[form.category] || 0}
              </span>
            </label>
            <input
              type="number" name="proposed_fee" min="1" step="0.5"
              value={form.proposed_fee} onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--runit-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--runit-border)'}
            />
            <div style={{ fontSize: 11, color: 'var(--runit-muted)', marginTop: 6 }}>
              You can increase this to attract runners faster. Minimum is the base fee.
            </div>
          </div>

          {/* Fee summary */}
          <div style={{
            background: 'var(--runit-surface)', border: '1px solid var(--runit-border)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--runit-muted)' }}>Category</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{form.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--runit-muted)' }}>You pay runner</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--runit-accent)' }}>
                GH₵ {parseFloat(form.proposed_fee || 0).toFixed(2)}
              </span>
            </div>
            <div style={{
              borderTop: '1px solid var(--runit-border)', paddingTop: 8, marginTop: 4,
              fontSize: 11, color: 'var(--runit-muted)',
            }}>
              💵 Cash on delivery — pay your runner when they arrive
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting || !location} style={{
            width: '100%', padding: '15px', borderRadius: 50,
            background: submitting || !location ? 'var(--runit-accent-dark)' : 'var(--runit-accent)',
            color: '#0a1f1c', fontWeight: 700, fontSize: 16,
            border: 'none', cursor: submitting || !location ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 24px rgba(0,201,167,0.25)',
            transition: 'opacity 0.2s',
          }}>
            {submitting ? 'Placing order...' : !location ? 'Waiting for location...' : 'Place Order →'}
          </button>

        </form>
      </div>
    </div>
  );
}