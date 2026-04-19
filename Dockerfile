FROM php:8.2-cli

# Install PostgreSQL extension
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Set working directory
WORKDIR /app

# Copy all PHP files
COPY . .

# Expose port
EXPOSE 8080

# Start PHP server
CMD php -S 0.0.0.0:8080