#!/bin/bash
# Script deployment untuk Campus Job Portal - VPS Deployment
# Akan men-deploy aplikasi Laravel dengan Docker ke VPS secara otomatis

set -e  # Exit on any error

# Konfigurasi VPS
VPS_HOST="128.199.31.100"
VPS_USER="root"  # Ganti sesuai user VPS Anda
VPS_PORT="22"
PROJECT_DIR="/var/www/campus-job-portal"
GITHUB_REPO="https://github.com/username/campus-job-portal.git"  # Ganti dengan repo Anda

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fungsi untuk menjalankan command di VPS
run_remote() {
    ssh -o StrictHostKeyChecking=no -p $VPS_PORT $VPS_USER@$VPS_HOST "$1"
}

# Fungsi untuk copy file ke VPS
copy_to_vps() {
    scp -o StrictHostKeyChecking=no -P $VPS_PORT "$1" $VPS_USER@$VPS_HOST:"$2"
}

# Fungsi untuk copy directory ke VPS
copy_dir_to_vps() {
    scp -o StrictHostKeyChecking=no -r -P $VPS_PORT "$1" $VPS_USER@$VPS_HOST:"$2"
}

echo "======================================="
echo "🚀 DEPLOYMENT CAMPUS JOB PORTAL KE VPS"
echo "======================================="
echo "Target VPS: $VPS_HOST"
echo "User: $VPS_USER"
echo "Project Dir: $PROJECT_DIR"
echo "======================================="

# 1. PEMERIKSAAN KONEKSI VPS
print_status "Memeriksa koneksi ke VPS..."
if ! ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -p $VPS_PORT $VPS_USER@$VPS_HOST "echo 'Connected'" > /dev/null 2>&1; then
    print_error "Tidak dapat terhubung ke VPS. Pastikan:"
    echo "  - VPS IP: $VPS_HOST"
    echo "  - Username: $VPS_USER"
    echo "  - Port SSH: $VPS_PORT"
    echo "  - SSH Key sudah ditambahkan ke VPS"
    exit 1
fi
print_success "Koneksi ke VPS berhasil!"

# 2. INSTALL DEPENDENCIES DI VPS
print_status "Menginstall dependencies di VPS..."
run_remote "
    # Update sistem
    apt-get update -y

    # Install Docker jika belum ada
    if ! command -v docker &> /dev/null; then
        echo 'Installing Docker...'
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl start docker
        systemctl enable docker
    fi

    # Install Docker Compose jika belum ada
    if ! command -v docker-compose &> /dev/null; then
        echo 'Installing Docker Compose...'
        curl -L \"https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # Install git jika belum ada
    if ! command -v git &> /dev/null; then
        apt-get install -y git
    fi

    echo 'Dependencies installed successfully!'
"

# 3. PERSIAPAN PROJECT DIRECTORY
print_status "Mempersiapkan direktori project..."
run_remote "
    # Buat direktori project jika belum ada
    mkdir -p $PROJECT_DIR

    # Hentikan container yang mungkin sedang berjalan
    if [ -f '$PROJECT_DIR/docker-compose.yml' ]; then
        cd $PROJECT_DIR && docker-compose down --remove-orphans || true
    fi
"

# 4. UPLOAD PROJECT FILES
print_status "Mengupload project files ke VPS..."

# Copy seluruh project kecuali yang ada di .gitignore
if [ -f ".gitignore" ]; then
    print_status "Menggunakan rsync untuk sync project files..."
    rsync -avz --exclude-from='.gitignore' \
          --exclude='.git' \
          --exclude='node_modules' \
          --exclude='vendor' \
          --exclude='storage/logs/*' \
          --exclude='storage/framework/cache/*' \
          --exclude='storage/framework/sessions/*' \
          --exclude='storage/framework/views/*' \
          -e "ssh -o StrictHostKeyChecking=no -p $VPS_PORT" \
          ./ $VPS_USER@$VPS_HOST:$PROJECT_DIR/
else
    print_warning ".gitignore tidak ditemukan, copy manual..."
    copy_dir_to_vps "./" "$PROJECT_DIR/"
fi

# 5. SETUP ENVIRONMENT FILE
print_status "Menyiapkan file environment..."
run_remote "
    cd $PROJECT_DIR

    # Copy .env dari example jika tidak ada
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
        else
            # Buat .env minimal jika tidak ada template
            cat > .env << 'EOF'
APP_NAME=Laravel
APP_ENV=production
APP_DEBUG=false
APP_URL=http://$VPS_HOST

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=campus_job_portal
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=localhost
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@campusjobportal.com
MAIL_FROM_NAME=\"Campus Job Portal\"
EOF
        fi
    fi

    # Update konfigurasi untuk environment VPS
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=db/g' .env
    sed -i 's/^DB_USERNAME=.*/DB_USERNAME=laravel_user/g' .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=laravel_password/g' .env
    sed -i 's|APP_URL=.*|APP_URL=http://$VPS_HOST|g' .env
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' .env
    sed -i 's/APP_ENV=local/APP_ENV=production/g' .env

    echo 'Environment file prepared!'
"

# 6. SETUP DIREKTORI YANG DIPERLUKAN
print_status "Menyiapkan direktori yang diperlukan..."
run_remote "
    cd $PROJECT_DIR

    # Buat direktori yang diperlukan
    mkdir -p storage/logs
    mkdir -p storage/framework/sessions
    mkdir -p storage/framework/views
    mkdir -p storage/framework/cache
    mkdir -p storage/app/public
    mkdir -p bootstrap/cache
    mkdir -p public/storage

    # Buat file wait-for-db.sh
    cat > wait-for-db.sh << 'EOF'
#!/bin/bash
host=\"\$1\"
shift
cmd=\"\$@\"

until mysqladmin ping -h \"\$host\" -u laravel_user -plaravel_password --silent; do
  echo \"Waiting for database connection...\"
  sleep 2
done

echo \"Database is ready!\"
exec \$cmd
EOF
    chmod +x wait-for-db.sh

    echo 'Required directories created!'
"

# 7. BUILD DAN JALANKAN CONTAINERS
print_status "Membangun dan menjalankan containers..."
run_remote "
    cd $PROJECT_DIR

    # Build dan jalankan containers
    docker-compose down --remove-orphans || true
    docker-compose build --no-cache
    docker-compose up -d

    echo 'Containers started!'
"

# 8. TUNGGU DATABASE SIAP
print_status "Menunggu database siap..."
run_remote "
    cd $PROJECT_DIR

    # Tunggu database siap
    RETRIES=30
    COUNT=0
    while [ \$COUNT -lt \$RETRIES ]; do
        if docker-compose exec -T db mysqladmin ping -h localhost -u root -ppassword --silent; then
            echo 'Database is ready!'
            break
        fi
        COUNT=\$((COUNT+1))
        echo \"Waiting for database... (\$COUNT/\$RETRIES)\"
        sleep 2
    done

    if [ \$COUNT -eq \$RETRIES ]; then
        echo 'Database timeout, but continuing...'
    fi
"

# 9. SETUP APLIKASI LARAVEL
print_status "Menyiapkan aplikasi Laravel..."
run_remote "
    cd $PROJECT_DIR

    # Pastikan .env ada di container
    docker-compose exec -T app bash -c 'cat > /var/www/.env' < .env

    # Install dependencies jika belum ada
    docker-compose exec -T app bash -c 'if [ ! -d /var/www/vendor ]; then composer install --no-interaction --optimize-autoloader --no-dev; fi'

    # Generate APP_KEY
    docker-compose exec -T app php artisan key:generate --force

    # Setup storage permissions
    docker-compose exec -T app bash -c '
        chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
        chmod -R 775 /var/www/storage /var/www/bootstrap/cache
    '

    # Create storage link
    docker-compose exec -T app php artisan storage:link --force

    # Run migrations
    docker-compose exec -T app php artisan migrate --force

    # Seed database (optional)
    docker-compose exec -T app php artisan db:seed --force || true

    # Optimize application
    docker-compose exec -T app php artisan optimize:clear
    docker-compose exec -T app php artisan config:cache
    docker-compose exec -T app php artisan route:cache
    docker-compose exec -T app php artisan view:cache

    echo 'Laravel application setup completed!'
"

# 10. SETUP FIREWALL (OPTIONAL)
print_status "Mengkonfigurasi firewall..."
run_remote "
    # Allow SSH, HTTP, and HTTPS
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3306/tcp
    ufw --force enable || true

    echo 'Firewall configured!'
"

# 11. VERIFIKASI DEPLOYMENT
print_status "Memverifikasi deployment..."
run_remote "
    cd $PROJECT_DIR
    docker-compose ps

    # Test application
    sleep 5
    curl -I http://localhost:80 || echo 'Application may need more time to start'
"

# 12. CLEANUP
print_status "Membersihkan resources..."
run_remote "
    # Clean up Docker
    docker system prune -f || true

    echo 'Cleanup completed!'
"

# 13. FINAL STATUS
print_success "Deployment selesai!"
echo "======================================="
echo "🎉 DEPLOYMENT BERHASIL!"
echo "======================================="
echo "URL Aplikasi: http://$VPS_HOST"
echo "SSH ke VPS: ssh -p $VPS_PORT $VPS_USER@$VPS_HOST"
echo "Project Dir: $PROJECT_DIR"
echo ""
echo "📋 PERINTAH DEBUGGING:"
echo "ssh -p $VPS_PORT $VPS_USER@$VPS_HOST"
echo "cd $PROJECT_DIR"
echo "docker-compose logs -f app"
echo "docker-compose exec app bash"
echo ""
echo "🔧 UNTUK UPDATE APLIKASI:"
echo "./deploy.sh"
echo ""
print_success "Aplikasi berhasil di-deploy ke VPS!"

# Test aplikasi
print_status "Testing aplikasi..."
if curl -s -o /dev/null -w "%{http_code}" http://$VPS_HOST | grep -q "200\|302"; then
    print_success "✅ Aplikasi dapat diakses di http://$VPS_HOST"
else
    print_warning "⚠️  Aplikasi mungkin masih starting up. Tunggu beberapa menit dan coba akses http://$VPS_HOST"
fi
