from typing import Dict
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from api.tests.utils import create_random_study


def study_generator(name: str) -> dict:
    return


def test_post_studies_researcher(
    client: TestClient, researcher_token_header: Dict
):
    data = {
        "title": "Test study title",
        "description": "Test study description",
        "configuration": {
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    }
    response = client.post(
        "/studies/", headers=researcher_token_header, json=data
    )
    assert response.status_code == 201
    content = response.json()
    assert "id" in content
    assert "status" in content
    assert content["status"] == "SUBMITTED"
    del content["id"]
    del content["status"]
    assert content == data


def test_post_studies_admin(
    client: TestClient, admin_token_header: Dict
):
    data = {
        "title": "Test study title",
        "description": "Test study description",
        "configuration": {
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    }
    response = client.post("/studies/", headers=admin_token_header, json=data)
    assert response.status_code == 403


def test_get_studies(
    client: TestClient, db: Session, admin_token_header: Dict
):
    expected_study_ids = set()
    for _ in range(10):
        study = create_random_study(db)
        expected_study_ids.add(study.id)
    response = client.get("/studies", headers=admin_token_header)

    assert response.status_code == 200
    studies = response.json()
    returned_study_ids = set()
    for study in studies:
        returned_study_ids.add(study["id"])
    assert expected_study_ids <= returned_study_ids


def test_put_studies_status(
    client: TestClient, db: Session, admin_token_header: Dict
):
    study = create_random_study(db)
    data = {
        "status": "DENIED"
    }
    response = client.put(
        f"/studies/{study.id}/status",
        headers=admin_token_header,
        json=data
    )

    assert response.status_code == 200
    content = response.json()
    assert content["status"] == "DENIED"


def test_put_studies_status_404(client: TestClient, admin_token_header: Dict):
    data = {
        "status": "DENIED"
    }
    response = client.put(
        "/studies/9999999999/status",
        headers=admin_token_header,
        json=data
    )
    assert response.status_code == 404
    content = response.json()
    assert content == {
        "detail": "Study not found"
    }
