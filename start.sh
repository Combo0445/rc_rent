#!/bin/bash

# Quick Start Script for Car Rental Platform
# This script starts both frontend and backend servers

echo "🚀 Starting Car Rental Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Backend...${NC}"
cd car-rental-backend
npm install
npm run dev &
BACKEND_PID=$!

echo -e "${YELLOW}Starting Frontend...${NC}"
cd ..
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ Backend running on: http://localhost:5000${NC}"
echo -e "${GREEN}✅ Frontend running on: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
