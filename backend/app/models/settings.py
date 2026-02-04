"""App settings model for persistent configuration."""

from typing import Optional

from sqlmodel import Field, SQLModel


class AppSetting(SQLModel, table=True):
    """Single-row settings table for app configuration."""

    __tablename__ = "app_setting"

    id: int = Field(default=1, primary_key=True)
    discord_webhook_url: Optional[str] = Field(default=None)


class AppSettingUpdate(SQLModel):
    """Schema for updating settings."""

    discord_webhook_url: Optional[str] = None
