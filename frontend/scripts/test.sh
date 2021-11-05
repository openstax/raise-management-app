#! /usr/bin/env bash

# Exit in case of error
set -e
# Print commands to help with debugging
set -x

docker-compose build
docker-compose down -v --remove-orphans
docker-compose up -d
docker-compose exec -T postgres timeout 10 bash -c "until pg_isready; do sleep 1; done;"
docker-compose exec -T api alembic upgrade head
npm test
docker-compose down -v --remove-orphans
