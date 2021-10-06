import random
import string
from sqlalchemy.orm import Session
from api import models, schema, database


def random_string(size: int) -> str:
    return "".join(random.choices(string.ascii_letters, k=size))


def create_random_study(db: Session) -> schema.Study:
    random_study = models.Study(
        title=random_string(16),
        description=random_string(200),
        status=models.StudyStatusValues.submitted,
        configuration={
            "url": f"https://qualtrics/{random_string(8)}",
            "secret": random_string(10)
        }
    )
    return database.create_study(db, random_study)
