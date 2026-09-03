import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { fetchTickets } from './api/ticketService';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-icon-wrapper">
              <Ticket size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="brand-title">
                Support Portal
                <span className="brand-tag">Internal</span>
              </h1>
            </div>
          </div>

          <div className="header-actions">
            <button 
              className="btn btn-secondary" 
              onClick={loadTickets} 
              disabled={loading}
              title="Refresh tickets"
            >
              <RefreshCw size={16} className={loading ? 'spinner spinner-dark' : ''} />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary">
              <Plus size={16} />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Quick Stats Overview */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Ticket size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Tickets</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <AlertCircle size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{openCount}</span>
              <span className="stat-label">Open</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#fffbeb', color: '#b45309' }}>
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{inProgressCount}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#047857' }}>
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{resolvedCount}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </section>

        {/* State Indicators */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <div className="spinner spinner-dark" style={{ width: '2rem', height: '2rem', marginBottom: '0.75rem' }} />
            <p>Connecting to backend and loading tickets...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger-text)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} />
              <span><strong>Backend Connection Error:</strong> {error}</span>
            </div>
            <button className="btn btn-secondary" onClick={loadTickets}>Retry</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
