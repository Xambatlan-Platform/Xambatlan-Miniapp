# Xambatlán Deployment Guide

This guide covers deploying Xambatlán to production environments.

## Deployment Architecture

### Recommended Production Stack

- **Frontend**: Vercel or Netlify (Next.js deployment)
- **Backend**: Railway, Render, or AWS ECS (Node.js API)
- **Database**: Railway PostgreSQL, Supabase, or AWS RDS
- **IPFS**: Infura or Pinata
- **Blockchain**: Ethereum mainnet or World Chain
- **Monitoring**: Sentry for error tracking

## Pre-Deployment Checklist

### 1. Environment Preparation

- [ ] Production database provisioned
- [ ] IPFS storage service configured
- [ ] Smart contracts deployed to mainnet/production chain
- [ ] World ID production app created
- [ ] Domain names acquired and configured
- [ ] SSL certificates ready
- [ ] Monitoring and alerting set up

### 2. Security Review

- [ ] All secrets properly configured
- [ ] No hardcoded sensitive values
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Audit logging enabled
- [ ] Error messages don't leak sensitive info

### 3. Performance Optimization

- [ ] Database queries optimized
- [ ] API response caching implemented
- [ ] Image optimization configured
- [ ] Bundle size analyzed and optimized
- [ ] CDN configured for static assets

## Backend Deployment (API)

### Option 1: Railway

Railway offers simple deployment with PostgreSQL included.

1. **Create Railway Account**: Sign up at railway.app

2. **Create New Project**:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and create project
   railway login
   railway init
   ```

3. **Configure Environment Variables**:
   ```bash
   # Set production environment variables
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set JWT_SECRET="$(openssl rand -base64 32)"
   railway variables set ENCRYPTION_KEY="$(openssl rand -hex 32)"
   railway variables set WORLD_ID_APP_ID="app_prod_xxx"
   railway variables set NODE_ENV="production"
   railway variables set PORT="3001"
   ```

4. **Deploy**:
   ```bash
   # From the apps/api directory
   cd apps/api
   railway up
   ```

### Option 2: Render

1. **Connect Repository**: Link your GitHub repo to Render

2. **Create Web Service**:
   - Build Command: `cd apps/api && npm install && npm run build`
   - Start Command: `cd apps/api && npm start`
   - Environment: Node.js

3. **Configure Environment Variables** in Render dashboard

4. **Add PostgreSQL Database** from Render add-ons

### Option 3: Docker Deployment

Create `apps/api/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages

# Build the application
WORKDIR /app/apps/api
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

Build and deploy:

```bash
# Build image
docker build -t xambitlan-api .

# Run container
docker run -d \
  --name xambitlan-api \
  -p 3001:3001 \
  --env-file .env \
  xambitlan-api
```

## Frontend Deployment (Mini App)

### Option 1: Vercel (Recommended)

1. **Connect Repository**: Link GitHub repo to Vercel

2. **Configure Build Settings**:
   - Framework: Next.js
   - Root Directory: `apps/miniapp`
   - Build Command: `cd apps/miniapp && npm run build`
   - Output Directory: `apps/miniapp/.next`

3. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   NEXT_PUBLIC_WORLD_ID_APP_ID=app_prod_xxx
   ```

4. **Custom Domain**: Add your domain in Vercel dashboard

### Option 2: Netlify

1. **Build Settings**:
   - Build command: `cd apps/miniapp && npm run build && npm run export`
   - Publish directory: `apps/miniapp/out`

2. **netlify.toml** in project root:
   ```toml
   [build]
     base = "apps/miniapp"
     command = "npm run build && npm run export"
     publish = "out"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## Database Migration

### Production Database Setup

1. **Create Production Database**:
   ```bash
   # For Railway
   railway add postgresql

   # For Supabase (create project in dashboard)
   # Get connection string from dashboard
   ```

2. **Run Migrations**:
   ```bash
   # Set production DATABASE_URL
   export DATABASE_URL="postgresql://prod-connection-string"

   # Run migrations
   pnpm --filter api prisma migrate deploy

   # Generate Prisma client
   pnpm --filter api prisma generate
   ```

3. **Seed Production Data** (optional):
   ```bash
   # Only run if you want initial categories/test data
   pnpm --filter api db:seed
   ```

## Smart Contract Deployment

### Mainnet Deployment

1. **Prepare Deployment Environment**:
   ```bash
   cd packages/contracts

   # Set environment variables
   export PRIVATE_KEY="your-mainnet-private-key"
   export RPC_URL="https://ethereum.publicnode.com"
   export ETHERSCAN_API_KEY="your-etherscan-api-key"
   ```

2. **Deploy Contracts**:
   ```bash
   # Deploy to mainnet
   forge script script/Deploy.s.sol \
     --rpc-url $RPC_URL \
     --broadcast \
     --verify \
     --slow

   # Save deployment addresses
   cp deployments.json ../../../apps/api/deployments.json
   ```

3. **Update Environment Variables**:
   ```bash
   # Update API with deployed contract addresses
   railway variables set PROFILE_SBT_CONTRACT="0x..."
   railway variables set ESCROW_CONTRACT="0x..."
   railway variables set REPUTATION_CONTRACT="0x..."
   ```

## World ID Production Configuration

### 1. Create Production App

1. Go to [developer.worldcoin.org](https://developer.worldcoin.org)
2. Create new app or clone staging app
3. Set environment to **Production**
4. Configure production URLs

### 2. Update App Configuration

```bash
# Update environment variables
WORLD_ID_APP_ID="app_prod_xxx"  # New production app ID
WORLD_ID_ACTION="verify-human"   # Keep same action
```

### 3. Domain Verification

Add your production domain to World ID app settings:
- Mini App URL: `https://your-domain.com`
- API URL: `https://api.your-domain.com`

## IPFS Production Setup

### Option 1: Infura IPFS

1. **Upgrade Infura Plan** for production usage
2. **Configure Environment**:
   ```bash
   IPFS_PROJECT_ID="your-prod-project-id"
   IPFS_PROJECT_SECRET="your-prod-secret"
   IPFS_ENDPOINT="https://ipfs.infura.io:5001"
   ```

### Option 2: Pinata

1. **Create Pinata Account** and get API keys
2. **Update IPFS Service** to use Pinata endpoints
3. **Configure Rate Limits** for production usage

## Monitoring and Observability

### Error Tracking with Sentry

1. **Install Sentry**:
   ```bash
   # Add to both frontend and backend
   npm install @sentry/node @sentry/nextjs
   ```

2. **Configure Backend** (`apps/api/src/index.ts`):
   ```typescript
   import * as Sentry from '@sentry/node';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **Configure Frontend** (`apps/miniapp/sentry.client.config.js`):
   ```javascript
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### Health Checks

Implement health check endpoints:

```typescript
// apps/api/src/routes/health.ts
app.get('/health', async (request, reply) => {
  const checks = {
    database: await checkDatabase(),
    ipfs: await checkIPFS(),
    blockchain: await checkBlockchain(),
  };

  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: checks,
  };
});
```

### Performance Monitoring

Set up application performance monitoring:

```typescript
// Monitor API response times
app.addHook('onRequest', async (request) => {
  request.startTime = Date.now();
});

app.addHook('onResponse', async (request, reply) => {
  const duration = Date.now() - request.startTime;
  console.log(`${request.method} ${request.url} - ${reply.statusCode} - ${duration}ms`);
});
```

## Security Configuration

### Rate Limiting

```typescript
// apps/api/src/plugins/rateLimit.ts
import rateLimit from '@fastify/rate-limit';

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => ({
    code: 'RATE_LIMIT_EXCEEDED',
    error: 'Too many requests',
    expiresIn: context.ttl,
  }),
});
```

### CORS Configuration

```typescript
// apps/api/src/plugins/cors.ts
app.register(require('@fastify/cors'), {
  origin: [
    'https://your-domain.com',
    'https://app.your-domain.com',
    // Add your production domains
  ],
  credentials: true,
});
```

### Security Headers

```typescript
// apps/api/src/plugins/helmet.ts
app.register(require('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://ipfs.io"],
    },
  },
});
```

## SSL/TLS Configuration

### Automated SSL with Caddy

Create `Caddyfile`:

```caddy
your-domain.com {
  reverse_proxy localhost:3000
}

api.your-domain.com {
  reverse_proxy localhost:3001
}
```

### Manual SSL with Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Backup and Disaster Recovery

### Database Backups

```bash
# Automated daily backups
#!/bin/bash
BACKUP_FILE="xambitlan-backup-$(date +%Y%m%d).sql"
pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://your-backup-bucket/
```

### Contract State Backup

Regularly backup important contract data:

```typescript
// Backup script for contract state
const backupContractData = async () => {
  const profiles = await profileContract.getAllProfiles();
  const deals = await escrowContract.getAllDeals();

  await storeBackup({
    profiles,
    deals,
    timestamp: new Date(),
  });
};
```

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Test API health
curl https://api.your-domain.com/health

# Test World ID verification endpoint
curl -X POST https://api.your-domain.com/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"proof":"test"}'
```

### 2. End-to-End Testing

1. Open Mini App in World App
2. Complete World ID verification
3. Create test profile
4. Create test service
5. Test pay-to-reveal flow
6. Test deal creation and completion

### 3. Performance Testing

```bash
# Load testing with artillery
npm install -g artillery
artillery quick --count 10 --num 100 https://api.your-domain.com/health
```

## Maintenance

### Regular Tasks

- [ ] Monitor error rates and performance
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Backup verification weekly
- [ ] Security audit quarterly

### Scaling Considerations

- **Database**: Consider read replicas for high traffic
- **API**: Horizontal scaling with load balancer
- **IPFS**: CDN for faster metadata access
- **Caching**: Redis for session and API response caching

## Rollback Plan

### Database Rollback

```bash
# Restore from backup
pg_restore --clean --if-exists -d $DATABASE_URL backup-file.sql
```

### Application Rollback

```bash
# Vercel
vercel rollback

# Railway
railway rollback

# Docker
docker run previous-image-tag
```

## Troubleshooting Production Issues

### Common Production Issues

1. **High Database CPU**: Add indexes, optimize queries
2. **Memory Leaks**: Monitor Node.js heap usage
3. **IPFS Timeouts**: Implement fallback mechanisms
4. **Rate Limit Hits**: Adjust limits or implement queuing

### Debug Production Issues

```bash
# Enable debug logging temporarily
railway variables set DEBUG="xambitlan:*"

# Check application logs
railway logs

# Monitor database performance
railway connect postgresql
```