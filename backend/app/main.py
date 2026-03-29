from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .auth.router import router as auth_router
from .users.router import router as users_router
from .admin.router import router as admin_router
from .officer.router import router as officer_router
from .farmer.router import router as farmer_router
from .ai.router import router as ai_router
from .sync.router import router as sync_router

app = FastAPI(title='Karnova API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(admin_router)
app.include_router(officer_router)
app.include_router(farmer_router)
app.include_router(ai_router)
app.include_router(sync_router)

UPLOAD_DIR = Path('backend/uploads')
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount('/uploads', StaticFiles(directory=str(UPLOAD_DIR)), name='uploads')


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.post('/farmer/upload')
async def upload(file: UploadFile = File(...)):
    destination = UPLOAD_DIR / file.filename
    content = await file.read()
    destination.write_bytes(content)
    return {'path': f'/uploads/{file.filename}'}
