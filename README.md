# Task Manager App

A full-stack Task Management application with JWT authentication and role-based access control.

## Project Structure
- `backend/` — Node.js + Express + Prisma + SQLite
- `frontend/` — React + Vite + Tailwind CSS

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
node src/index.js
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Features
- JWT Authentication (Register/Login)
- Role-based access (Admin/User)
- Task CRUD operations
- Admin dashboard
- 31 automated tests