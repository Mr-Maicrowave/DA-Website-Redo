#!/bin/bash
echo "============================================"
echo "  Saving and uploading your changes..."
echo "============================================"
cd "$(dirname "$0")"
read -p "Describe your changes (e.g. updated pricing section): " msg
git add .
git commit -m "$msg"
git push
echo ""
echo "Done! Your changes have been saved to GitHub."
echo ""
