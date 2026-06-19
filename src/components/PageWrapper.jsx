// src/components/PageWrapper.jsx
// Wraps page content with correct padding for desktop vs mobile

export default function PageWrapper({ children, maxWidth = 560 }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--runit-bg)',
      color: 'var(--runit-text)',
      paddingBottom: 100,
    }}>
      <div
        className="page-content"
        style={{ maxWidth, margin: '0 auto' }}
      >
        {children}
      </div>
    </div>
  );
}