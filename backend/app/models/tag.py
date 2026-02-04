"""Tag models for session categorization."""

from typing import Optional

from sqlmodel import Field, SQLModel


class TagBase(SQLModel):
    """Base tag model."""

    name_ko: str
    name_en: str
    color: str = "#6366f1"  # Default indigo
    is_default: bool = False


class Tag(TagBase, table=True):
    """Database model for tags."""

    id: Optional[int] = Field(default=None, primary_key=True)


class TagCreate(TagBase):
    """Schema for creating a tag."""

    pass


class TagRead(TagBase):
    """Schema for reading a tag."""

    id: int


class SessionTag(SQLModel, table=True):
    """Junction table for session-tag many-to-many relationship."""

    session_id: int = Field(foreign_key="session.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)
