# TaskFlow — Frontend

React + Vite frontend for the Task Manager application.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- React Hook Form
- Axios
- React Router DOM
- Vitest + React Testing Library

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Set backend URL in `.env`:
```
VITE_API_URL=http://localhost:5000
```

## Run App
```bash
npm run dev
```

App runs at: http://localhost:5173

## Run Tests
```bash
npm test
```

## Features
- Register / Login with JWT
- Protected routes
- Dashboard with task stats
- Admin view (all users + all tasks)
- Create, Edit, Delete tasks
- Role-based UI
- Responsive design