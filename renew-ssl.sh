#!/bin/bash

# SSL Certificate Renewal Script
set -e

DOMAIN=${DOMAIN:-"your-domain.com"}

echo "🔄 Renewing SSL certificate for $DOMAIN..."

# Renew certificate
docker run --rm -v $(pwd)/ssl:/etc/letsencrypt \
    certbot/certbot renew --standalone

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem

# Reload nginx
docker-compose exec nginx nginx -s reload

echo "✅ SSL certificate renewed successfully!"
