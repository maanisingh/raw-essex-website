#!/bin/bash

# Nginx + SSL Setup Script for Raw Essex Website
DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Usage: sudo ./setup-nginx-ssl.sh yourdomain.com"
    exit 1
fi

echo "🌐 Setting up Nginx and SSL for domain: $DOMAIN"

# Create Nginx configuration
cat > /etc/nginx/sites-available/raw-essex << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Static file serving
    location /images/ {
        alias /var/www/raw-essex/public/images/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /css/ {
        alias /var/www/raw-essex/public/css/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /js/ {
        alias /var/www/raw-essex/public/js/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/raw-essex /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    systemctl reload nginx
else
    echo "❌ Nginx configuration error"
    exit 1
fi

# Get SSL certificate
echo "🔒 Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Set up automatic certificate renewal
echo "🔄 Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Configure firewall
echo "🔥 Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow ssh
ufw --force enable

# Start and enable services
systemctl enable nginx
systemctl enable pm2-$USER

echo "✅ SSL setup complete!"
echo "🌐 Your website is now live at: https://$DOMAIN"
echo "🔒 SSL certificate installed and auto-renewal configured"
echo "🔥 Firewall configured for HTTP/HTTPS traffic"
echo ""
echo "📊 Useful commands:"
echo "  - Check website: curl -I https://$DOMAIN"
echo "  - View PM2 status: pm2 status"
echo "  - View PM2 logs: pm2 logs"
echo "  - Restart app: pm2 restart raw-essex-website"
echo "  - Check SSL: certbot certificates"