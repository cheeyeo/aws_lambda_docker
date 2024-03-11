# Example of running a proxy for App.js to prevent SIGSEV when running locally
import json
import os
import logging
import requests
from flask import Flask, current_app, request
from flask_cors import CORS


logger = logging.getLogger()
logger.setLevel("INFO")

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['POST'])
def proxy_request():
    # current_app.logger.info(request.json)
    # current_app.logger.info("TESTING...")
    lambda_url = os.environ.get("LAMBDA_URL", "http://localhost:9000/2015-03-31/functions/function/invocations")

    resp = requests.post(lambda_url, json={"body": request.json})

    res = resp.json()
    current_app.logger.info(res)
    status_code = res.get('statusCode')
    current_app.logger.info(f"STATUS CODE: {status_code}")

    # NOTE: The return code and format is from Flask and is required to allow the reactjs component to pick up the status code and message in event of errors
    if status_code == 200:
        repos = json.loads(res['body'])['repos']

        return {
            'repos': repos
        }, 200
    else:
        current_app.logger.info(res)
        body = json.loads(res['body'])

        return {
            'error_msg': body['error_msg'],
            'stack_trace': body['stack_trace']
        }, status_code