# basic flask server for serving up the web interface

from distutils.log import debug
import flask

app = flask.Flask(__name__)

# serve up the index page without template
@app.route('/')
def index():
    return flask.send_from_directory('', 'index.html')

# serve up the static files
@app.route('/<path:path>')
def static_file(path):
    return flask.send_from_directory('', path)

app.run(debug=True)