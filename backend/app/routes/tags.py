"""Tags API routes for session categorization."""

from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from ..database import SessionDep
from ..models.tag import Tag, TagCreate, TagRead, SessionTag

router = APIRouter(prefix="/api/tags", tags=["tags"])


@router.get("/", response_model=List[TagRead])
def list_tags(db: SessionDep) -> List[Tag]:
    """List all tags."""
    return list(db.exec(select(Tag)).all())


@router.post("/", response_model=TagRead)
def create_tag(tag: TagCreate, db: SessionDep) -> Tag:
    """Create a new tag."""
    db_tag = Tag.model_validate(tag)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


@router.delete("/{tag_id}")
def delete_tag(tag_id: int, db: SessionDep) -> dict:
    """Delete a tag."""
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")

    # Delete session-tag associations
    session_tags = db.exec(select(SessionTag).where(SessionTag.tag_id == tag_id)).all()
    for st in session_tags:
        db.delete(st)

    db.delete(tag)
    db.commit()
    return {"ok": True}


@router.post("/sessions/{session_id}/tags")
def add_tags_to_session(session_id: int, tag_ids: List[int], db: SessionDep) -> dict:
    """Add tags to a session."""
    # Remove existing tags for this session
    existing = db.exec(
        select(SessionTag).where(SessionTag.session_id == session_id)
    ).all()
    for st in existing:
        db.delete(st)

    # Add new tags
    for tag_id in tag_ids:
        session_tag = SessionTag(session_id=session_id, tag_id=tag_id)
        db.add(session_tag)

    db.commit()
    return {"ok": True}


@router.get("/sessions/{session_id}/tags", response_model=List[TagRead])
def get_session_tags(session_id: int, db: SessionDep) -> List[Tag]:
    """Get tags for a session."""
    session_tags = db.exec(
        select(SessionTag).where(SessionTag.session_id == session_id)
    ).all()
    tag_ids = [st.tag_id for st in session_tags]

    if not tag_ids:
        return []

    tags = db.exec(select(Tag).where(Tag.id.in_(tag_ids))).all()
    return list(tags)
