#!/bin/sh

log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

log "Starting the execution of the app..."

exec npm run start
