"""Test sessions API endpoints."""

import pytest


def test_create_session(client):
    """POST /api/sessions/ creates a new session and returns it."""
    payload = {
        "planned_duration_seconds": 600,
        "visual_type": "breathingCircle",
        "bell_sound": "tibetan",
    }
    response = client.post("/api/sessions/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["planned_duration_seconds"] == 600
    assert data["visual_type"] == "breathingCircle"
    assert data["bell_sound"] == "tibetan"
    assert data["completed"] is False
    assert "id" in data
    assert "started_at" in data


def test_list_sessions(client):
    """GET /api/sessions/ returns a list of sessions."""
    # Create a session first
    client.post(
        "/api/sessions/",
        json={"planned_duration_seconds": 300},
    )

    response = client.get("/api/sessions/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_session(client):
    """GET /api/sessions/{id} returns the session."""
    # Create a session first
    create_response = client.post(
        "/api/sessions/",
        json={"planned_duration_seconds": 600},
    )
    session_id = create_response.json()["id"]

    response = client.get(f"/api/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert data["planned_duration_seconds"] == 600


def test_get_session_not_found(client):
    """GET /api/sessions/{id} returns 404 for non-existent session."""
    response = client.get("/api/sessions/99999")
    assert response.status_code == 404


def test_update_session(client):
    """PATCH /api/sessions/{id} updates the session."""
    # Create a session first
    create_response = client.post(
        "/api/sessions/",
        json={"planned_duration_seconds": 600},
    )
    session_id = create_response.json()["id"]

    # Update the session
    update_payload = {
        "completed": True,
        "actual_duration_seconds": 580,
        "mood_after": "calm",
    }
    response = client.patch(f"/api/sessions/{session_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["completed"] is True
    assert data["actual_duration_seconds"] == 580
    assert data["mood_after"] == "calm"


def test_update_session_not_found(client):
    """PATCH /api/sessions/{id} returns 404 for non-existent session."""
    response = client.patch("/api/sessions/99999", json={"completed": True})
    assert response.status_code == 404


def test_delete_session(client):
    """DELETE /api/sessions/{id} removes the session."""
    # Create a session first
    create_response = client.post(
        "/api/sessions/",
        json={"planned_duration_seconds": 300},
    )
    session_id = create_response.json()["id"]

    # Delete the session
    response = client.delete(f"/api/sessions/{session_id}")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

    # Verify it's gone
    get_response = client.get(f"/api/sessions/{session_id}")
    assert get_response.status_code == 404


def test_delete_session_not_found(client):
    """DELETE /api/sessions/{id} returns 404 for non-existent session."""
    response = client.delete("/api/sessions/99999")
    assert response.status_code == 404
