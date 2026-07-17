import os
import json
import logging
from typing import Dict, Any, List, Optional
from openai import OpenAI
from app.config import settings
from app.models import AgentChatMessage, AgentChatResponse

logger = logging.getLogger(__name__)

# Initialize OpenAI client if key is available
openai_client = None
if settings.OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize OpenAI client: {e}")

# Helper maps for indoor coordinates (e.g. wheelchair routes, seat routes)
COORDINATE_ROUTS = {
    "wheelchair_gate_d_west": [[100.0, 150.0], [120.0, 180.0], [220.0, 200.0], [300.0, 240.0]],
    "gate_b_seat_104": [[150.0, 80.0], [180.0, 110.0], [200.0, 120.0], [210.0, 125.0]],
    "lost_found_path": [[320.0, 400.0], [350.0, 380.0], [380.0, 360.0]],
    "evac_route_north": [[200.0, 200.0], [180.0, 120.0], [150.0, 50.0]]
}

# Rich mock database of SOPs and knowledge for high-fidelity fallback
SOP_DATABASE = {
    "missing_child": {
        "title": "Protocol 12-A: Missing Child Workflow",
        "steps": [
            "1. Initiate immediate local area lockdown (50-meter radius around last seen point).",
            "2. Broadcast child description ('Code Amber') to all security stations & volunteer walkies.",
            "3. Deploy Volunteer teams to secure exits (Gate A, B, C, D) and check CCTV feeds.",
            "4. Match child photo/details using Nexus AI Face Recognition placeholder engine.",
            "5. Escort parents to Operations Room Command Pod 3."
        ],
        "suggested_actions": ["Trigger Code Amber Alert", "Lock Gate C Exits", "Dispatch Nearby Volunteers"]
    },
    "medical_emergency": {
        "title": "Protocol 4-B: Medical Trauma Response",
        "steps": [
            "1. Establish exact seat location (e.g., Section 112, Row F, Seat 12).",
            "2. Alert the nearest medical responder team (Zone B EMT-2).",
            "3. Dispatch operations staff to clear accessibility route to the emergency location.",
            "4. Alert Stadium Command Center to coordinate ambulance arrival at Service Gate D."
        ],
        "suggested_actions": ["Dispatch EMT Zone B", "Clear Elevator 4", "Alert Staging Area 2"]
    },
    "lost_found": {
        "title": "Protocol 9-C: Lost & Found Retrieval",
        "steps": [
            "1. Record item name, brand, color, location found, and exact time.",
            "2. Lodge the item into the central digital inventory.",
            "3. Escort the guest/volunteer to Information Center 2 (West Stand).",
            "4. Verify ownership via item description, lock-screen matches, or matching ID."
        ],
        "suggested_actions": ["Log Found Item", "Route to Info Desk 2", "Check Security Cameras"]
    }
}

def ask_agent(message_data: AgentChatMessage) -> AgentChatResponse:
    role = message_data.agent_role
    query = message_data.message.lower()
    
    # Try calling OpenAI API if key is set
    if openai_client:
        try:
            return call_llm_agent(role, message_data.message, message_data.context)
        except Exception as e:
            logger.warning(f"LLM Agent call failed, using high-fidelity fallback: {e}")
            
    return get_fallback_agent_response(role, query)

def call_llm_agent(role: str, message: str, context: Optional[Dict[str, Any]]) -> AgentChatResponse:
    system_prompts = {
        "Fan": "You are the FIFA Fan Assistant AI. Provide indoor navigation, seat finding, queue lengths, food ratings, merchandise deals, match facts, and emergency routes. Output structured responses.",
        "Volunteer": "You are the Volunteer Copilot AI. Assist volunteers with Standard Operating Procedures (SOPs), Missing Child workflows, Lost & Found guidelines, and task lists.",
        "Security": "You are the Security AI. Monitor crowd density, predict hotspots, draft incident reports, and advise guards on safety incidents.",
        "Operations": "You are the Operations AI. Generate real-time reports, gate recommendations, and coordinate logistics.",
        "Accessibility": "You are the Accessibility AI. Direct users to wheelchair routes, elevators, sensory rooms, and audio assistance.",
        "Sustainability": "You are the Sustainability AI. Suggest energy/water savings and waste minimization policies.",
        "Transport": "You are the Transportation AI. Predict Metro loads, recommend parking zones, and estimate shuttle queue times."
    }
    
    prompt = system_prompts.get(role, "You are FIFA Nexus AI.")
    
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"Context: {json.dumps(context or {})}\n\nQuestion: {message}"}
        ],
        temperature=0.3
    )
    
    reply = response.choices[0].message.content
    
    # Generate mock suggest actions and routes based on role to keep UI interactive
    suggested = ["Consult SOP Manual", "View Live Heatmap"]
    nav_route = None
    
    if "wheelchair" in message.lower() or "elevator" in message.lower():
        nav_route = COORDINATE_ROUTS["wheelchair_gate_d_west"]
        suggested = ["Request Cart Pickup", "Locate Elevator 4"]
    elif "seat" in message.lower() or "gate b" in message.lower():
        nav_route = COORDINATE_ROUTS["gate_b_seat_104"]
        suggested = ["Show Walking Path", "Queue Status: Gate B"]
    elif "missing" in message.lower() or "child" in message.lower() or "amber" in message.lower():
        suggested = SOP_DATABASE["missing_child"]["suggested_actions"]
    elif "medical" in message.lower() or "hurt" in message.lower() or "injured" in message.lower():
        suggested = SOP_DATABASE["medical_emergency"]["suggested_actions"]
        
    return AgentChatResponse(
        agent_role=role,
        response=reply,
        suggested_actions=suggested,
        nav_route_coords=nav_route,
        structured_data={"agent_status": "online", "llm_generated": True}
    )

def get_fallback_agent_response(role: str, query: str) -> AgentChatResponse:
    # 1. FAN AI ASSISTANT FALLBACKS
    if role == "Fan":
        if "seat" in query or "navigation" in query or "find" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Nexus Seat Finder:** Your seat is in **Section 104, Row K, Seat 12** (East Stand). The quickest path is through **Gate B (West Transit)**. I have plotted a step-by-step route avoiding congested stairs.",
                suggested_actions=["Show Walking Path", "Check Gate B Queue", "Locate Nearest Restroom"],
                nav_route_coords=COORDINATE_ROUTS["gate_b_seat_104"]
            )
        elif "food" in query or "eat" in query or "beer" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Food Recommendation:** Based on current wait times, the **Taco Fiesta Express** (Section 108) is running a 4-minute queue. The **Stadium Grill** (Section 104) has a 12-minute wait but offers 15% off for Visa cardholders today.",
                suggested_actions=["Route to Taco Fiesta", "View Full Menu", "Order Mobile Pickup"],
            )
        elif "emergency" in query or "evacuate" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**EMERGENCY ASSISTANCE:** Please remain calm. The nearest exit is **Gate A (Main North)**. Follow the flashing green emergency floor lights. Avoid all service elevators.",
                suggested_actions=["Show Evacuation Path", "Call Medical Staging"],
                nav_route_coords=COORDINATE_ROUTS["evac_route_north"]
            )
        else:
            return AgentChatResponse(
                agent_role=role,
                response="Hello! I am your FIFA Stadium AI Assistant. Ask me about indoor navigation, your seat, food stands, restrooms, wait times, or live matches.",
                suggested_actions=["Seat Finder", "Food Map", "Transport Departure Time"]
            )

    # 2. VOLUNTEER COPILOT FALLBACKS
    elif role == "Volunteer":
        if "child" in query or "lost boy" in query or "lost girl" in query or "amber" in query:
            sop = SOP_DATABASE["missing_child"]
            return AgentChatResponse(
                agent_role=role,
                response=f"### {sop['title']}\n\nFollow these guidelines immediately:\n" + "\n".join(sop["steps"]),
                suggested_actions=sop["suggested_actions"]
            )
        elif "medical" in query or "emergency" in query or "cpr" in query:
            sop = SOP_DATABASE["medical_emergency"]
            return AgentChatResponse(
                agent_role=role,
                response=f"### {sop['title']}\n\nExecute the medical support chain:\n" + "\n".join(sop["steps"]),
                suggested_actions=sop["suggested_actions"]
            )
        elif "lost" in query or "found" in query or "wallet" in query:
            sop = SOP_DATABASE["lost_found"]
            return AgentChatResponse(
                agent_role=role,
                response=f"### {sop['title']}\n\nLog found items securely:\n" + "\n".join(sop["steps"]),
                suggested_actions=sop["suggested_actions"],
                nav_route_coords=COORDINATE_ROUTS["lost_found_path"]
            )
        else:
            return AgentChatResponse(
                agent_role=role,
                response="Welcome Volunteer! Access all Stadium SOP folders, file a Lost & Found report, trigger safety protocols, or view assigned duties.",
                suggested_actions=["Missing Child SOP", "Medical Emergency SOP", "Log Lost Wallet"]
            )

    # 3. SECURITY AI FALLBACKS
    elif role == "Security":
        if "density" in query or "crowd" in query or "hotspot" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Security Warning:** Crowd density near **Gate C (South Metro)** is approaching 0.85 (Critical capacity). Wait times are 22 minutes. Recommend dispatching 4 additional crowd control officers to split Metro arrivals.",
                suggested_actions=["Dispatch Units", "Activate Flow Control Gates", "Broadcast Route Redirect"]
            )
        elif "risk" in query or "incident" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Risk Assessment Report:** Current high-risk vectors:\n1. Overcrowding at south turnstiles (Gate C).\n2. Minor altercation reported in Section 202 (Active Fans stand). CCTV has lock-on.",
                suggested_actions=["Generate Incident Report", "Review CCTV Section 202"]
            )
        else:
            return AgentChatResponse(
                agent_role=role,
                response="Security Intelligence dashboard active. Ask me about crowd risk, active fights/hazards, incident summaries, or dispatch status.",
                suggested_actions=["View Active Incidents", "Crowd Density Heatmap", "Emergency Dispatch Core"]
            )

    # 4. OPERATIONS AI FALLBACKS
    elif role == "Operations":
        return AgentChatResponse(
            agent_role=role,
            response="**Operations Executive Directive:** Gate B is expected to exceed safe queue thresholds in 8 minutes due to simultaneous bus arrivals. Operations suggests redirecting pedestrian flow to Gate D immediately.",
            suggested_actions=["Redirect Traffic to Gate D", "Trigger Bus Hold Pattern"]
        )

    # 5. ACCESSIBILITY AI FALLBACKS
    elif role == "Accessibility":
        if "wheelchair" in query or "elevator" in query or "ramp" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Accessibility Wheelchair Routing:** Gate D has a step-free entrance. Route highlights elevator lobby West 2. Take Elevator 4 directly to Seating Zone West Stand (VIP). Level access all the way.",
                suggested_actions=["Start Accessible Turn-by-Turn", "Request Cart Pickup"],
                nav_route_coords=COORDINATE_ROUTS["wheelchair_gate_d_west"]
            )
        else:
            return AgentChatResponse(
                agent_role=role,
                response="Accessibility assistant active. Select Large Text or High Contrast modes, or request audio-described seating and step-free wheelchair routing.",
                suggested_actions=["Step-free Seat Route", "Sensory Room Locations", "Request Sign-Language Aid"]
            )

    # 6. SUSTAINABILITY AI FALLBACKS
    elif role == "Sustainability":
        return AgentChatResponse(
            agent_role=role,
            response="**Sustainability Audit:** Stadium water consumption is 12% lower than matchday average due to graywater recycling. Waste sorting bins are 84% full at food court East. Carbon offset counter is tracking 345g CO2/visitor.",
            suggested_actions=["Optimize Chiller Units", "Dispatch Waste Cleanup", "View Energy Metrics"]
        )

    # 7. TRANSPORTATION AI FALLBACKS
    elif role == "Transport":
        if "metro" in query or "congestion" in query or "train" in query:
            return AgentChatResponse(
                agent_role=role,
                response="**Transport Prediction:** Metro Line 1 is operating at peak passenger load (85%). Wait times at the platforms are roughly 15 minutes. Best departure window is **in 25 minutes** when frequency increases.",
                suggested_actions=["Check Metro Line 2", "Book Shuttle Ticket", "Find Walkway Times"]
            )
        else:
            return AgentChatResponse(
                agent_role=role,
                response="Transportation analytics active. Monitor bus schedules, metro station loads, ride-share surge pricing, and parking lot fills.",
                suggested_actions=["Metro Status Page", "Parking Lot Occupancy", "Shuttle Departure Grid"]
            )

    # Global default
    return AgentChatResponse(
        agent_role=role,
        response="FIFA Stadium Copilot stands ready. Please ask a specific question for your division.",
        suggested_actions=["View Dashboard", "Help System"]
    )
