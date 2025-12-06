#!/bin/sh
set -e

# Wait for any initialization tasks
echo "Starting DataView application..."

# If running in production, ensure the build exists
if [ "$NODE_ENV" = "production" ]; then
  if [ ! -d ".next" ]; then
    echo "Building application..."
    pnpm build
  fi
fi

# Execute the main command
exec "$@"

