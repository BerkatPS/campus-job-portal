#!/bin/bash

# Deployment Script untuk Job Portal Laravel + Inertia React
# Pastikan script dijalankan dari direktori root project

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk logging dengan warna
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fungsi untuk menunggu service siap
wait_for_service() {
    local service=$1
    local command=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Menunggu $service siap..."
    while [ $attempt -le $max_attempts ]; do
        if eval $command; then
            log_success "$service sudah siap"
            return 0
        fi
        log_info "Menunggu $service... ($attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    log_error "$service tidak siap setelah $max_attempts percobaan"
    return 1
}

# Fungsi untuk menjalankan perintah dengan error handling
run_command() {
    local description=$1
    local command=$2
    local allow_failure=${3:-false}
    
    log_info "$description"
    if eval $command; then
        log_success "$description berhasil"
        return 0
    else
        if [ "$allow_failure" = "true" ]; then
            log_warning "$description gagal, melanjutkan deployment"
            return 0
        else
            log_error "$description gagal"
            return 1
        fi
    fi
}

echo "=========================================="
echo "    DEPLOYMENT JOB PORTAL APLIKASI"
echo "=========================================="

# 1. PEMERIKSAAN PRASYARAT
log_info "Memeriksa prasyarat deployment..."

# Pastikan docker dan docker-compose tersedia
if ! command -v docker &> /dev/null; then
    log_error "Docker tidak terinstall. Silakan install terlebih dahulu."
    log_info "Petunjuk instalasi: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose tidak terinstall. Silakan install terlebih dahulu."
    exit 1
fi

# Pastikan user dapat menjalankan docker
if ! docker ps &> /dev/null; then
    log_error "User tidak memiliki akses ke Docker. Pastikan user sudah ditambahkan ke group docker"
    log_info "Jalankan: sudo usermod -aG docker \$USER && newgrp docker"
    exit 1
fi

log_success "Semua prasyarat terpenuhi"

# 2. PERSIAPAN FILE KONFIGURASI
log_info "Menyiapkan file konfigurasi..."

# Backup .env jika sudah ada
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    log_info "File .env yang lama sudah di-backup"
fi

# Buat .env dari template jika belum ada
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        log_success "File .env berhasil dibuat dari .env.example"
    else
        log_error "File .env.example tidak ditemukan"
        exit 1
    fi
fi

# Update konfigurasi untuk environment Docker
log_info "Memperbarui konfigurasi untuk Docker environment..."

# Backup original .env
cp .env .env.temp

# Update database configuration
sed -i.bak \
    -e 's/DB_HOST=.*/DB_HOST=db/' \
    -e 's/DB_DATABASE=.*/DB_DATABASE=campus_job_portal/' \
    -e 's/DB_USERNAME=.*/DB_USERNAME=root/' \
    -e 's/DB_PASSWORD=.*/DB_PASSWORD=password/' \
    -e 's|APP_URL=.*|APP_URL=http://34.101.61.206:8000|' \
    -e 's/QUEUE_CONNECTION=.*/QUEUE_CONNECTION=database/' \
    -e 's/SESSION_DRIVER=.*/SESSION_DRIVER=database/' \
    -e 's/CACHE_DRIVER=.*/CACHE_DRIVER=file/' \
    -e 's/BROADCAST_DRIVER=.*/BROADCAST_DRIVER=log/' \
    .env

log_success "Konfigurasi environment berhasil diperbarui"

# 3. CLEANUP SEBELUM DEPLOYMENT
log_info "Membersihkan environment sebelumnya..."

# Stop dan remove container yang ada
docker-compose down --remove-orphans || true

# Remove unused images (optional)
log_info "Membersihkan Docker images yang tidak terpakai..."
docker image prune -f || true

# 4. BUILD DAN START SERVICES
log_info "Memulai proses build dan deployment..."

# Pull latest images
run_command "Mendownload image terbaru" "docker-compose pull" true

# Build dan start services
run_command "Membangun dan menjalankan container" "docker-compose up -d --build"

# 5. MENUNGGU SERVICES SIAP
wait_for_service "Database MySQL" "docker-compose exec -T db mysqladmin ping -h localhost -u root --password=password --silent 2>/dev/null"

wait_for_service "PHP-FPM Service" "docker-compose exec -T app php --version > /dev/null 2>&1"

# 6. SETUP ENVIRONMENT DI CONTAINER
log_info "Menyiapkan environment di dalam container..."

# Copy .env ke container
docker-compose exec -T app sh -c 'cat > /var/www/.env' < .env

# Verify .env exists in container
if docker-compose exec -T app test -f /var/www/.env; then
    log_success "File .env berhasil di-copy ke container"
else
    log_error "Gagal meng-copy file .env ke container"
    exit 1
fi

# 7. INSTALASI DEPENDENSI
log_info "Menginstall dependensi aplikasi..."

# Install PHP dependencies
run_command "Menginstall dependensi PHP dengan Composer" \
    "docker-compose exec -T app composer install --no-dev --optimize-autoloader --no-interaction" \
    true

# Generate application key
run_command "Menggenerate application key" \
    "docker-compose exec -T app php artisan key:generate --force" \
    false

# Install NPM dependencies (jika belum di-build dalam Dockerfile)
run_command "Menginstall dependensi JavaScript" \
    "docker-compose exec -T app npm ci --production" \
    true

# Build frontend assets
run_command "Membangun aset frontend" \
    "docker-compose exec -T app npm run build" \
    true

# 8. DATABASE OPERATIONS
log_info "Melakukan operasi database..."

# Test database connection
run_command "Menguji koneksi database" \
    "docker-compose exec -T app php artisan tinker --execute='DB::connection()->getPdo(); echo \"Database connection successful\n\";'" \
    false

# Setup session dan cache tables jika diperlukan
log_info "Membuat tabel session dan cache..."
run_command "Membuat tabel session" \
    "docker-compose exec -T app php artisan session:table" \
    true

run_command "Membuat tabel cache" \
    "docker-compose exec -T app php artisan cache:table" \
    true

run_command "Membuat tabel queue" \
    "docker-compose exec -T app php artisan queue:table" \
    true

run_command "Membuat tabel queue batches" \
    "docker-compose exec -T app php artisan queue:batches-table" \
    true

run_command "Membuat tabel failed jobs" \
    "docker-compose exec -T app php artisan queue:failed-table" \
    true

# Run migrations
run_command "Menjalankan migrasi database" \
    "docker-compose exec -T app php artisan migrate --force" \
    false

# Seed database (optional - uncomment if needed)
# run_command "Menjalankan database seeder" \
#     "docker-compose exec -T app php artisan db:seed --force" \
#     true

# 9. OPTIMASI APLIKASI
log_info "Mengoptimasi aplikasi Laravel..."

# Clear all caches first
run_command "Membersihkan cache aplikasi" \
    "docker-compose exec -T app php artisan optimize:clear" \
    true

# Setup file-based cache directory
run_command "Membuat direktori cache" \
    "docker-compose exec -T app mkdir -p /var/www/storage/framework/cache/data" \
    true

run_command "Mengatur permissions cache directory" \
    "docker-compose exec -T app chmod -R 775 /var/www/storage/framework/cache" \
    true

# Generate optimized caches
run_command "Menggenerate config cache" \
    "docker-compose exec -T app php artisan config:cache" \
    true

run_command "Menggenerate route cache" \
    "docker-compose exec -T app php artisan route:cache" \
    true

run_command "Menggenerate view cache" \
    "docker-compose exec -T app php artisan view:cache" \
    true

# Warm up application cache
run_command "Warming up application cache" \
    "docker-compose exec -T app php artisan cache:clear && docker-compose exec -T app php artisan config:cache" \
    true

# 10. SETUP STORAGE DAN PERMISSIONS
log_info "Mengatur storage dan permissions..."

# Setup storage permissions
run_command "Mengatur permissions storage" \
    "docker-compose exec -T app chmod -R 775 /var/www/storage /var/www/bootstrap/cache" \
    true

run_command "Mengatur ownership storage" \
    "docker-compose exec -T app chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache" \
    true

# Create storage symlink
run_command "Membuat symlink storage" \
    "docker-compose exec -T app php artisan storage:link" \
    true

# 11. BACKGROUND SERVICES
log_info "Mengatur background services..."

# Setup queue
run_command "Me-restart queue worker" \
    "docker-compose exec -T app php artisan queue:restart" \
    true

# Note: Queue worker dan scheduler akan dijalankan menggunakan supervisor atau cron
# Untuk sekarang kita skip karena memerlukan konfigurasi tambahan

# 12. HEALTH CHECK
log_info "Melakukan health check aplikasi..."

# Check if all containers are running
if docker-compose ps | grep -q "Up"; then
    log_success "Semua container berjalan dengan baik"
else
    log_error "Beberapa container tidak berjalan dengan baik"
    docker-compose ps
fi

# Test HTTP response
sleep 5  # Wait for nginx to be ready
if curl -f -s http://localhost:8000 > /dev/null; then
    log_success "Aplikasi merespon dengan baik"
else
    log_warning "Aplikasi mungkin belum siap, coba akses manual"
fi

# 13. CLEANUP
log_info "Membersihkan file temporary..."
rm -f .env.bak .env.temp 2>/dev/null || true

# 14. FINAL STATUS
echo "=========================================="
log_success "DEPLOYMENT SELESAI!"
echo "=========================================="

log_info "Status Container:"
docker-compose ps

echo ""
log_info "Informasi Akses:"
echo "  - Aplikasi: http://34.101.61.206:8000"
echo "  - Database: 34.101.61.206:3306"
echo "  - Health Check: http://34.101.61.206:8000/health"
echo ""

log_info "Konfigurasi Cache & Session:"
echo "  - Cache Driver: File (/var/www/storage/framework/cache)"
echo "  - Session Driver: Database (sessions table)"
echo "  - Queue Driver: Database (jobs table)"
echo ""

log_info "Langkah selanjutnya:"
echo "  1. Pastikan firewall mengizinkan port 8000"
echo "  2. Setup reverse proxy (Nginx/Apache) untuk domain custom"
echo "  3. Setup SSL certificate untuk HTTPS"
echo "  4. Monitor logs: docker-compose logs -f"
echo ""

log_success "Job Portal berhasil di-deploy ke VPS!"