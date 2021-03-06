#! /usr/bin/env bash

# Exit in case of error
set -e
# Print commands to help with debugging
set -x

export COGNITO_AWS_REGION=awsregion
export COGNITO_USER_POOL_ID=userpoolid
export COGNITO_CLIENT_ID=clientid
export FAKE_AUTH_MODE=0
INSTALL_DEV=true docker-compose build api
docker-compose down -v --remove-orphans
docker-compose up -d api
docker-compose exec -T postgres timeout 10 bash -c "until pg_isready; do sleep 1; done;"
docker-compose exec -T api alembic upgrade head
docker-compose exec -T api pytest --cov=api --cov-report=term --cov-report=html api/tests -vvv
docker-compose down -v --remove-orphans
