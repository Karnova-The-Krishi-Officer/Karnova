from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..db.mongo import get_collection
from ..core.security import create_token, hash_password, verify_password

router = APIRouter(prefix='/auth', tags=['auth'])

DEFAULT_ADMIN_IDENTIFIER = 'Pravith1p93@gmail.com'
DEFAULT_ADMIN_PASSWORD = 'admin12345'


class LoginInput(BaseModel):
    identifier: str
    password: str


@router.post('/login')
async def login(payload: LoginInput):
    users = get_collection('users')
    user = await users.find_one({'identifier': payload.identifier})

    if not user and payload.identifier == DEFAULT_ADMIN_IDENTIFIER:
        seed = {
            'identifier': DEFAULT_ADMIN_IDENTIFIER,
            'password': hash_password(DEFAULT_ADMIN_PASSWORD),
            'name': 'Default Admin',
            'role': 'admin',
        }
        await users.insert_one(seed)
        user = seed

    if not user:
        raise HTTPException(status_code=401, detail='Invalid credentials')

    if not verify_password(payload.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    token = create_token(str(user.get('_id', 'local-admin')), user['role'])
    return {'token': token, 'user': {'name': user['name'], 'role': user['role']}}
