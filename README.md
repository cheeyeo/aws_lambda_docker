### AWS Lambda Docker example

Example of using Docker to package, deploy and test Lambda functions.

This project builds a webapp using ReactJS that calls a APIGateway resource which has a Lambda integration on the attached routes.


### Running locally

To run locally, the following pre-requisites are required:

* node v20.11.1
* docker 25.0.4
* docker-compose v2.24.7
* python 3.12.2

To start the lambda and proxy services, run `docker compose watch` in the top directory.

To start the webapp, navigate to `webapp` and run `yarn start`

Access the app via http://localhost:3000

### Deployment

For deploying to AWS:

* Create / use an ECR repository for the lambda

* Build, tag and push the lambda image
  ```
  export AWS_PROFILE=XXX

  aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin XXXX.dkr.ecr.eu-west-1.amazonaws.com
  
  docker build -t docker-image:test -f deploy/lambda.dockerfile .
  
  docker tag docker-image:test XXXX.dkr.ecr.eu-west-1.amazonaws.com/lambda-docker-test:latest
  ```

* Create the lambda function:
  ```
  aws lambda create-function \
    --function-name docker-test \
    --package-type Image \
    --code ImageUri=XXXX.dkr.ecr.eu-west-1.amazonaws.com/lambda-docker-test:latest \
    --role arn:aws:iam::XXXX:role/LambdaExecutionRole \
    --region eu-west-1
  ```

* To update the lambda function:
  ```
  aws lambda update-function-code \
    --region eu-west-1 \
    --function-name docker-test \
    --image-uri XXXX.dkr.ecr.eu-west-1.amazonaws.com/lambda-docker-test:latest \
    --publish
  ```

* Create a APIGateway resource in the required region. Create a route with POST action with a Lambda integration referencing the above lambda function


### TODO:

* Add cloudformation template for creating the above resources ?
