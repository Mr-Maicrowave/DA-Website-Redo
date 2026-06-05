#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f "end-session.sh" ]; then
  echo "Could not find end-session.sh next to this launcher."
  echo "Please put END-SESSION.command in the DA Tuition website folder."
  echo ""
  read -r -p "Press return to close this window..."
  exit 1
fi

chmod +x end-session.sh
./end-session.sh

echo ""
read -r -p "Press return to close this window..."
