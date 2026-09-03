import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

/**
 * PriorityBadge Component
 * Renders a stylized badge with icon indicator for ticket priority (Low, Medium, High).
 * @param {string} priority - 'Low' | 'Medium' | 'High'
 * @param {string} className - Optional extra class names
 */
export default function PriorityBadge({ priority = 'Low', className = '' }) {
  const getPriorityClass = (pr) => {
    switch (pr?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
      default:
        return 'priority-low';
    }
  };

  const getPriorityIcon = (pr) => {
    switch (pr?.toLowerCase()) {
      case 'high':
        return <ArrowUp size={12} strokeWidth={2.5} />;
      case 'medium':
        return <ArrowRight size={12} strokeWidth={2.5} />;
      case 'low':
      default:
        return <ArrowDown size={12} strokeWidth={2.5} />;
    }
  };

  return (
    <span className={`badge ${getPriorityClass(priority)} ${className}`}>
      {getPriorityIcon(priority)}
      <span>{priority}</span>
    </span>
  );
}
