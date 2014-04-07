#-*-coding:utf8-*-
'''
Populate postgres with the given JSON file

$ python reset_db.py <pg_user> <records.json>

Copyright 2014 Joe Nudell
'''

import json
import psycopg2 as pg
from sys import argv, stderr, exit

db_name = 'wood'
fields = {
    'common_name' : 'varchar',
    'scientific_name': 'varchar'
}
LIST_DELIM = '|'

# SQL for creating the table
sql_create = '''
CREATE TABLE %s
(
    id serial PRIMARY_KEY,
    %s
);
''' % (
    db_name,
    ','.join([
        '%s %s' % (k, v) for k, v in fields.items()
    ])
)

# SQL for dropping
sql_drop = '''
DROP TABLE IF EXISTS %s
''' % db_name

def drop(cur):
    cur.execute(sql_drop)

def create(cur):
    cur.execute(sql_create)


# def clean(k, v):
#     if type(v) is list:
#         v = LIST_DELIM.join(v)
#     return '%s %s' % (k, v)


if __name__ == '__main__':
    if len(argv) != 3:
        print >>stderr, __doc__
        exit(1)

    print >>stderr, "Reading in records ..."
    with open(argv[2]) as fh:
        text = fh.read()
        records = json.loads(text)

    # connect to postgres
    print >>stderr, "Connecting to database ..."
    conn = pg.connect("dbname=%s user=%s" % (argv[1], argv[1]))
    cur = conn.cursor()

    print >>stderr, "Destroying any old tables ..."
    drop(cur)
    print >>stderr, "Creating new tables ..."
    create(cur)

    # persist & close
    print >>stderr, "Closing connections"
    conn.commit()
    cur.close()
    conn.close()
