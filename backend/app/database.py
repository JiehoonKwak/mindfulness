from pathlib import Path
from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

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
