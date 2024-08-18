#!/bin/bash
set -e

# Параметры
BACKUP_DIR="/backups"
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${PGUSER}"
DB_NAME="${PGNAME}"

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Waiting for database..."
  sleep 2
done

echo "Creating backup..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_$(date +'%Y%m%d%H%M%S').sql"

find "$BACKUP_DIR" -type f -name '*.sql' -mtime +14 -exec rm {} \;

echo "Backup completed."