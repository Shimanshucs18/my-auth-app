# Auth System — Next.js + PostgreSQL + Docker

A production-ready authentication and authorization system built with Next.js, PostgreSQL, and Docker, featuring JWT-based sessions with refresh tokens, role-based access control, rate limiting, and server-side route protection.

## Features

- User registration and login with bcrypt password hashing
- JWT access tokens (15 min) + refresh tokens (7 days) for persistent sessions
- Role-based authorization (Admin / User / Seller / Support)
- Admin panel to view and delete users
- Server-side route protection via Next.js Middleware
- Rate limiting — account locks for 1 minute after 5 failed login attempts
- Form and API validation using Zod
- Styled with Tailwind CSS and Shadcn UI components
- Admin seeding script — no public admin registration
- Dockerized for both development and production

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **Auth:** JWT, bcrypt, Refresh Tokens
- **Validation:** Zod

## Getting Started (Without Docker Compose)

### 1. Clone the repository

```bash
git clone https://github.com/Shimanshucs18/my-auth-app.git
cd my-auth-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL with Docker

```bash
docker run --name auth-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=authdb -p 5432:5432 -d postgres
```

### 4. Set up environment variables

Create a `.env.local` file in the root:

DATABASE_URL=postgresql://postgres:secret@localhost:5432/authdb
JWT_SECRET=your_secret_key

You can replace `your_secret_key` with any random string. To generate a secure one, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run database migrations

```bash
npm run migrate
```

This creates all required tables (users, refresh_tokens, login_attempts, cart_items, orders, order_items).

### 6. Seed the first admin

```bash
npm run seed
```

This creates the first admin account:

- Email: `admin@myapp.com`
- Password: `Admin@123`

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running with Docker Compose (Recommended)

Instead of running the app and database separately, you can run everything together with Docker Compose.

### Development

```bash
docker-compose up
```

This starts both the PostgreSQL database and the Next.js app in development mode.

Once running, seed the first admin:

```bash
docker exec -it auth-app-dev npm run seed
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Create a `.env` file in the root with production secrets:

DB_PASSWORD=your_strong_production_password
JWT_SECRET=your_production_secret_key

Then run:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

app/

├── api/auth/ # Login, register, logout, refresh, users APIs

├── login/ # Login page

├── register/ # Register page

├── dashboard/ # Protected user dashboard

└── admin/ # Protected admin panel

lib/

├── db.js # Database connection

├── auth.js # Centralized auth helpers

├── validations.js # Zod schemas

└── axios-client.js # Axios instance with auto-refresh

scripts/

└── seed-admin.js # Admin seeding script

middleware.js # Route protection

docker-compose.yml # Development environment

docker-compose.prod.yml # Production environment

Dockerfile # Multi-stage build for the Next.js app

## Roadmap

- [x] Expand roles to ADMIN, USER, SELLER, SUPPORT
- [x] Docker Compose for dev and production environments
