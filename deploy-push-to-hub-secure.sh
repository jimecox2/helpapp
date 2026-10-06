#!/bin/bash
# Build the tbhelpapp image and push it to Docker Hub.
#
# Uses the Docker login already saved on this machine. Log in once with:
#   docker login -u jimecox807
# and paste your PAT at the prompt. Never put the PAT in .env or in this repo.

read -p "Tag (press Enter for 'latest'): " tag
tag=${tag:-latest}

docker build -t jimecox807/tbhelpapp:$tag . || exit 1

if ! docker push jimecox807/tbhelpapp:$tag; then
  echo "Push failed. If it was an auth error, run: docker login -u jimecox807"
  exit 1
fi
