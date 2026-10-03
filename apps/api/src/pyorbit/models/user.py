from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from pyorbit.db.base import Base, TimestampMixin, UuidMixin


class User(UuidMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
