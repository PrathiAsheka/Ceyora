# Ceyora (EduBI)

> **Deploying to Vercel:** see [DEPLOY.md](DEPLOY.md) (web app + API + PostgreSQL).

**Tuition Business Intelligence & Operations Platform**

Turning tuition data into business insight, automated action, and measurable improvement.

Ceyora is a full-stack SaaS platform designed for tuition institutes in Sri Lanka. It provides financial management, QR-based attendance tracking, academic analytics, bilingual support (English/Sinhala), and business intelligence — all in a modern, responsive web application.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Default Login](#default-login)
- [Environment Variables](#environment-variables)
- [Sprint Progress](#sprint-progress)
- [Documentation](#documentation)
- [License](#license)

---

## Features

- **Financial Management** — Fee charges, payment tracking, outstanding fees, expenses, teacher salary calculations, P&L reports
- **QR Attendance** — Camera-based QR code scanning with offline support and background sync
- **Academic Tracking** — Exam results, pass rates, topic-level weakness analysis
- **BI Analytics** — Attendance-revenue correlations, student retention, class health metrics
- **Bilingual UI** — Full English and Sinhala (සිංහල) interface with language switcher
- **Dark/Light Theme** — System-preference aware with manual toggle
- **PDF Reports** — Monthly management reports, fee receipts, payment reminders via WeasyPrint
- **RBAC** — 4-tier role system: Super Admin, Institute Admin, Teacher, Staff/Cashier
- **Multi-Tenancy** — Institute-scoped data isolation via JWT middleware
- **Glassmorphism UI** — Modern design with animated KPI cards, recharts dashboards, framer-motion transitions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS |
| **State** | Zustand, React Context (i18n) |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Backend** | FastAPI, Python 3.11+ |
| **ORM** | SQLAlchemy 2.0 (async), Alembic |
| **Database** | PostgreSQL 16 (production), SQLite (development) |
| **Cache/Queue** | Redis 7, Celery |
| **PDF** | WeasyPrint + Jinja2 templates |
| **Auth** | JWT (python-jose), PBKDF2 password hashing |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                              │
│  Next.js 15 (App Router) + Tailwind CSS + Recharts      │
│  Zustand stores • Framer Motion • Custom i18n            │
│  Glassmorphism UI • Dark/Light theme                     │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS (JWT Bearer Token)
┌───────────────────────▼─────────────────────────────────┐
│                     API GATEWAY                           │
│  FastAPI + OAuth2 JWT + RBAC (4 roles)                   │
│  Multi-tenant middleware (institute_id extraction)        │
│  Pydantic V2 schemas • Audit logging                     │
└───────┬───────────┬───────────┬─────────────────────────┘
        │           │           │
┌───────▼───┐ ┌─────▼─────┐ ┌──▼──────────┐
│ PostgreSQL │ │   Redis   │ │  Celery      │
│ 16 (data)  │ │ 7 (cache) │ │ (async tasks)│
│            │ │           │ │ PDF gen      │
│ 20 models  │ │ Queue     │ │ WhatsApp     │
│ RLS rows   │ │ Session   │ │ SMS          │
└────────────┘ └───────────┘ │ Snapshots    │
                              └──────────────┘
```

**Key design decisions:**
- Monorepo with npm workspaces + Turborepo for shared types between frontend/backend
- Custom i18n (React Context) instead of next-intl for lightweight bundle
- SQLite for local development (no Docker required), PostgreSQL for production
- Zustand for client state, React Context for i18n and theme
- WeasyPrint for server-side PDF generation with Jinja2 HTML templates

---

## Project Structure

```
Ceyora/Project/
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/v1/         # Route handlers (17 routers)
│   │   │   ├── core/           # Security, deps, audit, exceptions
│   │   │   ├── models/         # 20 SQLAlchemy ORM models
│   │   │   ├── schemas/        # Pydantic V2 request/response schemas
│   │   │   ├── services/       # Business logic (9 services)
│   │   │   └── templates/      # WeasyPrint Jinja2 HTML templates
│   │   ├── alembic/            # Database migrations
│   │   ├── scripts/            # DB seed, utilities
│   │   ├── static/             # PDF static assets (CSS, images)
│   │   ├── ceyora.db           # SQLite dev database
│   │   └── requirements.txt    # Python dependencies
│   │
│   └── web/                    # Next.js 15 frontend
│       ├── app/
│       │   ├── (dashboard)/    # 27+ authenticated pages
│       │   │   ├── page.tsx    # Dashboard with KPIs + charts
│       │   │   ├── institutes/ # Institute management
│       │   │   ├── classes/    # Class management
│       │   │   ├── teachers/   # Teacher directory
│       │   │   ├── students/   # Student enrollments
│       │   │   ├── finance/    # Charges, payments, expenses
│       │   │   ├── attendance/ # Dashboard + QR scanner
│       │   │   ├── academic/   # Exams + topic analysis
│       │   │   ├── analytics/  # BI analytics
│       │   │   ├── reports/    # Report generation + preview
│       │   │   ├── import/     # CSV/Excel data import
│       │   │   ├── settings/   # Institute, subjects, fees, RBAC, language
│       │   │   └── support/    # Support tickets
│       │   └── login/          # Authentication page
│       ├── components/
│       │   ├── layout/         # Sidebar, topbar, providers
│       │   ├── animated-*.tsx  # Framer Motion animation components
│       │   └── ui/             # (planned) reusable UI components
│       ├── lib/
│       │   ├── i18n.tsx        # Custom EN/SI translation provider
│       │   ├── api.ts          # Axios instance with JWT interceptor
│       │   └── utils.ts        # cn() helper, utilities
│       ├── stores/             # Zustand: auth, UI, offline
│       ├── hooks/              # Custom React hooks
│       ├── i18n/               # en.json, si.json (450+ translation keys)
│       └── types/              # TypeScript interfaces for all entities
│
├── packages/shared/            # Shared types + constants
│   ├── types/roles.ts          # RBAC roles, permissions
│   └── constants/index.ts      # Currency, date formatters, enums
│
├── docker/                     # Container configuration
│   ├── docker-compose.yml      # Dev stack (PostgreSQL + Redis + API + Web)
│   ├── docker-compose.prod.yml # Production stack
│   ├── Dockerfile.api          # Python 3.11-slim
│   └── Dockerfile.web          # Multi-stage Node 18
│
├── scripts/                    # Operations scripts
│   ├── seed-db.py              # Database seeding (admin user + demo data)
│   ├── deploy.sh               # Docker Compose deployment
│   └── backup.sh               # PostgreSQL backup + rotation
│
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── deployment.md
│   └── sprint-plan.md
│
├── .github/workflows/          # CI/CD
│   ├── ci.yml                  # Lint + test
│   └── deploy.yml              # Production deploy
│
├── turbo.json                  # Turborepo config
├── package.json                # Root workspace config
├── .env.example                # Environment variable template
└── .gitignore
```

---

## Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| **Node.js** | >= 18.0 | LTS recommended |
| **npm** | >= 9.0 | Comes with Node.js |
| **Python** | >= 3.11 | 3.12 also works |
| **Docker** | >= 24.0 | For PostgreSQL + Redis (optional for dev) |
| **Git** | >= 2.0 | For version control |

> **Windows users:** Python packages like `asyncpg` and `bcrypt` may fail to compile. The project uses `aiosqlite` and `hashlib.pbkdf2_hmac` as Windows-compatible alternatives.

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/ceyora.git
cd ceyora
```

### 2. Install Node.js dependencies

```bash
npm install
```

This installs dependencies for all workspace packages (`apps/web`, `apps/api` (if applicable), `packages/shared`) via npm workspaces + Turborepo.

### 3. Set up Python virtual environment (backend)

```bash
cd apps/api

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> **Windows note:** If `asyncpg` or `bcrypt` fails, install `aiosqlite` instead:
> ```bash
> pip install aiosqlite
> ```
> The app automatically uses SQLite when PostgreSQL is unavailable.

### 4. Configure environment variables

```bash
# Copy the example template
cp .env.example .env

# Edit .env with your settings (see Environment Variables section)
```

For local development with SQLite (no Docker needed), the defaults work out of the box:
- `DATABASE_URL=sqlite+aiosqlite:///./ceyora.db` (auto-configured in config.py)
- Default JWT secret is set for development only

### 5. Start infrastructure services (optional)

For full functionality (PostgreSQL + Redis), start Docker services:

```bash
docker compose -f docker/docker-compose.yml up -d
```

This starts:
- PostgreSQL 16 on port `5432`
- Redis 7 on port `6379`

> **Skip this step** if you want to use SQLite for development — the API auto-detects and falls back.

### 6. Initialize the database

```bash
# If using PostgreSQL:
cd apps/api
alembic upgrade head

# Seed with demo data (creates admin user + demo institute):
python -m scripts.seed_db
```

If using SQLite, the database file is created automatically on first API startup.

---

## Running the Project

### Development Mode (recommended)

**Option A: Start everything at once**

```bash
npm run dev
```

This uses Turborepo to start both the API and frontend dev servers concurrently.

**Option B: Start services individually**

```bash
# Terminal 1 — Backend API (port 8000)
cd apps/api
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend (port 3000)
cd apps/web
npm run dev
```

### Access the application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Docs (Swagger)** | http://localhost:8000/docs |
| **API Docs (ReDoc)** | http://localhost:8000/redoc |

### Production Mode

```bash
# Build frontend
npm run build

# Or use Docker Compose for full production stack
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Default Login

| Field | Value |
|-------|-------|
| **Email** | `admin@ceyora.lk` |
| **Password** | `changeme123` |

> Change these credentials immediately in production via the `.env` file:
> ```
> SUPER_ADMIN_EMAIL=your-email@domain.com
> SUPER_ADMIN_PASSWORD=your-secure-password
> ```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `sqlite+aiosqlite:///...` | Async database connection string |
| `DATABASE_URL_SYNC` | Yes | `sqlite:///...` | Sync connection for Alembic |
| `REDIS_URL` | No | `redis://localhost:6379/0` | Redis connection string |
| `JWT_SECRET_KEY` | Yes | (dev default) | Secret for JWT token signing |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000/api/v1` | Backend API URL for frontend |
| `SUPER_ADMIN_EMAIL` | Yes | `admin@ceyora.lk` | Default admin email |
| `SUPER_ADMIN_PASSWORD` | Yes | `changeme123` | Default admin password |
| `PAYHERE_MERCHANT_ID` | No | — | PayHere payment gateway |
| `WHATSAPP_ACCESS_TOKEN` | No | — | WhatsApp Cloud API |
| `R2_BUCKET_NAME` | No | — | Cloudflare R2 file storage |

See [`.env.example`](.env.example) for the full list with descriptions.

---

## Sprint Progress

| Sprint | Description | Status |
|--------|-------------|--------|
| **Sprint 1** | Core Foundation & Database Security | ~80% ✅ |
| **Sprint 2** | Financial Ledger & Billing Engine | ~50% 🔧 |
| **Sprint 3** | Edge Attendance & Scanner Component | ~20% 🔧 |
| **Sprint 4** | Payment Webhooks & WhatsApp Queue | ~5% 📋 |
| **Sprint 5** | Management UI, Bilingual Settings & Support | ~90% ✅ |
| **Sprint 6** | BI Analytics, Snapshots & Monthly Dossiers | ~25% 🔧 |
| **Sprint 7** | Standalone Packaging & Licensing Engine | ~40% 🔧 |

- ✅ = Near complete
- 🔧 = Partially implemented
- 📋 = Planned / stubs only

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System design, data flow, infrastructure |
| [API Reference](docs/api.md) | Endpoint documentation, request/response schemas |
| [Deployment](docs/deployment.md) | Production deployment guide |
| [Sprint Plan](docs/sprint-plan.md) | Detailed sprint breakdown and task tracking |

---

## License

Proprietary — All rights reserved.

Copyright (c) 2024 Ceyora / EduBI
