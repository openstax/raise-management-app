from fastapi import FastAPI
from .endpoints import studies_router

app = FastAPI(title="OpenStax RAISE Management Application API")
app.include_router(studies_router, prefix="/studies", tags=["studies"])
