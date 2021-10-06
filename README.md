# OpenStax RAISE Management Application

## Getting started

Install the following in your environment as needed:
* [Docker](https://docs.docker.com/engine/install/)
* [docker-compose](https://docs.docker.com/compose/install/)

To launch a local development environment using the provided `docker-compose.yml`:

```bash
$ docker-compose up -d
$ docker-compose exec api alembic upgrade head
```

## Frontend

Coming soon...

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
$ ./backend/script/lint.sh
```

In local environments, the generated HTML coverage report at `./backend/htmlcov/index.html` can be opened to view coverage details.

When writing tests, the docker environment can be used to invoke `pytest` with specific arguments (e.g. to run specific test cases) and for faster iterations:

```bash
$ INSTALL_DEV=true docker-compose build
$ docker-compose up -d
$ docker-compose exec api pytest api/tests/test_foo.py::test_bar
```
