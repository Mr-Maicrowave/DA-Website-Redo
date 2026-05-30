#!/bin/bash
set -e

echo "============================================"
echo "  Starting DA Tuition work session..."
echo "============================================"
cd "$(dirname "$0")"

echo ""
echo "Fetching latest changes from GitHub..."
git pull

if [ ! -d node_modules ]; then
  echo ""
  echo "Installing website dependencies..."
  npm install
fi

echo ""
echo "Opening the local website server..."
if curl -fsS http://localhost:8080 >/dev/null 2>&1; then
  echo "Website server is already running at http://localhost:8080"
  echo ""
  echo "Done! Edit the website, then refresh or check your browser."
  echo ""
  exit 0
fi

npm run dev

echo ""
