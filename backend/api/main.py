from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import studies_router
from .settings import CORS_ALLOWED_ORIGINS

app = FastAPI(title="OpenStax RAISE Management Application API")
app.include_router(studies_router, prefix="/studies", tags=["studies"])

if CORS_ALLOWED_ORIGINS:
    origins = [origin.strip() for origin in CORS_ALLOWED_ORIGINS.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
