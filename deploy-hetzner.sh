#!/bin/bash

# Hetzner Production Deployment Script for Raw Essex Website
echo "🚀 Deploying Raw Essex Website to Hetzner Server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install -y nginx
fi

# Install Certbot for SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Installing Certbot for SSL..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Create application directory
sudo mkdir -p /var/www/raw-essex
sudo chown -R $USER:$USER /var/www/raw-essex

# Clone or update the repository
if [ -d "/var/www/raw-essex/.git" ]; then
    echo "🔄 Updating existing repository..."
    cd /var/www/raw-essex
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/maanisingh/raw-essex-website.git /var/www/raw-essex
    cd /var/www/raw-essex
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create production environment file
echo "⚙️ Creating production environment..."
cat > .env << EOF
NODE_ENV=production
PORT=3000
STRIPE_SECRET_KEY=sk_test_placeholder_replace_with_actual_key
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_replace_with_actual_key
DPD_API_KEY=placeholder_replace_with_actual_key
DHL_API_KEY=placeholder_replace_with_actual_key
DATABASE_URL=placeholder
ADMIN_EMAIL=admin@rawessex.co.uk
ADMIN_PASSWORD=placeholder
SITE_URL=https://yourdomain.com
SITE_NAME=Raw Essex
EOF

echo "🔧 Environment file created. Please update with real API keys!"

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'raw-essex-website',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/raw-essex-error.log',
    out_file: '/var/log/pm2/raw-essex-out.log',
    log_file: '/var/log/pm2/raw-essex-combined.log',
    time: true
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete raw-essex-website 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ Raw Essex Website deployed successfully!"
echo "📍 Application running on: http://localhost:3000"
echo "🔧 Check status with: pm2 status"
echo "📊 View logs with: pm2 logs raw-essex-website"
echo ""
echo "🌐 Next steps:"
echo "1. Configure your domain DNS to point to this server"
echo "2. Run: sudo ./setup-nginx-ssl.sh yourdomain.com"
echo "3. Update .env file with real API keys"