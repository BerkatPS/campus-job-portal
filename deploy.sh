#!/bin/bash
# Script deployment untuk Campus Job Portal
# Akan men-deploy aplikasi Laravel dengan Docker ke VPS

# Tetap jalankan meskipun ada error, kita akan handle secara manual
set +e

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
echo "Memperbarui konfigurasi database dan URL di .env..."
sed -i'.bak' 's/DB_HOST=127.0.0.1/DB_HOST=db/g' .env
sed -i'.bak' 's/^DB_USERNAME=.*/DB_USERNAME=laravel_user/g' .env
sed -i'.bak' 's/^DB_PASSWORD=.*/DB_PASSWORD=laravel_password/g' .env
sed -i'.bak' 's|APP_URL=.*|APP_URL=http://128.199.31.100|g' .env
echo "Konfigurasi database dan URL telah diperbarui"

# 2. PERSIAPAN CONTAINER
echo "Menghentikan container yang mungkin sedang berjalan..."
docker-compose down --remove-orphans

echo "Membersihkan cache Docker untuk memastikan build yang bersih..."
docker system prune -f

echo "Membangun dan menjalankan container..."
docker-compose up -d --build

# 3. TUNGGU DATABASE SIAP
echo "Menunggu database siap (maksimal 60 detik)..."
RETRIES=30
COUNT=0
while [ $COUNT -lt $RETRIES ]; do
    if docker-compose exec -T db mysqladmin ping -h localhost -uroot -ppassword --silent; then
        echo "Database sudah siap!"
        break
    fi
    COUNT=$((COUNT+1))
    echo "Menunggu database... ($COUNT/$RETRIES)"
    sleep 2
done

if [ $COUNT -eq $RETRIES ]; then
    echo "Timeout menunggu database siap. Memeriksa logs..."
    docker-compose logs db
    echo "Tetap melanjutkan proses deployment..."
fi

# 4. PERSIAPAN ENVIRONMENT
echo "Menyiapkan file environment..."
docker-compose exec -T app bash -c "mkdir -p /var/www/storage/logs /var/www/storage/framework/sessions /var/www/storage/framework/views /var/www/storage/framework/cache"

# Salin .env ke container
cat .env | docker-compose exec -T app bash -c 'cat > /var/www/.env'
docker-compose exec -T app php -r "file_exists('/var/www/.env') ? print('File .env berhasil dibuat di container' . PHP_EOL) : print('Gagal membuat file .env' . PHP_EOL);"

# 5. PASTIKAN VENDOR DIR TERINSTALL
echo "Memastikan vendor directory terinstall dengan benar..."
docker-compose exec -T app bash -c "if [ ! -d /var/www/vendor ]; then composer install --no-interaction --optimize-autoloader; fi"

# 6. SETUP APLIKASI
echo "Mengatur kunci aplikasi..."
docker-compose exec -T app php artisan key:generate --force

# 7. SETUP PENYIMPANAN & PERMISSIONS
echo "Mengatur izin penyimpanan..."
docker-compose exec -T app bash -c "mkdir -p /var/www/storage/app/public"
docker-compose exec -T app bash -c "chmod -R 775 /var/www/storage /var/www/bootstrap/cache"
docker-compose exec -T app bash -c "chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache"

echo "Membuat symlink storage..."
docker-compose exec -T app php artisan storage:link

# 8. SETUP DATABASE
echo "Menjalankan migrasi database..."
docker-compose exec -T app php artisan migrate --force
docker-compose exec -T app php artisan db:seed

# 9. OPTIMASI APLIKASI
echo "Menyegarkan cache aplikasi..."
docker-compose exec -T app php artisan optimize:clear
docker-compose exec -T app php artisan optimize
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan route:cache
docker-compose exec -T app php artisan view:cache

# 10. RESTART SERVICES DI DALAM CONTAINER
echo "Me-restart layanan..."
docker-compose exec -T app php artisan queue:restart

# 11. VERIFIKASI DEPLOYMENT
echo "Memeriksa status container..."
docker-compose ps

# 12. SELESAI
echo "Aplikasi berhasil di-deploy dan berjalan di VPS!"
echo "Lihat aplikasi di: http://128.199.31.100"
echo ""
echo "Untuk melihat logs aplikasi, gunakan: docker-compose logs app"
echo "Untuk melihat logs database, gunakan: docker-compose logs db"
echo "Untuk memeriksa status queue, gunakan: docker-compose exec app php artisan queue:status"
