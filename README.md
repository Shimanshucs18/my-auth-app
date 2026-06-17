# Auth System — Next.js + PostgreSQL + Docker

A production-ready authentication and authorization system built with Next.js, PostgreSQL, and Docker, featuring JWT-based sessions with refresh tokens, role-based access control, rate limiting, and server-side route protection.

## Features

- User registration and login with bcrypt password hashing
- JWT access tokens (15 min) + refresh tokens (7 days) for persistent sessions
- Role-based authorization (Admin / User)
- Admin panel to view and delete users
- Server-side route protection via Next.js Middleware
- Rate limiting — account locks for 1 minute after 5 failed login attempts
- Form and API validation using Zod
- Styled with Tailwind CSS and Shadcn UI components
- Admin seeding script — no public admin registration

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Docker)
- **Auth:** JWT, bcrypt, Refresh Tokens
- **Validation:** Zod

## Getting Started

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

```
DATABASE_URL=postgresql://postgres:secret@localhost:5432/authdb
JWT_SECRET=your_secret_key
```
You can replace `your_secret_key` with any random string. To generate a secure one, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
### 5. Create database tables

Connect to PostgreSQL:

```bash
docker exec -it auth-db psql -U postgres -d authdb
```

Run:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

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

## Project Structure
app/

├── api/auth/          # Login, register, logout, refresh, users APIs

├── login/             # Login page

├── register/          # Register page

├── dashboard/         # Protected user dashboard

└── admin/             # Protected admin panel

lib/

├── db.js              # Database connection

├── auth.js            # Centralized auth helpers

├── validations.js     # Zod schemas

└── axios-client.js    # Axios instance with auto-refresh

scripts/

└── seed-admin.js       # Admin seeding script

middleware.js           # Route protection