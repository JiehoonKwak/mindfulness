"""Statistics API routes for meditation analytics."""

from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import List

from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import select

from ..database import SessionDep
from ..models.session import Session

router = APIRouter(prefix="/api/stats", tags=["stats"])


class StatsSummary(BaseModel):
    """Summary statistics."""

    total_sessions: int
    total_minutes: int
    current_streak: int
    longest_streak: int


class HeatmapEntry(BaseModel):
    """Single day entry for heatmap."""

    date: str
    minutes: int
    sessions: int


class StreakInfo(BaseModel):
    """Streak information."""

    current: int
    longest: int


def calculate_streaks(session_dates: List[datetime]) -> tuple[int, int]:
    """Calculate current and longest streak from session dates."""
    if not session_dates:
        return 0, 0

    # Get unique dates (in local timezone, truncated to date)
    unique_dates = sorted(set(d.date() for d in session_dates), reverse=True)
    if not unique_dates:
        return 0, 0

    today = datetime.now(UTC).date()
    current_streak = 0
    longest_streak = 0
    streak = 0
    prev_date = None

    # Check if today or yesterday has a session (for current streak)
    check_date = today
    if unique_dates[0] < today - timedelta(days=1):
        current_streak = 0
    else:
        for d in unique_dates:
            if prev_date is None:
                streak = 1
            elif (prev_date - d).days == 1:
                streak += 1
            else:
                break
            prev_date = d

        # Only count as current if includes today or yesterday
        if unique_dates[0] >= today - timedelta(days=1):
            current_streak = streak

    # Calculate longest streak
    streak = 0
    prev_date = None
    for d in sorted(unique_dates):
        if prev_date is None:
            streak = 1
        elif (d - prev_date).days == 1:
            streak += 1
        else:
            longest_streak = max(longest_streak, streak)
            streak = 1
        prev_date = d
    longest_streak = max(longest_streak, streak)

    return current_streak, longest_streak


@router.get("/summary", response_model=StatsSummary)
def get_summary(db: SessionDep) -> StatsSummary:
    """Get summary statistics."""
    sessions = db.exec(select(Session).where(Session.completed == True)).all()

    total_sessions = len(sessions)
    total_minutes = sum((s.actual_duration_seconds or 0) // 60 for s in sessions)

    session_dates = [s.started_at for s in sessions]
    current_streak, longest_streak = calculate_streaks(session_dates)

    return StatsSummary(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        current_streak=current_streak,
        longest_streak=longest_streak,
    )


@router.get("/heatmap", response_model=List[HeatmapEntry])
def get_heatmap(db: SessionDep, days: int = 365) -> List[HeatmapEntry]:
    """Get heatmap data for the last N days."""
    cutoff = datetime.now(UTC) - timedelta(days=days)
    sessions = db.exec(
        select(Session).where(
            Session.completed == True,
            Session.started_at >= cutoff,
        )
    ).all()

    # Aggregate by date
    by_date: dict[str, dict] = defaultdict(lambda: {"minutes": 0, "sessions": 0})
    for s in sessions:
        date_str = s.started_at.date().isoformat()
        by_date[date_str]["minutes"] += (s.actual_duration_seconds or 0) // 60
        by_date[date_str]["sessions"] += 1

    return [
        HeatmapEntry(date=date, minutes=data["minutes"], sessions=data["sessions"])
        for date, data in sorted(by_date.items())
    ]


@router.get("/streak", response_model=StreakInfo)
def get_streak(db: SessionDep) -> StreakInfo:
    """Get current and longest streak."""
    sessions = db.exec(select(Session).where(Session.completed == True)).all()
    session_dates = [s.started_at for s in sessions]
    current, longest = calculate_streaks(session_dates)
    return StreakInfo(current=current, longest=longest)
