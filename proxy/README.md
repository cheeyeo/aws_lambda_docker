### Proxy to Docker Lambda runtime


Trying to access the Lambda functional url via http://localhost:9000/2015-03-31/functions/function/invocations result in segfault via ReactJS

The only way to get it to work for local development is to create a proxy Flask app which calls the lambda endpoint above, parses the results, and return the output to the ReactJS app.

To run from root dir:
```
gunicorn proxyapp:app
```

**Note** This must be run without workers else it will also segfault