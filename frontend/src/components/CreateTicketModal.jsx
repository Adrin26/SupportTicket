import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { createTicket } from '../api/ticketService';

/**
 * CreateTicketModal Component
 * Modal dialog for creating a new support ticket with client and server validation.
 */
export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    requesterName: '',
    priority: 'Medium',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened or closed
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        requesterName: '',
        priority: 'Medium',
        description: '',
      });
      setErrors({});
      setServerError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 150) {
      newErrors.title = 'Title must be 150 characters or less';
    }

    const trimmedRequester = formData.requesterName.trim();
    if (!trimmedRequester) {
      newErrors.requesterName = 'Requester name is required';
    } else if (trimmedRequester.length > 100) {
      newErrors.requesterName = 'Requester name must be 100 characters or less';
    }

    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Description is required';
    }

    if (!['Low', 'Medium', 'High'].includes(formData.priority)) {
      newErrors.priority = 'Please select a valid priority';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setServerError(null);

      const payload = {
        title: formData.title.trim(),
        requesterName: formData.requesterName.trim(),
        priority: formData.priority,
        description: formData.description.trim(),
        status: 'Open',
      };

      const created = await createTicket(payload);
      if (onTicketCreated) {
        onTicketCreated(created);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setServerError(err.message || 'Failed to create ticket. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget && !isSubmitting) onClose();
    }}>
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title-group">
            <div className="modal-icon-badge">
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">Create New Support Ticket</h2>
              <p className="modal-subtitle">Submit an internal issue or request for technical support.</p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="modal-alert-error">
            <AlertCircle size={18} className="modal-alert-icon" />
            <div className="modal-alert-text">{serverError}</div>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          {/* Title Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="ticket-title" className="form-label">
                Ticket Title <span className="required-star">*</span>
              </label>
              <span className={`char-counter ${formData.title.length > 150 ? 'char-counter-exceeded' : ''}`}>
                {formData.title.length}/150
              </span>
            </div>
            <input
              id="ticket-title"
              type="text"
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              placeholder="e.g. Unable to access staging database"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              maxLength={150}
              autoFocus
              disabled={isSubmitting}
            />
            {errors.title && <p className="form-error-msg">{errors.title}</p>}
          </div>

          {/* Requester Name & Priority Grid */}
          <div className="form-row-2col">
            {/* Requester Name */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="ticket-requester" className="form-label">
                  Requester Name <span className="required-star">*</span>
                </label>
                <span className="char-counter">{formData.requesterName.length}/100</span>
              </div>
              <input
                id="ticket-requester"
                type="text"
                className={`form-input ${errors.requesterName ? 'form-input-error' : ''}`}
                placeholder="e.g. Sarah Connor"
                value={formData.requesterName}
                onChange={(e) => handleChange('requesterName', e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.requesterName && <p className="form-error-msg">{errors.requesterName}</p>}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="ticket-priority" className="form-label">
                Priority Level <span className="required-star">*</span>
              </label>
              <select
                id="ticket-priority"
                className={`form-select ${errors.priority ? 'form-input-error' : ''}`}
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Low">Low (Minor inconvenience)</option>
                <option value="Medium">Medium (Standard request)</option>
                <option value="High">High (Blocking or urgent)</option>
              </select>
              {errors.priority && <p className="form-error-msg">{errors.priority}</p>}
            </div>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="ticket-desc" className="form-label">
                Detailed Description <span className="required-star">*</span>
              </label>
            </div>
            <textarea
              id="ticket-desc"
              rows={4}
              className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
              placeholder="Provide relevant details, error messages, and reproduction steps..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.description && <p className="form-error-msg">{errors.description}</p>}
          </div>

          {/* Modal Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
