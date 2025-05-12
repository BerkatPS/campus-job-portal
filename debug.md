Implementasi Deployment ke GitHub Container Registry (GHCR)
Berikut adalah kode lengkap untuk men-deploy aplikasi Laravel dengan Docker ke GitHub Container Registry (GHCR).
1. Buat file .github/workflows/build-push-ghcr.yml
   yamlname: Build and Push to GHCR

on:
push:
branches: [ main, master ]
pull_request:
branches: [ main, master ]
# Memungkinkan trigger manual dari tab Actions
workflow_dispatch:

env:
REGISTRY: ghcr.io
IMAGE_NAME: ${{ github.repository }}

jobs:
build-and-push:
runs-on: ubuntu-latest
permissions:
contents: read
packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to the Container registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,format=long
            type=sha,format=short
            type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', 'main') || github.ref == format('refs/heads/{0}', 'master') }}

      - name: Build and push app image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push web server image
        uses: docker/build-push-action@v4
        with:
          context: ./nginx
          file: ./nginx/Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ github.repository }}-nginx:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
2. Buat Dockerfile untuk Nginx di ./nginx/Dockerfile
   dockerfileFROM nginx:alpine

COPY ./conf.d /etc/nginx/conf.d

WORKDIR /var/www

RUN apk update && apk upgrade && \
rm -rf /var/cache/apk/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
3. Optimalkan Dockerfile Utama di Root Directory
   dockerfileFROM php:8.2-fpm-alpine

# Set Working Dir
WORKDIR /var/www

# Install dependencies
RUN apk add --no-cache \
build-base \
libpng-dev \
libzip-dev \
oniguruma-dev \
libxml2-dev \
zip \
unzip \
curl \
git \
nodejs \
npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first to leverage Docker cache
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --ignore-platform-reqs

# Copy application files
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Install NPM dependencies and build assets
RUN npm ci && npm run build

# Remove development dependencies
RUN composer install --optimize-autoloader --no-dev

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
4. Buat Docker Compose untuk Deployment di docker-compose.prod.yml
   yamlversion: '3.8'

services:
# PHP Service
app:
image: ghcr.io/${GITHUB_REPOSITORY}:latest
container_name: job_portal_app
restart: unless-stopped
volumes:
- ./storage:/var/www/storage
- ./php/local.ini:/usr/local/etc/php/conf.d/local.ini
networks:
- job_portal_network
environment:
- DB_HOST=db
- DB_PORT=3306
- DB_DATABASE=${DB_DATABASE}
- DB_USERNAME=${DB_USERNAME}
- DB_PASSWORD=${DB_PASSWORD}
- APP_ENV=${APP_ENV}
- APP_KEY=${APP_KEY}
- APP_DEBUG=${APP_DEBUG}
- APP_URL=${APP_URL}

# Nginx Service
webserver:
image: ghcr.io/${GITHUB_REPOSITORY}-nginx:latest
container_name: job_portal_nginx
restart: unless-stopped
ports:
- "${NGINX_PORT:-80}:80"
volumes:
- ./:/var/www
networks:
- job_portal_network
depends_on:
- app

# MySQL Service
db:
image: mysql:8.0
container_name: job_portal_db
restart: unless-stopped
environment:
MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
MYSQL_DATABASE: ${DB_DATABASE}
MYSQL_USER: ${DB_USERNAME}
MYSQL_PASSWORD: ${DB_PASSWORD}
SERVICE_TAGS: prod
SERVICE_NAME: mysql
volumes:
- dbdata:/var/lib/mysql
networks:
- job_portal_network

# Queue Worker
queue:
image: ghcr.io/${GITHUB_REPOSITORY}:latest
container_name: job_portal_queue
restart: unless-stopped
command: php artisan queue:work --tries=3
volumes:
- ./storage:/var/www/storage
networks:
- job_portal_network
depends_on:
- app
- db

# Scheduler
scheduler:
image: ghcr.io/${GITHUB_REPOSITORY}:latest
container_name: job_portal_scheduler
restart: unless-stopped
command: sh -c "while :; do php artisan schedule:run --verbose --no-interaction & sleep 60; done"
volumes:
- ./storage:/var/www/storage
networks:
- job_portal_network
depends_on:
- app
- db

# Networks
networks:
job_portal_network:
driver: bridge

# Volumes
volumes:
dbdata:
driver: local
5. Buat Deployment Script deploy.sh
   bash#!/bin/bash

# Script untuk deployment dari GHCR

# Set environment variables
export $(grep -v '^#' .env | xargs)
export GITHUB_REPOSITORY=$(echo $GITHUB_REPOSITORY || "yourusername/job-portal")

# Login to GitHub Container Registry
echo $GHCR_TOKEN | docker login ghcr.io -u $GHCR_USERNAME --password-stdin

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Stop and remove existing containers
docker-compose -f docker-compose.prod.yml down

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Run migrations (with a slight delay to ensure database is ready)
sleep 10
docker-compose -f docker-compose.prod.yml exec -T app php artisan migrate --force

# Clear cache
docker-compose -f docker-compose.prod.yml exec -T app php artisan optimize:clear
docker-compose -f docker-compose.prod.yml exec -T app php artisan optimize

# Set permissions
docker-compose -f docker-compose.prod.yml exec -T app chmod -R 775 /var/www/storage
docker-compose -f docker-compose.prod.yml exec -T app chown -R www-data:www-data /var/www/storage

# Create Storage Link if not exists
docker-compose -f docker-compose.prod.yml exec -T app php artisan storage:link || true

echo "Application deployed successfully from GitHub Container Registry!"
6. Buat CI/CD GitHub Action yang Lebih Lengkap di .github/workflows/deploy.yml
   yamlname: Deploy Application

on:
push:
branches: [ main, master ]
# Memungkinkan trigger manual dari tab Actions
workflow_dispatch:

jobs:
build-and-push:
name: Build and Push to GHCR
runs-on: ubuntu-latest
permissions:
contents: read
packages: write
steps:
- name: Checkout repository
uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to the Container registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata for Docker
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,format=short
            type=ref,event=branch
            type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', 'main') || github.ref == format('refs/heads/{0}', 'master') }}

      - name: Build and push app image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Nginx image
        uses: docker/build-push-action@v4
        with:
          context: ./nginx
          push: true
          tags: ghcr.io/${{ github.repository }}-nginx:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

deploy:
name: Deploy to Production
needs: build-and-push
runs-on: ubuntu-latest
if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
steps:
- name: Deploy to production server
uses: appleboy/ssh-action@master
with:
host: ${{ secrets.DEPLOY_HOST }}
username: ${{ secrets.DEPLOY_USER }}
key: ${{ secrets.DEPLOY_KEY }}
port: ${{ secrets.DEPLOY_PORT }}
script: |
cd /path/to/application

            # Buat .env jika tidak ada
            if [ ! -f .env ]; then
              echo "Creating .env file"
              echo "${{ secrets.ENV_FILE }}" > .env
            fi
            
            # Ekspor variabel yang diperlukan untuk deployment
            export GITHUB_REPOSITORY="${{ github.repository }}"
            export GHCR_USERNAME="${{ github.actor }}"
            export GHCR_TOKEN="${{ secrets.GITHUB_TOKEN }}"
            
            # Eksekusi script deployment
            bash deploy.sh
7. Buat file .dockerignore
   node_modules
   vendor
   storage/app/*
   storage/logs/*
   storage/framework/cache/*
   storage/framework/sessions/*
   storage/framework/views/*
   .git
   .github
   .env
   .env.*
   .editorconfig
   .gitattributes
   .gitignore
   Dockerfile
   docker-compose.yml
   docker-compose.*.yml
   *.md
   tests
8. Persiapan Secret Keys untuk GitHub Actions
   Anda perlu menambahkan secrets berikut di repositori GitHub:

DEPLOY_HOST - Hostname server produksi
DEPLOY_USER - Username untuk SSH ke server
DEPLOY_KEY - SSH private key
DEPLOY_PORT - Port SSH (biasanya 22)
ENV_FILE - Seluruh isi file .env untuk produksi

9. Konfigurasi MySQL untuk Production di .github/workflows/mysql-init.sql
   sql-- Buat database dan user jika belum ada
   CREATE DATABASE IF NOT EXISTS ${DB_DATABASE};
   CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
   GRANT ALL PRIVILEGES ON ${DB_DATABASE}.* TO '${DB_USERNAME}'@'%';
   FLUSH PRIVILEGES;
10. Tambahkan Konfigurasi Nginx di nginx/conf.d/app.conf
    nginxserver {
    listen 80;
    server_name _;
    root /var/www/public;
    index index.php;

    charset utf-8;
    client_max_body_size 100M;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log error;

    location / {
    try_files $uri $uri/ /index.php?$query_string;
    gzip_static on;
    }

    location ~ \.php$ {
    try_files $uri =404;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_pass app:9000;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param PATH_INFO $fastcgi_path_info;
    fastcgi_buffer_size 16k;
    fastcgi_buffers 4 16k;
    }

    location ~ /\.(?!well-known).* {
    deny all;
    }

    # Set caching for static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|woff|woff2|ttf|svg|eot)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
    }
    }
11. Tambahkan Konfigurasi PHP-FPM di php/local.ini
    ini[PHP]
    upload_max_filesize = 50M
    post_max_size = 50M
    memory_limit = 256M
    max_execution_time = 600
    max_input_time = 600
    display_errors = Off
    log_errors = On
    error_log = /var/log/php/error.log
    date.timezone = UTC
12. Buat Scheduling Supervisor di supervisor/conf.d/laravel-worker.conf
    ini[program:laravel-worker]
    process_name=%(program_name)s_%(process_num)02d
    command=php /var/www/artisan queue:work --tries=3 --max-time=3600
    autostart=true
    autorestart=true
    stopasgroup=true
    killasgroup=true
    numprocs=2
    redirect_stderr=true
    stdout_logfile=/var/www/storage/logs/worker.log
    stopwaitsecs=3600
    user=www-data

[program:laravel-scheduler]
process_name=%(program_name)s_%(process_num)02d
command=/bin/sh -c "while [ true ]; do (php /var/www/artisan schedule:run --verbose --no-interaction &); sleep 60; done"
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/storage/logs/scheduler.log
13. Tambahkan Health Check untuk Docker di routes/api.php
    phpRoute::get('/health', function () {
    // Cek koneksi database
    try {
    DB::connection()->getPdo();
    $databaseStatus = true;
    } catch (\Exception $e) {
    $databaseStatus = false;
    }

    // Cek Redis jika digunakan
    $redisStatus = true;
    if (config('cache.default') === 'redis') {
    try {
    Redis::ping();
    } catch (\Exception $e) {
    $redisStatus = false;
    }
    }

    // Cek queue
    $queueStatus = true;
    try {
    Queue::size();
    } catch (\Exception $e) {
    $queueStatus = false;
    }

    $status = [
    'status' => 'ok',
    'database' => $databaseStatus ? 'connected' : 'disconnected',
    'cache' => $redisStatus ? 'connected' : 'disconnected',
    'queue' => $queueStatus ? 'available' : 'unavailable',
    'timestamp' => now()->toIso8601String(),
    'environment' => config('app.env'),
    ];

    $httpStatus = ($databaseStatus && $redisStatus && $queueStatus) ? 200 : 503;

    return response()->json($status, $httpStatus);
    });
14. Optimalisasi untuk Production di .env.example
    APP_NAME="Job Portal"
    APP_ENV=production
    APP_KEY=
    APP_DEBUG=false
    APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=campus_job_portal
DB_USERNAME=portal_user
DB_PASSWORD=secret_password
DB_ROOT_PASSWORD=root_secret_password

BROADCAST_DRIVER=pusher
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# GitHub Container Registry
GITHUB_REPOSITORY=yourusername/job-portal
GHCR_USERNAME=yourusername
GHCR_TOKEN=your_ghcr_token

# Nginx Configuration
NGINX_PORT=80
15. README.md dengan Instruksi Deployment
    markdown# Job Portal Application

## Deployment dengan GitHub Container Registry (GHCR)

### Prasyarat
- Server dengan Docker dan Docker Compose terinstal
- Akses ke GitHub Container Registry
- SSH akses ke server production

### Setup Server Production
1. Login ke server production
2. Buat direktori untuk aplikasi:
   mkdir -p /path/to/application
   cd /path/to/application
3. Copy file konfigurasi berikut:
- `.env` (dari template `.env.example`)
- `docker-compose.prod.yml` (rename jadi `docker-compose.yml`)
- `deploy.sh`
4. Buat direktori yang diperlukan:
   mkdir -p storage/app/public storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
   chmod -R 775 storage

### Setup GitHub Actions
1. Buka repositori GitHub Anda
2. Buka tab "Settings" > "Secrets" > "Actions"
3. Tambahkan secrets berikut:
- `DEPLOY_HOST`: Hostname server production
- `DEPLOY_USER`: Username SSH
- `DEPLOY_KEY`: SSH Private Key
- `DEPLOY_PORT`: SSH Port (biasanya 22)
- `ENV_FILE`: Seluruh isi file .env untuk production

### Deploy Manual
1. Pastikan GitHub Actions diaktifkan di repositori
2. Push ke branch `main` atau `master` untuk memicu deployment otomatis
3. Atau gunakan tab Actions untuk menjalankan workflow "Deploy Application" secara manual

### Monitoring
- Cek status container: `docker-compose ps`
- Cek logs: `docker-compose logs -f [service]`
- Cek health endpoint: `curl https://your-domain.com/api/health`

### Backup Database
docker-compose exec db sh -c 'exec mysqldump -uroot -p"MYSQLROOTPASSWORD"campusjobportal′>backup−MYSQL_ROOT_PASSWORD" campus_job_portal' > backup-
MYSQLR​OOTP​ASSWORD"campusj​obp​ortal′>backup−(date +%F).sql


### Seputar Aplikasi
- Backend: Laravel 10 dengan PHP 8.2
- Frontend: Node.js dengan npm
- Database: MySQL 8.0
- Web Server: Nginx
- Containers: Docker dengan Docker Compose

### Troubleshooting
- Jika mengalami masalah koneksi ke database, coba restart container db:
  docker-compose restart db
- Jika queue tidak berjalan, cek status:
  docker-compose exec app php artisan queue
  docker-compose logs queue

Dengan implementasi ini, Anda memiliki setup lengkap untuk deployment aplikasi Laravel ke GitHub Container Registry (GHCR) menggunakan GitHub Actions, termasuk:

Build dan push container images ke GHCR
Deployment otomatis ke server production
Konfigurasi yang teroptimasi untuk production
Container terpisah untuk queue dan scheduler
Health check endpoint untuk memantau aplikasi
Backup dan monitoring instruksi

Konfigurasi ini mendukung CI/CD lengkap dengan GitHub Actions dan GHCR sebagai container registry.Coba lagiClaude dapat membuat kesalahan. Periksa kembali setiap respons.
