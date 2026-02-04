"""Goal model for meditation goals tracking."""

from datetime import UTC, datetime, date
from typing import Optional

from sqlmodel import Field, SQLModel


def _utc_now() -> datetime:
    return datetime.now(UTC)


def _today() -> date:
    return datetime.now(UTC).date()


class GoalBase(SQLModel):
    """Base goal model."""

    goal_type: (
        str  # "daily_minutes", "daily_sessions", "weekly_minutes", "weekly_sessions"
    )
    target_value: int
    start_date: date = Field(default_factory=_today)
    end_date: Optional[date] = None
    is_active: bool = True


class Goal(GoalBase, table=True):
    """Database model for meditation goals."""

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=_utc_now)


class GoalCreate(GoalBase):
    """Schema for creating a goal."""

    pass


class GoalUpdate(SQLModel):
    """Schema for updating a goal."""

    target_value: Optional[int] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class GoalRead(GoalBase):
    """Schema for reading a goal."""

    id: int
    created_at: datetime


class GoalProgress(SQLModel):
    """Schema for goal progress response."""

    goal_id: int
    goal_type: str
    target_value: int
    current_value: int
    progress_percent: float
