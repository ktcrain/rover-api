#!/usr/bin/env bash

export PM2_HOME=/home/ubuntu/.pm2
pm2 delete rover-api
pm2 start ecosystem.json --env production

