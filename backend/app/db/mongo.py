from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client.get_default_database()


def get_collection(name: str):
    return db[name]
