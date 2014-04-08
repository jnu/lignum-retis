#-*-coding:utf8-*-
'''
Populate postgres with the given JSON file

$ python reset_db.py <pg_user> <records.json>

Copyright 2014 Joe Nudell
'''

import ujson as json
import psycopg2 as pg
import os
import sys
from pprint import pprint

# put API module in path
real_path = os.path.dirname(__file__)
api_rel = '../api'
api_full_path = os.path.join(real_path, api_rel)
sys.path.append(api_full_path)

from wood_fields import table_name, fields, LIST_DELIM



# SQL for creating the table
sql_create = '''
CREATE TABLE %s
(
    id serial PRIMARY KEY,
    %s
);
''' % (
    table_name,
    ','.join([
        '%s %s' % (k, v) for k, v in fields.items()
    ])
)

# SQL for dropping
sql_drop = '''
DROP TABLE IF EXISTS %s
''' % table_name

sql_insert = '''
INSERT INTO %s (%%s)
VALUES (%%s)
''' % table_name

def drop(cur):
    cur.execute(sql_drop)

def create(cur):
    cur.execute(sql_create)

def insert(cur, d):
    keys = d.keys()
    vals = d.values()

    base_sql = "INSERT INTO %s (%s) VALUES (%s)" % (
        table_name,
        ','.join(keys),
        ','.join(['%s'] * len(vals))
    )

    print >>sys.stderr, pprint(d)

    sql = cur.mogrify(base_sql, vals)

    cur.execute(sql)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print >>sys.stderr, __doc__
        sys.exit(1)

    print >>sys.stderr, "Reading in records ..."
    with open(sys.argv[2]) as fh:
        text = fh.read()
        records = json.loads(text)

    # connect to postgres
    print >>sys.stderr, "Connecting to database ..."
    conn = pg.connect("dbname=%s user=%s" % (sys.argv[1], sys.argv[1]))
    cur = conn.cursor()

    print >>sys.stderr, "Destroying any old tables ..."
    drop(cur)
    print >>sys.stderr, "Creating new tables ..."
    create(cur)

    print >>sys.stderr, "Adding records to database ..."
    for record in records:
        insert(cur, record)

    # persist & close
    print >>sys.stderr, "Closing connections"
    conn.commit()
    cur.close()
    conn.close()
