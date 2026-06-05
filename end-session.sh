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
msg="Website updates $(date '+%Y-%m-%d %H:%M')"

echo "Saving changes with commit message:"
echo "$msg"

git add .
if ! git commit -m "$msg"; then
  echo ""
  echo "Commit failed. Please check the message above."
  exit 1
fi

if ! git pull --rebase; then
  echo ""
  echo "Git pull/rebase failed. Please ask for help before pushing."
  exit 1
fi

if ! git push; then
  echo ""
  echo "Upload failed. Please check the message above."
  exit 1
fi

echo ""
echo "Done! Your changes have been saved to GitHub."
echo ""
