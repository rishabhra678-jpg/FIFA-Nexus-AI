"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { ShieldAlert, AlertOctagon, Activity, FileText, CheckCircle, Shield, PlusCircle, RefreshCw } from "lucide-react";

export interface Incident {
  id: string;
  title: string;
  location: string;
  severity: string;
  reporter: string;
  status: string;
  timestamp: string;
  description: string;
  ai_recommendation?: string;
}

export default function SecurityCenter() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Incident Inputs
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [aiDispatchReport, setAiDispatchReport] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/incidents`);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch {
      // Mock defaults
      setIncidents([
        {
          id: "INC-301",
          title: "Active Altercation in Section 202",
          location: "Section 202, Row H",
          severity: "High",
          reporter: "Security",
          status: "On-Scene",
          timestamp: "16:05:01",
          description: "Two fans arguing over seating space. Security Guard team 4 is present on scene attempting mediation.",
          ai_recommendation: "**AI Alert Intervention:** Dispatch backup guards from Zone C turnstile gate. Maintain visual lock-on using CCTV Dome-Camera 14. Place medical stand-by on warning."
        },
        {
          id: "INC-302",
          title: "Spilled Drink / Slip Hazard",
          location: "Concourse Level 2, Food Kiosk 3",
          severity: "Low",
          reporter: "Volunteer",
          status: "Dispatched",
          timestamp: "16:08:44",
          description: "Spilled soda causing extremely slick floor. Multiple fans slipping, no injuries reported yet.",
          ai_recommendation: "**AI Sanitation Alert:** Route active volunteer sweeping team 2. Auto-post 'Caution: Wet Floor' warning on the adjacent digital advertising panel."
        }
      ]);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateIncident = async () => {
    if (!title.trim() || !location.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, severity, description, reporter: "Security" })
      });
      if (res.ok) {
        const newInc = await res.json();
        setAiDispatchReport(newInc.ai_recommendation || "Dispatch complete.");
        // Clear fields
        setTitle("");
        setLocation("");
        setDescription("");
        fetchIncidents();
      }
    } catch {
      // Offline fallback
      const fallbackInc = {
        id: `INC-${300 + incidents.length + 1}`,
        title,
        location,
        severity,
        reporter: "Security",
        status: "Reported",
        timestamp: new Date().toLocaleTimeString(),
        description,
        ai_recommendation: `**AI Emergency Staging Guide:**\n1. Deploy safety details to ${location}.\n2. Alert nearby volunteer monitors.\n3. Position EMT responders at Sector ${location.split(" ")[0]}.`
      };
      setIncidents(prev => [fallbackInc, ...prev]);
      setAiDispatchReport(fallbackInc.ai_recommendation);
      setTitle("");
      setLocation("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIncident = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/incidents/${id}/resolve`, { method: "POST" });
      fetchIncidents();
    } catch {
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc));
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-brand-red animate-pulse" /> SECURITY INTELLIGENCE HUB
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Crowd risk assessment, dynamic hazard dispatching and incident logger
        </p>
      </div>

      {/* Stats Risk Assessment row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-4 flex items-center justify-between border-l-4 border-brand-red">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Crowd Risk Rating</span>
            <div className="text-xl font-bold text-white font-tech">MEDIUM SEVERITY</div>
            <span className="text-[9px] text-slate-500 font-mono">Zones 104-106 at warning levels</span>
          </div>
          <Shield className="w-6 h-6 text-brand-red" />
        </div>

        <div className="glass-card p-4 flex items-center justify-between border-l-4 border-brand-gold">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Intake Flow Index</span>
            <div className="text-xl font-bold text-white font-tech">110 scans/min</div>
            <span className="text-[9px] text-slate-500 font-mono">Turnstiles processing at normal</span>
          </div>
          <Activity className="w-6 h-6 text-brand-gold" />
        </div>

        <div className="glass-card p-4 flex items-center justify-between border-l-4 border-brand-cyan">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">AI CCTV Trackers</span>
            <div className="text-xl font-bold text-white font-tech">142 Cameras Active</div>
            <span className="text-[9px] text-slate-500 font-mono">Anomaly detection engine locked</span>
          </div>
          <ShieldAlert className="w-6 h-6 text-brand-cyan" />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log Incident Form & Dispatch Report (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
              <PlusCircle className="w-4 h-4 text-brand-red" /> FILE SECURITY INCIDENT
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block text-[9px] uppercase">Incident Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Alternating Dispute" 
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block text-[9px] uppercase">Location Zone</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Section 112 Row F" 
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block text-[9px] uppercase">Severity</label>
                <select 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border text-slate-300"
                >
                  <option value="Low">Low (Minor Hazard)</option>
                  <option value="Medium">Medium (Dispute/Slight Hazard)</option>
                  <option value="High">High (Physical Altercation/Injury)</option>
                  <option value="Critical">Critical (Evacuation/Fire)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block text-[9px] uppercase">Incident Details</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details of incident..." 
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border h-20"
                />
              </div>

              <button 
                onClick={handleCreateIncident}
                disabled={loading}
                className="w-full py-2.5 rounded bg-brand-red text-white hover:bg-brand-red/90 font-bold transition-all text-xs"
              >
                {loading ? "Generating dispatch details..." : "DISPATCH EMERGENCY ALERT"}
              </button>
            </div>
          </div>

          {/* AI recommendations log snippet */}
          {aiDispatchReport && (
            <div className="glass-card p-5 bg-gradient-to-tr from-brand-red/5 to-slate-950 border border-brand-red/30 space-y-3 animate-fadeIn">
              <span className="font-bold text-brand-red text-[10px] tracking-widest font-mono uppercase block flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-brand-red" /> AI DISPATCH DIRECTIVE APPLIED
              </span>
              <p className="text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-line">
                {aiDispatchReport}
              </p>
              <button 
                onClick={() => setAiDispatchReport(null)}
                className="text-[10px] font-mono text-slate-500 hover:text-white"
              >
                Dismiss Advice
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Active Incidents List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <div>
                <h3 className="font-bold text-white text-xs tracking-wider">LIVE VENUE INCIDENT TELEMETRY LOG</h3>
                <p className="text-[9px] text-slate-500 font-mono uppercase">Monitored risk factors</p>
              </div>
              <button onClick={fetchIncidents} className="text-slate-500 hover:text-white">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {incidents.filter(inc => inc.status !== "Resolved").length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-card-border rounded-lg">
                  All systems clear. No active incidents reported in the stadium.
                </div>
              ) : (
                incidents.filter(inc => inc.status !== "Resolved").map(inc => (
                  <div key={inc.id} className="p-4 bg-slate-900 border border-card-border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-brand-red uppercase tracking-wider bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded">
                          {inc.severity} Severity
                        </span>
                        <h4 className="font-bold text-white text-xs font-mono pt-1">{inc.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{inc.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                      Location: <strong className="text-white">{inc.location}</strong> | Description: {inc.description}
                    </p>

                    {inc.ai_recommendation && (
                      <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-400 leading-relaxed">
                        <strong className="text-brand-gold uppercase block text-[9px] mb-1">AI Dispatch Guideline:</strong>
                        {inc.ai_recommendation.replace("**AI Alert Intervention:**", "").replace("**AI Sanitation Alert:**", "")}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-card-border/50">
                      <span className="text-[10px] text-brand-gold font-mono flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> Status: {inc.status}
                      </span>
                      <button 
                        onClick={() => handleResolveIncident(inc.id)}
                        className="px-3 py-1 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[10px] font-semibold font-mono hover:bg-brand-emerald/20 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> MARK RESOLVED
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
