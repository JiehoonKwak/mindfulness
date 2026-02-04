"""Discord API routes for webhook management."""

from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import select

from ..database import SessionDep
from ..models.settings import AppSetting
from ..services.discord import discord_service

router = APIRouter(prefix="/api/discord", tags=["discord"])


class WebhookUpdate(BaseModel):
    """Schema for updating webhook URL."""

    webhook_url: str


class TestResult(BaseModel):
    """Schema for test result."""

    success: bool


def _get_or_create_settings(db: SessionDep) -> AppSetting:
    """Get or create the settings row."""
    settings = db.exec(select(AppSetting).where(AppSetting.id == 1)).first()
    if not settings:
        settings = AppSetting(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/status")
def get_status(db: SessionDep) -> dict:
    """Check if Discord webhook is configured."""
    settings = _get_or_create_settings(db)
    # Update service with saved URL
    if settings.discord_webhook_url:
        discord_service.set_webhook_url(settings.discord_webhook_url)
    return {"configured": settings.discord_webhook_url is not None}


@router.get("/webhook")
def get_webhook(db: SessionDep) -> dict:
    """Get current webhook URL."""
    settings = _get_or_create_settings(db)
    return {"webhook_url": settings.discord_webhook_url or ""}


@router.put("/webhook")
def update_webhook(data: WebhookUpdate, db: SessionDep) -> dict:
    """Save webhook URL to database."""
    settings = _get_or_create_settings(db)
    settings.discord_webhook_url = data.webhook_url
    db.add(settings)
    db.commit()
    # Update in-memory service
    discord_service.set_webhook_url(data.webhook_url)
    return {"ok": True}


@router.post("/test", response_model=TestResult)
async def test_webhook() -> TestResult:
    """Test the webhook connection."""
    if not discord_service.webhook_url:
        return TestResult(success=False)

    success = await discord_service.send_webhook(
        "",
        {
            "title": "Mindfulness App Connected",
            "description": "Test notification from your meditation app!",
            "color": 0x000000,  # Black for monochrome (not purple)
        },
    )
    return TestResult(success=success)
