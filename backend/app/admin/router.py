from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from ..core.deps import current_user
from ..core.security import hash_password
from ..db.mongo import get_collection

router = APIRouter(prefix='/admin', tags=['admin'])


class CreateOfficerInput(BaseModel):
    name: str
    email: EmailStr
    phone: str
    district: str
    panchayat: str
    password: str


class UpdateRoleInput(BaseModel):
    role: str


@router.get('/health')
async def admin_health():
    return {'status': 'admin ok'}


@router.post('/officers')
async def create_officer(payload: CreateOfficerInput, user=Depends(current_user)):
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Forbidden')

    users = get_collection('users')
    exists = await users.find_one({'identifier': payload.email})
    if exists:
        raise HTTPException(status_code=409, detail='Officer already exists')

    doc = {
        'identifier': payload.email,
        'name': payload.name,
        'phone': payload.phone,
        'district': payload.district,
        'panchayat': payload.panchayat,
        'password': hash_password(payload.password),
        'role': 'officer',
    }
    result = await users.insert_one(doc)
    return {'id': str(result.inserted_id), 'identifier': payload.email, 'role': 'officer'}


@router.patch('/users/{user_id}')
async def update_user_role(user_id: str, payload: UpdateRoleInput, user=Depends(current_user)):
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail='Forbidden')

    if payload.role not in {'farmer', 'officer', 'admin'}:
        raise HTTPException(status_code=400, detail='Invalid role')

    users = get_collection('users')
    await users.update_one({'_id': ObjectId(user_id)}, {'$set': {'role': payload.role}})
    return {'id': user_id, 'role': payload.role}
