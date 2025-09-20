module.exports = {
  apps: [{
    name: 'raw-essex-website',
    script: 'server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: '/var/log/pm2/raw-essex-error.log',
    out_file: '/var/log/pm2/raw-essex-out.log',
    log_file: '/var/log/pm2/raw-essex-combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};