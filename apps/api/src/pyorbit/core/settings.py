from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="PYORBIT_", env_file=("../../.env", ".env"), extra="ignore"
    )

    environment: str = "development"
    database_url: str = "postgresql+psycopg://pyorbit:pyorbit@localhost:5432/pyorbit"
    cors_origins: list[str] = ["http://localhost:3000"]
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()
