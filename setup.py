#!/usr/bin/env python

from setuptools import setup
import json
from pkg_resources import resource_string
package_json = resource_string('jupyter_skeleton', 'package.json')
npm_package = json.loads(package_json.decode('ascii'))
setup(
      name=npm_package['name'],
      version=npm_package['version'],
      description=npm_package['description'],
      author=npm_package['author'],
      author_email='antti.kaihola@eniram.fi',
      url=npm_package['repository']['url'],
      packages=['jupyter_skeleton'],
      package_data={'jupyter_skeleton': ['package.json',
                                         'amd/index.js']},
)