# Medical Management System - Initial Setup Plan

This document outlines the initial setup for a beginner-friendly Medical Management System using React, Vite, Tailwind CSS, Node.js, Express, and MySQL.

## Goal
Set up the foundational structure for a Medical Management System. This includes both the frontend (React + Vite + Tailwind CSS) and backend (Node.js + Express + MySQL) in separate directories, along with a responsive dashboard layout and basic sidebar navigation.

## User Review Required

> [!IMPORTANT]
> Please review the proposed folder structure and MySQL setup below. Let me know if you have a specific database name or credentials you want to use, or if the default `medical_system` is fine.

## Proposed Setup & Changes

The project will be split into two main directories: `frontend` and `backend`.

### Backend Setup

We will initialize a new Node.js project and install necessary dependencies like `express`, `mysql2`, `cors`, and `dotenv`.

**Folder Structure (`backend/`)**:
- `server.js` - Main entry point
- `.env` - Environment variables (DB connection info)
- `src/`
  - `config/db.js` - MySQL connection setup
  - `routes/` - API routes
  - `controllers/` - Request handlers

#### [NEW] backend/server.js
A basic Express server setup with CORS and JSON body parsing.

#### [NEW] backend/.env
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=medical_system
```

#### [NEW] backend/src/config/db.js
MySQL connection pool setup using `mysql2/promise`.

### Frontend Setup

We will use Vite to bootstrap a React application and configure Tailwind CSS for styling. We will focus on creating a rich, dynamic, and responsive dashboard layout as requested.

**Folder Structure (`frontend/`)**:
- `src/`
  - `components/Sidebar.jsx` - Sidebar navigation
  - `layouts/DashboardLayout.jsx` - Main layout wrapper
  - `pages/Dashboard.jsx` - The main dashboard view
  - `App.jsx` - Root component
  - `index.css` - Tailwind CSS imports

#### [NEW] frontend/src/components/Sidebar.jsx
A responsive sidebar navigation component with basic links like "Dashboard", "Patients", "Appointments".

#### [NEW] frontend/src/layouts/DashboardLayout.jsx
A layout component that houses the Sidebar and a main content area.

#### [NEW] frontend/src/pages/Dashboard.jsx
A simple but modern-looking dashboard page to act as a placeholder.

## Verification Plan

1. **Backend**: Run `node server.js` to ensure the server starts and connects to MySQL (or attempts to).
2. **Frontend**: Run `npm run dev` to start the Vite development server and verify the UI looks good and is responsive.
