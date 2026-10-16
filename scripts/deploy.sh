#!/bin/bash
# Deployment script for Ceyora

set -e

ENV=${1:-development}

echo "Deploying Ceyora to ${ENV}..."

if [ "$ENV" = "production" ]; then
    echo "Building production images..."
    docker compose -f docker/docker-compose.prod.yml build

    echo "Starting production services..."
    docker compose -f docker/docker-compose.prod.yml up -d

    echo "Running database migrations..."
    docker compose -f docker/docker-compose.prod.yml exec api alembic upgrade head

    echo "Seeding database..."
    docker compose -f docker/docker-compose.prod.yml exec api python -m scripts.seed_db
else
    echo "Starting development services..."
    docker compose -f docker/docker-compose.yml up -d

    echo "Running database migrations..."
    docker compose -f docker/docker-compose.yml exec api alembic upgrade head

    echo "Seeding database..."
    docker compose -f docker/docker-compose.yml exec api python -m scripts.seed_db
fi

echo "Deployment completed!"
