"""Generated music model for AI-created meditation tracks."""

from datetime import UTC, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


def _utc_now() -> datetime:
    return datetime.now(UTC)


class GeneratedMusicBase(SQLModel):
    """Base model for generated music."""

    filename: str
    prompt: str
    duration_seconds: int


class GeneratedMusic(GeneratedMusicBase, table=True):
    """Database model for generated music tracks."""

    id: Optional[int] = Field(default=None, primary_key=True)
    status: str = "pending"  # pending, generating, completed, failed
    created_at: datetime = Field(default_factory=_utc_now)


class GeneratedMusicCreate(SQLModel):
    """Schema for creating a music generation request."""

    prompt: str
    duration_seconds: int = 60


class GeneratedMusicRead(GeneratedMusicBase):
    """Schema for reading generated music."""

    id: int
    status: str
    created_at: datetime
