"""Export API routes for data export functionality."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import Response
from sqlmodel import select

from ..database import SessionDep
from ..models.session import Session
from ..services.export import export_json, export_csv, export_ical, export_markdown

router = APIRouter(prefix="/api/export", tags=["export"])


def get_filtered_sessions(
    db: SessionDep,
    from_date: Optional[str],
    to_date: Optional[str],
) -> list[Session]:
    """Get sessions filtered by date range."""
    query = select(Session).where(Session.completed == True)

    if from_date:
        query = query.where(Session.started_at >= datetime.fromisoformat(from_date))
    if to_date:
        query = query.where(Session.started_at <= datetime.fromisoformat(to_date))

    query = query.order_by(Session.started_at.desc())
    return list(db.exec(query).all())


def get_stats(sessions: list[Session]) -> dict:
    """Calculate stats from sessions."""
    return {
        "total_sessions": len(sessions),
        "total_minutes": sum((s.actual_duration_seconds or 0) // 60 for s in sessions),
    }


@router.get("/json")
def export_data_json(
    db: SessionDep,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
) -> Response:
    """Export all data as JSON."""
    sessions = get_filtered_sessions(db, from_date, to_date)
    stats = get_stats(sessions)
    content = export_json(sessions, stats)

    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=mindfulness-export.json"},
    )


@router.get("/csv")
def export_data_csv(
    db: SessionDep,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
) -> Response:
    """Export sessions as CSV."""
    sessions = get_filtered_sessions(db, from_date, to_date)
    content = export_csv(sessions)

    return Response(
        content=content,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=mindfulness-sessions.csv"
        },
    )


@router.get("/ical")
def export_data_ical(
    db: SessionDep,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
) -> Response:
    """Export as iCal format."""
    sessions = get_filtered_sessions(db, from_date, to_date)
    content = export_ical(sessions)

    return Response(
        content=content,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=mindfulness.ics"},
    )


@router.get("/markdown")
def export_data_markdown(
    db: SessionDep,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
) -> Response:
    """Export as markdown journal."""
    sessions = get_filtered_sessions(db, from_date, to_date)
    content = export_markdown(sessions)

    return Response(
        content=content,
        media_type="text/markdown",
        headers={"Content-Disposition": "attachment; filename=mindfulness-journal.md"},
    )
