from collections.abc import Generator
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from pyorbit.core.settings import get_settings


@lru_cache
def get_session_factory() -> sessionmaker[Session]:
    engine = create_engine(get_settings().database_url, pool_pre_ping=True)
    return sessionmaker(engine, autoflush=False)


def get_session() -> Generator[Session]:
    with get_session_factory()() as session:
        yield session
