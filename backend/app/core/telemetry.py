import time
import random
from datetime import datetime
from typing import Dict, Any, List
from app.models import TelemetryState, SeatingZone, GateStatus, TransportStatus, SustainabilityMetric, Alert

# Global in-memory state
current_state: Dict[str, Any] = {
    "attendance_total": 68200,
    "attendance_max": 75000,
    "active_incidents": 2,
    "crowd_density_overall": 0.65,
    "seating_zones": [
        {"name": "North Stand", "capacity": 18000, "current_occupancy": 15200, "risk_level": "Low"},
        {"name": "South Stand (Active Fans)", "capacity": 18000, "current_occupancy": 17800, "risk_level": "Medium"},
        {"name": "East Stand", "capacity": 20000, "current_occupancy": 16900, "risk_level": "Low"},
        {"name": "West Stand (VIP)", "capacity": 19000, "current_occupancy": 18300, "risk_level": "Medium"}
    ],
    "gates": [
        {"name": "Gate A (Main North)", "status": "Open", "wait_time_minutes": 8, "flow_rate_per_min": 140, "current_queue": 150},
        {"name": "Gate B (West Transit)", "status": "Open", "wait_time_minutes": 15, "flow_rate_per_min": 110, "current_queue": 380},
        {"name": "Gate C (South Metro)", "status": "Open", "wait_time_minutes": 22, "flow_rate_per_min": 95, "current_queue": 540},
        {"name": "Gate D (East Parking)", "status": "Open", "wait_time_minutes": 5, "flow_rate_per_min": 150, "current_queue": 80}
    ],
    "transport": [
        {"name": "Metro Line 1 (North Bound)", "status": "On Time", "delay_minutes": 0, "load_factor": 0.85, "estimated_arrival_minutes": 3},
        {"name": "Metro Line 2 (City Center)", "status": "On Time", "delay_minutes": 0, "load_factor": 0.70, "estimated_arrival_minutes": 5},
        {"name": "Express Shuttle 26 (East Lot)", "status": "On Time", "delay_minutes": 2, "load_factor": 0.90, "estimated_arrival_minutes": 4},
        {"name": "Uber/Lyft Ride-share Area", "status": "Crowded", "delay_minutes": 12, "load_factor": 0.95, "estimated_arrival_minutes": 10}
    ],
    "sustainability": {
        "energy_kwh": 4820.5,
        "water_liters": 124500.0,
        "waste_kg": 1850.2,
        "carbon_g": 345.8
    },
    "alerts": [
        {
            "id": "1",
            "timestamp": "15:42",
            "severity": "Warning",
            "agent": "Operations",
            "message": "Gate B crowd inflow is bottlenecking. Recommended redirecting Metro arrivals to Gate A.",
            "resolved": False
        },
        {
            "id": "2",
            "timestamp": "15:48",
            "severity": "Info",
            "agent": "Sustainability",
            "message": "Solar panel arrays are running at 94% efficiency, supplying 28% of current match energy.",
            "resolved": False
        }
    ],
    "active_modifiers": {}
}

def apply_modifier(name: str, values: Dict[str, Any]):
    current_state["active_modifiers"][name] = values

def clear_modifiers():
    current_state["active_modifiers"] = {}

def get_current_telemetry() -> TelemetryState:
    # 1. Start with the base state copies
    attendance_total = current_state["attendance_total"]
    active_incidents = current_state["active_incidents"]
    crowd_density_overall = current_state["crowd_density_overall"]
    
    seating_zones_data = [SeatingZone(**z) for z in current_state["seating_zones"]]
    gates_data = [GateStatus(**g) for g in current_state["gates"]]
    transport_data = [TransportStatus(**t) for t in current_state["transport"]]
    
    sust = current_state["sustainability"]
    sust_data = SustainabilityMetric(
        energy_kwh=sust["energy_kwh"],
        water_liters=sust["water_liters"],
        waste_kg=sust["waste_kg"],
        carbon_g=sust["carbon_g"]
    )
    
    alerts_data = [Alert(**a) for a in current_state["alerts"]]
    
    # 2. Add subtle random fluctuations to make it live
    # Shift wait times slightly
    for gate in gates_data:
        if gate.status == "Open":
            gate.current_queue += random.randint(-15, 20)
            gate.current_queue = max(10, gate.current_queue)
            gate.wait_time_minutes = int(gate.current_queue / max(10, gate.flow_rate_per_min / 5))
            gate.wait_time_minutes = max(1, gate.wait_time_minutes)
            
    # Shift transport times
    for t in transport_data:
        if t.estimated_arrival_minutes is not None:
            t.estimated_arrival_minutes -= 1
            if t.estimated_arrival_minutes <= 0:
                t.estimated_arrival_minutes = random.randint(6, 12)
                
    # Increment sustainability usage
    sust_data.energy_kwh += random.uniform(5.5, 12.0)
    sust_data.water_liters += random.uniform(10.0, 50.0)
    sust_data.waste_kg += random.uniform(0.5, 3.0)
    sust_data.carbon_g += random.uniform(0.1, 0.5)

    # 3. Apply active simulator overrides
    exec_summary = "All systems operating normally. Stadium attendance is stable at 91% capacity."
    
    for mod_name, mod in current_state["active_modifiers"].items():
        if "attendance_factor" in mod:
            attendance_total = int(attendance_total * mod["attendance_factor"])
            attendance_total = min(75000, attendance_total)
            crowd_density_overall = min(1.0, crowd_density_overall * mod["attendance_factor"])
            for zone in seating_zones_data:
                zone.current_occupancy = min(zone.capacity, int(zone.current_occupancy * mod["attendance_factor"]))
                if zone.current_occupancy / zone.capacity > 0.95:
                    zone.risk_level = "High"
                elif zone.current_occupancy / zone.capacity > 0.80:
                    zone.risk_level = "Medium"
                    
        if "gate_closed" in mod:
            closed_gate_name = mod["gate_closed"]
            for gate in gates_data:
                if closed_gate_name in gate.name:
                    gate.status = "Closed"
                    gate.wait_time_minutes = 999
                    gate.current_queue = 0
                else:
                    # Spillover to other gates
                    gate.current_queue += 120
                    gate.wait_time_minutes = int(gate.current_queue / max(10, gate.flow_rate_per_min / 5))
                    
        if "rain_effect" in mod:
            sust_data.water_liters += 1500  # Rain harvest simulation
            for t in transport_data:
                t.status = "Delayed"
                t.delay_minutes += random.randint(10, 15)
                t.load_factor = min(1.0, t.load_factor + 0.1)
            for gate in gates_data:
                gate.wait_time_minutes += 5  # Slow entry
                
        if "metro_shutdown" in mod:
            shutdown_line = mod["metro_shutdown"]
            for t in transport_data:
                if shutdown_line in t.name:
                    t.status = "Suspended"
                    t.load_factor = 0.0
                    t.estimated_arrival_minutes = None
                elif "Uber" in t.name or "Shuttle" in t.name:
                    # Massive load surge on other modes
                    t.status = "Critical Delay"
                    t.delay_minutes += 25
                    t.load_factor = 1.0

        if "incident" in mod:
            active_incidents += 1

        if "exec_summary" in mod:
            exec_summary = mod["exec_summary"]
            
    # Cap total attendance percentage
    attendance_pct = (attendance_total / 75000) * 100

    # Sync updates back to base in-memory state (so they evolve continuously)
    current_state["attendance_total"] = attendance_total
    current_state["active_incidents"] = active_incidents
    current_state["crowd_density_overall"] = crowd_density_overall
    current_state["sustainability"]["energy_kwh"] = sust_data.energy_kwh
    current_state["sustainability"]["water_liters"] = sust_data.water_liters
    current_state["sustainability"]["waste_kg"] = sust_data.waste_kg
    current_state["sustainability"]["carbon_g"] = sust_data.carbon_g

    # Filter out resolved alerts or add custom ones from overrides
    all_alerts = list(alerts_data)
    for mod_name, mod in current_state["active_modifiers"].items():
        if "alert" in mod:
            all_alerts.append(Alert(
                id=str(len(all_alerts) + 1),
                timestamp=datetime.now().strftime("%H:%M"),
                severity="Critical" if "Critical" in mod["alert"] else "Warning",
                agent=mod.get("agent_role", "Operations"),
                message=mod["alert"]
            ))

    return TelemetryState(
        timestamp=datetime.now().strftime("%H:%M:%S"),
        attendance_total=attendance_total,
        attendance_percentage=round(attendance_pct, 1),
        active_incidents=active_incidents,
        crowd_density_overall=round(crowd_density_overall, 2),
        seating_zones=seating_zones_data,
        gates=gates_data,
        transport=transport_data,
        sustainability=sust_data,
        alerts=all_alerts[-8:], # keep last 8 alerts
        executive_summary=exec_summary
    )
