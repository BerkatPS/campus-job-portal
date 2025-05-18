


FROM php:8.2-fpm

# Set Working Dir
WORKDIR /var/www

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install NPM packages
RUN npm install --legacy-peer-deps
RUN npm install --legacy-peer-deps @nivo/core @nivo/line @nivo/bar @nivo/pie @nivo/scatterplot @nivo/radar @nivo/heatmap @nivo/calendar @nivo/network

# Copy composer files
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copy application files
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage

# Build frontend assets with debug output
RUN NODE_ENV=production npm run build || (echo "Build failed with following error:" && cat npm-debug.log && exit 1)

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
