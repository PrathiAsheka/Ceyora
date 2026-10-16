#!/bin/bash
# Database backup script for Ceyora

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/ceyora_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."

pg_dump -h localhost -U postgres -d ceyora | gzip > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t ceyora_*.sql.gz | tail -n +8 | xargs -r rm

echo "Backup completed!"
