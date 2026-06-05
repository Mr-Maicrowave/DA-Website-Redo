#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -f "start-session.sh" ]; then
  echo "Could not find start-session.sh next to this launcher."
  echo "Please put START-SESSION.command in the DA Tuition website folder."
  echo ""
  read -r -p "Press return to close this window..."
  exit 1
fi

chmod +x start-session.sh
./start-session.sh

echo ""
read -r -p "Press return to close this window..."
