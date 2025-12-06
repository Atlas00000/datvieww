# Docker Guide

This guide provides detailed instructions for running the DataView application using Docker.

## Prerequisites

- Docker Engine 20.10+ or Docker Desktop
- Docker Compose 2.0+ (included with Docker Desktop)

## Quick Start

### Development Mode
```bash
# Start development container with hot reload
docker-compose up --build

# Or using npm scripts
pnpm docker:dev
```

The application will be available at http://localhost:3000 with hot reload enabled.

### Production Mode
```bash
# Start production container
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop container
docker-compose -f docker-compose.prod.yml down
```

## Docker Files Overview

### `.dockerignore`
Excludes unnecessary files from Docker build context to reduce image size and build time.

### `Dockerfile`
Multi-stage production build:
- **Stage 1 (deps)**: Installs dependencies
- **Stage 2 (builder)**: Builds the Next.js application
- **Stage 3 (runner)**: Creates minimal production image with only runtime files

**Features:**
- Uses `node:20-alpine` for smaller image size
- Runs as non-root user (`nextjs`) for security
- Uses Next.js standalone output for optimal performance
- Multi-stage build reduces final image size

### `Dockerfile.dev`
Development build with:
- Hot reload support
- Volume mounting for live code changes
- All dev dependencies included

### `docker-compose.yml`
Development and production services:
- `app-dev`: Development service with hot reload
- `app-prod`: Production service (requires `--profile production`)

### `docker-compose.prod.yml`
Production-only configuration with:
- Health checks
- Optimized restart policies
- Production environment variables

### `docker-entrypoint.sh`
Entrypoint script for container initialization (optional, can be used for custom setup).

## Manual Docker Commands

### Build Images

**Development:**
```bash
docker build -f Dockerfile.dev -t datvieww-dev .
```

**Production:**
```bash
docker build -t datvieww-prod .
```

### Run Containers

**Development:**
```bash
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -v /app/.next \
  datvieww-dev
```

**Production:**
```bash
docker run -p 3000:3000 \
  --env NODE_ENV=production \
  datvieww-prod
```

## Environment Variables

You can customize the application using environment variables:

```bash
# In docker-compose.yml or docker run command
environment:
  - NODE_ENV=production
  - NEXT_TELEMETRY_DISABLED=1
  - PORT=3000
  - HOSTNAME=0.0.0.0
```

## Volume Mounting (Development)

The development setup uses volume mounting for hot reload:
- Source code: `.:/app` (mounted)
- `node_modules`: Anonymous volume (not mounted, uses container's)
- `.next`: Anonymous volume (not mounted, uses container's)

This ensures:
- Code changes reflect immediately
- Dependencies remain consistent
- Build artifacts don't interfere

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Container Won't Start
```bash
# Check logs
docker-compose logs app-dev

# Or for production
docker-compose -f docker-compose.prod.yml logs app
```

### Permission Issues
The production container runs as non-root user (`nextjs`). If you encounter permission issues:
```bash
# Check container user
docker exec -it datvieww-prod whoami

# Should output: nextjs
```

## Image Size Optimization

The production Dockerfile uses multi-stage builds to minimize image size:
- Final image only contains runtime files
- Development dependencies excluded
- Uses Alpine Linux base image
- Next.js standalone output reduces dependencies

## Security Best Practices

1. **Non-root user**: Production container runs as `nextjs` user
2. **Minimal base image**: Uses Alpine Linux
3. **No unnecessary packages**: Only runtime dependencies included
4. **Environment variables**: Sensitive data via environment variables, not hardcoded

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t datvieww:${{ github.sha }} .
      - name: Push to registry
        run: docker push datvieww:${{ github.sha }}
```

## Production Deployment

### Docker Hub
```bash
# Tag image
docker tag datvieww-prod username/datvieww:latest

# Push to Docker Hub
docker push username/datvieww:latest
```

### AWS ECS / ECR
```bash
# Build and tag for ECR
docker build -t datvieww-prod .
docker tag datvieww-prod:latest 123456789012.dkr.ecr.region.amazonaws.com/datvieww:latest

# Push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin 123456789012.dkr.ecr.region.amazonaws.com
docker push 123456789012.dkr.ecr.region.amazonaws.com/datvieww:latest
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datvieww
spec:
  replicas: 3
  selector:
    matchLabels:
      app: datvieww
  template:
    metadata:
      labels:
        app: datvieww
    spec:
      containers:
      - name: datvieww
        image: datvieww-prod:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## Next Steps

- Configure environment variables for your deployment
- Set up health checks for production
- Configure logging and monitoring
- Set up reverse proxy (nginx/traefik) if needed
- Configure SSL/TLS certificates

