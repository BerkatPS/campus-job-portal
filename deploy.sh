#!/bin/bash
set -e

echo "🚀 Memulai proses deployment aplikasi ke VPS..."

# 1. PEMERIKSAAN PRASYARAT
echo "🔍 Memeriksa prasyarat..."

# Pastikan docker dan docker-compose tersedia
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker atau Docker Compose tidak terinstall. Silakan install terlebih dahulu."
    echo "   Petunjuk instalasi: https://docs.docker.com/engine/install/"
    exit 1
fi

# Pastikan file konfigurasi tersedia
if [ ! -f .env ]; then
    echo "⚙️ File .env tidak ditemukan, membuat dari .env.example..."
    cp .env.example .env
    echo "⚠️ Pastikan mengubah konfigurasi di file .env sesuai dengan environment produksi"
fi

# 2. PERSIAPAN CONTAINER
echo "🔄 Mendownload/memperbarui image terbaru..."
docker-compose pull

echo "🏗️ Membangun dan menjalankan container..."
docker-compose up -d --build

# 3. INSTALASI DEPENDENSI BACKEND
echo "📦 Menginstall dependensi PHP..."
docker-compose exec -T app composer install --optimize-autoloader

echo "🔑 Mengatur kunci aplikasi..."
docker-compose exec -T app php artisan key:generate --force

# 4. INSTALASI DEPENDENSI FRONTEND
echo "📦 Menginstall dependensi JavaScript..."
docker-compose exec -T app npm ci

echo "🏭 Membangun aset frontend..."
docker-compose exec -T app npm run build

# 5. SETUP DATABASE
echo "🗄️ Menjalankan migrasi database..."
docker-compose exec -T app php artisan migrate --force

# 6. OPTIMASI APLIKASI
echo "🔄 Menyegarkan cache aplikasi..."
docker-compose exec -T app php artisan optimize:clear
docker-compose exec -T app php artisan optimize
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan route:cache
docker-compose exec -T app php artisan view:cache

# 7. SETUP PENYIMPANAN
echo "📁 Mengatur izin penyimpanan..."
docker-compose exec -T app chmod -R 775 /var/www/storage
docker-compose exec -T app chown -R www-data:www-data /var/www/storage

echo "🔗 Membuat symlink storage..."
docker-compose exec -T app php artisan storage:link

# 8. SETUP BACKGROUND SERVICES
echo "⚙️ Me-restart layanan queue..."
docker-compose exec -T app php artisan queue:restart

echo "🔄 Memulai queue worker di background..."
docker-compose exec -T -d app php artisan queue:work --tries=3 --timeout=90

echo "🕒 Memulai scheduler di background..."
docker-compose exec -T -d app php artisan schedule:work

# 9. SELESAI
echo "✅ Aplikasi berhasil di-deploy dan berjalan di VPS!"
echo "   Lihat aplikasi di: http://SERVER_IP:8000"
echo "   Pastikan port 8000 terbuka di firewall atau konfigurasi reverse proxy untuk akses melalui domain"
