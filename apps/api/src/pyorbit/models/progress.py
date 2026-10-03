from uuid import UUID

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from pyorbit.db.base import Base, TimestampMixin, UuidMixin


class LessonProgress(UuidMixin, TimestampMixin, Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (UniqueConstraint("user_id", "course_slug", "lesson_slug"),)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    course_slug: Mapped[str] = mapped_column(String(100))
    lesson_slug: Mapped[str] = mapped_column(String(100))
    completed: Mapped[bool] = mapped_column(default=False)
