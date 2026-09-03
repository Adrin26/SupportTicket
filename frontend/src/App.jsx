import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Ticket, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { fetchTickets, updateTicket, deleteTicket } from './api/ticketService';
import FilterBar from './components/FilterBar';
import TicketList from './components/TicketList';
import CreateTicketModal from './components/CreateTicketModal';
import TicketDetailModal from './components/TicketDetailModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // Async Action Progress States
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: null, type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

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

  // Overall metric counts
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

  const handleTicketCreated = (newTicket) => {
    loadTickets();
    showToast(`Ticket #${newTicket.id} "${newTicket.title}" was created successfully!`, 'success');
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await updateTicket(ticketId, { status: newStatus });
      
      // Update selected ticket in modal
      setSelectedTicket(updated);
      
      // Update list in place
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updated : t))
      );

      showToast(`Status updated to "${newStatus}" for ticket #${ticketId}`, 'success');
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteRequest = (ticket) => {
    setTicketToDelete(ticket);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      setIsDeleting(true);
      await deleteTicket(ticketToDelete.id);

      // Remove from list
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));

      // Close modals
      setSelectedTicket(null);
      const deletedId = ticketToDelete.id;
      const deletedTitle = ticketToDelete.title;
      setTicketToDelete(null);

      showToast(`Ticket #${deletedId} "${deletedTitle}" was deleted successfully`, 'success');
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      showToast(err.message || 'Failed to delete ticket', 'error');
    } finally {
      setIsDeleting(false);
    }
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
            <button 
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              id="btn-create-ticket"
            >
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
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      </main>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      {/* Ticket Detail & Status Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
        onDeleteRequest={handleDeleteRequest}
        isUpdatingStatus={isUpdatingStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(ticketToDelete)}
        title="Delete Support Ticket"
        message="Are you sure you want to permanently delete this support ticket? This action cannot be undone."
        ticketTitle={ticketToDelete?.title}
        ticketId={ticketToDelete?.id}
        confirmLabel="Delete Ticket"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTicketToDelete(null)}
        isProcessing={isDeleting}
      />

      {/* Floating Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: 'success' })}
      />
    </div>
  );
}

export default App;
