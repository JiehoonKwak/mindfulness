"""Discord API routes for webhook management."""

from fastapi import APIRouter
from pydantic import BaseModel

from ..services.discord import discord_service

router = APIRouter(prefix="/api/discord", tags=["discord"])


class WebhookUpdate(BaseModel):
    """Schema for updating webhook URL."""

    webhook_url: str


class TestResult(BaseModel):
    """Schema for test result."""

    success: bool


@router.get("/status")
def get_status() -> dict:
    """Check if Discord webhook is configured."""
    return {"configured": discord_service.webhook_url is not None}


@router.put("/webhook")
def update_webhook(data: WebhookUpdate) -> dict:
    """Save webhook URL."""
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
            "title": "🧘 Mindfulness App Connected",
            "description": "Test notification from your meditation app!",
            "color": 0x6366F1,
        },
    )
    return TestResult(success=success)
