from sqlalchemy.orm import Session
from api.models import StudyCreate, StudyStatusValues
from api import database
from api.tests.utils import create_random_study, random_string


def test_create_study(db: Session):
    input_study = StudyCreate(
        title="Test study title",
        description="Test study description",
        status=StudyStatusValues.submitted,
        owner="someuser",
        configuration={
            "url": "http://qualtrics",
            "secret": "qualtricssecret"
        }
    )
    db_study = database.create_study(db, input_study)
    assert db_study.title == input_study.title
    assert db_study.description == input_study.description
    assert db_study.status == input_study.status
    assert db_study.configuration == input_study.configuration
    assert db_study.id is not None


def test_get_study(db: Session):
    db_study = create_random_study(db)
    study_id = db_study.id
    queried_study = database.get_study(db, study_id)
    assert queried_study.title == db_study.title


def test_get_studies(db: Session):
    created_study_ids = set()
    for _ in range(10):
        created_study = create_random_study(db)
        created_study_ids.add(created_study.id)
    studies = database.get_studies(db)
    returned_study_ids = set()
    for study in studies:
        returned_study_ids.add(study.id)
    assert created_study_ids <= returned_study_ids


def test_get_studies_with_owner(db: Session):
    random_users = [f"user{random_string(5)}" for _ in range(5)]
    for username in random_users:
        create_random_study(db, username)
    studies = database.get_studies(db, owner=random_users[0])
    assert len(studies) == 1
    assert studies[0].owner == random_users[0]


def test_update_study_status(db: Session):
    db_study = create_random_study(db)
    db_study.status = StudyStatusValues.approved
    updated_study = database.update_study(db, db_study)
    assert updated_study.status == db_study.status
