import React from 'react';
import { Inbox, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import TicketCard from './TicketCard';

/**
 * Skeleton Card for loading state
 */
function SkeletonTicketCard() {
  return (
    <div className="ticket-card skeleton-card">
      <div className="skeleton-line" style={{ width: '30%', height: '1.2rem', marginBottom: '0.75rem' }} />
      <div className="skeleton-line" style={{ width: '80%', height: '1.4rem', marginBottom: '0.5rem' }} />
      <div className="skeleton-line" style={{ width: '100%', height: '1rem', marginBottom: '0.35rem' }} />
      <div className="skeleton-line" style={{ width: '60%', height: '1rem', marginBottom: '1.25rem' }} />
      <div className="skeleton-footer">
        <div className="skeleton-line" style={{ width: '35%', height: '1rem' }} />
        <div className="skeleton-line" style={{ width: '25%', height: '1rem' }} />
      </div>
    </div>
  );
}

/**
 * TicketList Component
 * Manages loading, empty, and populated ticket states.
 */
export default function TicketList({
  tickets = [],
  loading = false,
  error = null,
  onRetry,
  onSelectTicket,
  onOpenCreateModal,
  onResetFilters,
  isFiltered = false,
}) {
  if (loading) {
    return (
      <div className="ticket-list-grid">
        <SkeletonTicketCard />
        <SkeletonTicketCard />
        <SkeletonTicketCard />
        <SkeletonTicketCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-card error-state-card">
        <div className="state-icon-wrapper error-icon-wrapper">
          <AlertCircle size={32} />
        </div>
        <h3 className="state-title">Unable to Load Tickets</h3>
        <p className="state-description">{error}</p>
        {onRetry && (
          <button className="btn btn-secondary" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Retry Loading</span>
          </button>
        )}
      </div>
    );
  }

  if (tickets.length === 0) {
    if (isFiltered) {
      return (
        <div className="state-card empty-state-card">
          <div className="state-icon-wrapper">
            <Inbox size={36} />
          </div>
          <h3 className="state-title">No Matching Tickets Found</h3>
          <p className="state-description">
            No tickets match your active search or filter criteria. Try adjusting your search query or status/priority selections.
          </p>
          {onResetFilters && (
            <button className="btn btn-secondary" onClick={onResetFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="state-card empty-state-card">
        <div className="state-icon-wrapper">
          <Inbox size={36} />
        </div>
        <h3 className="state-title">No Support Tickets Yet</h3>
        <p className="state-description">
          The ticket queue is currently empty. Get started by creating the first support ticket.
        </p>
        {onOpenCreateModal && (
          <button className="btn btn-primary" onClick={onOpenCreateModal}>
            <Plus size={16} />
            <span>Create First Ticket</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="ticket-list-grid">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onSelectTicket={onSelectTicket}
        />
      ))}
    </div>
  );
}
