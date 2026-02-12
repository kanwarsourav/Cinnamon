FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip libonig-dev \
    && docker-php-ext-install pdo_mysql zip mbstring

# Install Node 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# ✅ CREATE SQLITE FILE (THIS FIXES YOUR ERROR)
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod -R 775 database \
    && chmod -R 775 storage bootstrap/cache

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install and build frontend
RUN npm install
RUN npm run build

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000
