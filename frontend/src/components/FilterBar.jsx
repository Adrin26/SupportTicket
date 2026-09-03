import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

/**
 * FilterBar Component
 * Provides search bar and dropdown selectors for Status and Priority.
 */
export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  totalCount,
  filteredCount,
  onResetFilters,
}) {
  const isFiltered = statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-main">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets by title, requester, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="filter-dropdowns">
          <div className="filter-control">
            <label htmlFor="status-filter" className="filter-label">
              <Filter size={14} />
              <span>Status:</span>
            </label>
            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="filter-control">
            <label htmlFor="priority-filter" className="filter-label">
              <SlidersHorizontal size={14} />
              <span>Priority:</span>
            </label>
            <select
              id="priority-filter"
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {isFiltered && (
            <button
              className="btn btn-secondary btn-reset-filters"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter summary count */}
      <div className="filter-results-bar">
        <span className="results-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> tickets
        </span>
        {isFiltered && (
          <span className="active-filters-tag">
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
}
