#!/bin/bash

# AgentCost Production Deployment Script
set -e

echo "🚀 Deploying AgentCost to production..."

# Configuration
DOMAIN=${DOMAIN:-"your-domain.com"}
EMAIL=${EMAIL:-"admin@your-domain.com"}

# Create required directories
mkdir -p data logs ssl

# Build and deploy
echo "📦 Building Docker images..."
docker-compose build

# Generate SSL certificate (Let's Encrypt)
if [ ! -f "ssl/cert.pem" ]; then
    echo "🔐 Generating SSL certificate..."
    docker run --rm -v $(pwd)/ssl:/etc/letsencrypt \
        certbot/certbot certonly --standalone \
        --email $EMAIL --agree-tos --no-eff-email \
        -d $DOMAIN
    
    # Copy certificates to nginx location
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
fi

# Deploy services
echo "🚢 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🔍 Performing health check..."
if curl -f http://localhost/api/health; then
    echo "✅ Deployment successful!"
    echo "🌐 Dashboard available at: https://$DOMAIN"
else
    echo "❌ Health check failed"
    docker-compose logs
    exit 1
fi

# Set up automatic SSL renewal
echo "🔄 Setting up SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * $(pwd)/renew-ssl.sh") | crontab -

echo "🎉 AgentCost deployed successfully!"
echo ""
echo "📊 Next steps:"
echo "1. Visit https://$DOMAIN to access the dashboard"
echo "2. Create your first user account"
echo "3. Configure your budget settings"
echo "4. Install the CLI on your development machines"
