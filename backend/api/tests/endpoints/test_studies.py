from typing import Dict, Callable
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from api.tests.utils import create_random_study, random_string


def study_generator(name: str) -> dict:
    return


def test_post_studies_researcher(
    client: TestClient,
    researcher_header_factory: Callable[[str], Dict]
):
    data = {
        "title": "Test study title",
        "description": "Test study description",
        "configuration": {
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    }
    auth_header = researcher_header_factory("researcheruser")
    response = client.post("/studies/", headers=auth_header, json=data)
    assert response.status_code == 201
    content = response.json()
    assert "id" in content
    assert "status" in content
    assert content["status"] == "SUBMITTED"
    assert content["owner"] == "researcheruser"
    del content["id"]
    del content["status"]
    del content["owner"]
    assert content == data


def test_post_studies_admin(
    client: TestClient, admin_header_factory: Callable[[str], Dict]
):
    data = {
        "title": "Test study title",
        "description": "Test study description",
        "configuration": {
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    }
    auth_header = admin_header_factory("adminuser")
    response = client.post("/studies/", headers=auth_header, json=data)
    assert response.status_code == 403


def test_get_studies_admin(
    client: TestClient,
    db: Session,
    admin_header_factory: Callable[[str], Dict]
):
    expected_study_ids = set()
    for _ in range(10):
        study = create_random_study(db)
        expected_study_ids.add(study.id)
    auth_header = admin_header_factory("adminuser")
    response = client.get("/studies", headers=auth_header)

    assert response.status_code == 200
    studies = response.json()
    returned_study_ids = set()
    for study in studies:
        returned_study_ids.add(study["id"])
    assert expected_study_ids <= returned_study_ids


def test_get_studies_researcher(
    client: TestClient,
    db: Session,
    researcher_header_factory: Callable[[str], Dict]
):
    random_users = [f"researcher{random_string(5)}" for _ in range(5)]
    for username in random_users:
        create_random_study(db, username)
    auth_header = researcher_header_factory(random_users[0])
    response = client.get("/studies", headers=auth_header)

    assert response.status_code == 200
    studies = response.json()
    assert len(studies) == 1
    assert studies[0]["owner"] == random_users[0]


def test_put_studies_status_admin(
    client: TestClient,
    db: Session,
    admin_header_factory: Callable[[str], Dict]
):
    study = create_random_study(db)
    data = {
        "status": "DENIED"
    }
    response = client.put(
        f"/studies/{study.id}/status",
        headers=admin_header_factory("adminuser"),
        json=data
    )

    assert response.status_code == 200
    content = response.json()
    assert content["status"] == "DENIED"


def test_put_studies_status_researcher(
    client: TestClient,
    db: Session,
    researcher_header_factory: Callable[[str], Dict]
):
    study = create_random_study(db)
    data = {
        "status": "APPROVED"
    }
    response = client.put(
        f"/studies/{study.id}/status",
        headers=researcher_header_factory("researchuser"),
        json=data
    )

    assert response.status_code == 403


def test_put_studies_status_404(
    client: TestClient, admin_header_factory: Callable[[str], Dict]
):
    data = {
        "status": "DENIED"
    }
    response = client.put(
        "/studies/9999999999/status",
        headers=admin_header_factory("adminuser"),
        json=data
    )
    assert response.status_code == 404
    content = response.json()
    assert content == {
        "detail": "Study not found"
    }
