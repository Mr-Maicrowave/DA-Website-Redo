#!/bin/bash
set -e
cd "$(dirname "$0")"
git status --short
[ -z "$(git status --porcelain)" ] && echo "No changes." && exit 0
read -p "Describe changes: " msg
git add . && git commit -m "$msg" && git pull --rebase && git push
echo "Done!"
