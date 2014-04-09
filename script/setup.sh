#!/bin/bash
# Setup script for wood app
# WARNING - Will delete and reload anything in Postgres
#
# Copyright 2014 Joe Nudell. All rights reserved.

PG_USER="lignum"
PG_PASS="password"
DATA_DIR="raw"

ENV=${1:-local}

# get script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# include helpers
source "$DIR/common.sh"

findroot

info "Checking core dependencies ..."
command -v postgres >/dev/null 2>&1 || brew install postgres
command -v virtualenv >/dev/null 2>&1 || sudo easy_install virtualenv
command -v ./$ENV_ROOT/bin/python2.7 >/dev/null 2>&1 || virtualenv $ENV_ROOT


# install JS dependencies
info "Checking JS dependencies ..."
sudo npm install

# install python dependencies (in virtual environment)
govirtual

info "Installing Python dependencies ..."
export CFLAGS=-Qunused-arguments
export CPPFLAGS=-Qunused-arguments
pip install -r requirements.txt

# set up postgres
info "(Re)initializing postgres ..."
rm -r data; mkdir data && cd data

info "Creating new database ..."
initdb . --locale=en_US.UTF-8 --encoding=UNICODE

# replace default cfgs with checked-in versions
git show origin/master:data/postgresql.conf > postgresql.conf
git show origin/master:data/pg_hba.conf > pg_hba.conf


# start postgres in background
postgres -D . &
PG_PID=$!

info "Waiting for postgres to start ... "
file=/tmp/.s.PGSQL.5432
while : ; do
    [ -e "$file" ] && break
    sleep 1s
    warn "still waitin' ..."
done

info "Creating postgres stuff ..."
createdb $PG_USER

psql -d $PG_USER -c "CREATE ROLE $PG_USER PASSWORD '$PG_PASS' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN;"

cd ..
info "Done with DB things"

# populate db
info "Finding latest raw data ..."
DATA_FILE=$(ls -lt $DATA_DIR | awk '{print $9}' | grep -v '^$' | head -1)
if [ ${#DATA_FILE} -lt 1 ]; then
    interesting "No data found. Not populating database."
else
    FULL_FILE_PATH="$PWD/$DATA_DIR/$DATA_FILE"
    interesting "Found file '$FULL_FILE_PATH'"
    info "Populating database ..."
    python script/reset_db.py "$PG_USER" "$FULL_FILE_PATH"
fi

# quit postgres
info "Stopping Postgres ..."
kill $PG_PID

info "Writing NginX config ..."
sudo python script/configure.py "$ENV"

info "Exiting Python virtual environment ..."
deactivate

sleep 1s
good 'All set!'
