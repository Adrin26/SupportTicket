import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Toast Component
 * Displays a non-intrusive floating feedback notification with auto-dismiss.
 */
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`toast-container toast-${type}`} role="alert">
      <div className="toast-icon-wrapper">
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  );
}
