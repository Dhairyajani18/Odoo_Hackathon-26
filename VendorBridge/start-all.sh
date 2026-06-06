#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting VendorBridge Frontend & Backend...${NC}\n"

# Start Backend
echo -e "${GREEN}Starting Backend Server (Port 5000)...${NC}"
cd VendorBridge/backend
npm install > /dev/null 2>&1
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Frontend
echo -e "${GREEN}Starting Frontend (Port 5173)...${NC}"
cd ../client
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ Both servers are running!${NC}"
echo -e "${BLUE}Backend: http://localhost:5000${NC}"
echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
echo -e "\nPress Ctrl+C to stop both servers\n"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
