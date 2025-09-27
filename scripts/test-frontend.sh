#!/bin/bash

# Frontend Testing Script for Xambatlán
# Creates mock services to test the frontend without real database/contracts

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo "🧪 Starting Xambatlán Frontend Testing Environment"
echo "================================================="
echo

log_info "This will start:"
log_info "1. Mock API server with fake data"
log_info "2. Next.js Mini App"
log_info "3. Both will run with your ngrok URL: https://evidently-uncompensating-neal.ngrok-free.dev/"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    log_error "Please run this script from the project root directory"
    exit 1
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    log_info "Installing dependencies..."
    pnpm install
fi

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "Port 3000 is already in use. Please stop the existing process."
    exit 1
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "Port 3001 is already in use. Please stop the existing process."
    exit 1
fi

# Start mock API server in background
log_info "Starting mock API server on port 3001..."
node scripts/mock-api.js &
MOCK_API_PID=$!

# Wait for mock API to start
sleep 2

# Check if mock API started successfully
if ! curl -s http://localhost:3001/health > /dev/null; then
    log_warning "Mock API failed to start. Check the logs above."
    kill $MOCK_API_PID 2>/dev/null || true
    exit 1
fi

log_success "Mock API server running on http://localhost:3001"

# Start the Mini App
log_info "Starting Mini App on port 3000..."
cd apps/miniapp
pnpm dev &
MINIAPP_PID=$!
cd ../..

# Wait for Mini App to start
log_info "Waiting for Mini App to start..."
sleep 5

# Check if Mini App started
if ! curl -s http://localhost:3000 > /dev/null; then
    log_warning "Mini App failed to start. Check the logs above."
    kill $MOCK_API_PID 2>/dev/null || true
    kill $MINIAPP_PID 2>/dev/null || true
    exit 1
fi

log_success "Mini App running on http://localhost:3000"
log_success "Also available via ngrok: https://evidently-uncompensating-neal.ngrok-free.dev/"

echo
log_info "🧪 Test Environment Ready!"
log_info "=============================="
log_info "Local URL: http://localhost:3000"
log_info "Ngrok URL: https://evidently-uncompensating-neal.ngrok-free.dev/"
log_info "Mock API: http://localhost:3001"
echo
log_info "Test the app in World App using the ngrok URL"
log_info "The mock API provides fake data for all endpoints"
echo
log_info "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    log_info "Stopping services..."
    kill $MOCK_API_PID 2>/dev/null || true
    kill $MINIAPP_PID 2>/dev/null || true
    log_success "All services stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done