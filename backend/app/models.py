from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class SeatingZone(BaseModel):
    name: str
    capacity: int
    current_occupancy: int
    risk_level: str  # "Low", "Medium", "High"

class GateStatus(BaseModel):
    name: str
    status: str  # "Open", "Closed", "Restricted"
    wait_time_minutes: int
    flow_rate_per_min: int
    current_queue: int

class TransportStatus(BaseModel):
    name: str  # e.g., "Metro Line 1", "Gate B Shuttle", "North Parking"
    status: str  # "On Time", "Delayed", "Suspended", "Crowded"
    delay_minutes: int
    load_factor: float  # 0.0 to 1.0
    estimated_arrival_minutes: Optional[int] = None

class SustainabilityMetric(BaseModel):
    energy_kwh: float
    water_liters: float
    waste_kg: float
    carbon_g: float

class Alert(BaseModel):
    id: str
    timestamp: str
    severity: str  # "Info", "Warning", "Critical"
    agent: str  # "Security", "Operations", "Transport", etc.
    message: str
    resolved: bool = False

class TelemetryState(BaseModel):
    timestamp: str
    attendance_total: int
    attendance_percentage: float
    active_incidents: int
    crowd_density_overall: float  # 0.0 to 1.0
    seating_zones: List[SeatingZone]
    gates: List[GateStatus]
    transport: List[TransportStatus]
    sustainability: SustainabilityMetric
    alerts: List[Alert]
    executive_summary: str

class Incident(BaseModel):
    id: str
    title: str
    location: str
    severity: str  # "Low", "Medium", "High", "Critical"
    reporter: str  # "Fan", "Volunteer", "Security", "System"
    status: str  # "Reported", "Dispatched", "On-Scene", "Resolved"
    timestamp: str
    description: str
    ai_recommendation: Optional[str] = None

class ScenarioSimulationRequest(BaseModel):
    scenario_type: str  # "gate_closure", "rain", "metro_shutdown", "attendance_surge", "medical_emergency"
    details: Optional[Dict[str, Any]] = None

class SimulationImpact(BaseModel):
    metric_name: str
    before_value: str
    after_value: str
    percentage_change: float
    status: str  # "improved", "degraded", "neutral"

class SimulationResult(BaseModel):
    scenario_name: str
    impacts: List[SimulationImpact]
    alerts_triggered: List[str]
    sustainability_delta: Dict[str, float]
    ai_mitigation_plan: str
    recommended_actions: List[str]

class AgentChatMessage(BaseModel):
    session_id: str
    agent_role: str  # "Fan", "Volunteer", "Security", "Operations", "Accessibility", "Sustainability", "Transport"
    message: str
    context: Optional[Dict[str, Any]] = None

class AgentChatResponse(BaseModel):
    agent_role: str
    response: str
    suggested_actions: List[str]
    nav_route_coords: Optional[List[List[float]]] = None  # Coordinates for seat routing / wheelchair routing
    structured_data: Optional[Dict[str, Any]] = None
