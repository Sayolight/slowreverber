#!/bin/bash

npx prisma generate

if [ "$NODE_ENV" = "production" ]; then
  echo "migrating database and starting bot..."
  npx prisma migrate deploy
  npm run build
  npm run bot
else
  echo "db pushing and starting dev bot..."
  npx prisma db push
  npm run dev
fi

