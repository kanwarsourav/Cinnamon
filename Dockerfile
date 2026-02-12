# 1. Base image
FROM php:8.2-fpm

# 2. Set working directory
WORKDIR /var/www/html

# 3. Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    nodejs npm \
    && docker-php-ext-install pdo_mysql zip mbstring

# 4. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 5. Copy project files
COPY . .

# 6. Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# 7. Install JS dependencies and build React
RUN npm install
RUN npm run build

# 8. Fix permissions
RUN chmod -R 775 storage bootstrap/cache

# 9. Expose port
EXPOSE 8000

# 10. Clear caches at runtime and start server
CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan serve --host=0.0.0.0 --port=8000
