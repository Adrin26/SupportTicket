/**
 * API Service for Support Ticket Operations
 * Communicates with the FastAPI backend REST API.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Helper to handle fetch responses and extract meaningful error messages.
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Pydantic validation error array
          errorMessage = errorData.detail.map((err) => `${err.loc?.slice(-1)[0] || 'Field'}: ${err.msg}`).join(', ');
        }
      }
    } catch {
      // Failed to parse json, retain default message
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Fetch list of tickets with optional status and priority filters.
 * @param {Object} filters - Optional filters: { status, priority }
 * @returns {Promise<Array>} List of ticket objects
 */
export async function fetchTickets(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'All') {
    params.append('status', filters.status);
  }
  if (filters.priority && filters.priority !== 'All') {
    params.append('priority', filters.priority);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/tickets${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Fetch a single ticket by its ID.
 * @param {number|string} id - Ticket ID
 * @returns {Promise<Object>} Ticket object
 */
export async function getTicket(id) {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Create a new support ticket.
 * @param {Object} ticketData - { title, description, priority, requesterName, status? }
 * @returns {Promise<Object>} Created ticket object
 */
export async function createTicket(ticketData) {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(ticketData),
  });

  return handleResponse(response);
}

/**
 * Update an existing ticket (partial update).
 * @param {number|string} id - Ticket ID
 * @param {Object} updateData - Partial ticket fields to update
 * @returns {Promise<Object>} Updated ticket object
 */
export async function updateTicket(id, updateData) {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  return handleResponse(response);
}

/**
 * Delete a ticket by its ID.
 * @param {number|string} id - Ticket ID
 * @returns {Promise<null>}
 */
export async function deleteTicket(id) {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  return handleResponse(response);
}

/**
 * Check backend API health status.
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
}
