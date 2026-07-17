"use client";

import React, { useState } from "react";
import { Info, MapPin, Route, ShieldAlert, AlertTriangle } from "lucide-react";
import { TelemetryState, SeatingZone } from "@/hooks/useTelemetry";

interface LiveMapProps {
  telemetry: TelemetryState;
  activeSimulation: string | null;
  selectedRoute?: number[][] | null;
}

export default function LiveMap({ telemetry, activeSimulation, selectedRoute }: LiveMapProps) {
  const [selectedElement, setSelectedElement] = useState<{ type: string; name: string; details: string } | null>(null);

  // Check details
  const handleZoneClick = (zone: SeatingZone) => {
    setSelectedElement({
      type: "Seating Stand",
      name: zone.name,
      details: `Capacity: ${zone.capacity.toLocaleString()} | Occupancy: ${zone.current_occupancy.toLocaleString()} (${Math.round((zone.current_occupancy / zone.capacity) * 100)}%) | Risk Index: ${zone.risk_level}`
    });
  };

  const handleGateClick = (name: string) => {
    const gate = telemetry.gates.find(g => g.name.includes(name));
    if (gate) {
      setSelectedElement({
        type: "Gate Entry Node",
        name: gate.name,
        details: `Status: ${gate.status} | Active Queue: ${gate.current_queue} persons | Est. Wait: ${gate.wait_time_minutes} mins | Intake rate: ${gate.flow_rate_per_min}/min`
      });
    }
  };

  // Check overrides
  const isGateCClosed = telemetry.gates.some(g => g.name.includes("Gate C") && g.status === "Closed");
  const isRainActive = activeSimulation === "rain";
  const isMedicalEmergencyActive = telemetry.alerts.some(a => a.message.includes("MEDICAL") || a.message.includes("INCIDENT") && a.message.includes("Section 112"));

  return (
    <div className="glass-card p-6 flex flex-col h-full space-y-4 relative overflow-hidden">
      
      {/* Map Header */}
      <div className="flex justify-between items-center border-b border-card-border pb-4">
        <div>
          <h2 className="font-bold text-white flex items-center gap-2 text-sm tracking-wider">
            <MapPin className="w-4 h-4 text-brand-red" /> LIVE STADIUM SPATIAL COGNITION
          </h2>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">Interactive SVG Heatmap & Sensor Overlays</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-card-border text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
            Sensors: Active
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative flex-1 flex items-center justify-center min-h-[300px] bg-slate-950/80 rounded-xl border border-card-border p-4">
        <svg viewBox="0 0 500 450" className="w-full h-full max-h-[380px]">
          
          {/* Grid Overlay inside SVG */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Metro Line 2 (City Route) */}
          <path 
            d="M 50 420 L 250 420 L 450 420" 
            fill="none" 
            stroke={activeSimulation === "metro_shutdown" ? "#ef4444" : "#1d4ed8"} 
            strokeWidth="4" 
            strokeDasharray={activeSimulation === "metro_shutdown" ? "4,4" : "none"}
            className="transition-colors duration-500"
          />
          <text x="50" y="440" fill="#64748b" className="text-[9px] font-mono">Metro Transit Line 2</text>
          {activeSimulation === "metro_shutdown" && (
            <text x="220" y="415" fill="#ef4444" className="text-[9px] font-mono font-bold animate-pulse">SUSPENDED</text>
          )}

          {/* Stadium Footprint (Outer Ring) */}
          <ellipse cx="250" cy="200" rx="190" ry="140" fill="none" stroke="#222f4d" strokeWidth="6" />
          <ellipse cx="250" cy="200" rx="180" ry="130" fill="none" stroke="#00f2fe" strokeWidth="1" strokeOpacity="0.3" />

          {/* Retractable Roof Ring (Flashing if closing/closed in Rain) */}
          {isRainActive && (
            <ellipse 
              cx="250" 
              cy="200" 
              rx="110" 
              ry="75" 
              fill="rgba(34, 47, 77, 0.4)" 
              stroke="#d4af37" 
              strokeWidth="2" 
              strokeDasharray="5,5" 
              className="animate-spin" 
              style={{ transformOrigin: "250px 200px", animationDuration: "30s" }}
            />
          )}

          {/* Seating stands polygons */}
          
          {/* North Stand */}
          <path 
            d="M 120 120 C 180 80, 320 80, 380 120 L 350 150 C 310 125, 190 125, 150 150 Z" 
            fill="rgba(0, 242, 254, 0.08)" 
            stroke="#222f4d" 
            strokeWidth="1.5"
            onClick={() => handleZoneClick(telemetry.seating_zones[0])}
            className="hover:fill-brand-cyan/20 cursor-pointer transition-all"
          />
          <text x="250" y="110" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-mono pointer-events-none">North Stand</text>

          {/* South Stand (Active Fans) */}
          <path 
            d="M 120 280 C 180 320, 320 320, 380 280 L 350 250 C 310 275, 190 275, 150 250 Z" 
            fill={activeSimulation === "attendance_surge" ? "rgba(233, 27, 76, 0.18)" : "rgba(212, 175, 55, 0.08)"} 
            stroke="#222f4d" 
            strokeWidth="1.5"
            onClick={() => handleZoneClick(telemetry.seating_zones[1])}
            className="hover:fill-brand-gold/20 cursor-pointer transition-all"
          />
          <text x="250" y="300" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-mono pointer-events-none">South Stand</text>

          {/* East Stand */}
          <path 
            d="M 380 120 C 430 170, 430 230, 380 280 L 350 250 C 390 215, 390 185, 350 150 Z" 
            fill="rgba(0, 242, 254, 0.08)" 
            stroke="#222f4d" 
            strokeWidth="1.5"
            onClick={() => handleZoneClick(telemetry.seating_zones[2])}
            className="hover:fill-brand-cyan/20 cursor-pointer transition-all"
          />
          <text x="390" y="205" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-mono pointer-events-none" style={{ writingMode: "vertical-rl" }}>East Stand</text>

          {/* West Stand (VIP) */}
          <path 
            d="M 120 120 C 70 170, 70 230, 120 280 L 150 250 C 110 215, 110 185, 150 150 Z" 
            fill="rgba(212, 175, 55, 0.08)" 
            stroke="#222f4d" 
            strokeWidth="1.5"
            onClick={() => handleZoneClick(telemetry.seating_zones[3])}
            className="hover:fill-brand-gold/20 cursor-pointer transition-all"
          />
          <text x="110" y="205" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-mono pointer-events-none" style={{ writingMode: "vertical-rl" }}>West Stand (VIP)</text>

          {/* Stadium Pitch Center Green Field */}
          <ellipse cx="250" cy="200" rx="90" ry="60" fill="#0b1712" stroke="#10b981" strokeWidth="2" strokeOpacity="0.4" />
          <ellipse cx="250" cy="200" rx="80" ry="50" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />

          {/* Dynamic SVG Routes for Navigation / Wheelchair */}
          {selectedRoute && selectedRoute.length > 1 && (
            <path
              d={`M ${selectedRoute.map(coord => coord.join(" ")).join(" L ")}`}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8,5"
              className="animate-pulse"
              style={{ animationDuration: "1.5s" }}
            />
          )}

          {/* Evacuation dashed route if emergency triggers */}
          {activeSimulation === "gate_closure" && (
            <path
              d="M 250 310 L 250 370 L 370 370 L 400 330"
              fill="none"
              stroke="#e91b4c"
              strokeWidth="2"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
          )}

          {/* Gate Nodes */}

          {/* Gate A (Main North) */}
          <g className="cursor-pointer" onClick={() => handleGateClick("Gate A")}>
            <circle cx="250" cy="40" r="14" fill="#0f1626" stroke="#00f2fe" strokeWidth="2" />
            <text x="250" y="44" fill="#00f2fe" textAnchor="middle" className="text-[10px] font-bold font-mono">A</text>
          </g>

          {/* Gate B (West Transit) */}
          <g className="cursor-pointer" onClick={() => handleGateClick("Gate B")}>
            <circle cx="45" cy="200" r="14" fill="#0f1626" stroke="#d4af37" strokeWidth="2" />
            <text x="45" y="204" fill="#d4af37" textAnchor="middle" className="text-[10px] font-bold font-mono">B</text>
          </g>

          {/* Gate C (South Metro) */}
          <g className="cursor-pointer" onClick={() => handleGateClick("Gate C")}>
            <circle 
              cx="250" 
              cy="360" 
              r="14" 
              fill="#0f1626" 
              stroke={isGateCClosed ? "#ef4444" : "#d4af37"} 
              strokeWidth="2" 
              className={isGateCClosed ? "cyber-glow-red" : ""}
            />
            {isGateCClosed ? (
              <text x="250" y="364" fill="#ef4444" textAnchor="middle" className="text-[11px] font-black font-mono">X</text>
            ) : (
              <text x="250" y="364" fill="#d4af37" textAnchor="middle" className="text-[10px] font-bold font-mono">C</text>
            )}
          </g>

          {/* Gate D (East Parking) */}
          <g className="cursor-pointer" onClick={() => handleGateClick("Gate D")}>
            <circle cx="455" cy="200" r="14" fill="#0f1626" stroke="#00f2fe" strokeWidth="2" />
            <text x="455" y="204" fill="#00f2fe" textAnchor="middle" className="text-[10px] font-bold font-mono">D</text>
          </g>

          {/* Telemetry Crowd Density Heatmap Flashing Nodes */}
          {/* Hotspot 1 in South stand */}
          <circle cx="280" cy="275" r={activeSimulation === "attendance_surge" ? "20" : "12"} fill="#ef4444" fillOpacity="0.25" className="animate-pulse" />
          <circle cx="280" cy="275" r="4" fill="#ef4444" />

          {/* Hotspot 2 in Weststand VIP */}
          <circle cx="130" cy="180" r="10" fill="#d4af37" fillOpacity="0.2" className="animate-pulse" />
          <circle cx="130" cy="180" r="3" fill="#d4af37" />

          {/* Hotspot 3 in North Gate entrance */}
          <circle cx="250" cy="85" r="8" fill="#10b981" fillOpacity="0.15" />
          <circle cx="250" cy="85" r="3" fill="#10b981" />

          {/* Incident Callout icon */}
          {isMedicalEmergencyActive && (
            <g className="animate-bounce" style={{ transformOrigin: "320px 240px" }}>
              <path d="M 320 240 L 310 220 L 330 220 Z" fill="#ef4444" />
              <circle cx="320" cy="215" r="10" fill="#ef4444" />
              <text x="320" y="219" fill="#fff" textAnchor="middle" className="text-[9px] font-bold font-mono">!</text>
            </g>
          )}

        </svg>
      </div>

      {/* Selected Element Detailed HUD */}
      {selectedElement ? (
        <div className="p-3 bg-slate-900 border border-card-border rounded-lg text-xs flex items-start gap-3 animate-fadeIn">
          <div className="p-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white uppercase text-[10px] tracking-wide text-brand-gold">
                {selectedElement.type}: {selectedElement.name}
              </span>
              <button 
                onClick={() => setSelectedElement(null)} 
                className="text-[10px] text-slate-500 hover:text-white"
              >
                Clear
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{selectedElement.details}</p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-900/30 border border-dashed border-card-border rounded-lg text-xs text-center text-slate-500 font-mono">
          Click any Seating Stand or Gate Node to inspect sensor feeds.
        </div>
      )}

    </div>
  );
}
