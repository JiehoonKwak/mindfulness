"""Goals API routes for meditation goals management."""

from datetime import UTC, datetime, timedelta
from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from ..database import SessionDep
from ..models.goal import Goal, GoalCreate, GoalRead, GoalUpdate, GoalProgress
from ..models.session import Session

router = APIRouter(prefix="/api/goals", tags=["goals"])


def get_current_value(db: SessionDep, goal: Goal) -> int:
    """Calculate current progress value for a goal."""
    now = datetime.now(UTC)
    today = now.date()

    if goal.goal_type.startswith("daily_"):
        start = datetime.combine(today, datetime.min.time()).replace(tzinfo=UTC)
        end = start + timedelta(days=1)
    elif goal.goal_type.startswith("weekly_"):
        # Week starts on Monday
        start_of_week = today - timedelta(days=today.weekday())
        start = datetime.combine(start_of_week, datetime.min.time()).replace(tzinfo=UTC)
        end = start + timedelta(days=7)
    else:
        return 0

    sessions = db.exec(
        select(Session).where(
            Session.completed == True,
            Session.started_at >= start,
            Session.started_at < end,
        )
    ).all()

    if goal.goal_type.endswith("_minutes"):
        return sum((s.actual_duration_seconds or 0) // 60 for s in sessions)
    elif goal.goal_type.endswith("_sessions"):
        return len(sessions)
    return 0


@router.get("/", response_model=List[GoalRead])
def list_goals(db: SessionDep, active_only: bool = True) -> List[Goal]:
    """List all goals, optionally filtered by active status."""
    query = select(Goal)
    if active_only:
        query = query.where(Goal.is_active == True)
    return list(db.exec(query).all())


@router.post("/", response_model=GoalRead)
def create_goal(goal: GoalCreate, db: SessionDep) -> Goal:
    """Create a new goal."""
    db_goal = Goal.model_validate(goal)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@router.get("/{goal_id}", response_model=GoalRead)
def get_goal(goal_id: int, db: SessionDep) -> Goal:
    """Get a specific goal."""
    goal = db.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.patch("/{goal_id}", response_model=GoalRead)
def update_goal(goal_id: int, goal_update: GoalUpdate, db: SessionDep) -> Goal:
    """Update a goal."""
    goal = db.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    update_data = goal_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(goal, key, value)

    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: SessionDep) -> dict:
    """Delete a goal."""
    goal = db.get(Goal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"ok": True}


@router.get("/progress/all", response_model=List[GoalProgress])
def get_goals_progress(db: SessionDep) -> List[GoalProgress]:
    """Get progress for all active goals."""
    goals = db.exec(select(Goal).where(Goal.is_active == True)).all()
    progress_list = []

    for goal in goals:
        current = get_current_value(db, goal)
        percent = (
            min(100.0, (current / goal.target_value) * 100)
            if goal.target_value > 0
            else 0
        )
        progress_list.append(
            GoalProgress(
                goal_id=goal.id,
                goal_type=goal.goal_type,
                target_value=goal.target_value,
                current_value=current,
                progress_percent=round(percent, 1),
            )
        )

    return progress_list
