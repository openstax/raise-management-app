import pytest
from typing import Generator
from fastapi.testclient import TestClient
from api.main import app
from api.database import SessionLocal


@pytest.fixture(scope="session")
def db() -> Generator:
    yield SessionLocal()


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c
