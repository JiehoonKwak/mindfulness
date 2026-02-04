"""Pytest fixtures for test configuration."""

import pytest
from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Initialize database tables before running tests."""
    init_db()
    yield


@pytest.fixture
def client():
    """Create a test client for API testing."""
    return TestClient(app)
