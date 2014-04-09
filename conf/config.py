'''
Custom environment settings for dev and deploy

Copyright 2014 Joe Nudell
'''

import os

__script_dir = os.path.dirname(os.path.abspath(__file__))
__rel_root = os.path.join(__script_dir, '..')
__abs_root = os.path.abspath(__rel_root)

# these might be useful ...
app_root = os.path.join(__abs_root, 'app')
assets_root = os.path.join(__abs_root, 'build')

name = 'lignum'

# Define environments here
config = {
    'local': {
        'nginx': {
            'port': 5000,
            'name': '_',
            'root': app_root,
            'assetsRoot': assets_root
        },
        'conf_dir': '/usr/local/etc/nginx/sites-available'
    }
}