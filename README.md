# OpenStax RAISE Management Application

## Getting started

Install the following in your environment as needed:
* [Docker](https://docs.docker.com/engine/install/)
* [docker-compose](https://docs.docker.com/compose/install/)

To launch a local development environment using the provided `docker-compose.yml`, you first need to set environment variable values that will determine how the application authenticates users. There are two alternatives:

1. Use AWS Cognito user pool resources
    * Users are currently created and initialized using the `aws` CLI
    * The roles associated with a user are configured via Cognito groups and included in the JWT passed back
    * The backend will verify the JWT passed for authentication
2. Use a fake authenticator (for local dev use and CI only)
    * The user password is the same as the username (e.g. test bad credentials with any other value)
    * The roles associated with a user in the fake JWT are determined based upon the username for simplicity / ease of testing (e.g. for an admin user the username should include the string `admin`)
    * The backend will not verify the JWT and blindly consume any claims.

To setup AWS Cognito, configure the following environment variables with appropriate values:

```bash
$ export COGNITO_AWS_REGION=<value>
$ export COGNITO_USER_POOL_ID=<value>
$ export COGNITO_CLIENT_ID=<value>
```

To setup the fake authenticator, set the following environment variable (note that this variable takes precedence over any Cognito settings):

```bash
$ export FAKE_AUTH_MODE=1
```

Once the environment variables are set as desired, the application can be brought up with `docker-compose`:

```bash
$ docker-compose up -d
$ docker-compose exec api alembic upgrade head
```

## Frontend

The frontend UI is implemented using [React](https://reactjs.org/).

### Setup

The following can be used to quickly launch the frontend code. The second step below assumes you are using [nvm](https://nvm.sh/). If that's not the case, replace it with the equivalent for your environment to use the version of `node` in `frontend/.nvmrc`:

```bash
$ cd frontend
$ nvm use
$ npm install
$ npm run dev
```

Note that with the direct invocation above, you should set the same environment variables as outlined in the previous section but with the prefix `VITE_` (e.g. `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` or `VITE_FAKE_AUTH_MODE`).

During development, a full environment can be launched using `docker-compose` (note the use of `FE_DOCKERFILE_EXT` so it uses the `Dockerfile.dev`):

```bash
$ FE_DOCKERFILE_EXT=.dev docker-compose build
$ docker-compose up -d
```

The frontend should pickup code changes with this invocation. Alternatively, if you want to run a local environment using the container used for deployment:

```bash
$ docker-compose build
$ docker-compose up -d
```

The main difference is the deployment container builds the static assets and packages them within an `nginx` container.

The frontend service is exposed at the same [http://localhost:3000/](http://localhost:3000/) endpoint in all three cases above.

### Generating frontend API client code

For convenience, the frontend client code is generated automatically based upon the Swagger data produced by FastAPI using the [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator). These files can be updated as needed when the API is modified (**NOTE:** You will need Java installed):

```bash
$ docker-compose build
$ docker-compose up -d
$ cd frontend
$ npm run gen-client-api
```

### Managing AWS Cognito users

When testing with AWS Cognito user pools during development, you can add users and set passwords using the `aws` CLI:

```bash
$ export USER_POOL_ID=<user_pool_id>
$ export NEW_USER=caleb.dume
$ aws cognito-idp admin-create-user --user-pool-id $USER_POOL_ID --username $NEW_USER
$ aws cognito-idp admin-set-user-password --user-pool-id $USER_POOL_ID --username $NEW_USER --password <password> --permanent
```

Users can be added / removed from groups as well via CLI:

```bash
$ aws cognito-idp admin-add-user-to-group --user-pool-id $USER_POOL_ID --username $NEW_USER --group-name <group>
$ aws cognito-idp admin-remove-user-from-group --user-pool-id $USER_POOL_ID --username $NEW_USER --group-name <group>
$
```

### Running tests

The frontend tests and linting can be run as follows:

```bash
$ cd frontend
$ npm install
$ npm run lint
$ npx playwright install
$ npm test
```

## Backend

The backend API is implemented using [FastAPI](https://fastapi.tiangolo.com).

### API documentation

FastAPI generates API documentation via Swagger and ReDoc. These can be opened in the developer environment using the following links:

* [Swagger](http://localhost:8000/docs)
* [ReDoc](http://localhost:8000/redoc)

### Database migrations

The backend uses [alembic](https://alembic.sqlalchemy.org) to manage database migrations based upon the data schema defined in the code. After updating the schema, you can generate a migration by:

```bash
$ docker-compose exec api alembic revision --autogenerate -m "Message string"
```

### Running tests

Backend tests and linter checks can be run using scripts:

```bash
$ ./backend/scripts/test.sh
$ ./backend/scripts/lint.sh
```

In local environments, the generated HTML coverage report at `./backend/htmlcov/index.html` can be opened to view coverage details.

When writing tests, the docker environment can be used to invoke `pytest` with specific arguments (e.g. to run specific test cases) and for faster iterations:

```bash
$ INSTALL_DEV=true docker-compose build
$ docker-compose up -d
$ docker-compose exec api pytest api/tests/test_foo.py::test_bar
```
