#!/bin/bash
# Setup script for wood app
# WARNING - Will delete and reload anything in Postgres
#
# Copyright 2014 Joe Nudell. All rights reserved.

ROOT="lignum-retis"
PG_USER="lignum"
PG_PASS="password"
DATA_DIR="raw"

echo "Navigating to root ..."
# go up directory tree until root is found
cwd=${PWD##*/}
LAST=
while [[ "$ROOT" -ne "$cwd" ]]; do
    LAST=$cwd
    cd ..
    cwd=${PWD##*/}

    if [[ "$LAST" -eq "$cwd" ]]; then
        echo "Can't find root. Try running from root or script directory."
        exit 1
    fi
done

echo "Checking dependencies ..."
command -v postgres >/dev/null 2>&1 || brew install postgres
command -v ./ENV/bin/python2.7 >/dev/null 2>&1 || easy_install virtualenv && virtualenv ENV

# install JS dependencies
npm install -g grunt grunt-cli nodemon
npm install

# install python dependencies (in virtual environment)
source ENV/bin/activate

pip install -r requirements.txt

# set up postgres
echo "(Re)initializing postgres ..."
rm -r data; mkdir data && cd data

echo "Creating new database ..."
initdb . --locale=en_US.UTF-8 --encoding=UNICODE

# replace default cfgs with checked-in versions
git show origin/master:data/postgresql.conf > postgresql.conf
git show origin/master:data/pg_hba.conf > pg_hba.conf


# start postgres in background
postgres -D . &
PG_PID=$!

echo "Waiting for postgres to start ... "
file=/tmp/.s.PGSQL.5432
while : ; do
    [ -e "$file" ] && break
    sleep 1s
    echo "still waitin' ..."
done

createdb $PG_USER

psql -d $PG_USER -c "CREATE ROLE $PG_USER PASSWORD '$PG_PASS' NOSUPERUSER NOCREATEDB NOCREATEROLE INHERIT LOGIN;"

cd ..

# populate db
echo "Finding latest raw data ..."
DATA_FILE=$(ls -lt $DATA_DIR | awk '{print $9}' | grep -v '^$' | head -1)
if [ ${#DATA_FILE} -lt 1 ]; then
    echo "No data found. Not populating database."
else
    echo "Found file '$DATA_FILE'"
    echo "Populating database ..."
    python script/reset_db.py "$PWD/$DATA_DIR/$DATA_FILE"
fi

# clean up
kill $PG_PID
deactivate

echo "All set!"
