#!/bin/bash

docker build -t podinho/rinhav2:latest .
docker compose down -v
docker compose up -d

sleep 5

./load-test/run-test.sh
