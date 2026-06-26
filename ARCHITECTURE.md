# System Architecture

This document explains the authentication flow, role-based access control, route protection, and security measures used in this application.

## 1. Authentication Flow

### Registration
1. User submits name, email, and password
2. Zod validates the input (name length, email format, password rules)
3. Password is hashed using bcrypt before storage
4. New user is created with default role `USER`
5. No public registration creates admins — the first admin is seeded via a script (`npm run seed`)

### Login
1. User submits email and password
2. Zod validates input format
3. Rate limiting checks if this email is currently locked (5 failed attempts = 1 minute lock)
4. Password is compared against the stored hash using bcrypt
5. On success:
   - An **access token** (JWT) is generated, valid for 15 minutes
   - A **refresh token** (random string) is generated, valid for 7 days, and stored in the `refresh_tokens` table
   - Both tokens are set as httpOnly cookies
6. On failure, the failed attempt counter increments for that email

### Token Refresh
- When the access token expires, the client (via an Axios interceptor) automatically calls `/api/auth/refresh`
- This endpoint validates the refresh token against the database and issues a new access token
- If the refresh token is also expired or invalid, the user is redirected to login

### Logout
- Both the access token and refresh token cookies are cleared
- The user is redirected to `/login` using `req.url` (not a hardcoded URL) so it works in any environment

## 2. Role-Based Access Control

Four roles exist in the system:

| Role | Access |
|---|---|
| `ADMIN` | Admin Panel (view/delete users) |
| `USER` | Products, Cart, Orders |
| `SELLER` | Seller Dashboard, Products (onboarding flow pending) |
| `SUPPORT` | Support Dashboard (onboarding flow pending) |

- All public registrations default to `USER`
- Roles can only be elevated to `ADMIN` via direct database update or future admin tooling (no self-elevation)
- The navigation bar (`components/Navbar.js`) fetches the current user via `/api/auth/profile` and conditionally renders links based on `user.role`

## 3. Route Guards

### Server-Side Middleware (`middleware.js`)
- Runs before any protected page renders
- Checks for the presence and validity of the access token cookie using the `jose` library (Edge Runtime compatible)
- Protected routes (`/dashboard`, `/admin`) redirect to `/login` if no valid token is found
- Auth routes (`/login`, `/register`) redirect already-authenticated users to `/dashboard`

### Centralized Auth Helpers (`lib/auth.js`)
Three reusable functions used across pages and API routes:

- `getAuthenticatedUser()` — returns the decoded user from the token, or `null`
- `requireAuth()` — returns the user, or redirects to `/login` if not authenticated
- `requireRole(role)` — returns the user, or redirects if the user's role doesn't match

This avoids duplicating cookie/JWT logic across every protected page.

### API-Level Protection
Each protected API route (cart, orders, admin user management) independently verifies the JWT from cookies before processing the request, since middleware does not run on every API call by default.

## 4. Security Measures

| Measure | Implementation |
|---|---|
| Password hashing | bcrypt, 10 salt rounds |
| Session tokens | JWT (access) + random token (refresh), both httpOnly cookies |
| Token expiry | 15 min (access), 7 days (refresh) |
| Rate limiting | 5 failed login attempts locks the account for 1 minute |
| Input validation | Zod schemas on both client and server |
| SQL injection protection | Parameterized queries via `pg` (no string concatenation) |
| Route protection | Middleware (server-side, pre-render) + per-API checks |
| No public admin creation | Admins are seeded via a script, never through public registration |

## 5. E-commerce Architecture

The product/cart/order features follow a layered pattern: 

Component (UI)

↓

Service / Store (Zustand)

↓

API Route (Next.js)

↓

Database (PostgreSQL) or static data (products)

- **Products** are static data (`lib/products-data.js`), served through `/api/products` for consistency with the architecture pattern
- **Cart** is persisted in the database (`cart_items` table), not localStorage — the Zustand store (`lib/cart-store.js`) syncs with `/api/cart` on every action
- **Orders** are created from the cart on checkout: cart items are copied into `orders` and `order_items` tables, and the cart is cleared

## 6. Database Schema

| Table | Purpose |
|---|---|
| `users` | User accounts, roles, hashed passwords |
| `refresh_tokens` | Active refresh tokens per user |
| `login_attempts` | Tracks failed login attempts per email |
| `cart_items` | Current cart contents per user |
| `orders` | Placed orders with total and status |
| `order_items` | Line items for each order |