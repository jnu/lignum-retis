#! /usr/bin/env python
#-*-coding:utf8-*-
'''
CGI script - db accessor

Copyright 2014 Joe Nudell
'''

import psycopg2 as pg
import ujson as json
from wood_fields import db_user
from wood_queries import get_basic

from flask import Flask, jsonify


# create app module
app = Flask(__name__)


# define api
@app.route("/api/")
def main():
    # establish connection to db
    conn = pg.connect("dbname=%s user=%s" % (db_user, db_user))
    cur = conn.cursor()

    records = get_basic(cur)

    cur.close()
    conn.close()
    return jsonify(woods=records)




# launch
if __name__ == '__main__':
    app.run()