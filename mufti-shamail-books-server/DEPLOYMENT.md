# VPS Deployment Guide for MERN App

## 1. Server Setup

### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 2. Environment Configuration

Create `.env` file in backend directory:
```bash
cd ~/Mufti_shamail_work/mufti-shamail-books-server
nano .env
```

Add these variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mufti-shamail-books
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=https://srv705671.hstgr.cloud
```

## 3. Deploy Backend

```bash
# Navigate to backend
cd ~/Mufti_shamail_work/mufti-shamail-books-server

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start dist/server.js --name "mufti-shamail-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

## 4. Deploy Frontend

```bash
# Navigate to frontend
cd ~/Mufti_shamail_work/mufti-shamail-books-frontend

# Create production environment
echo "VITE_API_URL=https://srv705671.hstgr.cloud/api" > .env

# Install dependencies
npm install

# Build for production
npm run build
```

## 5. Configure Nginx

```nginx
server {
    listen 80;
    server_name srv705671.hstgr.cloud;

    # Frontend static files
    location / {
        root /root/Mufti_shamail_work/mufti-shamail-books-frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d srv705671.hstgr.cloud
```

## 7. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5000

# Enable firewall
sudo ufw enable
```

## 8. Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs mufti-shamail-api

# Monitor resources
pm2 monit
```

## 9. Auto-restart on Server Reboot

```bash
# Generate startup script
pm2 startup

# Save current processes
pm2 save
```
