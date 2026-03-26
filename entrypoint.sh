#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting file service..."
exec node src/app.js
