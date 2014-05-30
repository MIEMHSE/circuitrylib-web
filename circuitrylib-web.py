import json

from flask import Flask, Response, render_template
from circuitry import self_describe

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/describe/')
def describe():
    description_json = json.dumps(self_describe(description_type='dict'))
    return Response(description_json, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)
