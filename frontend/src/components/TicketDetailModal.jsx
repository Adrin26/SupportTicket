import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  ArrowRightCircle, 
  History 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

/**
 * Format ISO timestamp into formatted human readable date.
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
 * TicketDetailModal Component
 * Full-page modal dialog for inspecting details, modifying status, or deleting a ticket.
 */
export default function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
  onDeleteRequest,
  isUpdatingStatus = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'Open');

  // Keep local state in sync when ticket prop changes
  React.useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
    }
  }, [ticket]);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const { id, title, description, priority, status, requesterName, createdAt, updatedAt } = ticket;

  const handleStatusSelect = (newStatus) => {
    if (newStatus === status || isUpdatingStatus) return;
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const statusOptions = ['Open', 'In Progress', 'Resolved'];

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-dialog detail-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title">
        {/* Modal Header */}
        <div className="modal-header detail-modal-header">
          <div className="detail-header-left">
            <span className="ticket-id detail-ticket-id">#T-{String(id).padStart(3, '0')}</span>
            <PriorityBadge priority={priority} />
            <StatusBadge status={status} />
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="detail-modal-content">
          <h2 id="detail-modal-title" className="detail-ticket-title">
            {title}
          </h2>

          {/* Metadata Grid */}
          <div className="detail-meta-grid">
            <div className="detail-meta-card">
              <div className="detail-meta-icon-box">
                <User size={16} />
              </div>
              <div className="detail-meta-text">
                <span className="detail-meta-label">Requester</span>
                <span className="detail-meta-value">{requesterName}</span>
              </div>
            </div>

            <div className="detail-meta-card">
              <div className="detail-meta-icon-box">
                <Calendar size={16} />
              </div>
              <div className="detail-meta-text">
                <span className="detail-meta-label">Created At</span>
                <span className="detail-meta-value">{formatDate(createdAt)}</span>
              </div>
            </div>

            <div className="detail-meta-card">
              <div className="detail-meta-icon-box">
                <History size={16} />
              </div>
              <div className="detail-meta-text">
                <span className="detail-meta-label">Last Updated</span>
                <span className="detail-meta-value">{formatDate(updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="detail-status-section">
            <div className="status-section-header">
              <span className="status-section-title">Update Status:</span>
              {isUpdatingStatus && (
                <span className="status-updating-indicator">
                  <span className="spinner spinner-dark" style={{ width: '12px', height: '12px' }} />
                  <span>Saving...</span>
                </span>
              )}
            </div>

            <div className="status-pill-group">
              {statusOptions.map((st) => {
                const isActive = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    className={`status-pill-btn status-pill-${st.toLowerCase().replace(' ', '-')} ${isActive ? 'active' : ''}`}
                    onClick={() => handleStatusSelect(st)}
                    disabled={isUpdatingStatus}
                  >
                    <span className="status-pill-dot" />
                    <span>{st}</span>
                    {isActive && <CheckCircle2 size={14} className="status-active-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-description-section">
            <h3 className="detail-section-title">Description</h3>
            <div className="detail-description-box">
              <p className="detail-description-text">{description}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer detail-modal-footer">
          <button
            type="button"
            className="btn btn-danger btn-delete-ticket"
            onClick={() => onDeleteRequest && onDeleteRequest(ticket)}
          >
            <Trash2 size={16} />
            <span>Delete Ticket</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
