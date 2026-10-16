# Ceyora Architecture

## Overview

Ceyora (EduBI) is a Tuition Business Intelligence & Operations Platform built with a monorepo architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic V2 |
| Database | PostgreSQL 16+ with Row-Level Security |
| Cache/Queue | Redis + Celery/ARQ |
| PDF | WeasyPrint |
| Deployment | Docker Compose |

## Monorepo Structure

```
ceyora/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # FastAPI backend
├── packages/
│   └── shared/       # Shared types and constants
├── docker/           # Docker configurations
├── scripts/          # Utility scripts
└── docs/             # Documentation
```

## Key Design Decisions

1. **Deterministic Financial Computing**: All financial metrics are calculated via SQL/Pandas, never AI
2. **Offline Resilience**: QR scanner uses IndexedDB for offline caching
3. **Multi-Tenant**: PostgreSQL RLS ensures data isolation between institutes
4. **Dual Commercial Track**: Managed SaaS + Self-Hosted Enterprise

## Decision-Support Chain

```
RAW DATA → METRICS → INSIGHTS → ACTIONS → REPORTS
```
