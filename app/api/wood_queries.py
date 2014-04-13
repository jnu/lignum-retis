#-*-coding:utf8-*-
'''
Helpers for executing common DB queries

Cache a lot of stuff here for performance

Copyright 2014 Joe Nudell
'''

from wood_fields import table_name

##
# -- INDEX ----------------------------------------------------------------- //
##

_index_sql = "SELECT id, common_name FROM %s" % table_name

def get_index(cur):
    cur.execute(_index_sql)
    records = cur.fetchall()
    return [{ 'id': l[0], 'name': l[1] } for l in records]

##
# -- BASIC ----------------------------------------------------------------- //
##

# The fields to show in a basic query
out_basic_fields = {
    'id': 'id',
    'name': 'common_name',
    'height': 'tree_height_imperial',
    'diameter': 'tree_diameter_imperial',
    'dryWeight': 'average_dried_weight_imperial',
    'gravityBasic': 'specific_gravity_basic',
    'gravity12': 'specific_gravity_12pct',
    'janka': 'janka_hardness_imperial',
    'rupture': 'modulus_of_rupture_imperial',
    'elastic': 'elastic_modulus_imperial',
    'crush': 'crushing_strength_imperial',
    'shrinkRadial': 'shrinkage_radial',
    'shrinkTangential': 'shrinkage_tangential',
    'shrinkVolumetric': 'shrinkage_volumetric',
    'shrinkTr': 'shrinkage_tr_ratio',
    'type': 'wood_type'
}
_out_basic_outnames = out_basic_fields.keys()
_out_basic_intnames = out_basic_fields.values()
_out_basic_sql = "SELECT %s FROM %s" % (
    ','.join(_out_basic_intnames),
    table_name
)
_out_basic_one_sql = _out_basic_sql + " WHERE id=%s"



# execute basic query (some info about all woods in DB)
def get_basic(cur, idx):
    if idx:
        sql = _out_basic_one_sql % idx
    else:
        sql = _out_basic_sql
    cur.execute(sql)
    records = cur.fetchall()
    lst = []
    for r in records:
        d = dict([[_out_basic_outnames[i], k] for i, k in enumerate(r)])
        lst.append(d)
    return lst if not idx else lst[0]
