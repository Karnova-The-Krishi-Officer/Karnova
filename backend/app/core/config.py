from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_uri: str = Field(alias='MONGO_URI')
    jwt_secret: str = Field(alias='JWT_SECRET')
    ai_api_key: str = Field(alias='AI_API_KEY')
    storage_type: str = Field(default='local', alias='STORAGE_TYPE')

    class Config:
        env_file = 'backend/.env'


settings = Settings()
