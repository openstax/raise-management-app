from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException
from starlette.requests import Request
from typing import Optional, List, Dict
from .models import UserData
from jose import jwt, jwk, JWTError
import aiohttp

COGNITO_KEYS_URL_TEMPLATE = \
    "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json"
COGNITO_ISS_TEMPLATE = "https://cognito-idp.{}.amazonaws.com/{}"
COGNITO_USERNAME_CLAIM = "cognito:username"
COGNITO_GROUPS_CLAIM = "cognito:groups"
COGNITO_ADMIN_GROUP = "admin"
COGNITO_RESEARCHER_GROUP = "researcher"


def get_userdata(request: Request) -> UserData:
    return request.state.userdata


class CognitoJWTBearer(HTTPBearer):
    def __init__(
        self,
        aws_region: str,
        user_pool_id: str,
        client_id: str,
        skip_verification: bool = False
    ):
        super().__init__(auto_error=True)
        self.aws_region = aws_region
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.skip_verification = skip_verification
        self.cognito_keys = None

    async def __call__(
        self,
        request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        credentials: HTTPAuthorizationCredentials = \
            await super().__call__(request)

        # Request has expected header and scheme since we enabled auto_error
        # in the parent class. We still need to verify the token unless
        # configured not to (e.g. for local dev / CI environments).
        token = credentials.credentials

        if self.skip_verification:
            token_claims = jwt.get_unverified_claims(token)
        else:
            token_claims = await self.get_verified_claims(token)

        token_type = token_claims.get("token_use")

        if token_type != "id":
            raise HTTPException(
                status_code=403,
                detail=f"Unexpected token type {token_type}"
            )

        # Add user claims data to request state
        username = token_claims.get(COGNITO_USERNAME_CLAIM, "")
        user_groups = token_claims.get(COGNITO_GROUPS_CLAIM, [])

        if (not username) or (not user_groups):
            raise HTTPException(
                status_code=403,
                detail="Token missing required claims"
            )

        request.state.userdata = UserData(
            username=username,
            groups=user_groups,
            is_admin=COGNITO_ADMIN_GROUP in user_groups,
            is_researcher=COGNITO_RESEARCHER_GROUP in user_groups
        )

        return credentials

    async def get_verified_claims(self, token: str) -> Dict:
        try:
            unverified_headers = jwt.get_unverified_headers(token)
        except JWTError as error:
            raise HTTPException(
                status_code=403,
                detail=str(error)
            )
        kid = unverified_headers.get("kid")

        cognito_keys = await self.get_cognito_keys()

        maybeKey = list(filter(lambda k: k["kid"] == kid, cognito_keys))
        if not maybeKey:
            raise HTTPException(
                status_code=403,
                detail="Invalid kid value in token"
            )
        public_key = jwk.construct(maybeKey[0])
        verified_claims = self.verify_token(token, public_key)

        return verified_claims

    def verify_token(self, token: str, public_key) -> Dict:
        expected_issuer = COGNITO_ISS_TEMPLATE.format(
            self.aws_region, self.user_pool_id
        )

        verification_options = {
            'verify_signature': True,
            'verify_aud': True,
            'verify_exp': True,
            'verify_iss': True,
            'require_aud': True,
            'require_exp': True,
            'require_iss': True,
        }

        try:
            verified_claims = jwt.decode(
                token,
                public_key,
                audience=self.client_id,
                issuer=expected_issuer,
                options=verification_options
            )
        except JWTError as error:
            raise HTTPException(
                status_code=403,
                detail=str(error)
            )

        return verified_claims

    async def get_cognito_keys(self) -> List[dict]:
        """Get / cache public keys"""
        if self.cognito_keys:
            return self.cognito_keys

        keys_url = COGNITO_KEYS_URL_TEMPLATE.format(
            self.aws_region,
            self.user_pool_id
        )
        async with aiohttp.ClientSession() as session:
            async with session.get(keys_url) as response:
                data = await response.json()
        self.cognito_keys = data.get("keys", [])

        return self.cognito_keys
