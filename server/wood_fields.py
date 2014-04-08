#-*-coding:utf8-*-
'''
Fields in the table

Copyright 2014 Joe Nudell
'''

db_user = 'lignum'

table_name = 'wood'

LIST_DELIM = '|'

fields = {
    'common_name' : 'varchar[]',
    'scientific_name' : 'varchar[]',
    'distribution' : 'varchar',
    'tree_height_imperial' : 'float8[]',
    'tree_height_metric' : 'float8[]',
    'tree_diameter_imperial' : 'float8[]',
    'tree_diameter_metric' : 'float8[]',
    'average_dried_weight_imperial' : 'float8',
    'average_dried_weight_metric' : 'float8',
    'specific_gravity_basic' : 'float8',
    'specific_gravity_12pct' : 'float8',
    'janka_hardness_imperial' : 'float8',
    'janka_hardness_metric' : 'float8',
    'modulus_of_rupture_imperial' : 'float8',
    'modulus_of_rupture_metric' : 'float8',
    'elastic_modulus_imperial' : 'float8',
    'elastic_modulus_metric' : 'float8',
    'crushing_strength_imperial' : 'float8',
    'crushing_strength_metric' : 'float8',
    'shrinkage_radial' : 'float8',
    'shrinkage_tangential' : 'float8',
    'shrinkage_volumetric' : 'float8',
    'shrinkage_tr_ratio' : 'float8',

    'wood_type' : 'varchar',

    'text_color' : 'varchar',
    'text_grain' : 'varchar',
    'text_endgrain' : 'varchar',
    'text_rot' : 'varchar',
    'text_workability' : 'varchar',
    'text_odor' : 'varchar',
    'text_toxicity' : 'varchar',
    'text_price' : 'varchar',
    'text_sustainability' : 'varchar',
    'text_uses' : 'varchar',
    'text_comments' : 'varchar',
    'text_related' : 'varchar',

    'url_pics' : 'varchar',

    'url' : 'varchar'
}
