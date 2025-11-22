# Emergency Medical Patient History System

A production-ready system for ambulance/emergency doctors to check patient medical history in real-time using Passport ID.

## Tech Stack
- **Backend**: Node.js, Fastify, TypeScript
- **Frontend**: React, Vite, TailwindCSS
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Realtime**: Supabase Realtime

## Setup Instructions

### 1. Supabase Setup
1. Create a new Supabase project.
2. Go to the SQL Editor and run the script located in `database/schema.sql`.
3. Copy your Project URL and Anon Key.

### 2. Environment Variables
1. Backend: Copy `backend/.env.example` to `backend/.env` and fill in Supabase credentials.
2. Frontend: Copy `frontend/.env.example` to `frontend/.env` and fill in Supabase credentials.

### 3. Run Locally
```bash
# Install dependencies
npm install

# Build shared types
npm run build --workspace=shared

# Run Backend (Terminal 1)
npm run dev:backend

# Run Frontend (Terminal 2)
npm run dev:frontend
```

### 4. Run with Docker
```bash
docker-compose up --build
```

## Features
- **Patient Search**: Search by Passport ID.
- **Real-time History**: Updates instantly when new diagnoses are added.
- **Rule Engine**: Warns if adding a redundant test (e.g., Measles).
- **Role-Based Access**: Doctors see patients, Admins see all.
