import React from 'react';

/**
 * StatusBadge Component
 * Renders a stylized badge for ticket status (Open, In Progress, Resolved).
 * @param {string} status - 'Open' | 'In Progress' | 'Resolved'
 * @param {string} className - Optional extra class names
 */
export default function StatusBadge({ status = 'Open', className = '' }) {
  const getStatusClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'in progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'open':
      default:
        return 'status-open';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)} ${className}`}>
      <span className="badge-dot" />
      <span>{status}</span>
    </span>
  );
}
