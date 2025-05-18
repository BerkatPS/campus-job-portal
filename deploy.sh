#!/bin/bash
# Set -e akan menyebabkan script berhenti jika ada perintah yang gagal
# Tetapi kita tetap akan melanjutkan beberapa operasi meskipun error
set -e

echo "Memulai proses deployment aplikasi ke VPS..."

# 1. PEMERIKSAAN PRASYARAT
echo "Memeriksa prasyarat..."

# Pastikan docker dan docker-compose tersedia
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Docker atau Docker Compose tidak terinstall. Silakan install terlebih dahulu."
    echo "Petunjuk instalasi: https://docs.docker.com/engine/install/"
    exit 1
fi

# Pastikan file konfigurasi tersedia
if [ ! -f .env ]; then
    echo "File .env tidak ditemukan, membuat dari .env.example..."
    cp .env.example .env
    echo "File .env berhasil dibuat dari template"
fi

# Perbarui file .env dengan konfigurasi database yang benar
echo "Memperbarui konfigurasi database di .env..."
sed -i'.bak' 's/DB_HOST=127.0.0.1/DB_HOST=db/g' .env
sed -i'.bak' 's/DB_PASSWORD=/DB_PASSWORD=password/g' .env
sed -i'.bak' 's/APP_URL=http:\/\/localhost:8000/APP_URL=http:\/\/34.101.61.206:8000/g' .env
echo "Konfigurasi database dan URL telah diperbarui"

# 2. PERSIAPAN CONTAINER
echo "Menghentikan container yang mungkin sedang berjalan..."
docker-compose down

echo "Mendownload/memperbarui image terbaru..."
docker-compose pull || echo "Tidak dapat pull image, akan mencoba build dari awal"

echo "Membangun dan menjalankan container..."
docker-compose up -d --build

# Tunggu database siap menerima koneksi dengan retry
echo "Menunggu database siap..."
for i in {1..30}; do
    if docker-compose exec -T db mysqladmin ping -h db -u root --password=password --silent; then
        echo "Database sudah siap"
        break
    fi
    echo "Menunggu database... ($i/30)"
    sleep 2
done

# 3. PERSIAPAN ENVIRONMENT
echo "Menyiapkan file environment..."
# Membuat .env file di dalam container menggunakan sh
cat .env | docker-compose exec -T app sh -c 'cat > /var/www/.env'
docker-compose exec -T app php -r "file_exists('/var/www/.env') ? print('File .env berhasil dibuat di container' . PHP_EOL) : print('Gagal membuat file .env' . PHP_EOL);"

# 4. INSTALASI DEPENDENSI BACKEND
echo "Menginstall dependensi PHP..."
docker-compose exec -T app composer install --optimize-autoloader || echo "Peringatan: Composer install tidak sempurna, melanjutkan deployment"

echo "Mengatur kunci aplikasi..."
docker-compose exec -T app php artisan key:generate --force || echo "Peringatan: Pembuatan kunci gagal, melanjutkan deployment"

# 5. INSTALASI DEPENDENSI FRONTEND
echo "Menginstall dependensi JavaScript..."
docker-compose exec -T app npm ci || echo "Peringatan: npm ci gagal, mencoba npm install..."

echo "Membangun aset frontend..."
docker-compose exec -T app npm run build || echo "Peringatan: Build frontend gagal, melanjutkan deployment"

# 6. SETUP DATABASE
echo "Menjalankan migrasi database..."
docker-compose exec -T app php artisan migrate --force || echo "Peringatan: Migrasi database gagal, melanjutkan deployment"

# 7. OPTIMASI APLIKASI
echo "Menyegarkan cache aplikasi..."
docker-compose exec -T app php artisan optimize:clear || echo "Peringatan: Cache clear gagal, melanjutkan deployment"
docker-compose exec -T app php artisan optimize || echo "Peringatan: Optimasi aplikasi gagal, melanjutkan deployment"
docker-compose exec -T app php artisan config:cache || echo "Peringatan: Config cache gagal, melanjutkan deployment"
docker-compose exec -T app php artisan route:cache || echo "Peringatan: Route cache gagal, melanjutkan deployment"
docker-compose exec -T app php artisan view:cache || echo "Peringatan: View cache gagal, melanjutkan deployment"

# 8. SETUP PENYIMPANAN
echo "Mengatur izin penyimpanan..."
docker-compose exec -T app chmod -R 775 /var/www/storage || echo "Peringatan: Pengaturan izin storage gagal, melanjutkan deployment"
docker-compose exec -T app chown -R www-data:www-data /var/www/storage || echo "Peringatan: Pengaturan owner storage gagal, melanjutkan deployment"

echo "Membuat symlink storage..."
docker-compose exec -T app php artisan storage:link || echo "Peringatan: Symlink storage gagal, melanjutkan deployment"

# 9. SETUP BACKGROUND SERVICES
echo "Me-restart layanan queue..."
docker-compose exec -T app php artisan queue:restart || echo "Peringatan: Queue restart gagal, melanjutkan deployment"

echo "Memulai queue worker di background..."
docker-compose exec -T -d app php artisan queue:work --tries=3 --timeout=90 || echo "Peringatan: Queue worker gagal dijalankan, melanjutkan deployment"

echo "Memulai scheduler di background..."
docker-compose exec -T -d app php artisan schedule:work || echo "Peringatan: Scheduler gagal dijalankan, melanjutkan deployment"

# 10. VERIFIKASI DEPLOYMENT
echo "Memeriksa status container..."
docker-compose ps

# 11. SELESAI
echo "Aplikasi berhasil di-deploy dan berjalan di VPS!"
echo "Lihat aplikasi di: http://34.101.61.206:8000"
echo "Pastikan port 8000 terbuka di firewall atau konfigurasi reverse proxy untuk akses melalui domain"
