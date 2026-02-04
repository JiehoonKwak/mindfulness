from pathlib import Path
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# Import models so SQLModel registers them
from .models import session as _session_model  # noqa: F401
from .models import goal as _goal_model  # noqa: F401
from .models import tag as _tag_model  # noqa: F401
from .models import generated_music as _music_model  # noqa: F401
from .models import settings as _settings_model  # noqa: F401

# Database path relative to this file's location
_DB_DIR = Path(__file__).parent.parent / "data"
_DB_DIR.mkdir(exist_ok=True)
DATABASE_URL = f"sqlite:///{_DB_DIR}/mindfulness.db"
engine = create_engine(DATABASE_URL, echo=False)


def init_db() -> None:
    """Initialize database by creating all tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Yield a database session for dependency injection."""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
