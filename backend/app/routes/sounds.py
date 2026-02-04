"""Sounds API routes for listing available meditation sounds."""

from pathlib import Path
from typing import List

from fastapi import APIRouter

router = APIRouter(prefix="/api/sounds", tags=["sounds"])

# Base path for sounds (relative to frontend public directory)
SOUNDS_BASE = (
    Path(__file__).parent.parent.parent.parent.parent / "frontend/public/sounds"
)


def list_sounds_in_dir(category: str) -> List[dict]:
    """List all MP3 files in a sound category directory."""
    category_dir = SOUNDS_BASE / category
    if not category_dir.exists():
        return []

    sounds = []
    for file in sorted(category_dir.glob("*.mp3")):
        sounds.append(
            {
                "id": file.stem,
                "filename": file.name,
                "path": f"/sounds/{category}/{file.name}",
            }
        )
    return sounds


@router.get("/bells")
def list_bells() -> List[dict]:
    """List available bell sounds."""
    return list_sounds_in_dir("bells")


@router.get("/ambient")
def list_ambient() -> List[dict]:
    """List available ambient sounds."""
    return list_sounds_in_dir("ambient")
