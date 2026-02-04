"""Discord webhook service for notifications."""

from datetime import datetime
from typing import Optional

import httpx

from ..models.session import Session


class DiscordService:
    """Service for sending Discord webhook notifications."""

    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url

    def set_webhook_url(self, url: str) -> None:
        """Set the webhook URL."""
        self.webhook_url = url

    async def send_webhook(
        self,
        message: str,
        embed: Optional[dict] = None,
    ) -> bool:
        """Send a message to the Discord webhook."""
        if not self.webhook_url:
            return False

        payload: dict = {"content": message}
        if embed:
            payload["embeds"] = [embed]

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.webhook_url,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )
                return response.status_code in (200, 204)
        except Exception:
            return False

    async def notify_session_complete(self, session: Session) -> bool:
        """Notify when a meditation session is completed."""
        duration_min = (session.actual_duration_seconds or 0) // 60

        embed = {
            "title": "🧘 Meditation Complete",
            "color": 0x6366F1,  # Indigo
            "fields": [
                {
                    "name": "Duration",
                    "value": f"{duration_min} minutes",
                    "inline": True,
                },
            ],
            "timestamp": datetime.utcnow().isoformat(),
        }

        if session.mood_after:
            mood_emojis = {
                "calm": "😌",
                "happy": "😊",
                "peaceful": "🙂",
                "neutral": "😐",
                "tired": "😔",
            }
            embed["fields"].append(
                {
                    "name": "Mood",
                    "value": f"{mood_emojis.get(session.mood_after, '')} {session.mood_after}",
                    "inline": True,
                }
            )

        return await self.send_webhook("", embed)

    async def notify_streak_milestone(self, streak: int) -> bool:
        """Notify when a streak milestone is reached."""
        milestones = {
            7: "1 Week",
            14: "2 Weeks",
            30: "1 Month",
            60: "2 Months",
            100: "100 Days",
        }
        milestone_name = milestones.get(streak)

        if not milestone_name:
            return False

        embed = {
            "title": f"🔥 Streak Milestone: {milestone_name}!",
            "description": f"You've meditated for {streak} days in a row!",
            "color": 0xF59E0B,  # Amber
        }

        return await self.send_webhook("", embed)

    async def send_weekly_summary(self, stats: dict) -> bool:
        """Send a weekly meditation summary."""
        embed = {
            "title": "📊 Weekly Meditation Summary",
            "color": 0x10B981,  # Green
            "fields": [
                {
                    "name": "Sessions",
                    "value": str(stats.get("sessions", 0)),
                    "inline": True,
                },
                {
                    "name": "Total Time",
                    "value": f"{stats.get('minutes', 0)} min",
                    "inline": True,
                },
                {
                    "name": "Streak",
                    "value": f"{stats.get('streak', 0)} days",
                    "inline": True,
                },
            ],
        }

        return await self.send_webhook("", embed)


# Global instance (webhook URL loaded from config/env)
discord_service = DiscordService()
