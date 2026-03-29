from fastapi import APIRouter, Depends
from ..core.deps import current_user
from ..db.mongo import get_collection

router = APIRouter(prefix='/users', tags=['users'])


@router.get('/')
async def list_users(user=Depends(current_user)):
    if user['role'] != 'admin':
        return []
    users = await get_collection('users').find({}, {'password': 0}).to_list(length=100)
    for u in users:
        u['_id'] = str(u['_id'])
    return users
