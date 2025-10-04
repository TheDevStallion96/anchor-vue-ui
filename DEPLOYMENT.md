# Deployment Guide

This guide covers deploying Anchor Vue UI to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Docker Deployment](#docker-deployment)
- [Electron App Integration](#electron-app-integration)
- [Static Hosting](#static-hosting)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn
- Docker API backend running (see [API.md](./API.md))
- Production environment variables configured

## Building for Production

### Standard Build

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main application bundle
│   ├── index-[hash].css     # Compiled styles
│   └── [component]-[hash].js # Lazy-loaded chunks
└── favicon.ico
```

### Build Optimization

The build process includes:
- Code minification
- Tree-shaking unused code
- CSS extraction and optimization
- Asset optimization
- Code splitting by routes
- Gzip compression

### Preview Production Build

```bash
npm run preview
```

This starts a local server to preview the production build at `http://localhost:4173`.

## Environment Configuration

### Environment Variables

Create environment-specific files:

#### `.env.production`

```env
# Production Docker API URL
VITE_DOCKER_API_BASE_URL=http://your-docker-api-server.com/api/v1
```

#### `.env.development`

```env
# Development Docker API URL
VITE_DOCKER_API_BASE_URL=http://localhost:3000/api/v1
```

#### `.env.local` (gitignored)

```env
# Local overrides (not committed to git)
VITE_DOCKER_API_BASE_URL=http://192.168.1.100:3000/api/v1
```

### Loading Environment Variables

Variables are automatically loaded based on the mode:

```javascript
// Access in code
const apiUrl = import.meta.env.VITE_DOCKER_API_BASE_URL
```

**Note**: Only variables prefixed with `VITE_` are exposed to the client.

## Deployment Options

### Option 1: Static Web Server

Deploy to any static web server (Nginx, Apache, etc.).

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name anchor.example.com;
    root /var/www/anchor-vue-ui/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Option 2: Cloud Platforms

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

1. Install gh-pages:
```bash
npm install -D gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/anchor-vue-ui/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

#### AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Upload to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure CloudFront for SPA routing

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://docker-api-backend:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  anchor-ui:
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_DOCKER_API_BASE_URL=http://localhost:3000/api/v1
    depends_on:
      - docker-api
    networks:
      - anchor-network

  docker-api:
    image: your-docker-api-image:latest
    ports:
      - "3000:3000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - anchor-network

networks:
  anchor-network:
    driver: bridge
```

### Build and Run

```bash
# Build the image
docker build -t anchor-vue-ui .

# Run the container
docker run -p 8080:80 anchor-vue-ui

# Or use Docker Compose
docker-compose up -d
```

## Electron App Integration

Anchor Vue UI can be integrated into an Electron desktop application.

### Electron Setup

1. Install Electron:
```bash
npm install electron --save-dev
```

2. Create `electron/main.js`:
```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  // In production, load built files
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    // In development, load from dev server
    win.loadURL('http://localhost:5173')
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

3. Update `package.json`:
```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "electron .",
    "electron:build": "npm run build && electron-builder"
  }
}
```

4. Package with electron-builder:
```bash
npm install electron-builder --save-dev
```

5. Configure in `package.json`:
```json
{
  "build": {
    "appId": "com.anchor.dockerui",
    "productName": "Anchor",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "mac": {
      "category": "public.app-category.developer-tools"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": ["deb", "AppImage"]
    }
  }
}
```

## Static Hosting

### Apache Configuration

Create `.htaccess` in the `dist/` directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Caddy Configuration

```caddy
anchor.example.com {
    root * /var/www/anchor-vue-ui/dist
    file_server
    try_files {path} /index.html
    encode gzip
}
```

## Production Checklist

Before deploying to production:

- [ ] Update `VITE_DOCKER_API_BASE_URL` to production URL
- [ ] Build the application: `npm run build`
- [ ] Test the production build locally: `npm run preview`
- [ ] Verify all environment variables are set correctly
- [ ] Ensure Docker API backend is accessible
- [ ] Configure CORS on the backend
- [ ] Set up SSL/TLS certificates (HTTPS)
- [ ] Configure proper caching headers
- [ ] Enable gzip compression
- [ ] Test all features in production environment
- [ ] Set up monitoring and error tracking
- [ ] Configure backup procedures

## Performance Optimization

### Gzip Compression

Enable in your web server (see Nginx example above).

### CDN Setup

Use a CDN for static assets:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  }
})
```

### Preloading

Add to `index.html`:

```html
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

## Monitoring

### Error Tracking

Integrate error tracking (e.g., Sentry):

```javascript
// main.js
import * as Sentry from "@sentry/vue"

const app = createApp(App)

Sentry.init({
  app,
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE
})
```

### Analytics

Add analytics (e.g., Google Analytics):

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### API Connection Issues

Check CORS headers on the backend:

```javascript
// Backend CORS configuration example
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}))
```

### Routing Issues (404 on Refresh)

Ensure your web server is configured for SPA routing (see examples above).

### Performance Issues

- Enable production mode
- Check network tab for large bundles
- Use code splitting
- Enable compression

## Security

### HTTPS

Always use HTTPS in production:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ... rest of config
}
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## Support

For deployment issues:
- Check the [Troubleshooting](#troubleshooting) section
- Review the [API.md](./API.md) for backend configuration
- Open an issue on GitHub

---

Last updated: 2024
