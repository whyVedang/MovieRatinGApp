# 🎬 CineVault

# CineVault

> A modern React-based platform for movie enthusiasts to discover, search, and rate films.

---

## Why This Exists

Most movie browsing apps are either shallow wrappers around TMDB or monolithic applications that blur the line between data fetching, state, and UI. CineVault was built to explore what a properly-layered full-stack application looks like at a small-to-medium scale — with real concerns: secure authentication, cache invalidation, cursor-based pagination, rate limiting, and a frontend architecture that doesn't collapse under complexity.

---

## Feature Highlights

**Authentication & Session Management**
- JWT access tokens (short-lived, 10-minute expiry) with rotating refresh tokens stored as HttpOnly cookies
- Refresh token reuse detection: replaying a consumed token invalidates the entire user session and logs the anomaly
- User-Agent binding on refresh tokens — context switches force re-authentication
- OTP-based password reset with attempt limiting and expiry enforcement
- Email verification flow via tokenized link with 24-hour TTL

**Movie Discovery**
- Browse popular, top-rated, and upcoming films from TMDB with Redis-backed response caching (1-hour TTL)
- Full-text movie search with debounced frontend requests
- Paginated category browsing (cursor-based for favourites, page-based for TMDB endpoints)
- Movie detail pages with cast, TMDB reviews, and locally-written reviews combined

**Reviews**
- Per-user, per-movie review enforcement at the database level (`UNIQUE(userId, movieId)`)
- Review feed combining local reviews and TMDB community reviews
- Inline deletion with optimistic UI and confirmation state

**Favourites**
- Optimistic updates via TanStack Query's cache mutation — UI responds immediately, rollback on failure
- Cursor-based pagination for large collections
- Favourites hydrated with full movie metadata via parallel `useQueries`

**Frontend**
- Lazy-loaded Three.js scene (noise sphere + particle field) on the landing page via React Suspense
- Theatre.js canvas intro animation with graceful fallback
- Motion One / Framer Motion entrance animations with scroll-triggered stagger
- Fully responsive layout with Tailwind v4 utility classes and CSS custom properties

---

## 🖼️ Screenshots & Demo

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/1c06bccf-765c-4c24-a77a-46300ae2f9ae)

### Home Page
![Home Page](https://github.com/user-attachments/assets/db3c28b6-7c87-4a67-841a-61be32892aef)

### Favorites
![Favorites](https://github.com/user-attachments/assets/c810ba8b-154e-4e9b-a0c0-d5f7bb2ddff4)

### Reviews
![Reviews](https://github.com/user-attachments/assets/bc0c4427-fa75-4ccd-874a-7a1b5825e31f)
## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Client                       │
│  React 19 + Vite  ·  TanStack Query  ·  React Router v7     │
│  Three.js (lazy)  ·  Framer Motion  ·  Radix UI / Tailwind  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express 5 API Server                    │
│                                                             │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Auth Routes │  │  Movie Routes │  │  Review / Fav    │  │
│  │  /api/v1/auth│  │ /api/v1/movies│  │  Routes          │  │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘  │
│         │                  │                    │           │
│  ┌──────▼──────────────────▼────────────────────▼────────┐  │
│  │              Service Layer + Middleware               │  │
│  │  JWT auth · Zod validation · Rate limiting · CORS     |  │
│  └──────┬──────────────────┬─────────────────────────────┘  │
│         │                  │                                │
│  ┌──────▼──────┐  ┌────────▼────────┐  ┌──────────────────┐ │
│  │  PostgreSQL │  │  Redis Cache    │  │  TMDB HTTP API   │ │
│  │  (Prisma)   │  │  (ioredis)      │  │  (fetch)         │ │
│  └─────────────┘  └─────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

The backend follows a clean layered pattern: routes → controllers → services → data layer. Controllers handle HTTP concerns; services contain business logic; Prisma handles data access. TMDB calls live in their own service module and are independently cacheable.

---

## Core Engineering Concepts

### Token Rotation with Reuse Detection

Refresh tokens are stored hashed (SHA-256) in the database and marked `used: true` after a single rotation. If a token that is already marked `used` is presented again, the server assumes token theft, deletes **all** sessions for that user, and returns 403. This is a standard sliding-window rotation strategy.

A Redis distributed lock (`SET NX EX 5`) prevents concurrent refresh races on the same token, which would otherwise cause false-positive breach detections under parallel tab activity.

### Response Caching Strategy

TMDB responses are cached in Redis with a 1-hour TTL keyed by the full request URL (`req.originalUrl`). The middleware intercepts `res.json` to populate the cache transparently on first fetch, and short-circuits subsequent requests with a raw `res.send` on cache hit. This avoids redundant TMDB API calls and reduces latency on popular routes.

### Optimistic UI with Rollback

The favourites feature uses TanStack Query's `queryClient.setQueryData` to apply changes to the local cache before the server confirms them. If the API call fails, the query is invalidated and refetched, restoring the correct server state. This gives instant UI feedback without sacrificing consistency.

### Database Schema Design

Prisma migrations handle schema evolution incrementally. Key design decisions:
- `UNIQUE(userId, movieId)` on both `Review` and `Favorite` prevents duplicates at the database level, not just application logic
- Indexes on `userId` and `movieId` on both tables to support efficient user-scoped and movie-scoped queries
- Cascade deletes on all user-owned records (reviews, tokens, favourites) to avoid orphaned rows

### Rate Limiting

Two rate limiter instances with different profiles:
- `authRatelimiter`: 5 requests per 5-minute window on login, register, password reset
- `apiLimiter`: 100 requests per 5-minute window on write operations (reviews, favourites)

Both use `express-rate-limit` with standard headers. No external store — suitable for single-instance deployments.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | React 19 + Vite | Fast HMR, modern React features, minimal config |
| Styling | Tailwind v4 + CSS custom properties | Utility classes for layout, tokens for theming |
| Data fetching | TanStack Query v5 | Caching, background sync, optimistic updates |
| Routing | React Router v7 | File-based routing with loader support |
| 3D / WebGL | Three.js + React Three Fiber | Shader-based noise sphere, particle field |
| Animation | Framer Motion + Motion One | Declarative enter animations, scroll triggers |
| UI primitives | Radix UI + Radix Themes | Accessible, unstyled, composable components |
| Backend framework | Express 5 | Minimal, well-understood, async-native in v5 |
| ORM | Prisma 7 | Type-safe queries, migration tooling, pg adapter |
| Database | PostgreSQL | Relational integrity, JSONB if needed later |
| Cache / Lock | Redis (node-redis v5) | TTL-based caching, distributed refresh lock |
| Auth tokens | jsonwebtoken + crypto | JWT access tokens, random 40-byte refresh tokens |
| Email | Nodemailer (Gmail SMTP) | Verification and OTP delivery |
| Validation | Zod v4 | Schema-first request validation at route level |
| Movie data | TMDB API | Comprehensive film metadata, credits, reviews |

---

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Data models
│   │   └── migrations/            # Incremental SQL migrations
│   ├── src/
│   │   ├── app.js                 # Express app: middleware, routes
│   │   ├── server.js              # HTTP listener
│   │   ├── configenv.js           # Environment variable exports
│   │   ├── lib/
│   │   │   └── prisma.js          # PrismaClient singleton with pg pool
│   │   ├── redis/
│   │   │   └── redis.js           # Redis client initialisation
│   │   ├── routes/                # Route definitions
│   │   ├── controller/            # Request/response handlers
│   │   ├── services/              # Business logic (auth, fav, tmdb, password)
│   │   ├── middleware/            # auth, cache, validation, error, rate limit
│   │   └── utils/                 # JWT helpers, hashing, schema validators, AppError
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Router definition
    │   ├── main.jsx               # React root, providers
    │   ├── index.css              # Design tokens, global primitives
    │   ├── Pages/                 # Route-level components
    │   ├── components/            # Shared UI: MovieCard, Navbar, Pagination...
    │   ├── auth/                  # Login/register form + mutations
    │   ├── context/
    │   │   └── AuthContext.jsx    # Token state, cross-tab sync
    │   ├── hooks/
    │   │   └── useFavorite.js     # Optimistic favourite toggle
    │   └── services/              # API layer: auth, movies, reviews, favourites
    └── vite.config.js
```

---

## Key Modules

### `src/services/auth.service.js`
Handles register, login, logout, session listing, refresh rotation, and email verification. Encapsulates all session lifecycle logic: token generation, hashing, expiry, breach detection, and Redis lock management.

### `src/middleware/redis.middleware.js`
Transparent caching layer. Intercepts `res.json` after a cache miss, serialises the response to Redis with a TTL, and short-circuits future requests. Keyed on `req.originalUrl` so pagination and query params produce distinct cache entries.

### `src/lib/prisma.js`
Initialises a `pg.Pool` with environment-aware SSL settings, wraps it with `PrismaPg` driver adapter, and exports a global singleton to prevent connection pool exhaustion during hot reloads in development.

### `frontend/src/hooks/useFavorite.js`
Wraps TanStack Query with an optimistic update pattern. The cache is mutated synchronously before the API call resolves. On error, the query is invalidated to restore server truth. Avoids loading states for toggle interactions.

### `frontend/src/services/apiHandler.js`
Centralized fetch wrapper that attaches the Bearer token, handles 401 responses by attempting a silent refresh, retries the original request with the new token, and redirects to login on refresh failure. All authenticated API calls go through this single module.

### `frontend/src/components/HeroCanvas.jsx`
Self-contained Three.js scene lazy-loaded via `React.lazy`. Contains a simplex-noise GLSL vertex shader driving an icosahedron deformation and a 1,800-point particle field. Designed to be fully tree-shaken from non-landing routes.

---

## Local Development Setup

### Prerequisites

- Node.js >= 20 (see `backend/.nvmrc`)
- PostgreSQL running locally or via Docker
- Redis running locally or via Docker

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/cinevault.git
cd cinevault

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
# backend/.env  (copy from exampleenv.txt)
cp backend/exampleenv.txt backend/.env
```

Fill in all values — see Environment Variables section below.

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Start services

```bash
# Terminal 1 — backend (port 5000)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/moviemate` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret for signing access tokens | Generate: `openssl rand -base64 32` |
| `JWTEXPIRESIN` | Access token TTL | `10m` |
| `TMDB_APIKEY` | TMDB Bearer token | From [themoviedb.org](https://www.themoviedb.org/settings/api) |
| `EMAIL_USER` | Gmail address for sending email | `you@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | 16-character app password |
| `CLIENT_URL` | Frontend origin(s) for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKENDAPI` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## API Reference

All routes are prefixed `/api/v1`.

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account, send verification email |
| POST | `/login` | — | Returns access token + sets refresh cookie |
| POST | `/logout` | — | Invalidates refresh token |
| POST | `/refresh` | Cookie | Rotates refresh token, returns new access token |
| GET | `/me` | Bearer | Returns authenticated user |
| GET | `/sessions` | Bearer | Lists active sessions |
| DELETE | `/sessions/:id` | Bearer | Revokes a specific session |
| POST | `/forgot-password` | — | Sends OTP to email |
| POST | `/reset-password` | — | Validates OTP, updates password, revokes all sessions |
| GET | `/verify?token=` | — | Completes email verification |

### Movies — `/movies`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/popular` | — | TMDB popular movies (cached) |
| GET | `/top_rated` | — | TMDB top-rated movies (cached) |
| GET | `/upcoming` | — | TMDB upcoming movies (cached) |
| GET | `/search?query=` | — | TMDB movie search (cached) |
| GET | `/:id` | — | Movie details |
| GET | `/:id/credits` | — | Cast and crew |
| GET | `/:id/recommendations` | — | Similar movies |

### Reviews — `/movies/:id/reviews`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Combined local + TMDB reviews |
| POST | `/` | Bearer | Write a review (once per user per movie) |
| DELETE | `/:reviewId` | Bearer | Delete own review |
| GET | `/reviews/me` | Bearer | All reviews by authenticated user |

### Favourites — `/favorite`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Bearer | Paginated favourites (cursor-based) |
| POST | `/` | Bearer | Add a movie to favourites |
| DELETE | `/:movieId` | Bearer | Remove from favourites |

---

## Security Considerations

- **Refresh token hashing**: tokens are stored as SHA-256 hashes; plain tokens never touch the database
- **HttpOnly cookies**: refresh tokens are inaccessible to JavaScript, mitigating XSS token theft
- **Token reuse detection**: replayed refresh tokens trigger full session revocation
- **User-Agent binding**: session anomalies (changed UA on refresh) force re-authentication
- **Rate limiting**: brute-force protection on auth endpoints (5 req / 5 min)
- **OTP attempt limiting**: password reset OTPs expire after 5 failed attempts
- **Zod validation**: all request bodies are schema-validated before reaching controllers
- **CORS allowlist**: `CLIENT_URL` supports comma-separated origins; unlisted origins are rejected
- **SSL in production**: Prisma pool enables `{ rejectUnauthorized: false }` only when `NODE_ENV=production` — replace with a proper CA bundle in hardened environments
- **Environment secrets**: `.env` is gitignored; no secrets in source

---

## Deployment Architecture

The project is configured for deployment on [Render](https://render.com) with the following services:

```
Render Web Service (Node.js)
  ├── Build: npm install && npx prisma migrate deploy && npm run build
  └── Start: npm start

Render PostgreSQL (managed)
Render Redis (managed)

Frontend: Vercel static deployment
  └── vercel.json routes all paths to index.html (SPA fallback)
```

`render.yaml` in the backend directory specifies the service configuration. Migrations run automatically on each deploy via `prisma migrate deploy`, which applies only pending migrations without regenerating the dev history.

---

## Scaling Considerations

The current architecture is designed for single-instance deployment. Known boundaries:

- **Rate limiting** uses in-memory storage — under horizontal scaling, limits are per-instance, not global. Migrating to a Redis-backed store (e.g. `rate-limit-redis`) resolves this
- **Redis session lock** assumes a single Redis node. For clustered Redis, use Redlock
- **TMDB caching** reduces external API pressure significantly; the 1-hour TTL is a reasonable tradeoff between freshness and rate limit headroom
- **Prisma connection pooling** uses `pg.Pool` directly — pool size should be tuned against the database's `max_connections` when scaling

---

## Engineering Tradeoffs

**Prisma driver adapter vs. standard Prisma**: The `@prisma/adapter-pg` driver adapter gives direct control over the underlying `pg.Pool`, enabling SSL configuration and connection reuse patterns that aren't possible through Prisma's default connection string handling alone.

**JWT expiry at 10 minutes**: Short-lived access tokens limit the blast radius of token leakage. The trade-off is slightly more refresh traffic, mitigated by the transparent refresh logic in `apiHandler.js`.

**Redis for caching vs. in-memory**: Redis was chosen over in-memory caching to keep the cache warm across server restarts and to allow future horizontal scaling without cache fragmentation.

**Optimistic UI for favourites**: Accepted consistency risk (brief divergence between UI state and server state) in exchange for zero perceived latency on toggle interactions. The rollback path on failure is short and well-defined.

**No WebSockets**: Review and favourites data doesn't require real-time sync. Polling and cache invalidation via TanStack Query `invalidateQueries` is sufficient and simpler to reason about.

---

## Future Roadmap

- [ ] Deploy frontend to Vercel and connect to Render backend
- [ ] Add TMDB watchlist integration via user TMDB token (`tmdbToken` field already in schema)
- [ ] Redis-backed rate limiter for multi-instance deployments
- [ ] CI/CD pipeline (GitHub Actions: lint → test → deploy)
- [ ] Unit and integration tests (Vitest for frontend, Jest/Supertest for backend)
- [ ] Admin role enforcement (role field exists, middleware not yet wired)
- [ ] Infinite scroll option alongside pagination
- [ ] Dark/light theme toggle (CSS custom properties already support token swapping)
- [ ] Movie watchlist feature (distinct from favourites)
- [ ] Dockerfile + docker-compose for local reproducibility

---

## License

[MIT License](https://choosealicense.com/licenses/mit/) for details.

---

## Author

Built by [Vedang](https://www.linkedin.com/in/vedang-srivastava-164a322b6/).

Data provided by [The Movie Database (TMDB)](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMD
