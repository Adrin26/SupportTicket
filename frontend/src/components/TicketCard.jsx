import React from 'react';
import { User, Calendar, Clock, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

/**
 * Format ISO timestamp into human readable date/time string.
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * TicketCard Component
 * Displays summary information of a single support ticket.
 */
export default function TicketCard({ ticket, onSelectTicket, onQuickStatusChange }) {
  const { id, title, description, priority, status, requesterName, createdAt, updatedAt } = ticket;

  return (
    <article
      className="ticket-card"
      onClick={() => onSelectTicket && onSelectTicket(ticket)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectTicket && onSelectTicket(ticket);
        }
      }}
      aria-label={`Ticket #${id}: ${title}`}
    >
      {/* Card Header: ID & Badges */}
      <div className="ticket-card-header">
        <span className="ticket-id">#T-{String(id).padStart(3, '0')}</span>
        <div className="ticket-badges">
          <PriorityBadge priority={priority} />
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Card Body: Title & Description */}
      <div className="ticket-card-body">
        <h3 className="ticket-title">{title}</h3>
        <p className="ticket-description">{description}</p>
      </div>

      {/* Card Footer: Requester & Timestamps */}
      <div className="ticket-card-footer">
        <div className="ticket-meta-group">
          <div className="ticket-meta-item" title="Requester">
            <User size={14} className="ticket-meta-icon" />
            <span className="ticket-requester">{requesterName}</span>
          </div>

          <div className="ticket-meta-item" title={`Created: ${formatDate(createdAt)}`}>
            <Calendar size={14} className="ticket-meta-icon" />
            <span className="ticket-date">{formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="ticket-card-action">
          <span className="view-detail-hint">View details</span>
          <ChevronRight size={16} className="arrow-icon" />
        </div>
      </div>
    </article>
  );
}
