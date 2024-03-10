import json
import logging
import signal
import time
import sys
import traceback
import requests
from requests.exceptions import HTTPError


logger = logging.getLogger()
logger.setLevel("INFO")


def handler(event, context):
    logger.info(event)
    logger.info(context)
    # Lambda function that returns top python github repos based on desc order of stars

    body = event.get('body', {})
    if body and (isinstance(body, str)):
        body = json.loads(body)

    num_of_repos = body.get("per_page", 10)
    order = body.get("order", "desc")
    query = body.get("query", "language:python")
    sort = body.get("sort", "stars")

    try:
        resp = requests.get(
            'https://api.github.com/search/repositories',
            params={
                "q": query,
                "sort": sort, 
                "order": order,
                "per_page": int(num_of_repos)
            },
            headers={"Accept": "application/vnd.github+json"}
        )

        resp.raise_for_status()
    except HTTPError as http_err:
        logger.error(f'HTTP ERROR OCCURED: {http_err}')
        stack_trace = repr(traceback.format_exception(http_err))

        return {
            "isBase64Encoded": False,
            "statusCode": http_err.response.status_code,
            "body": json.dumps({"error_msg": str(http_err), "stack_trace": stack_trace}),
            "headers": {
                "X-Amzn-ErrorType": f"{type(http_err).__name__}"
            }
        }
    except Exception as err:
        logger.error(f'Other error occured: {err}')
        stack_trace = repr(traceback.format_exception(err))

        return {
            "isBase64Encoded": False,
            "statusCode": resp.status_code,
            "body": json.dumps({"error_msg": str(err), "stack_trace": stack_trace}),
            "headers": {
                "X-Amzn-ErrorType": f"{type(err).__name__}"
            }
        }

    json_resp = resp.json()
    popular_repos = json_resp['items']

    response = []
    for repo in popular_repos:
        # logger.info(f"REPO: {repo}")

        response.append({
            'name': repo['name'],
            'full_name': repo['full_name'],
            'url': repo['html_url'],
            'description': repo['description'],
            'stars': repo['stargazers_count']
        })

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "body": json.dumps({"repos": response}),
        "headers": {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }