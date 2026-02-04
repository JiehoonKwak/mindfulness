"""Scheduler service for periodic tasks."""

import logging
from datetime import UTC, date, datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlmodel import Session, create_engine, select

from ..config import get_config
from ..models.session import Session as MeditationSession
from .discord import discord_service

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

config = get_config()
db_url = config.get("database", {}).get("url", "sqlite:///./mindfulness.db")
engine = create_engine(db_url)


async def send_daily_reminder() -> None:
    """Check if user meditated today, send reminder if not."""
    try:
        with Session(engine) as db:
            today = date.today()
            today_start = datetime.combine(today, datetime.min.time())
            session_today = db.exec(
                select(MeditationSession).where(
                    MeditationSession.started_at >= today_start,
                    MeditationSession.completed == True,
                )
            ).first()

            if not session_today:
                await discord_service.send_webhook(
                    "",
                    {
                        "title": "Time for Mindfulness",
                        "description": "You haven't meditated today. Take a moment for yourself.",
                        "color": 0x6366F1,
                    },
                )
                logger.info("Daily reminder sent")
    except Exception as e:
        logger.error(f"Failed to send daily reminder: {e}")


async def send_weekly_summary() -> None:
    """Send weekly stats summary."""
    try:
        with Session(engine) as db:
            week_ago = datetime.now(UTC) - timedelta(days=7)
            sessions = db.exec(
                select(MeditationSession).where(
                    MeditationSession.started_at >= week_ago,
                    MeditationSession.completed == True,
                )
            ).all()

            stats = {
                "sessions": len(sessions),
                "minutes": sum(
                    (s.actual_duration_seconds or 0) // 60 for s in sessions
                ),
                "streak": 0,  # Would need streak calculation
            }

            await discord_service.send_weekly_summary(stats)
            logger.info("Weekly summary sent")
    except Exception as e:
        logger.error(f"Failed to send weekly summary: {e}")


def init_scheduler(reminder_hour: int = 20, reminder_minute: int = 0) -> None:
    """Initialize scheduler with configurable reminder time."""
    # Daily reminder
    scheduler.add_job(
        send_daily_reminder,
        CronTrigger(hour=reminder_hour, minute=reminder_minute),
        id="daily_reminder",
        replace_existing=True,
    )

    # Weekly summary on Sunday 8pm
    scheduler.add_job(
        send_weekly_summary,
        CronTrigger(day_of_week="sun", hour=20, minute=0),
        id="weekly_summary",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler initialized")


def shutdown_scheduler() -> None:
    """Shutdown the scheduler."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler shutdown")


def get_reminder_config() -> dict:
    """Get current reminder configuration."""
    job = scheduler.get_job("daily_reminder")
    if job and hasattr(job.trigger, "fields"):
        # Extract hour and minute from CronTrigger
        hour_field = next((f for f in job.trigger.fields if f.name == "hour"), None)
        minute_field = next((f for f in job.trigger.fields if f.name == "minute"), None)
        return {
            "enabled": True,
            "hour": int(str(hour_field)) if hour_field else 20,
            "minute": int(str(minute_field)) if minute_field else 0,
        }
    return {"enabled": False, "hour": 20, "minute": 0}


def update_reminder_config(hour: int, minute: int, enabled: bool = True) -> None:
    """Update reminder configuration."""
    if enabled:
        scheduler.reschedule_job(
            "daily_reminder",
            trigger=CronTrigger(hour=hour, minute=minute),
        )
    else:
        scheduler.pause_job("daily_reminder")
