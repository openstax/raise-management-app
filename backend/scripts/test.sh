#! /usr/bin/env bash

# Exit in case of error
set -e
# Print commands to help with debugging
set -x

INSTALL_DEV=true docker-compose build
docker-compose down -v --remove-orphans
docker-compose up -d
docker-compose exec -T api alembic upgrade head
docker-compose exec -T api pytest --cov=api --cov-report=term --cov-report=html api/tests -vvv
docker-compose down -v --remove-orphans
