from fastapi import APIRouter
from pydantic import BaseModel
from ..core.config import settings

router = APIRouter(prefix='/ai', tags=['ai'])


class QueryInput(BaseModel):
    text: str
    type: str = 'text'


@router.post('/query')
async def ai_query(payload: QueryInput):
    if not settings.ai_api_key or settings.ai_api_key == 'placeholder_key':
        return {'answer': f"[Mock AI] For '{payload.text}', monitor soil moisture and use balanced fertilizer."}
    return {'answer': f"AI processed: {payload.text}"}
