import random
import string
from typing import Optional
from sqlalchemy.orm import Session
from api import models, schema, database


def random_string(size: int) -> str:
    return "".join(random.choices(string.ascii_letters, k=size))


def create_random_study(
    db: Session,
    username: Optional[str] = None
) -> schema.Study:
    owner = username or random_string(10)
    random_study = models.StudyCreate(
        title=random_string(16),
        description=random_string(200),
        status=models.StudyStatusValues.submitted,
        owner=owner,
        configuration={
            "url": f"https://qualtrics/{random_string(8)}",
            "secret": random_string(10)
        }
    )
    return database.create_study(db, random_study)
