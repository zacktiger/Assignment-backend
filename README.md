# Task Management API

A full-stack task management application with secure authentication, role-based access control, and a clean REST API.

Users can register, log in, and manage their own tasks. Admins can view and manage all tasks across the platform.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | Zod |
| Frontend | React 19, Vite, Axios |
| Docs | Swagger (OpenAPI 3.0) |

## Features

- User registration and login with password hashing (bcrypt, 10 salt rounds)
- JWT-based authentication with 7-day token expiry
- Role-based access control (USER and ADMIN roles)
- Full CRUD for tasks (create, read, update, delete)
- Users can only access their own tasks; admins can view all tasks
- Input validation on every endpoint using Zod schemas
- Global rate limiting (100 req/15 min) and strict auth rate limiting (10 req/15 min)
- API documentation served at `/api/docs` via Swagger UI
- Global error handling with consistent JSON responses
- Security headers via Helmet
- Scalable modular project structure

## Project Structure

```
project-root/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/          # Environment and Prisma client
│   │   ├── middlewares/     # Auth, validation, error handler
│   │   ├── modules/
│   │   │   ├── auth/        # Register, login, me
│   │   │   └── tasks/       # CRUD operations
│   │   ├── utils/
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance and API functions
│   │   ├── components/      # Navbar, TaskCard, ProtectedRoute
│   │   ├── context/         # AuthContext (React Context)
│   │   ├── pages/           # Login, Register, Dashboard
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (running locally or remotely)
- npm

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below).

Run the database migration:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Start the frontend dev server:

```bash
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the backend server listens on | `3000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | (required) |
| `DATABASE_URL` | PostgreSQL connection string | (required) |

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the backend API (include `/api/v1`) |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Log in and receive a JWT | No |
| GET | `/api/v1/auth/me` | Get current user info | Yes |

### Tasks

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/v1/tasks` | Get tasks for the logged-in user | Yes | Any |
| GET | `/api/v1/tasks/admin/all` | Get all tasks (admin only) | Yes | ADMIN |
| POST | `/api/v1/tasks` | Create a new task | Yes | Any |
| PUT | `/api/v1/tasks/:id` | Update a task | Yes | Owner/ADMIN |
| DELETE | `/api/v1/tasks/:id` | Delete a task | Yes | Owner/ADMIN |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/docs` | Swagger API documentation |

## Request/Response Examples

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response (`201`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx...",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2026-04-22T00:00:00.000Z"
    }
  }
}
```

### Create Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title": "My task", "description": "Details here", "status": "pending"}'
```

Response (`201`):
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "My task",
    "description": "Details here",
    "status": "pending",
    "createdAt": "2026-04-22T00:00:00.000Z",
    "updatedAt": "2026-04-22T00:00:00.000Z",
    "userId": "clx..."
  }
}
```

## Database Schema

```
User
├── id        (String, CUID, PK)
├── email     (String, unique)
├── password  (String, hashed)
├── role      (Enum: USER | ADMIN)
├── createdAt (DateTime)
└── tasks     (Task[])

Task
├── id          (String, CUID, PK)
├── title       (String)
├── description (String, optional)
├── status      (String, default: "pending")
├── createdAt   (DateTime)
├── updatedAt   (DateTime)
└── userId      (FK -> User.id, cascade delete)
```

## Scalability

### Horizontal Scaling with Stateless JWT

The application uses JWT for authentication, which means the server does not store any session state. Each token is self-contained with the user's ID and role, so any instance can verify it independently. This allows the backend to be deployed across multiple servers behind a load balancer without shared memory or sticky sessions.

### Database Connection Pooling

Prisma Client manages a connection pool to PostgreSQL out of the box, reusing connections across requests instead of opening a new one each time. The pool size is configurable through the `connection_limit` parameter in the `DATABASE_URL` string. This prevents connection exhaustion under high concurrency and keeps query latency low.

### Rate Limiting

The API enforces rate limiting on a per-IP basis using `express-rate-limit`. A global limiter caps all routes at 100 requests per 15-minute window, while a stricter limiter on `/api/v1/auth/login` and `/api/v1/auth/register` allows only 10 requests per window to prevent brute-force attacks. In a multi-instance deployment, the rate limit store can be swapped to Redis so counters are shared across all servers.

### Redis Caching

For high-traffic read operations such as fetching task lists, a Redis cache layer can be introduced in the service functions. The pattern is straightforward: check Redis for a cached result before querying PostgreSQL, and invalidate the cache key on any create, update, or delete operation. This would reduce database load significantly for endpoints that are read-heavy, such as the admin "get all tasks" route.

### Docker and Containerization

The project structure is ready for containerization. A `Dockerfile` for the backend would use a Node.js base image, copy the source, run `prisma generate`, and expose the configured port. A `docker-compose.yml` can orchestrate the backend, frontend, and PostgreSQL containers together, making the entire stack reproducible with a single `docker compose up` command.

## Available Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon src/server.js` | Start dev server with hot reload |
| `npm start` | `node src/server.js` | Start production server |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start Vite dev server |
| `npm run build` | `vite build` | Build for production |
| `npm run preview` | `vite preview` | Preview production build |
