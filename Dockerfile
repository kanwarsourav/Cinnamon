# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: PHP + Laravel backend
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip nodejs npm \
    && docker-php-ext-install pdo_mysql zip mbstring

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy backend (Laravel) files
COPY . .

# Copy frontend build into public folder (optional)
COPY --from=frontend-build /app/dist /var/www/html/public

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Expose backend port
EXPOSE 8000

# Clear caches and run Laravel server
CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan serve --host=0.0.0.0 --port=8000
