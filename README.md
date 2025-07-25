# DevMate

A comprehensive hackathon platform built with React frontend and Node.js backend.

## Quick Start

### Running the Application

You can run the frontend and backend separately using `npm run dev` in each directory:

#### Backend (API Server)
```bash
cd backend
npm run dev
```
- Runs on: http://localhost:5002
- Uses nodemon for auto-restart on file changes
- Connects to MongoDB

#### Frontend (React App)
```bash
cd frontend
npm run dev
```
- Runs on: http://localhost:5173 (or next available port)
- Uses Vite development server with hot-reload
- Proxy API calls to backend

### Development Workflow

1. **Start Backend**: Open a terminal, navigate to `backend/`, run `npm run dev`
2. **Start Frontend**: Open another terminal, navigate to `frontend/`, run `npm run dev`
3. **Access Application**: Open http://localhost:5173 in your browser

Both servers will automatically restart/reload when you make changes to the code.

........