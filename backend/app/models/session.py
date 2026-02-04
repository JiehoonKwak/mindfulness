from datetime import UTC, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


def _utc_now() -> datetime:
    """Return current UTC time as a timezone-aware datetime."""
    return datetime.now(UTC)


class SessionBase(SQLModel):
    """Base session model with shared fields."""

    planned_duration_seconds: int
    visual_type: Optional[str] = None
    bell_sound: Optional[str] = None


class Session(SessionBase, table=True):
    """Database model for meditation sessions."""

    id: Optional[int] = Field(default=None, primary_key=True)
    started_at: datetime = Field(default_factory=_utc_now)
    ended_at: Optional[datetime] = None
    actual_duration_seconds: Optional[int] = None
    completed: bool = False
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=_utc_now)


class SessionCreate(SessionBase):
    """Schema for creating a new session."""

    pass


class SessionUpdate(SQLModel):
    """Schema for updating an existing session."""

    ended_at: Optional[datetime] = None
    actual_duration_seconds: Optional[int] = None
    completed: Optional[bool] = None
    mood_before: Optional[str] = None
    mood_after: Optional[str] = None
    note: Optional[str] = None


class SessionRead(SessionBase):
    """Schema for reading session data."""

    id: int
    started_at: datetime
    ended_at: Optional[datetime]
    actual_duration_seconds: Optional[int]
    completed: bool
    mood_before: Optional[str]
    mood_after: Optional[str]
    note: Optional[str]
