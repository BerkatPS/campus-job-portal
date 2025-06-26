#!/bin/bash

# Production Deployment Script
# This script helps deploy the Laravel application to production environment

set -e

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Remove old images to ensure fresh build
print_status "Cleaning up old images..."
docker system prune -f

# Build containers
print_status "Building containers..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
print_status "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 30

# Check container health
print_status "Checking container health..."
for i in {1..10}; do
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up (healthy)"; then
        print_success "Containers are healthy!"
        break
    else
        print_status "Waiting for containers to be healthy... ($i/10)"
        sleep 10
    fi
    
    if [ $i -eq 10 ]; then
        print_error "Containers failed to become healthy. Check logs:"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
done

# Run additional setup commands
print_status "Running additional setup commands..."
docker-compose -f docker-compose.prod.yml exec -T app bash -c "
    # Ensure proper permissions
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache
    
    # Clear all caches
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    
    # Create storage link
    php artisan storage:link --force
    
    # Run migrations
    php artisan migrate --force
    
    # Cache configurations for production
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    
    # Optimize autoloader
    composer dump-autoload --optimize
"

# Check if application is responding
print_status "Checking application health..."
sleep 5

if curl -f http://localhost:80 > /dev/null 2>&1; then
    print_success "Application is responding successfully!"
else
    print_error "Application is not responding. Checking logs..."
    echo "\n=== Application Logs ==="
    docker-compose -f docker-compose.prod.yml logs app | tail -20
    echo "\n=== Nginx Logs ==="
    docker-compose -f docker-compose.prod.yml logs webserver | tail -20
    echo "\n=== Database Logs ==="
    docker-compose -f docker-compose.prod.yml logs db | tail -20
    exit 1
fi

# Show running containers
print_status "Current container status:"
docker-compose -f docker-compose.prod.yml ps

print_success "🎉 Production deployment completed successfully!"
print_status "Application is available at: http://128.199.31.100"
print_status "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
print_status "To stop: docker-compose -f docker-compose.prod.yml down"