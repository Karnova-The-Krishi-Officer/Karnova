from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    MONGO_URI: str
    JWT_SECRET: str
    AI_API_KEY: str
    STORAGE_TYPE: str = 'local'

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), '../../.env')
    )


settings = Settings()
print('MONGO_URI:', settings.MONGO_URI)
