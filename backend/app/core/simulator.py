import random
from typing import Dict, Any, List
from app.models import SimulationResult, SimulationImpact, ScenarioSimulationRequest
from app.core import telemetry

SCENARIO_TEMPLATES = {
    "gate_closure": {
        "name": "Gate C (South Metro) Closure",
        "modifiers": {
            "gate_closed": "Gate C",
            "exec_summary": "CRITICAL: Gate C is CLOSED. Crowd flow is diverted to Gates A & D. Turnstile queue times at Gate B spiking to 35+ minutes. Deploy staff.",
            "alert": "Gate C turnstiles closed due to electrical power grid trip. Flow redirection active.",
            "agent_role": "Operations"
        },
        "impacts": [
            {"metric_name": "Gate B Turnstile Wait Time", "before": "15 mins", "after": "37 mins", "change": 146.6, "status": "degraded"},
            {"metric_name": "Gate D Turnstile Wait Time", "before": "5 mins", "after": "18 mins", "change": 260.0, "status": "degraded"},
            {"metric_name": "South Stand Crowd Density", "before": "0.78", "after": "0.95", "change": 21.7, "status": "degraded"}
        ],
        "alerts_triggered": [
            "OPERATIONS: Gate C Turnstile Power Outage Alarm",
            "SECURITY: Gate B Crowd Bottleneck Warning (Level 3)"
        ],
        "sustainability_delta": {"energy_kwh": 45.0, "carbon_g": 12.0},
        "ai_mitigation_plan": """### FIFA Ops Commander AI - Gate C Closure Emergency SOP
Gate C has experienced a localized power trip. High influx from Metro Line 2 is bottlenecking. 

**Immediate Recommendations:**
1. **Dynamic Signage:** Automatically update digital messaging on Metro arrival platform to direct passengers towards the East Walkway (Gate D).
2. **Transit Control:** Request Metro Operations to hold trains at previous station for 90-second intervals to space out arrivals.
3. **Staff Redeployment:** Shift 15 Volunteers from West Stand VIP lounges to turnstiles at Gate B to scan mobile tickets manually and speed up intake.
4. **Emergency Services:** Standby medical vehicle positioned at Service Sector 3.""",
        "recommended_actions": [
            "Activate Gate B Overflow Gates",
            "Divert Metro Exit Signage to Gate D",
            "Dispatch 15 Operations Volunteers to Gate B",
            "Notify City Metro Control to Slow Arrivals"
        ]
    },
    "rain": {
        "name": "Sudden Storm (Precipitation Surge)",
        "modifiers": {
            "rain_effect": True,
            "exec_summary": "WEATHER ALERT: Rain detected. Ground slick hazards. Fans retreating to indoor concourses. Concourse density high. Parking delays +15 mins.",
            "alert": "Storm alert: Yellow caution active. Concourse flooring is slippery. Pedestrian speeds reduced.",
            "agent_role": "Transport"
        },
        "impacts": [
            {"metric_name": "Concourse Crowd Density", "before": "0.55", "after": "0.88", "change": 60.0, "status": "degraded"},
            {"metric_name": "Average Metro Wait Time", "before": "5 mins", "after": "18 mins", "change": 260.0, "status": "degraded"},
            {"metric_name": "Graywater Tank Harvest Rate", "before": "40 L/m", "after": "650 L/m", "change": 1525.0, "status": "improved"}
        ],
        "alerts_triggered": [
            "WEATHER: Rain Sensor Triggered - Stadium Roof closing (ETA 12 minutes)",
            "SECURITY: Concourse Level 2 Slip-Fall Hazard Index High"
        ],
        "sustainability_delta": {"energy_kwh": 250.0, "water_liters": -8000.0, "carbon_g": 140.0},
        "ai_mitigation_plan": """### FIFA Ops Commander AI - Weather Incident Plan
Rain is causing spectators to gather in indoor pathways. Transport links will suffer minor delays.

**Immediate Recommendations:**
1. **Roof Deployment:** Fully close retractable roof structures (takes approx 12 minutes).
2. **Safety Protocols:** Dispatch sanitation crews with high-speed floor dryers to concourses A and B immediately.
3. **Transport Coordination:** Recommend fans stay inside stadium concourses post-match for 30 minutes to wait out the peak storm, offering discounts at food kiosks to ease exit crowds.
4. **Energy Management:** Shift stadium lighting to High-Lumen Storm Mode (increases energy load).""",
        "recommended_actions": [
            "Initiate Retractable Roof Closure",
            "Deploy Wet-Floor Signage & Dryers to Concourses",
            "Activate Post-Match Concourse Fan Retention Program",
            "Increase Chiller/HVAC Extract Fan Speed"
        ]
    },
    "metro_shutdown": {
        "name": "Metro Line 2 Critical Interruption",
        "modifiers": {
            "metro_shutdown": "Metro Line 2",
            "exec_summary": "TRANSPORT CRITICAL: Metro Line 2 suspended due to track signal failure. Shuttles and Ride-share lots experiencing 30+ minute queue delays.",
            "alert": "Metro Line 2 suspended. Commuters must use Express Shuttle routes from Gate D.",
            "agent_role": "Transport"
        },
        "impacts": [
            {"metric_name": "Ride-share Waiting Times", "before": "12 mins", "after": "45 mins", "change": 275.0, "status": "degraded"},
            {"metric_name": "Shuttle Bus Load Factor", "before": "0.70", "after": "1.00", "change": 42.8, "status": "degraded"},
            {"metric_name": "Carbon Footprint per Traveler", "before": "345g", "after": "490g", "change": 42.0, "status": "degraded"}
        ],
        "alerts_triggered": [
            "TRANSPORT: Metro Line 2 Signal Outage Broadcast",
            "SECURITY: Ride-share Area Overcrowding Alarm"
        ],
        "sustainability_delta": {"energy_kwh": 80.0, "carbon_g": 1800.0},
        "ai_mitigation_plan": """### FIFA Ops Commander AI - Metro Outage SOP
A track signal failure has shut down the major rail route. Exit operations will be severely bottle-necked.

**Immediate Recommendations:**
1. **Emergency Bus Dispatch:** Request 20 supplementary shuttle buses from city transit reserves to Route 26.
2. **Ride-Share Management:** Open Overflow Lot C to Uber/Lyft staging to resolve pick-up lane gridlocks.
3. **Dynamic Broadcast:** Notify stadium screen displays and fan app to promote the 'East Ride-Share Staging' corridor.
4. **Sustainability Alert:** High volume of combustion engine vehicles will spike stadium emission scores by 42%.""",
        "recommended_actions": [
            "Authorize Emergency City Shuttle Fleet Dispatch",
            "Open Staging Lot C for Ride-share Overflow",
            "Send Target Push Notification to Fans near Gate C",
            "Enable Emergency Parking Lot Parking-Fee Waivers"
        ]
    },
    "attendance_surge": {
        "name": "+30% VIP/General Admission Surge",
        "modifiers": {
            "attendance_factor": 1.30,
            "exec_summary": "CAPACITY WARNING: Peak attendance surge (+30%). Overall capacity at 98%. High risk in active seating zones (South Stand). Turnstiles congested.",
            "alert": "General capacity threshold surpassed 95%. Turnstiles operating at maximum flow capacity.",
            "agent_role": "Security"
        },
        "impacts": [
            {"metric_name": "Total Active Fans", "before": "68,200", "after": "74,950", "change": 9.9, "status": "degraded"},
            {"metric_name": "South Stand Risk Level", "before": "Medium", "after": "High (98% full)", "change": 20.0, "status": "degraded"},
            {"metric_name": "Energy Consumption Demand", "before": "4,820 kWh", "after": "6,150 kWh", "change": 27.5, "status": "degraded"}
        ],
        "alerts_triggered": [
            "SECURITY: Stadium Turnstile Maximum Limit Exceeded",
            "OPERATIONS: High Grid Voltage Draw Alarm"
        ],
        "sustainability_delta": {"energy_kwh": 1330.0, "water_liters": 25000.0, "waste_kg": 540.0},
        "ai_mitigation_plan": """### FIFA Ops Commander AI - Peak Capacity Crowd Flow Protocol
Stadium occupancy has hit near-maximum ceiling limits.

**Immediate Recommendations:**
1. **Flow Barriers:** Place crowd separation gates at South Stand tunnels to split fan densities.
2. **Turnstile Release:** Transition exit turnstiles to low-resistance free flow mode immediately.
3. **Power Grids:** Engage backup auxiliary battery storage units to prevent stadium power fluctuations.
4. **Food & Water:** Direct concession stands to swap to canned beverages only to accelerate checkout.""",
        "recommended_actions": [
            "Deploy Crowd Dividers to South Stand Access Points",
            "Toggle South Turnstiles to One-Way Free Passage",
            "Activate Auxiliary Tesla Powerpacks",
            "Alert Local Fire Marshal on Sector Capacities"
        ]
    },
    "medical_emergency": {
        "name": "Simulated Medical Emergency in Section 112",
        "modifiers": {
            "incident": True,
            "exec_summary": "MEDICAL INCIDENT: Cardiac distress reported in Section 112. Emergency response dispatched. Path clearance recommended.",
            "alert": "Medical dispatch active: Zone B EMT responding to Section 112, Row F. Keep elevators clear.",
            "agent_role": "Volunteer"
        },
        "impacts": [
            {"metric_name": "Active Safety Incidents", "before": "2", "after": "3", "change": 50.0, "status": "degraded"},
            {"metric_name": "Response Unit ETA", "before": "N/A", "after": "3.5 mins", "change": 0.0, "status": "improved"},
            {"metric_name": "Elevator 4 Accessibility Hold", "before": "Free", "after": "Restricted", "change": 100.0, "status": "neutral"}
        ],
        "alerts_triggered": [
            "SECURITY: EMT Unit dispatched - Emergency Call ID 481",
            "ACCESSIBILITY: Elevator 4 locked for medical VIP override"
        ],
        "sustainability_delta": {"energy_kwh": 5.0, "carbon_g": 0.0},
        "ai_mitigation_plan": """### FIFA Ops Commander AI - Section 112 Medical SOP
A fan is experiencing cardiac distress. Response protocols are active.

**Immediate Recommendations:**
1. **EMT Coordination:** Direct EMT Squad 2 via service corridor Section 110 (avoids public stairs).
2. **Elevator Hold:** Automatically lock Elevator 4 at Ground Level, reserved for the response unit.
3. **Volunteer Role:** Instruct Sector 112 volunteer staff to clear the immediate row to provide space for responders and guide the family members to the medical clinic lobby.""",
        "recommended_actions": [
            "Lock Elevator 4 for EMT Priority Override",
            "Dispatch Stretcher Team from Main Tunnel",
            "Deploy Volunteer Stewards to Guide EMT to Row F",
            "Alert Local Paramedics for Staging at Gate D Portal"
        ]
    }
}

def simulate_scenario(request: ScenarioSimulationRequest) -> SimulationResult:
    scenario_type = request.scenario_type
    
    # Check if we have a valid template
    if scenario_type not in SCENARIO_TEMPLATES:
        # Return a fallback custom scenario result
        return SimulationResult(
            scenario_name=f"Custom Scenario ({scenario_type})",
            impacts=[
                SimulationImpact(metric_name="Crowd Delay Factor", before="Normal", after="Elevated", percentage_change=15.0, status="degraded")
            ],
            alerts_triggered=["SYSTEM: Custom scenario modifiers applied"],
            sustainability_delta={"energy_kwh": 10.0, "water_liters": 0.0, "waste_kg": 0.0, "carbon_g": 2.0},
            ai_mitigation_plan="Custom simulation run. Monitor telemetry feeds.",
            recommended_actions=["Monitor Stadium Map", "Report anomalies to Security Desk"]
        )
        
    template = SCENARIO_TEMPLATES[scenario_type]
    
    # 1. Apply modifiers to the telemetry state
    telemetry.apply_modifier(scenario_type, template["modifiers"])
    
    # 2. Map impacts
    impacts_list = []
    for imp in template["impacts"]:
        impacts_list.append(SimulationImpact(
            metric_name=imp["metric_name"],
            before_value=imp["before"],
            after_value=imp["after"],
            percentage_change=imp["change"],
            status=imp["status"]
        ))
        
    return SimulationResult(
        scenario_name=template["name"],
        impacts=impacts_list,
        alerts_triggered=template["alerts_triggered"],
        sustainability_delta=template["sustainability_delta"],
        ai_mitigation_plan=template["ai_mitigation_plan"],
        recommended_actions=template["recommended_actions"]
    )
