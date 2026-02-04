"""Reminders API routes for notification scheduling."""

from fastapi import APIRouter
from pydantic import BaseModel

from ..services.scheduler import get_reminder_config, update_reminder_config

router = APIRouter(prefix="/api/reminders", tags=["reminders"])


class ReminderConfig(BaseModel):
    """Schema for reminder configuration."""

    enabled: bool
    hour: int
    minute: int


class ReminderUpdate(BaseModel):
    """Schema for updating reminder configuration."""

    hour: int
    minute: int
    enabled: bool = True


@router.get("/config", response_model=ReminderConfig)
def get_config() -> ReminderConfig:
    """Get current reminder configuration."""
    config = get_reminder_config()
    return ReminderConfig(**config)


@router.put("/config")
def set_config(data: ReminderUpdate) -> dict:
    """Update reminder configuration."""
    update_reminder_config(data.hour, data.minute, data.enabled)
    return {"success": True}
