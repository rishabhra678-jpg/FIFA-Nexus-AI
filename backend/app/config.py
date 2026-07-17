import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FIFA Nexus AI"
    API_V1_STR: str = "/api/v1"
    
    # OpenAI API configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS Origins (allow all in development/hackathon environment)
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        case_sensitive = True

settings = Settings()
