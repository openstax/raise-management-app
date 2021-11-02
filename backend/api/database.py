from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from .settings import SQLALCHEMY_DATABASE_URL
from . import models, schema

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_studies(
    db: Session,
    owner: Optional[str] = None
) -> List[schema.Study]:
    if owner:
        return db.query(schema.Study).filter(schema.Study.owner == owner).all()
    else:
        return db.query(schema.Study).all()


def get_study(db: Session, study_id: int) -> Optional[schema.Study]:
    return db.query(schema.Study).filter(schema.Study.id == study_id).first()


def create_study(db: Session, study: models.StudyCreate) -> schema.Study:
    db_study = schema.Study(**jsonable_encoder(study))
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    return db_study


def update_study(db: Session, study: schema.Study) -> schema.Study:
    db.merge(study)
    db.commit()
    return study
