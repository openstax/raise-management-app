import pytest
import time
from typing import Generator, Dict
from fastapi.testclient import TestClient
from jose import jwt, jwk
from aioresponses import aioresponses
from api.main import app
from api.database import SessionLocal
from api.auth import COGNITO_KEYS_URL_TEMPLATE, COGNITO_ISS_TEMPLATE, \
    COGNITO_USERNAME_CLAIM, COGNITO_GROUPS_CLAIM
from api.settings import COGNITO_AWS_REGION, COGNITO_USER_POOL_ID, \
    COGNITO_CLIENT_ID

TEST_HMAC_SECRET = "testsharedsecret"
TEST_HMAC_KID = "fakekid"


@pytest.fixture(scope="session")
def db() -> Generator:
    yield SessionLocal()


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c


@pytest.fixture
def hmac_key():
    return jwk.construct(TEST_HMAC_SECRET, "HS256").to_dict()


@pytest.fixture(autouse=True)
def mock_cognito_keys(hmac_key):
    key_entry = {"kid": TEST_HMAC_KID}
    key_entry.update(hmac_key)
    keys_url = COGNITO_KEYS_URL_TEMPLATE.format(
        COGNITO_AWS_REGION,
        COGNITO_USER_POOL_ID
    )
    keys_data = {
        "keys": [key_entry]
    }

    with aioresponses() as m:
        m.get(keys_url, payload=keys_data)
        yield m


@pytest.fixture
def admin_token_header(hmac_key) -> Dict:
    iss = COGNITO_ISS_TEMPLATE.format(COGNITO_AWS_REGION, COGNITO_USER_POOL_ID)
    headers = {
        "kid": TEST_HMAC_KID,
        "alg": "HS256",
        "typ": "JWT"
    }
    payload = {
        "aud": COGNITO_CLIENT_ID,
        "iss": iss,
        "token_use": "id",
        COGNITO_USERNAME_CLAIM: "adminuser",
        COGNITO_GROUPS_CLAIM: ["admin"],
        "exp": time.time() + 60
    }
    token = jwt.encode(payload, hmac_key, headers=headers)
    return {"Authorization": f"Bearer {token}"}
