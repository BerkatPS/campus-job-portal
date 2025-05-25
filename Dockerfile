# Use official PHP image with FPM
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgmp-dev \
    libldap2-dev \
    libsodium-dev \
    libsqlite3-dev \
    libssl-dev \
    zip \
    unzip \
    curl \
    git \
    nano \
    supervisor \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
        soap \
        gmp \
        sodium \
        sockets

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure PHP for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --optimize-autoloader

# Copy package.json and install Node dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Set proper permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Generate optimized autoload files
RUN composer dump-autoload --optimize --classmap-authoritative

# Build frontend assets
RUN npm run build

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && npm cache clean --force

# Create supervisor configuration for queue worker
RUN echo '[program:laravel-worker]' > /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'process_name=%(program_name)s_%(process_num)02d' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'command=php /var/www/artisan queue:work --sleep=3 --tries=3 --max-time=3600' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'autostart=true' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'user=www-data' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'numprocs=2' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'redirect_stderr=true' >> /etc/supervisor/conf.d/laravel-worker.conf && \
    echo 'stdout_logfile=/var/www/storage/logs/worker.log' >> /etc/supervisor/conf.d/laravel-worker.conf

# Add Laravel scheduler to crontab
RUN echo '* * * * * www-data cd /var/www && php artisan schedule:run >> /dev/null 2>&1' >> /etc/crontab

# Create startup script
RUN echo '#!/bin/bash' > /start.sh && \
    echo 'service supervisor start' >> /start.sh && \
    echo 'service cron start' >> /start.sh && \
    echo 'exec php-fpm' >> /start.sh && \
    chmod +x /start.sh

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD php -v || exit 1

# Start PHP-FPM server with supervisor and cron
CMD ["/start.sh"]