// src/components/SSEListener.jsx
import { useEffect, useRef } from 'react';

export default function SSEListener({ endpoint, onMessage, enabled = true }) {
  const esRef = useRef(null);

  useEffect(() => {
    if (!enabled || !endpoint) return;

    const token = localStorage.getItem('runit_token');
    const url   = `${endpoint}?token=${encodeURIComponent(token)}`;

    const connect = () => {
      if (esRef.current) esRef.current.close();

      const es = new EventSource(url);
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (onMessage) onMessage(data);
        } catch { /* ignore malformed events */ }
      };

      es.onerror = () => {
        es.close();
        // Auto-reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [endpoint, enabled]); // eslint-disable-line

  return null; // renders nothing — purely functional
}