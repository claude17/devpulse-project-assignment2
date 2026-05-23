# DevPulse Project

A minimal issue-tracking API built with Node.js, TypeScript, Express and PostgreSQL.

Live URL: https://devpulse-project.vercel.app/

## Features

- User signup & login with JWT authentication
- Role-based access control (`contributor`, `maintainer`)
- Create, read, update, and delete issues
- PostgreSQL persistence with simple SQL schema

## Tech stack

- Node.js + TypeScript
- Express
- PostgreSQL (`pg`)
- Authentication: `jsonwebtoken`, `bcryptjs`
- Dev tooling: `tsx`, `typescript`, `dotenv`

## Quick Setup

1. Clone the repository

```bash
git clone <repo-url>
cd devpulse-project
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file at the project root with the following variables:

```
CONNECTIONSTRING=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_jwt_secret
```

4. Start the server in development

```bash
npm run dev
```

The server listens on port `7000` by default.

## API Endpoints

Base path: `http://localhost:7000`

### Authentication

- POST `/api/auth/signup`
  - Description: Create a new user
  - Body (JSON): `{ "name": string, "email": string, "password": string, "role"?: "contributor" | "maintainer" }`
  - Response: Created user metadata (password is not returned)

- POST `/api/auth/login`
  - Description: Authenticate and receive a JWT
  - Body (JSON): `{ "email": string, "password": string }`
  - Response: `{ "token": "<JWT>" }`

### Issues

- POST `/api/issues/`
  - Description: Create an issue
  - Auth: required (`Authorization` header must contain JWT)
  - Roles allowed: `contributor`, `maintainer`
  - Body (JSON): `{ "title": string, "description": string, "type": "bug" | "feature_request" }`

- GET `/api/issues/`
  - Description: List all issues
  - Auth: none

- GET `/api/issues/:id`
  - Description: Get a single issue by id
  - Auth: none

- PATCH `/api/issues/:id`
  - Description: Update an issue
  - Auth: required
  - Roles allowed: `contributor`, `maintainer`
  - Body: Partial `title`, `description`, `type`, or `status`

- DELETE `/api/issues/:id`
  - Description: Delete an issue
  - Auth: required
  - Roles allowed: `maintainer`

Notes:

- Provide the JWT in the `Authorization` header (the server expects the raw token string).

## Database Schema (summary)

This project uses PostgreSQL. The database is initialized by `src/db/index.ts` and contains two primary tables:

- `users`
  - `id` SERIAL PRIMARY KEY
  - `name` VARCHAR(20)
  - `email` VARCHAR(30) UNIQUE NOT NULL
  - `password` TEXT NOT NULL
  - `role` VARCHAR(20) NOT NULL DEFAULT 'contributor' (CHECK constraint for `contributor`/`maintainer`)
  - `created_at`, `updated_at` TIMESTAMP

- `issues`
  - `id` SERIAL PRIMARY KEY
  - `title` VARCHAR(150) NOT NULL
  - `description` TEXT NOT NULL
  - `type` VARCHAR(20) NOT NULL (CHECK: `bug` | `feature_request`)
  - `status` VARCHAR(20) NOT NULL DEFAULT 'open' (CHECK: `open` | `in_progress` | `resolved`)
  - `reporter_id` INT NOT NULL (references `users.id` conceptually)
  - `created_at`, `updated_at` TIMESTAMP
