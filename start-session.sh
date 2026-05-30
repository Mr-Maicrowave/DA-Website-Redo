#!/bin/bash
echo "============================================"
echo "  Fetching latest changes from GitHub..."
echo "============================================"
cd "$(dirname "$0")"
git pull
echo ""
echo "Done! You're up to date. Start working :)"
echo ""
