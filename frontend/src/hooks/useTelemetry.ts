import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/config";

export interface SeatingZone {
  name: string;
  capacity: number;
  current_occupancy: number;
  risk_level: string;
}

export interface GateStatus {
  name: string;
  status: string;
  wait_time_minutes: number;
  flow_rate_per_min: number;
  current_queue: number;
}

export interface TransportStatus {
  name: string;
  status: string;
  delay_minutes: number;
  load_factor: number;
  estimated_arrival_minutes: number | null;
}

export interface SustainabilityMetric {
  energy_kwh: number;
  water_liters: number;
  waste_kg: number;
  carbon_g: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  severity: string;
  agent: string;
  message: string;
  resolved: boolean;
}

export interface TelemetryState {
  timestamp: string;
  attendance_total: number;
  attendance_percentage: number;
  active_incidents: number;
  crowd_density_overall: number;
  seating_zones: SeatingZone[];
  gates: GateStatus[];
  transport: TransportStatus[];
  sustainability: SustainabilityMetric;
  alerts: Alert[];
  executive_summary: string;
}

const DEFAULT_STATE: TelemetryState = {
  timestamp: "12:00:00",
  attendance_total: 68200,
  attendance_percentage: 90.9,
  active_incidents: 2,
  crowd_density_overall: 0.65,
  seating_zones: [
    { name: "North Stand", capacity: 18000, current_occupancy: 15200, risk_level: "Low" },
    { name: "South Stand (Active Fans)", capacity: 18000, current_occupancy: 17800, risk_level: "Medium" },
    { name: "East Stand", capacity: 20000, current_occupancy: 16900, risk_level: "Low" },
    { name: "West Stand (VIP)", capacity: 19000, current_occupancy: 18300, risk_level: "Medium" }
  ],
  gates: [
    { name: "Gate A (Main North)", status: "Open", wait_time_minutes: 8, flow_rate_per_min: 140, current_queue: 150 },
    { name: "Gate B (West Transit)", status: "Open", wait_time_minutes: 15, flow_rate_per_min: 110, current_queue: 380 },
    { name: "Gate C (South Metro)", status: "Open", wait_time_minutes: 22, flow_rate_per_min: 95, current_queue: 540 },
    { name: "Gate D (East Parking)", status: "Open", wait_time_minutes: 5, flow_rate_per_min: 150, current_queue: 80 }
  ],
  transport: [
    { name: "Metro Line 1 (North Bound)", status: "On Time", delay_minutes: 0, load_factor: 0.85, estimated_arrival_minutes: 3 },
    { name: "Metro Line 2 (City Center)", status: "On Time", delay_minutes: 0, load_factor: 0.70, estimated_arrival_minutes: 5 },
    { name: "Express Shuttle 26 (East Lot)", status: "On Time", delay_minutes: 2, load_factor: 0.90, estimated_arrival_minutes: 4 },
    { name: "Uber/Lyft Ride-share Area", status: "Crowded", delay_minutes: 12, load_factor: 0.95, estimated_arrival_minutes: 10 }
  ],
  sustainability: {
    energy_kwh: 4820.5,
    water_liters: 124500.0,
    waste_kg: 1850.2,
    carbon_g: 345.8
  },
  alerts: [
    {
      id: "1",
      timestamp: "15:42",
      severity: "Warning",
      agent: "Operations",
      message: "Gate B crowd inflow is bottlenecking. Recommended redirecting Metro arrivals to Gate A.",
      resolved: false
    },
    {
      id: "2",
      timestamp: "15:48",
      severity: "Info",
      agent: "Sustainability",
      message: "Solar panel arrays are running at 94% efficiency, supplying 28% of current match energy.",
      resolved: false
    }
  ],
  executive_summary: "All systems operating normally. Stadium attendance is stable at 91% capacity."
};

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryState>(DEFAULT_STATE);
  const [isConnected, setIsConnected] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fallback simulation generator (in case backend is offline)
  useEffect(() => {
    let mockInterval: NodeJS.Timeout;

    const connectWS = () => {
      // Dynamically resolve backend API and WebSocket endpoints
      const apiUrl = API_BASE_URL;
      const wsProto = apiUrl.startsWith("https") ? "wss" : "ws";
      const wsHost = apiUrl.replace(/^https?:\/\//, "");
      const wsUrl = `${wsProto}://${wsHost}/ws/telemetry`;
      
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;


      ws.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected successfully.");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTelemetry(data);
        } catch (err) {
          console.error("Failed to parse WS data", err);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket connection error. Standing by for mock updates.", err);
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected. Activating high-fidelity offline mock telemetry loop.");
        startMockLoop();
      };
    };

    const startMockLoop = () => {
      mockInterval = setInterval(() => {
        setTelemetry((prev) => {
          // Generate small random drifts
          const updatedGates = prev.gates.map((g) => {
            if (g.status === "Closed") return g;
            const deltaQueue = Math.floor(Math.random() * 30) - 13;
            const queue = Math.max(10, g.current_queue + deltaQueue);
            return {
              ...g,
              current_queue: queue,
              wait_time_minutes: Math.max(1, Math.floor(queue / (g.flow_rate_per_min / 5)))
            };
          });

          const updatedTransport = prev.transport.map((t) => {
            if (t.estimated_arrival_minutes === null) return t;
            let eta = t.estimated_arrival_minutes - 1;
            if (eta <= 0) eta = Math.floor(Math.random() * 6) + 6;
            return { ...t, estimated_arrival_minutes: eta };
          });

          return {
            ...prev,
            timestamp: new Date().toLocaleTimeString(),
            gates: updatedGates,
            transport: updatedTransport,
            sustainability: {
              energy_kwh: prev.sustainability.energy_kwh + Math.random() * 5 + 2,
              water_liters: prev.sustainability.water_liters + Math.random() * 15 + 5,
              waste_kg: prev.sustainability.waste_kg + Math.random() * 1.5 + 0.3,
              carbon_g: prev.sustainability.carbon_g + Math.random() * 0.2 + 0.05
            }
          };
        });
      }, 2000);
    };

    // Try starting WebSocket
    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (mockInterval) clearInterval(mockInterval);
    };
  }, []);

  const triggerSimulation = async (scenarioType: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_type: scenarioType })
      });
      if (response.ok) {
        const result = await response.json();
        setActiveSimulation(scenarioType);
        // Instantly fetch updated state
        const telRes = await fetch(`${API_BASE_URL}/api/v1/telemetry`);
        if (telRes.ok) {
          const newState = await telRes.json();
          setTelemetry(newState);
        }
        return result;
      }
    } catch (e) {
      console.warn("Failed to communicate with simulator backend. Enabling client-side mock simulation.", e);
      applyClientSideSimulation(scenarioType);
    }
  };

  const clearSimulation = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/simulate/clear`, { method: "POST" });
    } catch (e) {
      console.warn("Backend unavailable to clear simulation. Performing client-side reset.", e);
    }
    setActiveSimulation(null);
    setTelemetry(DEFAULT_STATE);
  };

  // Client-side simulation logic for fallback reliability
  const applyClientSideSimulation = (scenarioType: string) => {
    setActiveSimulation(scenarioType);
    setTelemetry((prev) => {
      let attendance_total = prev.attendance_total;
      let active_incidents = prev.active_incidents;
      let density = prev.crowd_density_overall;
      let exec = prev.executive_summary;
      let gates = [...prev.gates];
      let transport = [...prev.transport];
      let alerts = [...prev.alerts];

      if (scenarioType === "gate_closure") {
        gates = gates.map((g) => {
          if (g.name.includes("Gate C")) {
            return { ...g, status: "Closed", wait_time_minutes: 999, current_queue: 0 };
          }
          return { ...g, current_queue: g.current_queue + 120, wait_time_minutes: g.wait_time_minutes + 15 };
        });
        exec = "CRITICAL (Client Mock): Gate C is CLOSED. Pedestrians diverted to Gate A/D. Gate B queue time at 37m.";
        alerts.push({
          id: String(alerts.length + 1),
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          severity: "Critical",
          agent: "Operations",
          message: "Gate C shut down due to structural lock error. Directing to adjacent sectors.",
          resolved: false
        });
      } else if (scenarioType === "rain") {
        exec = "WEATHER ALERT (Client Mock): Rain detected.Retractable roof closing. Concourse density is peaking.";
        gates = gates.map(g => ({ ...g, wait_time_minutes: g.wait_time_minutes + 5 }));
        transport = transport.map(t => ({ ...t, status: "Delayed", delay_minutes: t.delay_minutes + 12 }));
        alerts.push({
          id: String(alerts.length + 1),
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          severity: "Warning",
          agent: "Transport",
          message: "Precipitation trigger. Storm delay margins applied across transit shuttle schedules.",
          resolved: false
        });
      } else if (scenarioType === "metro_shutdown") {
        transport = transport.map(t => {
          if (t.name.includes("Metro Line 2")) {
            return { ...t, status: "Suspended", estimated_arrival_minutes: null, load_factor: 0 };
          }
          return { ...t, status: "Crowded", delay_minutes: t.delay_minutes + 25, load_factor: 1.0 };
        });
        exec = "TRANSPORT ALERT (Client Mock): Metro Line 2 suspended. Commuters shifting to parking lots and Ride-shares.";
        alerts.push({
          id: String(alerts.length + 1),
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          severity: "Critical",
          agent: "Transport",
          message: "Metro Line 2 track signal malfunction. Operations staging emergency shuttles.",
          resolved: false
        });
      } else if (scenarioType === "attendance_surge") {
        attendance_total = Math.min(75000, Math.floor(attendance_total * 1.15));
        density = 0.95;
        exec = "CAPACITY ALERT (Client Mock): 30% attendance surge. Seating Zone occupancy nearing peak. Control flow active.";
      } else if (scenarioType === "medical_emergency") {
        active_incidents += 1;
        exec = "MEDICAL EMERGENCY (Client Mock): Local EMT dispatch to Section 112, Row F. Elevator 4 locked for medical VIP transit.";
      }

      return {
        ...prev,
        attendance_total,
        active_incidents,
        crowd_density_overall: density,
        executive_summary: exec,
        gates,
        transport,
        alerts
      };
    });
  };

  return {
    telemetry,
    isConnected,
    activeSimulation,
    triggerSimulation,
    clearSimulation
  };
}
