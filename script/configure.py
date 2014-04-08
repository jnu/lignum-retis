'''
Fill in nginx config based on environment. Write the config
to the nginx config root.

Copyright 2014 Joe Nudell
'''

from sys import argv, stderr
from subprocess import call
import os

real_path = os.path.dirname(__file__)
conf_rel = '../conf'
conf_full_path = os.path.join(real_path, conf_rel)
name = 'lignum'


# Define environments here
config = {
    'local': {
        'nginx': {
            'port': 5000,
            'name': '_',
            'root': os.path.join(real_path, '..'),
        },
        'conf_dir': '/usr/local/etc/nginx/sites-available'
    }
}




if __name__ == '__main__':

    conf_template_fn = os.path.join(conf_full_path, 'template.conf')

    with open(conf_template_fn) as fh:
        template = fh.read()

    env = argv[1] if len(argv) > 1 else 'local'

    print >>stderr, "Configuring in environment `%s` ..." % env,

    params = config[env]

    # plug in nginx params
    nginx_conf = template % params['nginx']

    # write config
    conf_path = os.path.join(params['conf_dir'], name)
    with open(conf_path, 'w+') as fh:
        fh.write(nginx_conf)

    print >>stderr, "Done!"

    print >>stderr, "Activating config ...",
    active_path = conf_path.replace('sites-available', 'sites-enabled')
    call('sudo ln -s %s %s' % (conf_path, active_path))
    print >>stderr, "Done!"


