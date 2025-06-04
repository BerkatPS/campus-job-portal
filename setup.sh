#!/bin/bash
# setup.sh

echo "Building containers..."
docker-compose up -d --build

echo "Waiting for containers to be ready..."
sleep 30

echo "Setting up application..."
docker exec -it job_portal_app bash -c "
    composer install --no-dev --optimize-autoloader &&
    cp .env.example .env &&
    php artisan key:generate &&
    chown -R www-data:www-data storage/* &&
    chown -R www-data:www-data bootstrap/* &&
    php artisan storage:link &&
    chmod -R 775 storage/ &&
    chmod -R 775 bootstrap/cache/ &&
    php artisan config:clear &&
    php artisan migrate --force &&
    php artisan config:cache &&
    php artisan route:cache &&
    php artisan view:cache
"

echo "Setup completed!"
echo "Please edit .env file and restart containers if needed"
echo "Access application at: http://128.199.31.100"
