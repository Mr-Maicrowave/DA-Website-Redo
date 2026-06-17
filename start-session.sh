#!/bin/bash
set -e
REMOTE="origin"
BRANCH="master"

echo "============================================"
echo "  Starting DA Tuition work session..."
echo "============================================"
cd "$(dirname "$0")"

echo ""
echo "Replacing this working folder with the latest GitHub version..."
echo "WARNING: local uncommitted changes and untracked files will be discarded."
echo ""
git fetch "$REMOTE"
git reset --hard "$REMOTE/$BRANCH"
git clean -ffd

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
  echo "Done! Edit the website, then refresh your browser."
  echo ""
  exit 0
fi

npm run dev

echo ""
