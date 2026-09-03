# 🎟️ Internal Support Ticket Portal

A modern, responsive full-stack **Support Ticket Management Portal** built with **FastAPI (Python)**, **SQLite**, and **React 18 + Vite**. Designed for internal engineering and IT operations to create, track, filter, and manage support tickets in real-time.

---

## ✨ Features

- **📊 Live KPI Overview**: Real-time counter metrics for *Total Tickets*, *Open*, *In Progress*, and *Resolved*.
- **🔍 Multi-Criteria Filtering & Instant Search**:
  - Filter by **Status** (`All`, `Open`, `In Progress`, `Resolved`).
  - Filter by **Priority** (`All`, `Low`, `Medium`, `High`).
  - Instant text search across ticket titles, descriptions, requester names, and IDs.
  - One-click **Reset Filters** and contextual empty states with recovery actions.
- **📝 Ticket Creation with Validation**:
  - Modal form with real-time character counters (`150` char title, `100` char requester).
  - Client-side and server-side Pydantic v2 validation (whitespace stripping, non-empty rules, enum checking).
- **🔎 Ticket Details & Status Transitions**:
  - Detail dialog displaying formatted timestamps, requester information, and multiline descriptions.
  - Interactive status changer pills (`Open` &rarr; `In Progress` &rarr; `Resolved`) with instant API patch and toast notifications.
- **🗑️ Safe Ticket Deletion**:
  - Confirmation alert modal preventing accidental deletions.
- **🎨 Modern Design**:
  - Custom CSS design system with CSS tokens, glassmorphism headers, subtle shadows, and Lucide React icons.
  - Responsive layouts tailored for desktop, tablet, and mobile viewports.

---

## 🏗️ Architecture & Tech Stack

```
SupportTicket/
├── backend/                  # FastAPI REST API & SQLite Database
│   ├── main.py               # Application entry point, CORS, and REST routes
│   ├── database.py           # SQLite engine & SQLAlchemy session configuration
│   ├── models.py             # SQLAlchemy Ticket ORM model
│   ├── schemas.py            # Pydantic v2 request/response validation schemas
│   ├── crud.py               # Database CRUD helper functions
│   ├── seed.py               # Database seed script with sample data
│   ├── test_api.py           # Pytest unit & integration test suite
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React 18 + Vite Single Page Application
    ├── index.html            # HTML entry point with Google Fonts
    ├── vite.config.js        # Vite configuration
    ├── package.json          # Frontend dependencies & scripts
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # Main portal application component
        ├── index.css         # Global design tokens and reset styles
        ├── App.css           # Component styles, responsive grids, and animations
        ├── api/
        │   └── ticketService.js  # Unified Fetch API service layer
        └── components/
            ├── StatusBadge.jsx        # Status badge with glowing indicators
            ├── PriorityBadge.jsx      # Priority badge with directional icons
            ├── FilterBar.jsx          # Search and dropdown filter controls
            ├── TicketCard.jsx         # Summary ticket card component
            ├── TicketList.jsx         # Grid, loading skeletons & empty states
            ├── CreateTicketModal.jsx  # Creation modal with validation
            ├── TicketDetailModal.jsx  # Full details view & status changer
            ├── ConfirmDialog.jsx      # Deletion confirmation modal
            └── Toast.jsx              # Floating auto-dismiss feedback alerts
```

### Technology Highlights:
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn, Pytest, HTTPX.
- **Frontend**: React 18, Vite 5, Lucide React icons, Vanilla CSS3 (Custom Properties / Flexbox / Grid).
- **Database**: SQLite3 (`tickets.db`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: 18 or higher (along with `npm`)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. *(Optional)* Seed initial sample tickets into the SQLite database:
   ```bash
   python seed.py
   ```

4. Start the FastAPI development server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

5. The API will be running at `http://127.0.0.1:8000`.
   - **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
   - **Health Check**: `http://127.0.0.1:8000/api/health`

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Running Automated Tests

To run the backend REST API unit and integration test suite:

```bash
cd backend
pytest -v test_api.py
```

### Test Coverage:
- `test_health`: API health check endpoint.
- `test_list_tickets`: Ticket listing and schema format verification.
- `test_filter_tickets_by_status`: Query status filtering (`?status=Open`).
- `test_filter_tickets_by_priority`: Query priority filtering (`?priority=High`).
- `test_filter_tickets_combined`: Multi-parameter filtering (`?status=Resolved&priority=Low`).
- `test_create_get_update_delete_lifecycle`: Full CRUD lifecycle testing.
- `test_validation_errors`: Empty fields, whitespace sanitization, and invalid enum validation.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body | Response Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | List tickets with optional `?status=` and `?priority=` filters | — | `200 OK` |
| `POST` | `/api/tickets` | Create a new ticket | `TicketCreate` JSON | `201 Created`, `422 Unprocessable` |
| `GET` | `/api/tickets/{id}` | Get ticket details by ID | — | `200 OK`, `404 Not Found` |
| `PATCH` | `/api/tickets/{id}` | Update ticket status or details | `TicketUpdate` JSON | `200 OK`, `404 Not Found` |
| `DELETE` | `/api/tickets/{id}` | Permanently delete a ticket | — | `204 No Content`, `404 Not Found` |
| `GET` | `/api/health` | Service health status check | — | `200 OK` |

---

## 📄 License
MIT
