from fastapi import APIRouter

router = APIRouter(prefix='/farmer', tags=['farmer'])


@router.get('/schemes')
async def schemes():
    return [
        {'id': 's1', 'name': 'PM-KISAN', 'eligibility': 'All small farmers'},
        {'id': 's2', 'name': 'Soil Health', 'eligibility': 'Registered landholders'},
    ]
