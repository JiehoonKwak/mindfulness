from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_config
from .database import init_db
from .routes import (
    sessions,
    sounds,
    stats,
    goals,
    tags,
    export,
    discord,
    music,
    reminders,
)
from .services.scheduler import init_scheduler, shutdown_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and scheduler on startup."""
    init_db()
    init_scheduler()
    yield
    shutdown_scheduler()


app = FastAPI(title="Mindfulness API", lifespan=lifespan)

config = get_config()
origins = config.get("server", {}).get("cors_origins", ["http://localhost:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(sounds.router)
app.include_router(stats.router)
app.include_router(goals.router)
app.include_router(tags.router)
app.include_router(export.router)
app.include_router(discord.router)
app.include_router(music.router)
app.include_router(reminders.router)


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
