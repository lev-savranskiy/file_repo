import json
from flask import Flask, request, jsonify, render_template
from utils.encoders import FileRepoResponseEncoder, FileEncoder, TagEncoder, UserEncoder
from controllers import file_controller, tag_controller, user_controller
from settings import *

app = Flask(__name__)


# Routing
# UI - Index html
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


# UI - Login html
@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


# UI - add file html
@app.route('/addfile', methods=['GET'])
def addfile():
    return render_template('addfile.html')


# UI - edit file html
@app.route('/editfile/<string:id>', methods=['GET'])
def editfile(id):
    return render_template('editfile.html')


# API - get UI config JSON
@app.route('/config', methods=['GET'])
def get_config():
    data = {
            "FILE_TYPES": FILE_TYPES,
            "ENV": ENV,
            "AWS_ACCESS_KEY": AWS_ACCESS_KEY,
            "AWS_SECRET_KEY": AWS_SECRET_KEY,
            "AWS_REGION": AWS_REGION,
            "AWS_BUCKET": AWS_BUCKET
            }
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response


# API - auth endpoint
@app.route('/auth', methods=['POST'])
def auth():
    return '{"name": "Lev" , "role": "admin"}'


# API - get all files endpoint
@app.route('/files', methods=['GET'])
def get_all_files():
    response = file_controller.get_all()

    status_code = 200 if response.is_success else 502
    encoders = {"File": FileEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - search files endpoint
@app.route('/files/search', methods=['POST'])
def search_files():
    request_body = request.json
    response = file_controller.search_files(request_body)

    status_code = 200 if response.is_success else 502
    encoders = {"File": FileEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - create file endpoint
@app.route('/file', methods=['POST'])
def create_file():
    request_body = request.json
    response = file_controller.create_file(request_body)

    # Send 201 if created successfully 502 on error
    status_code = 201 if response.is_success else 502
    encoders = {"File": FileEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - get one file endpoint
@app.route('/file/<string:id>', methods=['GET'])
def get_file(id):
    response = file_controller.get_file(id)

    # Send 200 if found object 204 if object not found 502 if error
    status_code = 200
    if not response.is_success:
        status_code = 502
    elif not response.result:
        status_code = 204

    encoders = {"File": FileEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - create one tag endpoint
@app.route('/tags', methods=['POST'])
def create_tag():
    request_body = request.json
    response = tag_controller.create_tag(request_body)

    # Send 201 if created successfully 502 on error
    status_code = 201 if response.is_success else 502
    encoders = {"Tag": TagEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - get all tags endpoint
@app.route('/tags', methods=['GET'])
def get_all_tags():
    response = tag_controller.get_all()

    status_code = 200 if response.is_success else 502
    encoders = {"Tag": TagEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - delete one tag endpoint
@app.route('/tags/<string:key>', methods=['DELETE'])
def delete_tag(key):
    response = tag_controller.delete_tag(key)

    status_code = 201 if response.is_success else 502
    encoders = {"Tag": TagEncoder}
    return jsonify(json.loads(json.dumps(response, cls=TagEncoder, **encoders))), status_code


# API - create one user endpoint
@app.route('/user', methods=['POST'])
def create_user():
    request_body = request.json
    response = user_controller.create_user(request_body)

    # Send 201 if created successfully 502 on error
    status_code = 201 if response.is_success else 502
    encoders = {"user": UserEncoder}
    return jsonify(json.loads(json.dumps(response, cls=UserEncoder, **encoders))), status_code


# API - get all users endpoint
@app.route('/user', methods=['GET'])
def get_all_users():
    response = user_controller.get_all()

    status_code = 200 if response.is_success else 502
    encoders = {"user": UserEncoder}
    return jsonify(json.loads(json.dumps(response, cls=FileRepoResponseEncoder, **encoders))), status_code


# API - update one user endpoint
@app.route('/user/<string:id>', methods=['PUT'])
def update_user(id):
    response = user_controller.update_user(id)

    status_code = 201 if response.is_success else 502
    encoders = {"user": UserEncoder}
    return jsonify(json.loads(json.dumps(response, cls=UserEncoder, **encoders))), status_code


# API - delete one user endpoint
@app.route('/user/<string:id>', methods=['DELETE'])
def delete_user(id):
    response = user_controller.delete_user(id)

    status_code = 201 if response.is_success else 502
    encoders = {"user": UserEncoder}
    return jsonify(json.loads(json.dumps(response, cls=UserEncoder, **encoders))), status_code


# todo  API - delete one file endpoint
# todo  API - update one file endpoint

if __name__ == '__main__':
    app.run()
