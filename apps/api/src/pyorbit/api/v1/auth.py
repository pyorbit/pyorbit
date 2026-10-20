from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError

from pyorbit.api.dependencies import (
	AppSettings,
	CurrentSession,
	CurrentUser,
	DatabaseSession,
	require_csrf_protection,
)
from pyorbit.core.security import (
	DUMMY_PASSWORD_HASH,
	SESSION_COOKIE_NAME,
	SESSION_TOKEN_LENGTH,
	create_session_token,
	hash_password,
	hash_session_token,
	verify_password,
)
from pyorbit.models.auth_session import AuthSession
from pyorbit.models.user import User
from pyorbit.schemas.auth import LoginRequest, RegisterRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
	"/register",
	response_model=UserResponse,
	status_code=status.HTTP_201_CREATED,
	dependencies=[Depends(require_csrf_protection)],
)
def register(
	payload: RegisterRequest,
	response: Response,
	db: DatabaseSession,
) -> User:
	email = str(payload.email)
	user = User(
		email=email,
		password_hash=hash_password(payload.password),
	)

	db.add(user)

	try:
		db.commit()
	except IntegrityError:
		db.rollback()

		existing_user = db.scalar(
			select(User).where(func.lower(User.email) == email)
		)

		if existing_user is not None:
			raise HTTPException(
				status_code=status.HTTP_409_CONFLICT,
				detail="Email is already registered",
			) from None

		raise

	db.refresh(user)
	response.headers["Cache-Control"] = "no-store"
	return user


@router.post(
	"/login",
	response_model=UserResponse,
	dependencies=[Depends(require_csrf_protection)],
)
def login(
	payload: LoginRequest,
	request: Request,
	response: Response,
	db: DatabaseSession,
	settings: AppSettings,
) -> User:
	user = db.scalar(
		select(User).where(
			func.lower(User.email) == str(payload.email)
		)
	)

	stored_hash = (
		user.password_hash
		if user is not None and user.password_hash is not None
		else DUMMY_PASSWORD_HASH
	)
	password_is_valid = verify_password(
		payload.password,
		stored_hash,
	)

	if user is None or user.password_hash is None or not password_is_valid:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)

	previous_token = request.cookies.get(SESSION_COOKIE_NAME)

	if previous_token is not None and len(previous_token) == SESSION_TOKEN_LENGTH:
		db.execute(
			delete(AuthSession).where(
				AuthSession.token_hash == hash_session_token(previous_token)
			)
		)

	token = create_session_token()
	expires_at = datetime.now(UTC) + timedelta(
		seconds=settings.session_ttl_seconds
	)

	db.add(
		AuthSession(
			token_hash=hash_session_token(token),
			user_id=user.id,
			expires_at=expires_at,
		)
	)
	db.commit()

	response.set_cookie(
		key=SESSION_COOKIE_NAME,
		value=token,
		max_age=settings.session_ttl_seconds,
		path="/",
		secure=settings.session_cookie_secure,
		httponly=True,
		samesite="lax",
	)
	response.headers["Cache-Control"] = "no-store"
	return user


@router.get("/me", response_model=UserResponse)
def me(
	response: Response,
	user: CurrentUser,
) -> User:
	response.headers["Cache-Control"] = "no-store"
	return user


@router.post(
	"/logout",
	status_code=status.HTTP_204_NO_CONTENT,
	dependencies=[Depends(require_csrf_protection)],
)
def logout(
	auth_session: CurrentSession,
	db: DatabaseSession,
	settings: AppSettings,
) -> Response:
	db.delete(auth_session)
	db.commit()

	response = Response(status_code=status.HTTP_204_NO_CONTENT)
	response.delete_cookie(
		key=SESSION_COOKIE_NAME,
		path="/",
		secure=settings.session_cookie_secure,
		httponly=True,
		samesite="lax",
	)
	response.headers["Cache-Control"] = "no-store"
	return response