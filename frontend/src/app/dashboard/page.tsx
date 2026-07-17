"use client";

import React, { useState } from "react";
import { 
  Users, AlertTriangle, Activity, Train, Leaf, 
  Play, RotateCcw, AlertOctagon, HelpCircle, Volume2, ShieldCheck, RefreshCw
} from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";
import LiveMap from "@/components/LiveMap";

export default function Dashboard() {
  const { 
    telemetry, 
    isConnected, 
    activeSimulation, 
    triggerSimulation, 
    clearSimulation 
  } = useTelemetry();

  const [simulating, setSimulating] = useState(false);
  const [simulationReport, setSimulationReport] = useState<any>(null);

  const handleSimulate = async (type: string) => {
    setSimulating(true);
    setSimulationReport(null);
    try {
      const res = await triggerSimulation(type);
      if (res) {
        setSimulationReport(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const handleReset = () => {
    clearSimulation();
    setSimulationReport(null);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Top HUD Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="glass-card p-4 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Total Spectators</span>
            <div className="text-2xl font-black text-white font-tech">
              {telemetry.attendance_total.toLocaleString()}
            </div>
            <span className="text-[10px] text-brand-gold font-mono">{telemetry.attendance_percentage}% Capacity</span>
          </div>
          <div className="p-3 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red">
            <Users className="w-5 h-5" />
          </div>
          {/* Animated background bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-brand-gold transition-all duration-500" style={{ width: `${telemetry.attendance_percentage}%` }}></div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-4 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Active Incidents</span>
            <div className={`text-2xl font-black font-tech ${telemetry.active_incidents > 0 ? "text-brand-red animate-pulse" : "text-brand-emerald"}`}>
              {telemetry.active_incidents}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Dispatches active</span>
          </div>
          <div className={`p-3 rounded-lg ${telemetry.active_incidents > 0 ? "bg-brand-red/10 border border-brand-red/20 text-brand-red" : "bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald"}`}>
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-brand-red w-0"></div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-4 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Crowd Density Index</span>
            <div className="text-2xl font-black text-white font-tech">
              {telemetry.crowd_density_overall}
            </div>
            <span className="text-[10px] text-brand-cyan font-mono">Safe Range &lt; 0.85</span>
          </div>
          <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
            <Activity className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-brand-cyan transition-all duration-500" style={{ width: `${telemetry.crowd_density_overall * 100}%` }}></div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-4 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Power Sustainability</span>
            <div className="text-2xl font-black text-brand-emerald font-tech">
              {Math.round(telemetry.sustainability.energy_kwh).toLocaleString()} kWh
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Real-time Solar & Storage Grid</span>
          </div>
          <div className="p-3 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-brand-emerald w-[75%]"></div>
        </div>

      </div>

      {/* Main Core Layout: 3 Columns on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Live Map & Executive Summary (7/12 width) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Executive Summary */}
          <div className="glass-card p-5 bg-gradient-to-r from-brand-red/5 to-slate-900 border-l-4 border-brand-red space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-brand-gold tracking-widest uppercase flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-brand-red" /> Operations Executive Directive
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Auto-updated {telemetry.timestamp}</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-mono">
              "{telemetry.executive_summary}"
            </p>
          </div>

          <div className="flex-1">
            <LiveMap telemetry={telemetry} activeSimulation={activeSimulation} />
          </div>
        </div>

        {/* Column 2: Live Alerts & Transport Queue HUD (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* What-If Simulator Controller */}
          <div className="glass-card p-5 border border-cyber-border space-y-4">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <div>
                <h3 className="font-bold text-white text-xs tracking-wider">WHAT-IF SCENARIO SIMULATOR</h3>
                <p className="text-[9px] text-slate-500 font-mono uppercase">Predictive stress-testing engine</p>
              </div>
              {activeSimulation && (
                <button 
                  onClick={handleReset}
                  className="px-2.5 py-1 text-[10px] font-semibold rounded bg-brand-red/10 border border-brand-red/20 text-brand-red hover:bg-brand-red/20 flex items-center gap-1.5 font-mono"
                >
                  <RotateCcw className="w-3 h-3" /> RESET BASELINE
                </button>
              )}
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => handleSimulate("gate_closure")}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold font-mono flex items-center justify-between transition-all ${
                  activeSimulation === "gate_closure"
                    ? "bg-brand-red/20 border-brand-red text-white"
                    : "bg-slate-900 border-card-border text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>Gate C Closes</span>
                <Play className="w-3 h-3" />
              </button>
              <button 
                onClick={() => handleSimulate("rain")}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold font-mono flex items-center justify-between transition-all ${
                  activeSimulation === "rain"
                    ? "bg-brand-gold/20 border-brand-gold text-white"
                    : "bg-slate-900 border-card-border text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>Sudden Storm</span>
                <Play className="w-3 h-3" />
              </button>
              <button 
                onClick={() => handleSimulate("metro_shutdown")}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold font-mono flex items-center justify-between transition-all ${
                  activeSimulation === "metro_shutdown"
                    ? "bg-blue-600/20 border-blue-500 text-white"
                    : "bg-slate-900 border-card-border text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>Metro Line 2 Off</span>
                <Play className="w-3 h-3" />
              </button>
              <button 
                onClick={() => handleSimulate("attendance_surge")}
                className={`p-2.5 rounded-lg border text-left text-xs font-semibold font-mono flex items-center justify-between transition-all ${
                  activeSimulation === "attendance_surge"
                    ? "bg-purple-600/20 border-purple-500 text-white"
                    : "bg-slate-900 border-card-border text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>+30% Inflow Surge</span>
                <Play className="w-3 h-3" />
              </button>
            </div>

            {/* Simulated report snippet if active */}
            {activeSimulation && (
              <div className="p-3 bg-slate-950 rounded-lg border border-card-border space-y-2 text-xs animate-fadeIn">
                <span className="font-bold text-brand-gold block text-[10px] tracking-wide font-mono uppercase">
                  SIMULATION ACTIVE: {activeSimulation.replace("_", " ")}
                </span>
                
                {simulationReport ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {simulationReport.ai_mitigation_plan.slice(0, 180)}...
                    </p>
                    <div className="border-t border-card-border pt-2">
                      <span className="text-[9px] text-slate-500 font-mono block mb-1">RECOMMENDED ACTIONS:</span>
                      <ul className="list-disc pl-4 space-y-1 font-mono text-[10px] text-slate-300">
                        {simulationReport.recommended_actions?.slice(0, 2).map((act: string, i: number) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching mitigation vectors...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Alerts feed */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-white text-xs tracking-wider">AI STADIUM INTELLIGENCE ALERTS</h3>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Consolidated multi-agent notification log</p>
            </div>

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {telemetry.alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border flex gap-3 text-xs ${
                    alert.severity === "Critical"
                      ? "bg-brand-red/10 border-brand-red/30 text-slate-100"
                      : alert.severity === "Warning"
                      ? "bg-brand-gold/10 border-brand-gold/20 text-slate-100"
                      : "bg-slate-900 border-card-border text-slate-200"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    alert.severity === "Critical" ? "text-brand-red animate-pulse" : alert.severity === "Warning" ? "text-brand-gold" : "text-brand-cyan"
                  }`} />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className="font-bold font-mono text-[9px] uppercase text-brand-gold">{alert.agent} Agent</span>
                      <span className="text-[9px] text-slate-500 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300 font-mono">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Status List */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-white text-xs tracking-wider">TRANSPORTATION DEPARTURE RADAR</h3>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Metro & vehicle queue capacity</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {telemetry.transport.map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-bold">{t.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      t.status === "On Time" ? "bg-brand-emerald/10 text-brand-emerald" : "bg-brand-red/10 text-brand-red"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Load meter */}
                    <div className="flex-1 bg-slate-900 border border-card-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-brand-cyan h-full rounded-full transition-all duration-500" 
                        style={{ width: `${t.load_factor * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 w-16 text-right">
                      {t.estimated_arrival_minutes ? `${t.estimated_arrival_minutes}m ETA` : "Suspended"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
