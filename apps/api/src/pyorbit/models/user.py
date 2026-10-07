from sqlalchemy import Index, String, func
from sqlalchemy.orm import Mapped, mapped_column

from pyorbit.db.base import Base, TimestampMixin, UuidMixin


class User(UuidMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320))
    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    __table_args__ = (
        Index("ix_users_email_normalized",
              func.lower(email),
              unique=True,
              ),
    )