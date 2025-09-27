#!/bin/bash

# Quick Test Startup Script for Xambatlán
# Starts the testing environment and shows QR code info

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}$1${NC}"; }
log_success() { echo -e "${GREEN}$1${NC}"; }
log_warning() { echo -e "${YELLOW}$1${NC}"; }
log_cyan() { echo -e "${CYAN}$1${NC}"; }

clear
echo "🌟 Xambatlán Testing Environment"
echo "================================"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_info "📦 Installing dependencies..."
    pnpm install
fi

log_info "🚀 Starting Xambatlán test environment..."
echo

# Start mock API in background
log_info "🔧 Starting mock API server..."
node scripts/mock-api.js &
MOCK_API_PID=$!

# Wait for API to start
sleep 3

# Check if API started
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo "❌ Mock API failed to start"
    kill $MOCK_API_PID 2>/dev/null || true
    exit 1
fi

log_success "✅ Mock API running on http://localhost:3001"

# Start Mini App in background
log_info "🔧 Starting Mini App..."
cd apps/miniapp
pnpm dev > /dev/null 2>&1 &
MINIAPP_PID=$!
cd ../..

# Wait for Mini App to start
log_info "⏳ Waiting for Mini App to start..."
sleep 5

# Check if Mini App started
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Mini App failed to start"
    kill $MOCK_API_PID 2>/dev/null || true
    kill $MINIAPP_PID 2>/dev/null || true
    exit 1
fi

log_success "✅ Mini App running on http://localhost:3000"
echo

# Display testing information
echo "🧪 TESTING READY!"
echo "=================="
echo
log_cyan "📱 SCAN WITH YOUR PHONE:"
log_cyan "1. Visit: http://localhost:3000/test"
log_cyan "2. Scan the QR code with your phone camera"
log_cyan "3. Tap 'Open in World App' when prompted"
echo
log_cyan "🔗 OR USE DIRECT URLS:"
log_cyan "• Local: http://localhost:3000"
log_cyan "• Ngrok: https://evidently-uncompensating-neal.ngrok-free.dev/"
log_cyan "• Test Page: https://evidently-uncompensating-neal.ngrok-free.dev/test"
echo
log_cyan "🆔 WORLD ID APP DETAILS:"
log_cyan "• App ID: app_0169420666"
log_cyan "• Action: verify-human"
log_cyan "• Testing URL: https://docs.world.org/mini-apps/quick-start/testing"
echo
log_warning "💡 TIP: Open http://localhost:3000/test in your browser first"
log_warning "    to see the QR code, then scan it with your phone!"
echo

# Function to cleanup on exit
cleanup() {
    echo
    log_info "🛑 Stopping services..."
    kill $MOCK_API_PID 2>/dev/null || true
    kill $MINIAPP_PID 2>/dev/null || true
    log_success "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Auto-open test page in browser (if available)
if command -v open >/dev/null 2>&1; then
    # macOS
    open http://localhost:3000/test >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open http://localhost:3000/test >/dev/null 2>&1 &
fi

log_cyan "Press Ctrl+C to stop all services"
echo

# Keep script running
while true; do
    sleep 1
done