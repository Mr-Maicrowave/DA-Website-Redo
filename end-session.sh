#!/bin/bash
set -e
REMOTE="origin"
BRANCH="master"

echo "============================================"
echo "  Saving and uploading your changes..."
echo "============================================"
cd "$(dirname "$0")"

git status --short

echo ""
echo "Checking GitHub status without merging..."
git fetch "$REMOTE"
if ! git merge-base --is-ancestor "$REMOTE/$BRANCH" HEAD; then
  echo ""
  echo "GitHub has changes that are not in this folder."
  echo "No merge was attempted. Run START-SESSION to replace this folder with GitHub's latest version, or ask for help if you need to preserve local work."
  exit 1
fi

if [ -z "$(git status --porcelain)" ]; then
  echo ""
  echo "No local file changes found. Checking for unpushed commits..."
  git push "$REMOTE" HEAD:"$BRANCH"
  echo ""
  echo "Done! GitHub is up to date."
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

git add -A
git commit -m "$msg"
git push "$REMOTE" HEAD:"$BRANCH"

echo ""
echo "Done! Your changes have been saved to GitHub."
echo ""
