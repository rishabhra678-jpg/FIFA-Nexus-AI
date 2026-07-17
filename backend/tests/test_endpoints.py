import pytest
import sys
import os
from fastapi.testclient import TestClient

# Adjust path to import backend modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_read_root():
    """Verify that root page renders the dashboard index.html template successfully."""
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]
    assert "FIFA Nexus AI" in response.text

def test_get_telemetry():
    """Verify telemetry state output keys and type specifications."""
    response = client.get("/api/v1/telemetry")
    assert response.status_code == 200
    data = response.json()
    assert "attendance_total" in data
    assert "active_incidents" in data
    assert "crowd_density_overall" in data
    assert isinstance(data["gates"], list)
    assert isinstance(data["transport"], list)

def test_run_simulation():
    """Verify that triggering a simulator scenario updates the state correctly."""
    response = client.post(
        "/api/v1/simulate",
        json={"scenario_type": "gate_closure"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "scenario_name" in data
    assert "ai_mitigation_plan" in data
    assert isinstance(data["recommended_actions"], list)
    
    # Confirm telemetry reflects closed gate status
    tel_resp = client.get("/api/v1/telemetry")
    tel_data = tel_resp.json()
    gate_c = next((g for g in tel_data["gates"] if "Gate C" in g["name"]), None)
    assert gate_c is not None
    assert gate_c["status"] == "Closed"

def test_clear_simulation():
    """Verify that resetting baseline simulation restores original values."""
    # First apply modifier
    client.post("/api/v1/simulate", json={"scenario_type": "gate_closure"})
    
    # Reset
    response = client.post("/api/v1/simulate/clear")
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    # Verify Gate C is restored
    tel_resp = client.get("/api/v1/telemetry")
    gate_c = next((g for g in tel_resp.json()["gates"] if "Gate C" in g["name"]), None)
    assert gate_c is not None
    assert gate_c["status"] == "Open"

def test_ask_agent():
    """Verify Q&A multi-agent endpoints."""
    response = client.post(
        "/api/v1/chat",
        json={
            "session_id": "test_sess",
            "agent_role": "Fan",
            "message": "Where is my seat in Section 104?"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["agent_role"] == "Fan"
    assert "response" in data
    assert isinstance(data["suggested_actions"], list)

def test_incidents_api():
    """Verify CRUD endpoints for security dispatches."""
    # Get active
    get_res = client.get("/api/v1/incidents")
    assert get_res.status_code == 200
    initial_count = len(get_res.json())
    
    # Create incident
    post_res = client.post(
        "/api/v1/incidents",
        json={
            "title": "Medical assistance needed",
            "location": "Section 112, Row F",
            "severity": "Medium",
            "description": "Guest feeling lightheaded."
        }
    )
    assert post_res.status_code == 200
    created_incident = post_res.json()
    assert created_incident["title"] == "Medical assistance needed"
    assert created_incident["status"] == "Reported"
    assert "ai_recommendation" in created_incident
    
    # Verify count increases
    get_res2 = client.get("/api/v1/incidents")
    assert len(get_res2.json()) == initial_count + 1
    
    # Resolve incident
    resolve_res = client.post(f"/api/v1/incidents/{created_incident['id']}/resolve")
    assert resolve_res.status_code == 200
    assert resolve_res.json()["status"] == "success"
