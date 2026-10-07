from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from pyorbit.db.base import Base

class AuthSession(Base):
	__tablename__ = "auth_sessions"

	token_hash: Mapped[str] = mapped_column(
		String(64),
		primary_key=True,
	)
	user_id: Mapped[UUID] = mapped_column(
		ForeignKey("users.id", ondelete="CASCADE"),
		index=True,
	)
	expires_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True),
		index=True,
	)