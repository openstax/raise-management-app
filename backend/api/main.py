from fastapi import FastAPI
from typing import List
from . import models

app = FastAPI(title="OpenStax RAISE Management Application API")


@app.post("/studies", tags=["studies"], response_model=models.StudyResponse)
async def create_study(study: models.StudyCreate):
    pass


@app.get(
    "/studies",
    tags=["studies"],
    response_model=List[models.StudyResponse]
)
async def list_studies():
    pass


@app.put(
    "/studies/{study_id}/status",
    tags=["studies"],
    response_model=models.StudyResponse
)
async def update_study_status(study_id: int, status: models.StudyStatus):
    pass
