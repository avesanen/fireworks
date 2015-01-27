#!/bin/bash

docker build -t fireworks .
docker stop fireworks
docker rm fireworks
docker run -v /var/lib/fireworks:/go/src/github.com/avesanen/fireworks/db -p 127.0.0.1:5003:8000 -d --name fireworks fireworks
