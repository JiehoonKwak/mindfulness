"""Music API routes for AI-generated meditation music."""

from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from ..database import SessionDep
from ..models.generated_music import (
    GeneratedMusic,
    GeneratedMusicCreate,
    GeneratedMusicRead,
)
from ..services.music_gen import music_gen_service, MUSIC_PRESETS

router = APIRouter(prefix="/api/music", tags=["music"])


@router.get("/presets")
def list_presets() -> List[dict]:
    """List available music generation presets."""
    return MUSIC_PRESETS


@router.post("/generate", response_model=GeneratedMusicRead)
async def generate_music(
    data: GeneratedMusicCreate,
    db: SessionDep,
) -> GeneratedMusic:
    """Start music generation (async).

    Note: Requires SUNO_API_KEY environment variable to be configured.
    """
    # Create record with pending status
    music = GeneratedMusic(
        prompt=data.prompt,
        duration_seconds=data.duration_seconds,
        filename="",
        status="pending",
    )
    db.add(music)
    db.commit()
    db.refresh(music)

    # Attempt generation
    result = await music_gen_service.generate(data.prompt, data.duration_seconds)

    if result:
        music.filename = result
        music.status = "completed"
    else:
        music.status = "failed"

    db.add(music)
    db.commit()
    db.refresh(music)

    return music


@router.get("/status/{music_id}", response_model=GeneratedMusicRead)
def get_status(music_id: int, db: SessionDep) -> GeneratedMusic:
    """Check generation status."""
    music = db.get(GeneratedMusic, music_id)
    if not music:
        raise HTTPException(status_code=404, detail="Music not found")
    return music


@router.get("/library", response_model=List[GeneratedMusicRead])
def list_library(db: SessionDep) -> List[GeneratedMusic]:
    """List all generated tracks."""
    music = db.exec(
        select(GeneratedMusic)
        .where(GeneratedMusic.status == "completed")
        .order_by(GeneratedMusic.created_at.desc())
    ).all()
    return list(music)


@router.delete("/{music_id}")
def delete_music(music_id: int, db: SessionDep) -> dict:
    """Delete a generated track."""
    music = db.get(GeneratedMusic, music_id)
    if not music:
        raise HTTPException(status_code=404, detail="Music not found")

    # TODO: Also delete the file from disk
    db.delete(music)
    db.commit()
    return {"ok": True}
