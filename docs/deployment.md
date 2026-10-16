# Deployment Guide

## Development

```bash
# Install dependencies
npm install

# Start Docker services
docker compose -f docker/docker-compose.yml up -d

# Run migrations
cd apps/api && alembic upgrade head

# Seed database
cd apps/api && python -m scripts.seed_db

# Start development servers
npm run dev
```

## Production

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with production values

# Deploy
./scripts/deploy.sh production
```

## Environment Variables

See `.env.example` for all required variables.

## Database Migrations

```bash
# Create new migration
cd apps/api
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Backup

```bash
# Manual backup
./scripts/backup.sh

# Automated (add to cron)
0 2 * * * /path/to/scripts/backup.sh
```
