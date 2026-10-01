#!/bin/sh
# Revive contract: start the preview server on 0.0.0.0:8080 if it is down.
set -eu
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
cd /workspace
npm run dev >/tmp/peremena-dev.log 2>&1 &
exit 0
