from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends, Header, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from pyorbit.core.security import (
    SESSION_COOKIE_NAME,
    SESSION_TOKEN_LENGTH,
    hash_session_token,
)
from pyorbit.core.settings import Settings, get_settings
from pyorbit.db.session import get_session
from pyorbit.models.auth_session import AuthSession
from pyorbit.models.user import User

DatabaseSession = Annotated[Session, Depends(get_session)]
AppSettings = Annotated[Settings, Depends(get_settings)]


def require_csrf_protection(
    request: Request,
    settings: AppSettings,
    csrf_header: Annotated[
        str | None,
        Header(alias="X-CSRF-Protection"),
    ] = None,
) -> None:
    origin = request.headers.get("origin")

    if origin not in settings.cors_origins or csrf_header != "1":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Request origin or CSRF header is invalid",
        )


def get_current_session(
    request: Request,
    db: DatabaseSession,
) -> AuthSession:
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if token is None or len(token) != SESSION_TOKEN_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    auth_session = db.scalar(
        select(AuthSession).where(
            AuthSession.token_hash == hash_session_token(token),
            AuthSession.expires_at > datetime.now(UTC),
        )
    )

    if auth_session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    return auth_session


CurrentSession = Annotated[AuthSession, Depends(get_current_session)]


def get_current_user(
    auth_session: CurrentSession,
    db: DatabaseSession,
) -> User:
    user = db.get(User, auth_session.user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
