#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required."
  exit 1
fi
if [ ! -d node_modules ]; then npm install; fi
npm run server > azez-core.log 2>&1 &
CORE_PID=$!
npm run dev -- --host 127.0.0.1 > azez-ui.log 2>&1 &
UI_PID=$!
echo "$CORE_PID $UI_PID" > .azez-pids
sleep 5
echo "AZEZ LAB AI started: http://127.0.0.1:5173"
