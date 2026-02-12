# -----------------------------
# Stage 1: Build React frontend
# -----------------------------
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./
RUN npm install

# Copy all project files and build
COPY . .
RUN npm run build

# -----------------------------
# Stage 2: PHP + Laravel backend
# -----------------------------
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip nodejs npm \
    && docker-php-ext-install pdo_mysql zip mbstring \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel project files
COPY . .

# Copy React build from previous stage into Laravel public folder
COPY --from=frontend-build /app/public/build /var/www/html/public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Expose Laravel port
EXPOSE 8000

# Clear caches and start Laravel server
CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan serve --host=0.0.0.0 --port=8000
