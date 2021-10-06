from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from api.tests.utils import create_random_study


def study_generator(name: str) -> dict:
    return


def test_post_studies(client: TestClient):
    data = {
        "title": "Test study title",
        "description": "Test study description",
        "configuration": {
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    }
    response = client.post("/studies/", json=data)

    assert response.status_code == 201
    content = response.json()
    assert "id" in content
    assert "status" in content
    assert content["status"] == "SUBMITTED"
    del content["id"]
    del content["status"]
    assert content == data


def test_get_studies(client: TestClient, db: Session):
    expected_study_ids = set()
    for _ in range(10):
        study = create_random_study(db)
        expected_study_ids.add(study.id)
    response = client.get("/studies")

    assert response.status_code == 200
    studies = response.json()
    returned_study_ids = set()
    for study in studies:
        returned_study_ids.add(study["id"])
    assert expected_study_ids <= returned_study_ids


def test_put_studies_status(client: TestClient, db: Session):
    study = create_random_study(db)
    data = {
        "status": "DENIED"
    }
    response = client.put(f"/studies/{study.id}/status", json=data)

    assert response.status_code == 200
    content = response.json()
    assert content["status"] == "DENIED"


def test_put_studies_status_404(client: TestClient):
    data = {
        "status": "DENIED"
    }
    response = client.put("/studies/9999999999/status", json=data)
    assert response.status_code == 404
    content = response.json()
    assert content == {
        "detail": "Study not found"
    }
