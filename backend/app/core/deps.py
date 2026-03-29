from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from .config import settings

security = HTTPBearer(auto_error=False)


async def current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail='Missing token')
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=['HS256'])
        return {'id': payload['sub'], 'role': payload['role']}
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid token')
