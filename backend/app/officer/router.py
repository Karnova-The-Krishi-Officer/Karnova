from fastapi import APIRouter

router = APIRouter(prefix='/officer', tags=['officer'])


@router.get('/escalations')
async def escalations():
    return [{'id': 'esc-1', 'query': 'Pest outbreak', 'status': 'open'}]
