#!/bin/bash
set -e

echo "============================================"
echo "  Starting DA Tuition work session..."
echo "============================================"
cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"

echo ""
echo "Fetching latest changes from GitHub..."
if ! git pull; then
  echo ""
  echo "Git pull failed. Please ask for help before making changes."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo ""
  echo "Installing website dependencies..."
  if ! npm install; then
    echo ""
    echo "Dependency install failed. Please ask for help before making changes."
    exit 1
  fi
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

shell_quote() {
  printf "'%s'" "$(printf "%s" "$1" | sed "s/'/'\\\\''/g")"
}

if [ "$(uname)" = "Darwin" ]; then
  DEV_COMMAND="cd $(shell_quote "$PROJECT_DIR") && npm run dev"
  osascript \
    -e 'tell application "Terminal"' \
    -e "do script \"$DEV_COMMAND\"" \
    -e 'activate' \
    -e 'end tell'

  echo "Done! Edit the website, then open http://localhost:8080 in your browser."
  echo ""
  exit 0
fi

npm run dev

echo ""
