#!/bin/bash
# wait-for-db.sh

set -e

host="$1"

echo "Waiting for MySQL..."
until mysql -h "$host" -u laravel_user -plaravel_password -e "SELECT 1" &> /dev/null; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - continuing"