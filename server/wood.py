#! /usr/bin/env python
#-*-coding:utf8-*-
'''
CGI script - db accessor

Copyright 2014 Joe Nudell
'''

# import cgi
# import cgitb; cgitb.enable()

# import psycopg2 as pg
# import ujson as json
# from wood_fields import db_user
# from wood_queries import get_basic


# # get URL params
# params = cgi.FieldStorage()
# body = {}


# # establish connection to db
# conn = pg.connect("dbname=%s user=%s" % (db_user, db_user))
# cur = conn.cursor()


# # basic query - no params
# if len(params) == 0:
#     body = get_basic(cur)


# # output
# # format header
# print "Content-Type: application/json"
# print ""

# print json.dumps(body)


from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello flask!"


if __name__ == '__main__':
    app.run()