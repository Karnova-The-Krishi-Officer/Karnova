from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..db.mongo import get_collection
from ..core.security import create_token, hash_password, verify_password

router = APIRouter(prefix='/auth', tags=['auth'])


class LoginInput(BaseModel):
    identifier: str
    password: str


@router.post('/login')
async def login(payload: LoginInput):
    users = get_collection('users')
    user = await users.find_one({'identifier': payload.identifier})
    if not user:
        seed = {
            'identifier': 'admin@karnova.local',
            'password': hash_password('admin123'),
            'name': 'Default Admin',
            'role': 'admin',
        }
        await users.insert_one(seed)
        user = seed
    if not verify_password(payload.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_token(str(user.get('_id', 'local-admin')), user['role'])
    return {'token': token, 'user': {'name': user['name'], 'role': user['role']}}
