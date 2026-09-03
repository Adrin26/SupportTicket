import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * ConfirmDialog Component
 * Modal dialog for confirming destructive actions like ticket deletion.
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Delete Ticket',
  message = 'Are you sure you want to delete this ticket? This action cannot be undone.',
  ticketTitle,
  ticketId,
  confirmLabel = 'Delete Ticket',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isProcessing) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop confirm-dialog-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget && !isProcessing) onCancel();
    }}>
      <div className="modal-dialog confirm-dialog" role="alertdialog" aria-modal="true">
        <div className="confirm-dialog-content">
          <div className="confirm-dialog-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="confirm-dialog-body">
            <h3 className="confirm-dialog-title">{title}</h3>
            <p className="confirm-dialog-message">{message}</p>
            {ticketTitle && (
              <div className="confirm-ticket-preview">
                <span className="confirm-ticket-id">#T-{String(ticketId).padStart(3, '0')}</span>
                <span className="confirm-ticket-title">{ticketTitle}</span>
              </div>
            )}
          </div>
        </div>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
