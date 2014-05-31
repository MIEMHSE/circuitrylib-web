#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'Sergey Sobko'
__email__ = 'S.Sobko@profitware.ru'
__copyright__ = 'Copyright 2014, The Profitware Group'

import json

from flask import Flask, Response, render_template
from circuitry import self_describe

app = Flask(__name__)

description_json = json.dumps(self_describe(description_type='dict'))

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/description.json')
def describe():
    return Response(description_json, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)
