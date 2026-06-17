#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Fetching latest..."
git pull
[ ! -d node_modules ] && npm install
npm run dev
