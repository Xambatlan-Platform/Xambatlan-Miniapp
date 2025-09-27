#!/bin/bash

# Xambatlán Setup Script
# This script automates the initial setup process

set -e  # Exit on any error

echo "🚀 Setting up Xambatlán development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Node.js
    if ! command_exists node; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -c2-)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        log_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher"
        exit 1
    fi
    log_success "Node.js $NODE_VERSION detected"

    # Check pnpm
    if ! command_exists pnpm; then
        log_warning "pnpm not found. Installing pnpm..."
        npm install -g pnpm
    fi
    log_success "pnpm detected"

    # Check PostgreSQL
    if ! command_exists psql; then
        log_warning "PostgreSQL not found. Please install PostgreSQL 13+ or use Docker"
        log_info "Docker option: docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15"
    else
        log_success "PostgreSQL detected"
    fi

    # Check git
    if ! command_exists git; then
        log_error "Git is not installed. Please install Git"
        exit 1
    fi
    log_success "Git detected"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    pnpm install
    log_success "Dependencies installed"
}

# Setup environment files
setup_environment() {
    log_info "Setting up environment files..."

    # Copy API environment template
    if [ ! -f "apps/api/.env" ]; then
        cp apps/api/.env.example apps/api/.env
        log_success "Created apps/api/.env from template"
    else
        log_warning "apps/api/.env already exists, skipping"
    fi

    # Copy Mini App environment template
    if [ ! -f "apps/miniapp/.env.local" ]; then
        cat > apps/miniapp/.env.local << EOF
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WORLD_ID_APP_ID="app_staging_xxx"
EOF
        log_success "Created apps/miniapp/.env.local"
    else
        log_warning "apps/miniapp/.env.local already exists, skipping"
    fi

    # Generate secrets for API .env
    log_info "Generating secrets..."

    # Generate encryption key
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    JWT_SECRET=$(openssl rand -base64 32)

    # Update .env file with generated secrets
    if command_exists sed; then
        # macOS/BSD sed
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/ENCRYPTION_KEY=\".*\"/ENCRYPTION_KEY=\"$ENCRYPTION_KEY\"/" apps/api/.env
            sed -i '' "s/JWT_SECRET=\".*\"/JWT_SECRET=\"$JWT_SECRET\"/" apps/api/.env
        else
            # GNU sed (Linux)
            sed -i "s/ENCRYPTION_KEY=\".*\"/ENCRYPTION_KEY=\"$ENCRYPTION_KEY\"/" apps/api/.env
            sed -i "s/JWT_SECRET=\".*\"/JWT_SECRET=\"$JWT_SECRET\"/" apps/api/.env
        fi
        log_success "Generated and updated secrets in apps/api/.env"
    else
        log_warning "Please manually update the following in apps/api/.env:"
        log_warning "ENCRYPTION_KEY=\"$ENCRYPTION_KEY\""
        log_warning "JWT_SECRET=\"$JWT_SECRET\""
    fi
}

# Setup database
setup_database() {
    log_info "Setting up database..."

    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=\"postgresql://username:password@localhost:5432/xambitlan\"" apps/api/.env; then
        log_warning "Please update DATABASE_URL in apps/api/.env with your actual database credentials"
        log_info "Example: postgresql://username:password@localhost:5432/xambitlan"

        # Ask if user wants to continue
        read -p "Have you updated the DATABASE_URL? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Please update DATABASE_URL and run this script again"
            exit 1
        fi
    fi

    # Try to create database (if it doesn't exist)
    if command_exists createdb; then
        createdb xambitlan 2>/dev/null || log_warning "Database 'xambitlan' might already exist or createdb failed"
    fi

    # Run migrations
    log_info "Running database migrations..."
    pnpm db:migrate || {
        log_error "Database migration failed. Please check your DATABASE_URL and ensure PostgreSQL is running"
        exit 1
    }

    # Seed database
    log_info "Seeding database with test data..."
    pnpm db:seed || {
        log_warning "Database seeding failed, but you can continue without test data"
    }

    log_success "Database setup completed"
}

# Setup smart contracts (optional)
setup_contracts() {
    log_info "Setting up smart contracts..."

    if command_exists forge; then
        cd packages/contracts
        forge install --quiet || true
        forge build
        log_success "Smart contracts compiled"
        cd ../..
    else
        log_warning "Foundry not installed. Smart contracts will use mock addresses"
        log_info "To install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    fi
}

# Verify setup
verify_setup() {
    log_info "Verifying setup..."

    # Check if packages can be built
    pnpm build > /dev/null 2>&1 || {
        log_error "Build failed. Please check for errors above"
        exit 1
    }
    log_success "All packages build successfully"

    # Check type checking
    pnpm typecheck > /dev/null 2>&1 || {
        log_warning "Type checking found issues, but setup can continue"
    }

    log_success "Setup verification completed"
}

# Print next steps
print_next_steps() {
    echo
    log_success "🎉 Xambatlán setup completed successfully!"
    echo
    log_info "Next steps:"
    echo "  1. Update World ID configuration in apps/api/.env:"
    echo "     - Get App ID from developer.worldcoin.org"
    echo "     - Set WORLD_ID_APP_ID to your app ID"
    echo
    echo "  2. Start the development servers:"
    echo "     pnpm dev"
    echo
    echo "  3. Set up ngrok for mobile testing:"
    echo "     ngrok http 3000"
    echo "     Then update allowedDevOrigins in apps/miniapp/next.config.ts"
    echo
    echo "  4. Optional: Configure IPFS by adding Infura credentials to apps/api/.env"
    echo
    log_info "For detailed setup instructions, see SETUP.md"
    log_info "For deployment instructions, see DEPLOYMENT.md"
    echo
}

# Main execution
main() {
    echo "🔧 Xambatlán Development Environment Setup"
    echo "=========================================="
    echo

    check_prerequisites
    install_dependencies
    setup_environment
    setup_database
    setup_contracts
    verify_setup
    print_next_steps
}

# Handle script interruption
trap 'log_error "Setup interrupted"; exit 1' INT

# Run main function
main "$@"