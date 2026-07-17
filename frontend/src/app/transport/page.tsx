"use client";

import React from "react";
import { Route, Train, AlertTriangle, Navigation, Clock, RefreshCw } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function TransportDashboard() {
  const { telemetry } = useTelemetry();

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Route className="w-8 h-8 text-brand-cyan animate-pulse" /> TRANSPORTATION COMMAND CONSOLE
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Real-time metro line delays, parking lot occupancies, and AI departure optimization
        </p>
      </div>

      {/* Dynamic Departure Optimizer Panel */}
      <div className="glass-card p-5 bg-gradient-to-r from-brand-cyan/5 to-slate-900 border-l-4 border-brand-cyan space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-brand-gold tracking-widest uppercase font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-cyan animate-spin" style={{ animationDuration: "6s" }} /> AI Optimal Departure Windows
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase">Real-Time Forecast</span>
        </div>
        <p className="text-slate-200 text-xs font-mono leading-relaxed">
          <strong>Recommended Window:</strong> Depart immediately via East Walkway to Gate D shuttles, OR delay departure by 25 minutes. Metro platforms at Gate C are experiencing peak boarding densities (85% load factor, 15m waits). Waiting inside the stadium for food court discounts will clear the main surge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Line Statuses & Fills (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider uppercase">Live Transit Link Telemetry</h3>
            
            <div className="space-y-4 font-mono text-xs">
              {telemetry.transport.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-900/60 border border-card-border rounded-lg space-y-3">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white text-[11px] block">{t.name}</span>
                      <p className="text-[9px] text-slate-500">Wait times fluctuate with arrival waves</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        t.status === "On Time" ? "bg-brand-emerald/10 text-brand-emerald" : "bg-brand-red/10 text-brand-red animate-pulse"
                      }`}>
                        {t.status}
                      </span>
                      {t.delay_minutes > 0 && (
                        <p className="text-[9px] text-brand-red font-bold mt-1">+{t.delay_minutes} min delay</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Passenger Load Factor</span>
                      <span>{Math.round(t.load_factor * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 border border-card-border h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          t.load_factor > 0.85 ? "bg-brand-red" : t.load_factor > 0.60 ? "bg-brand-gold" : "bg-brand-cyan"
                        }`}
                        style={{ width: `${t.load_factor * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-card-border/50">
                    <span className="text-slate-500">Service Frequency: 3-5m</span>
                    <span className="text-brand-gold font-bold">{t.estimated_arrival_minutes ? `Next arrival: ${t.estimated_arrival_minutes} mins` : "Suspended"}</span>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Parking lots fill (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider uppercase">PARKING LOT OCCUPANCIES</h3>
            
            <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-400">
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-white text-[11px]">
                  <span>North Parking (Lot A)</span>
                  <span>92% Full</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-red h-full w-[92%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white text-[11px]">
                  <span>East Parking (Lot B)</span>
                  <span>48% Full</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-cyan h-full w-[48%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white text-[11px]">
                  <span>Ride-share Staging (Lot C)</span>
                  <span>84% Full</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-gold h-full w-[84%]" />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 pt-2 border-t border-card-border/50">
                Dynamic routing is redirecting approaching vehicles away from Lot A towards Lot B, utilizing highway signs.
              </p>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
