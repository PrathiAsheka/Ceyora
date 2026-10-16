# Sprint Plan

## Sprint 1 - Core Foundation & Database Security
- PostgreSQL schema with all ORM models
- Alembic migrations
- Row-Level Security policies
- FastAPI OAuth2 JWT RBAC
- Core dependencies (get_db, get_current_user)

## Sprint 2 - Financial Ledger & Billing Engine
- Fee charges, payments, allocations
- Multi-class discounting
- Sibling concession rules
- Transaction reversal endpoints
- Teacher payment calculation

## Sprint 3 - Edge Attendance & Scanner Component
- QR scanner in Next.js (html5-qrcode)
- Offline IndexedDB scan caching
- Background synchronization handlers
- Fee status indicator

## Sprint 4 - Payment Webhooks & WhatsApp Queue
- PayHere MD5 signature verification
- Redis task queue (Celery/ARQ)
- Meta WhatsApp Cloud API dispatch
- SMS fallback

## Sprint 5 - Management UI, Bilingual & Support
- Next.js administrative dashboards
- next-intl translations (EN/SI)
- Dark/light theme switching
- In-app support ticket console

## Sprint 6 - BI Analytics, Snapshots & Monthly Dossiers
- Deterministic Pandas analytics
- Monthly snapshot engine
- WeasyPrint PDF report compilation
- Attendance-revenue correlations

## Sprint 7 - Standalone Packaging & Licensing
- Docker Compose production stack
- Cryptographic license verification
- Automated remote S3 backups
- Enterprise heartbeat system
