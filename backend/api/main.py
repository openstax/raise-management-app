from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .auth import CognitoJWTBearer
from .endpoints import studies_router
from .settings import CORS_ALLOWED_ORIGINS, COGNITO_AWS_REGION, \
    COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, FAKE_AUTH_MODE

# Enable token authentication, but skip verification if configured to do so
cognito_auth = CognitoJWTBearer(
    aws_region=COGNITO_AWS_REGION,
    user_pool_id=COGNITO_USER_POOL_ID,
    client_id=COGNITO_CLIENT_ID,
    skip_verification=FAKE_AUTH_MODE
)

app = FastAPI(
    title="OpenStax RAISE Management Application API",
    dependencies=[Depends(cognito_auth)]
)
app.include_router(studies_router, prefix="/studies", tags=["studies"])

if CORS_ALLOWED_ORIGINS:
    origins = [origin.strip() for origin in CORS_ALLOWED_ORIGINS.split(",")]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
