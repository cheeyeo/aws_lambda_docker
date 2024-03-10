### AWS Lambda Docker example

Example of using Docker to package, deploy and test Lambda functions.


https://docs.aws.amazon.com/lambda/latest/dg/python-image.html


https://aws.amazon.com/cn/blogs/compute/python-3-12-runtime-now-available-in-aws-lambda/

### Ref

https://github.com/aws-samples/graceful-shutdown-with-aws-lambda/blob/main/python-demo/hello_world/app.py


### Run

```
docker run --platform linux/amd64 -p 9000:8080 docker-image:test
```

To test:
```
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```


### SPA REACT JS

Creating single page react app to interact with the lambda function via apigateway when deployed...


https://medium.com/@diegogauna.developer/creating-a-single-page-app-spa-in-react-using-react-router-db37b89b3f73


https://builtin.com/software-engineering-perspectives/react-api


https://www.digitalocean.com/community/tutorials/react-axios-react


https://axios-http.com/docs/post_example




To create a basic react app:
```
npx create-react-app my-app
```


### Integration with ApiGateway and Lambda

The action for the route that calls Lambda must be set to POST else it will fail with 500 internal error


### AWS CLI lambda commands:

To publish lambda:
```
aws lambda create-function --function-name docker-test --package-type Image --code ImageUri=035663780217.dkr.ecr.eu-west-1.amazonaws.com/lambda-docker-test:latest --role arn:aws:iam::035663780217:role/LambdaExecutionRole --region eu-west-1
```

To update lambda:
```
aws lambda update-function-code --region eu-west-1 --function-name docker-test --image-uri 035663780217.dkr.ecr.eu-west-1.amazonaws.com/lambda-docker-test:latest --publish
```

The response ^ above should show an increase of the lambda version number at the end of the FunctionArn


https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key


### Docker compose rebuild

https://docs.docker.com/compose/file-watch/

docker compose watch can watch lambda file changes locally and rebuild image when detected:
```
docker compose watch
```

tail logs:
```
docker compose logs -f lambda
```

To delete dangling images:
```
docker rmi $(docker images -f "dangling=true" -q)
```



### Forms

https://www.freecodecamp.org/news/how-to-create-forms-in-react-using-react-hook-form/


https://formik.org/docs/tutorial



### Lambda return values

Lambda handler may / may not return a value in the handler:

https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html




If intergrating with APIGateway will need to return a response in the following form specified here:

https://docs.aws.amazon.com/apigateway/latest/developerguide/handle-errors-in-lambda-integration.html


Note that for the proxy for local dev we need to have the same format as above^:
```
{
  "error_msg": "<replaceable>string</replaceable>",
  "error_type": "<replaceable>string</replaceable>",
  "stack_trace": [
    "<replaceable>string</replaceable>",
    ...
  ]
}
```