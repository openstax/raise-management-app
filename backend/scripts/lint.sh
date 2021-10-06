#! /usr/bin/env bash

# Exit in case of error
set -e
# Print commands to help with debugging
set -x

docker build backend/. --build-arg INSTALL_DEV=true -t backend
docker run --rm backend flake8 api
