# -----------------------------
# Stage 1: Build React frontend
# -----------------------------
FROM node:18-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# -----------------------------
# Stage 2: PHP + Laravel backend
# -----------------------------
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies (NO node here)
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    && docker-php-ext-install pdo_mysql zip mbstring \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Copy React build from stage 1
COPY --from=frontend-build /app/public/build /var/www/html/public/build

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Generate app key automatically (important for Render)
RUN php artisan key:generate

# Fix permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan serve --host=0.0.0.0 --port=8000
