import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Ticket, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { fetchTickets } from './api/ticketService';
import FilterBar from './components/FilterBar';
import TicketList from './components/TicketList';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Selected Ticket for details modal (Phase 6)
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTickets({
        status: statusFilter,
        priority: priorityFilter,
      });
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Client-side text search on the fetched tickets
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) {
      return tickets;
    }
    const query = searchQuery.toLowerCase().trim();
    return tickets.filter((t) => {
      const matchTitle = t.title?.toLowerCase().includes(query);
      const matchDesc = t.description?.toLowerCase().includes(query);
      const matchRequester = t.requesterName?.toLowerCase().includes(query);
      const matchId = String(t.id).includes(query);
      return matchTitle || matchDesc || matchRequester || matchId;
    });
  }, [tickets, searchQuery]);

  // Overall metric counts (fetched across all for KPI accuracy or based on current dataset)
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const isFiltered = statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    // Modal will open here in Phase 6
    console.log('Selected ticket:', ticket);
  };

  return (
    <div className="app-container">
      {/* App Header */}
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
            <button className="btn btn-primary" onClick={() => console.log('Open Create Modal (Phase 5)')}>
              <Plus size={16} />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* KPI Overview Cards */}
        <section className="stats-grid" aria-label="Ticket statistics">
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

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          totalCount={tickets.length}
          filteredCount={filteredTickets.length}
          onResetFilters={handleResetFilters}
        />

        {/* Ticket List Section */}
        <TicketList
          tickets={filteredTickets}
          loading={loading}
          error={error}
          onRetry={loadTickets}
          onSelectTicket={handleSelectTicket}
          onOpenCreateModal={() => console.log('Open create modal')}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      </main>
    </div>
  );
}

export default App;
