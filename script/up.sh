#!/bin/bash
# Convenience script to start postgres, nginx, and uwsgi
#
# Copyright 2014 Joe Nudell


# get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# include logging helpers
source "$DIR/common.sh"

findroot

# start postgres
info "Starting postgres ..."
postgres -D data/ &
PG_PID=$!

# start uwsgi
info "Starting uwsgi ..."
cd server
uwsgi -s /tmp/lignum_uwsgi.sock -w wood:app --chmod-socket=666 &
UW_PID=$!
cd ..


# wait for postgres to finish launching
info "Waiting for postgres to fire up ..."
while : ; do
    [ -e /tmp/.s.PGSQL.5432 ] && break
    warn "still waitin' ..."
    sleep 1
done

# build stuff
info "Building crap ..."
grunt sass

# launch nginx
sudo nginx -s stop
sudo nginx


# kill all launched processes
function cleanup {
    info "Cleaning up ..."
    kill $PG_PID
    kill $UW_PID
    exit $?
}

# kill processes on cleanup
trap 'cleanup' INT

# meow
good 'Ready to rock!'
cat