from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any

router = APIRouter(prefix='/sync', tags=['sync'])


class SyncPayload(BaseModel):
    actions: list[dict[str, Any]]


@router.post('')
async def sync_actions(payload: SyncPayload):
    results = []
    for action in payload.actions:
        results.append({'id': action.get('id'), 'status': 'processed'})
    return {'processed': True, 'results': results}
