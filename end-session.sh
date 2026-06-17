#!/bin/bash
set -e

echo "============================================"
echo "  Saving and uploading your changes..."
echo "============================================"
cd "$(dirname "$0")"

git status --short

if [ -z "$(git status --porcelain)" ]; then
  echo ""
  echo "No changes found. Nothing to upload."
  echo ""
  exit 0
fi

echo ""
read -p "Describe your changes (e.g. updated pricing section): " msg

if [ -z "$msg" ]; then
  echo ""
  echo "Commit message cannot be blank. Nothing was uploaded."
  echo ""
  exit 1
fi

git add .
git commit -m "$msg"
git pull --rebase
git push

echo ""
echo "Done! Your changes have been saved to GitHub."
echo ""
