#! /usr/bin/env bash

# Exit in case of error
set -e
# Print commands to help with debugging
set -x

export FAKE_AUTH_MODE=1
docker-compose build
docker-compose down -v --remove-orphans
docker-compose up -d
docker-compose exec -T api alembic upgrade head
npm test
docker-compose down -v --remove-orphans
