# 🚀 Deployment Guide

## 🌐 Production Deployment

### Prerequisites

- Node.js 18+ or Bun runtime
- Supabase account and project
- Environment variables configured
- Domain name (optional)

## ⚡ Deployment Options

### 1. **Vercel Deployment** (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? Select your account
# - Link to existing project? [y/N] N
# - Project name: budget-buddy-backend
# - In which directory is your code located? ./
```

#### Step 4: Configure Environment Variables

```bash
# Add environment variables via Vercel dashboard or CLI
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
```

#### Step 5: Production Build

```bash
vercel --prod
```

### 2. **Railway Deployment**

#### Step 1: Create Railway Account

- Sign up at [railway.app](https://railway.app)
- Connect your GitHub account

#### Step 2: Deploy from GitHub

```bash
# Push to GitHub first
git add .
git commit -m "Prepare for deployment"
git push origin main

# Deploy via Railway dashboard:
# 1. Create new project
# 2. Deploy from GitHub repo
# 3. Select Budget-Buddy-Backend repository
```

#### Step 3: Configure Environment Variables

Add in Railway dashboard:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=3000
```

### 3. **Docker Deployment**

#### Create Dockerfile

```dockerfile
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Expose port
EXPOSE 3000

# Start application
CMD ["bun", "start"]
```

#### Docker Commands

```bash
# Build image
docker build -t budget-buddy-backend .

# Run container
docker run -p 3000:3000 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -e JWT_SECRET=your_secret \
  budget-buddy-backend
```

#### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Database Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-very-secure-jwt-secret-256-bits

# Application
NODE_ENV=production
PORT=3000

# CORS (if needed)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Checklist

- [ ] Use strong JWT secret (256-bit)
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS/TLS
- [ ] Set secure headers
- [ ] Configure rate limiting
- [ ] Enable database security policies

## 📊 Performance Optimization

### Production Build Optimization

```bash
# Build for production
bun run build

# Start production server
bun start
```

### Database Optimization

```sql
-- Add indexes for better query performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, created_at);
CREATE INDEX idx_budgets_user_category ON budgets(user_id, category_id);
CREATE INDEX idx_categories_user ON categories(user_id);
```

### Monitoring Setup

```bash
# Health check endpoint
curl https://your-domain.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

## 🔒 Security Configuration

### HTTPS Configuration

```javascript
// For custom server deployment
const app = new Elysia()
  .use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
      credentials: true,
    })
  )
  .use(helmet()); // Add security headers
```

### Rate Limiting

```javascript
// Add rate limiting middleware
.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
}))
```

## 🚨 Troubleshooting

### Common Issues

#### 1. **Environment Variables Not Found**

```bash
# Verify environment variables are set
echo $SUPABASE_URL
echo $JWT_SECRET

# Check deployment platform configuration
vercel env ls  # for Vercel
# or check Railway dashboard
```

#### 2. **Database Connection Issues**

```bash
# Test Supabase connection
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
     https://your-project.supabase.co/rest/v1/
```

#### 3. **JWT Authentication Problems**

```bash
# Verify JWT secret length (should be 256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4. **CORS Issues**

```javascript
// Update CORS configuration
.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Health Monitoring

```bash
# Set up health check monitoring
# Use services like:
# - UptimeRobot
# - Pingdom
# - StatusCake

# Monitor these endpoints:
GET /health                    # Basic health check
GET /api/v1/auth/profile      # Database connectivity
```

## 📈 Scaling Considerations

### Horizontal Scaling

- Deploy multiple instances behind a load balancer
- Use Redis for session storage (if needed)
- Implement database connection pooling

### Database Scaling

- Use Supabase connection pooling
- Implement read replicas for heavy read workloads
- Consider database partitioning for large datasets

### CDN Configuration

- Use CDN for static assets
- Configure proper cache headers
- Implement API response caching where appropriate

## 🔍 Performance Monitoring

### Key Metrics to Monitor

- Response time (< 200ms for most endpoints)
- Error rate (< 1%)
- Database query performance
- Memory usage
- CPU utilization

### Logging Setup

```javascript
// Add structured logging
const logger = {
  info: (message, meta) =>
    console.log(
      JSON.stringify({ level: 'info', message, meta, timestamp: new Date() })
    ),
  error: (message, error) =>
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
      })
    ),
};
```

For architecture details, see [Architecture Documentation](architecture.md).
For API usage, see [API Documentation](api-documentation.md).
