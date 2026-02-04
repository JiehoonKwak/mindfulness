"""Sessions API routes for meditation session CRUD operations."""

from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from ..database import SessionDep
from ..models.session import Session, SessionCreate, SessionRead, SessionUpdate

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.post("/", response_model=SessionRead)
def create_session(session: SessionCreate, db: SessionDep) -> Session:
    """Create a new meditation session."""
    db_session = Session.model_validate(session)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@router.get("/", response_model=List[SessionRead])
def list_sessions(db: SessionDep, limit: int = 50, offset: int = 0) -> List[Session]:
    """List meditation sessions ordered by most recent first."""
    sessions = db.exec(
        select(Session).order_by(Session.started_at.desc()).offset(offset).limit(limit)
    ).all()
    return list(sessions)


@router.get("/{session_id}", response_model=SessionRead)
def get_session(session_id: int, db: SessionDep) -> Session:
    """Get a specific meditation session by ID."""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.patch("/{session_id}", response_model=SessionRead)
def update_session(
    session_id: int, session_update: SessionUpdate, db: SessionDep
) -> Session:
    """Update an existing meditation session."""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    update_data = session_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(session, key, value)

    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}")
def delete_session(session_id: int, db: SessionDep) -> dict:
    """Delete a meditation session."""
    session = db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"ok": True}
