#!/bin/bash

# Build and start containers
docker-compose up -d

# Install dependencies
docker-compose exec app composer install
docker-compose exec app npm install

# Generate application key
docker-compose exec app php artisan key:generate

# Run migrations
docker-compose exec app php artisan migrate:fresh --seed

# Build frontend assets
docker-compose exec app npm run build

# Clear cache
docker-compose exec app php artisan optimize:clear

# set permission
docker-compose exec app chmod -R 775 /var/www/storage
docker-compose exec app chown -R www-data:www-data /var/www/storage

# create Storage Link
docker-compose exec app php artisan storage:link

# restart queue
docker-compose exec app php artisan queue:restart

# start queue
docker-compose exec app php artisan queue:work

# start scheduler
docker-compose exec app php artisan schedule:work

echo "Application deployed successfully!"
