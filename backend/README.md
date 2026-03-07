# TaskFlow — Backend

Node.js + Express + Prisma backend for the Task Manager application.

## Tech Stack
- Node.js + Express
- Prisma ORM
- SQLite
- JWT Authentication
- bcryptjs
- Jest + Supertest

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Set values in `.env`:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secret_here"
PORT=5000
```

4. Setup database:
```bash
npx prisma generate
npx prisma db push
```

## Run Server
```bash
node src/index.js
```

Server runs at: http://localhost:5000

## Run Tests
```bash
npm test
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get JWT |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get tasks (own or all if admin) |
| POST | /tasks | Create task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| DELETE | /users/:id | Delete user |

## Sample API Requests

**Register:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

**Create Task (with token):**
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Task","description":"Details","status":"PENDING"}'
```