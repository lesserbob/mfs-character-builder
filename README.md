# MFS Character Builder

A full-stack web application for building and managing RPG characters, featuring a modern React frontend, an Express/Prisma backend, and a SQLite database.

---

## Tech Stack

### Frontend

- **React 19** with [Vite](https://vitejs.dev/) for fast development and HMR
- **TypeScript** for type safety
- **Material-UI (MUI)** for UI components
- **React Router v7** for routing
- **React Hook Form** for form management
- **Axios** for HTTP requests
- **React Query** (setup, not yet fully used) for data fetching and caching

### Backend

- **Node.js** with **Express 5**
- **TypeScript** for backend code
- **Prisma ORM** for database access and migrations
- **SQLite** as the database (file-based, easy for development)
- **JWT Authentication** (with `jsonwebtoken`)
- **Helmet** and **CORS** for security
- **OpenAPI (Swagger)** for API documentation (`api.yml`)

### Dev Tools

- **Vite** for frontend dev server and build
- **ESLint** and **Prettier** for code quality and formatting
- **Prisma Studio** for database inspection
- **OpenAPI Generator** for generating TypeScript API clients

---

## Project Structure

```
mfs-character-builder/
├── api.yml                # OpenAPI spec for backend API
├── database.sqlite        # SQLite database file
├── docs/                  # Generated API docs
├── package.json           # Project scripts and dependencies
├── prisma/
│   ├── schema.prisma      # Prisma schema (DB models)
│   └── seed.ts            # DB seeding script
├── public/                # Static assets
├── server/
│   ├── controller/        # Express route controllers
│   ├── service/           # Business logic/services
│   ├── types/             # API and DB types
│   ├── middleware/        # Express middleware (auth, etc.)
│   └── index.ts           # Express app entry point
├── src/
│   ├── api/               # Generated API client and auth service
│   ├── components/        # React UI components
│   ├── context/           # React context providers (auth, classes, etc.)
│   ├── util/              # Utility functions
│   ├── views/             # Page-level React components
│   └── main.tsx           # React app entry point
├── ssl/                   # Self-signed SSL certs for HTTPS dev
└── README.md              # This file
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the database:**

   ```bash
   npm run db:push      # Push schema to SQLite
   npm run db:generate  # Generate Prisma client
   npm run db:studio    # (Optional) Open Prisma Studio
   ```

3. **Seed the database (optional):**

   ```bash
   npx ts-node prisma/seed.ts
   ```

4. **Generate API client and docs:**

   ```bash
   npm run api:generate
   npm run api:docs
   ```

5. **Start the backend server:**

   ```bash
   npm run server:build
   npm run server
   ```

6. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [https://localhost:3443/api](https://localhost:3443/api) (HTTPS, self-signed cert)

---

## API

- The backend API is documented in [api.yml](api.yml) and can be viewed in the `/docs/api/` directory after running `npm run api:docs`.
- Endpoints include `/creature`, `/class`, `/item`, `/auth` (JWT), etc.

---

## Security

- Uses JWT for authentication (register, login, protected endpoints)
- HTTPS enabled for local development (self-signed certs in `ssl/`)

---

## Development Notes

- React StrictMode is enabled by default (may cause double API calls in dev)
- All code is written in TypeScript
- Database is SQLite for easy local development

---

## License

MIT (or your preferred license)
