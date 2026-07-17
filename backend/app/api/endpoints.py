from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from datetime import datetime
from app.models import (
    TelemetryState, ScenarioSimulationRequest, SimulationResult, 
    AgentChatMessage, AgentChatResponse, Incident
)
from app.core import telemetry, simulator, agent_engine

router = APIRouter()

# In-memory database of incidents
incidents_db: List[Incident] = [
    Incident(
        id="INC-301",
        title="Active Altercation in Section 202",
        location="Section 202, Row H",
        severity="High",
        reporter="Security",
        status="On-Scene",
        timestamp="16:05:01",
        description="Two fans arguing over seating space. Security Guard team 4 is present on scene attempting mediation.",
        ai_recommendation="**AI Alert Intervention:** Dispatch backup guards from Zone C turnstile gate. Maintain visual lock-on using CCTV Dome-Camera 14. Place medical stand-by on warning."
    ),
    Incident(
        id="INC-302",
        title="Spilled Drink / Slip Hazard",
        location="Concourse Level 2, Food Kiosk 3",
        severity="Low",
        reporter="Volunteer",
        status="Dispatched",
        timestamp="16:08:44",
        description="Spilled soda causing extremely slick floor. Multiple fans slipping, no injuries reported yet.",
        ai_recommendation="**AI Sanitation Alert:** Route active volunteer sweeping team 2. Auto-post 'Caution: Wet Floor' warning on the adjacent digital advertising panel."
    )
]

@router.get("/telemetry", response_model=TelemetryState)
def get_telemetry():
    """Retrieve the current live stadium telemetry state."""
    return telemetry.get_current_telemetry()

@router.post("/simulate", response_model=SimulationResult)
def run_simulation(request: ScenarioSimulationRequest):
    """Trigger a simulator scenario and apply modifications to live telemetry."""
    try:
        return simulator.simulate_scenario(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simulate/clear")
def clear_simulation():
    """Clear all active simulator modifiers, restoring telemetry to baseline."""
    telemetry.clear_modifiers()
    return {"status": "success", "message": "All simulation overrides removed."}

@router.post("/chat", response_model=AgentChatResponse)
def ask_ai_agent(message: AgentChatMessage):
    """Dispatch a chat question to a designated FIFA AI Agent."""
    try:
        return agent_engine.ask_agent(message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/incidents", response_model=List[Incident])
def get_incidents():
    """Fetch the active lists of security, medical, and operational incidents."""
    return incidents_db

@router.post("/incidents", response_model=Incident)
def create_incident(incident_in: Dict[str, Any]):
    """File a new stadium incident. Automatically generates an AI Dispatch recommendation."""
    severity = incident_in.get("severity", "Medium")
    location = incident_in.get("location", "Unknown Location")
    title = incident_in.get("title", "Reported Incident")
    description = incident_in.get("description", "")
    reporter = incident_in.get("reporter", "Fan")
    
    # Auto-generate AI dispatcher recommendations
    ai_advice = f"**AI Incident Dispatch Recommendation:**\n"
    if "medical" in title.lower() or "medical" in description.lower() or "hurt" in description.lower():
        ai_advice += f"1. Alert Zone medical squad closest to {location}.\n2. Request elevator clearance if stairs are blocked.\n3. Dispatch nearby volunteer to hold gate door open."
    elif "fight" in title.lower() or "altercation" in title.lower() or "crowd" in title.lower():
        ai_advice += f"1. Dispatch security details to {location}.\n2. Engage video zoom feed to record incident.\n3. Establish exit pathway containment buffer."
    else:
        ai_advice += f"1. Log ticket in ops database.\n2. Notify nearest maintenance team.\n3. Mark location on Map visual grid."

    new_incident = Incident(
        id=f"INC-{len(incidents_db) + 301}",
        title=title,
        location=location,
        severity=severity,
        reporter=reporter,
        status="Reported",
        timestamp=datetime.now().strftime("%H:%M:%S"),
        description=description,
        ai_recommendation=ai_advice
    )
    incidents_db.insert(0, new_incident)
    
    # Insert custom alert on telemetry as well
    telemetry.apply_modifier(f"incident_{new_incident.id}", {
        "alert": f"INCIDENT REPORTED: {title} in {location}.",
        "agent_role": "Security" if severity in ["High", "Critical"] else "Operations"
    })
    
    return new_incident

@router.post("/incidents/{incident_id}/resolve")
def resolve_incident(incident_id: str):
    """Mark a stadium incident as resolved and remove the active telemetry warning."""
    for incident in incidents_db:
        if incident.id == incident_id:
            incident.status = "Resolved"
            # Clear modifiers
            telemetry.current_state["active_modifiers"].pop(f"incident_{incident_id}", None)
            return {"status": "success", "message": f"Incident {incident_id} resolved."}
            
    raise HTTPException(status_code=404, detail="Incident not found")

# AI Operational Generators
@router.post("/reports/daily")
def generate_daily_report():
    """AI Daily Operations Report Generator."""
    return {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "title": "FIFA World Cup 2026 - Stadium Operations Daily Report",
        "sections": [
            {
                "header": "1. Attendance & Gate Flow Summary",
                "content": "Overall gate efficiency has been high, handling a peak of 68,200 fans. Gate B experienced a minor turnstile bottleneck due to simultaneous shuttle arrivals but resolved inside 18 minutes. Recommended spacing for transit arrivals for subsequent matchdays."
            },
            {
                "header": "2. Security & Medical Log",
                "content": "A total of 8 minor incidents reported, including one spectator altercation in Sec 202 and two slick floor reports. EMT teams successfully cleared the Section 112 mock cardiac response within 3.5 minutes. General safety score holds at 96.8%."
            },
            {
                "header": "3. Environmental & Sustainability Compliance",
                "content": "Energy draw peaked at 6.1M kWh during full storm simulator operations (auxiliary battery load-shedding test successfully passed). Stadium graywater recovery collected 84,000 liters. Carbon footprint offsets tracked 345g CO2/user, matching LEED Gold compliance guidelines."
            }
        ],
        "summary": "Stadium infrastructure performed optimally under peak crowd loads. Operations systems are cleared for the next group match."
    }

@router.post("/reports/announcement")
def generate_announcement(type: str = "general"):
    """AI Announcement Generator for PA or digital sign boards."""
    if type == "weather":
        text = "Attention all visitors. A rain storm is approaching the venue. The retractable roof is closing. Please move slowly along the stairs and check your step. Concourse cleaning teams are deploying floor dryers. Thank you."
    elif type == "gate_redirect":
        text = "Operational Announcement: Gate C is experiencing high crowd inflows. Fans arriving via Metro Line 2 are advised to follow directional signals towards the East walkway and enter through Gate D for a 15-minute wait time reduction."
    elif type == "emergency":
        text = "ALERT: Operational staff, please enact emergency routing procedure D-2. Assist guests to the nearest designated exit points at Gate A and B. Do not use lifts or elevators."
    else:
        text = "Welcome to FIFA World Cup 2026! We invite all fans to visit the Sustainability Kiosks at Sector 104 and learn about our carbon offset rewards program. Have an enjoyable match!"
        
    return {
        "type": type,
        "announcement_text": text,
        "recommended_volume": "85 dB" if type == "emergency" else "65 dB",
        "duration_seconds": 25,
        "languages": ["English", "Spanish", "French"]
    }

@router.post("/reports/emergency")
def generate_emergency_plan(location: str):
    """AI Emergency Response Generator."""
    return {
        "location": location,
        "emergency_level": "Level 2 (Localized Emergency)",
        "evacuation_zone": "Sector East Zone 3",
        "primary_exit": "Gate D (East Parking)",
        "secondary_exit": "Gate B",
        "first_responders_staging": "Service Portal East 2",
        "step_by_step_guidelines": [
            "1. Activate blinking emergency guide-lines in Seating Zones 104-106.",
            "2. Send push notifications to mobile devices in Section 110-114 indicating exit directions.",
            "3. Dispatch 8 Volunteer Crowd Stewards to the foot of Elevator West 2.",
            "4. Lock escalator inputs to downwards-only motion to expedite exiting speeds."
        ]
    }
