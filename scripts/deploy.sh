#!/bin/bash

# Xambatlán Deployment Script
# Automates deployment to various platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Show usage
show_usage() {
    echo "Usage: $0 [PLATFORM] [ENVIRONMENT]"
    echo
    echo "Platforms:"
    echo "  railway    Deploy API to Railway"
    echo "  vercel     Deploy Mini App to Vercel"
    echo "  docker     Build and run Docker containers"
    echo "  contracts  Deploy smart contracts"
    echo "  all        Deploy everything"
    echo
    echo "Environments:"
    echo "  staging    Deploy to staging environment"
    echo "  production Deploy to production environment"
    echo
    echo "Examples:"
    echo "  $0 railway staging"
    echo "  $0 vercel production"
    echo "  $0 all staging"
}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
        log_error "Please run this script from the project root directory"
        exit 1
    fi

    # Check if dependencies are installed
    if [ ! -d "node_modules" ]; then
        log_error "Dependencies not installed. Run 'pnpm install' first"
        exit 1
    fi

    # Run tests
    log_info "Running tests..."
    pnpm test || {
        log_error "Tests failed. Please fix before deploying"
        exit 1
    }

    # Type check
    log_info "Type checking..."
    pnpm typecheck || {
        log_error "Type checking failed. Please fix before deploying"
        exit 1
    }

    # Lint
    log_info "Linting..."
    pnpm lint || {
        log_warning "Linting found issues, but deployment can continue"
    }

    # Build check
    log_info "Building packages..."
    pnpm build || {
        log_error "Build failed. Please fix before deploying"
        exit 1
    }

    log_success "Pre-deployment checks passed"
}

# Deploy to Railway
deploy_railway() {
    local env=$1
    log_info "Deploying API to Railway ($env)..."

    if ! command_exists railway; then
        log_error "Railway CLI not installed. Install with: npm install -g @railway/cli"
        exit 1
    fi

    # Check if logged in
    railway whoami > /dev/null 2>&1 || {
        log_error "Not logged in to Railway. Run 'railway login' first"
        exit 1
    }

    cd apps/api

    # Set environment-specific variables
    if [ "$env" = "production" ]; then
        log_info "Setting production environment variables..."
        railway variables set NODE_ENV=production
        railway variables set PORT=3001
    else
        log_info "Setting staging environment variables..."
        railway variables set NODE_ENV=staging
        railway variables set PORT=3001
    fi

    # Deploy
    railway up

    # Run migrations
    log_info "Running database migrations..."
    railway run npx prisma migrate deploy

    cd ../..
    log_success "Railway deployment completed"
}

# Deploy to Vercel
deploy_vercel() {
    local env=$1
    log_info "Deploying Mini App to Vercel ($env)..."

    if ! command_exists vercel; then
        log_error "Vercel CLI not installed. Install with: npm install -g vercel"
        exit 1
    fi

    cd apps/miniapp

    # Deploy
    if [ "$env" = "production" ]; then
        vercel --prod
    else
        vercel
    fi

    cd ../..
    log_success "Vercel deployment completed"
}

# Deploy smart contracts
deploy_contracts() {
    local env=$1
    log_info "Deploying smart contracts ($env)..."

    if ! command_exists forge; then
        log_error "Foundry not installed. Install from https://foundry.paradigm.xyz"
        exit 1
    fi

    cd packages/contracts

    # Check environment variables
    if [ -z "$PRIVATE_KEY" ]; then
        log_error "PRIVATE_KEY environment variable not set"
        exit 1
    fi

    if [ -z "$RPC_URL" ]; then
        log_error "RPC_URL environment variable not set"
        exit 1
    fi

    # Build contracts
    forge build

    # Run tests
    forge test

    # Deploy
    if [ "$env" = "production" ]; then
        log_warning "Deploying to MAINNET. Are you sure? (y/N)"
        read -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi

    forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify

    # Save deployment addresses
    if [ -f "deployments.json" ]; then
        cp deployments.json ../../apps/api/deployments.json
        log_success "Deployment addresses saved"
    fi

    cd ../..
    log_success "Smart contracts deployed"
}

# Build Docker images
build_docker() {
    local env=$1
    log_info "Building Docker images..."

    # Build API image
    log_info "Building API Docker image..."
    cat > apps/api/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build packages
RUN pnpm build

# Set working directory to API
WORKDIR /app/apps/api

EXPOSE 3001

CMD ["pnpm", "start"]
EOF

    docker build -f apps/api/Dockerfile -t xambitlan-api:$env .

    # Build Mini App image
    log_info "Building Mini App Docker image..."
    cat > apps/miniapp/Dockerfile << EOF
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY apps/miniapp/package.json ./apps/miniapp/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
WORKDIR /app/apps/miniapp
RUN pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/apps/miniapp/.next ./.next
COPY --from=builder /app/apps/miniapp/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
EOF

    docker build -f apps/miniapp/Dockerfile -t xambitlan-miniapp:$env .

    log_success "Docker images built"
}

# Deploy with Docker Compose
deploy_docker() {
    local env=$1
    log_info "Deploying with Docker Compose..."

    # Create docker-compose file
    cat > docker-compose.$env.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: xambitlan
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    image: xambitlan-api:$env
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/xambitlan
      NODE_ENV: $env
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  miniapp:
    image: xambitlan-miniapp:$env
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
EOF

    # Deploy
    docker-compose -f docker-compose.$env.yml up -d

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 10

    # Run migrations
    docker-compose -f docker-compose.$env.yml exec api npx prisma migrate deploy

    log_success "Docker deployment completed"
}

# Verify deployment
verify_deployment() {
    local platform=$1
    local env=$2

    log_info "Verifying deployment..."

    case $platform in
        "railway")
            # Check API health
            API_URL=$(railway status --json | jq -r '.deployments[0].url')
            if [ "$API_URL" != "null" ]; then
                curl -f "$API_URL/health" || log_warning "API health check failed"
            fi
            ;;
        "vercel")
            # Check frontend
            FRONTEND_URL=$(vercel ls --json | jq -r '.[0].url')
            if [ "$FRONTEND_URL" != "null" ]; then
                curl -f "https://$FRONTEND_URL" || log_warning "Frontend check failed"
            fi
            ;;
        "docker")
            # Check local services
            curl -f "http://localhost:3001/health" || log_warning "API health check failed"
            curl -f "http://localhost:3000" || log_warning "Frontend check failed"
            ;;
    esac

    log_success "Deployment verification completed"
}

# Main function
main() {
    local platform=${1:-""}
    local env=${2:-"staging"}

    if [ -z "$platform" ]; then
        show_usage
        exit 1
    fi

    log_info "Starting deployment: $platform to $env"

    # Run pre-deployment checks
    pre_deployment_checks

    # Deploy based on platform
    case $platform in
        "railway")
            deploy_railway $env
            verify_deployment railway $env
            ;;
        "vercel")
            deploy_vercel $env
            verify_deployment vercel $env
            ;;
        "docker")
            build_docker $env
            deploy_docker $env
            verify_deployment docker $env
            ;;
        "contracts")
            deploy_contracts $env
            ;;
        "all")
            deploy_contracts $env
            deploy_railway $env
            deploy_vercel $env
            verify_deployment railway $env
            verify_deployment vercel $env
            ;;
        *)
            log_error "Unknown platform: $platform"
            show_usage
            exit 1
            ;;
    esac

    log_success "🎉 Deployment completed successfully!"
}

# Handle interruption
trap 'log_error "Deployment interrupted"; exit 1' INT

# Run main function
main "$@"