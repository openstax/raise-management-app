from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from . import models
from . import database
from . import auth

studies_router = APIRouter()


@studies_router.post("/", status_code=201, response_model=models.Study)
async def create_study(
    study: models.StudyCreate,
    db: Session = Depends(database.get_db),
    user: models.UserData = Depends(auth.get_userdata)
):
    # Only expect / allow users with researcher role to create studies
    if (not user.is_researcher):
        raise HTTPException(
            status_code=403, detail="Must be researcher to create study"
        )

    # Set initial study status
    new_study = models.Study(
        **study.dict(),
        status=models.StudyStatusValues.submitted,
        owner=user.username
    )

    return database.create_study(db, new_study)


@studies_router.get("/", response_model=List[models.Study])
async def list_studies(db: Session = Depends(database.get_db)):
    return database.get_studies(db)


@studies_router.put("/{study_id}/status", response_model=models.Study)
async def update_study_status(
    study_id: int,
    status: models.StudyStatus,
    db: Session = Depends(database.get_db)
):
    study = database.get_study(db, study_id)
    if study is None:
        raise HTTPException(status_code=404, detail="Study not found")
    study.status = status.status
    return database.update_study(db, study)
