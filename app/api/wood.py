#! /usr/bin/env python
#-*-coding:utf8-*-
'''
CGI script - db accessor

Copyright 2014 Joe Nudell
'''

import psycopg2 as pg
import ujson as json
from wood_fields import db_user
from wood_queries import get_basic, get_index

from flask import Flask, jsonify


# create app module
app = Flask(__name__)

# helper to get wood from db
def get_wood_from_db(idx=None):
    # establish connection to db
    conn = pg.connect("dbname=%s user=%s" % (db_user, db_user))
    cur = conn.cursor()

    records = get_basic(cur, idx) if idx is not None else get_index(cur)

    cur.close()
    conn.close()

    ret = jsonify(woods=records) if type(records) is list else jsonify(records)
    return ret


# define api
@app.route("/api/wood/<idx>")
def get_wood(idx):
    return get_wood_from_db(idx)

@app.route("/api/wood/")
def get_woods():
    return get_wood_from_db(False)

@app.route("/api/index/")
def get_wood_index():
    return get_wood_from_db(None)



# launch
if __name__ == '__main__':
    app.run()