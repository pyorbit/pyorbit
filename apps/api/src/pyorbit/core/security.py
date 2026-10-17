import hashlib
import secrets

from pwdlib import PasswordHash

SESSION_COOKIE_NAME = "pyorbit_session"
SESSION_TOKEN_BYTES = 32
SESSION_TOKEN_LENGTH = 43

password_hasher = PasswordHash.recommended()

DUMMY_PASSWORD_HASH = password_hasher.hash("dummy-password-that-is-not-an-account-password")


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_hasher.verify(password, password_hash)


def create_session_token() -> str:
    return secrets.token_urlsafe(SESSION_TOKEN_BYTES)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
