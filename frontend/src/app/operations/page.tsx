"use client";

import React, { useState } from "react";
import { SlidersHorizontal, FileText, Volume2, ShieldAlert, CheckCircle, RefreshCw, Layers } from "lucide-react";

export default function OperationsCenter() {
  const [dailyReport, setDailyReport] = useState<any>(null);
  const [announcementType, setAnnouncementType] = useState("general");
  const [announcementOutput, setAnnouncementOutput] = useState<any>(null);
  
  const [emergencyLocation, setEmergencyLocation] = useState("Section 112");
  const [emergencyOutput, setEmergencyOutput] = useState<any>(null);

  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingAnnounce, setLoadingAnnounce] = useState(false);
  const [loadingEmergency, setLoadingEmergency] = useState(false);

  const handleGenerateDailyReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/reports/daily", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDailyReport(data);
      }
    } catch {
      // Mock Fallback
      setDailyReport({
        timestamp: "2026-07-17 16:15",
        title: "FIFA World Cup 2026 - Stadium Operations Daily Report",
        sections: [
          {
            header: "1. Attendance & Gate Flow Summary",
            content: "Overall gate efficiency has been high, handling a peak of 68,200 fans. Gate B experienced a minor turnstile bottleneck due to simultaneous shuttle arrivals but resolved inside 18 minutes. Recommended spacing for transit arrivals for subsequent matchdays."
          },
          {
            header: "2. Security & Medical Log",
            content: "A total of 8 minor incidents reported, including one spectator altercation in Sec 202 and two slick floor reports. EMT teams successfully cleared the Section 112 mock cardiac response within 3.5 minutes. General safety score holds at 96.8%."
          },
          {
            header: "3. Environmental & Sustainability Compliance",
            content: "Energy draw peaked at 6.1M kWh during full storm simulator operations (auxiliary battery load-shedding test successfully passed). Stadium graywater recovery collected 84,000 liters. Carbon footprint offsets tracked 345g CO2/user, matching LEED Gold compliance guidelines."
          }
        ],
        summary: "Stadium infrastructure performed optimally under peak crowd loads. Operations systems are cleared for the next group match."
      });
    } finally {
      setLoadingReport(false);
    }
  };

  const handleGenerateAnnouncement = async () => {
    setLoadingAnnounce(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reports/announcement?type=${announcementType}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAnnouncementOutput(data);
      }
    } catch {
      // Mock Fallback
      let text = "Welcome to FIFA World Cup 2026! We invite all fans to visit the Sustainability Kiosks at Sector 104 and learn about our carbon offset rewards program. Have an enjoyable match!";
      if (announcementType === "weather") {
        text = "Attention all visitors. A rain storm is approaching the venue. The retractable roof is closing. Please move slowly along the stairs and check your step. Concourse cleaning teams are deploying floor dryers. Thank you.";
      } else if (announcementType === "gate_redirect") {
        text = "Operational Announcement: Gate C is experiencing high crowd inflows. Fans arriving via Metro Line 2 are advised to follow directional signals towards the East walkway and enter through Gate D for a 15-minute wait time reduction.";
      } else if (announcementType === "emergency") {
        text = "ALERT: Operational staff, please enact emergency routing procedure D-2. Assist guests to the nearest designated exit points at Gate A and B. Do not use lifts or elevators.";
      }
      setAnnouncementOutput({
        type: announcementType,
        announcement_text: text,
        recommended_volume: announcementType === "emergency" ? "85 dB" : "65 dB",
        duration_seconds: 25,
        languages: ["English", "Spanish", "French"]
      });
    } finally {
      setLoadingAnnounce(false);
    }
  };

  const handleGenerateEmergencyPlan = async () => {
    setLoadingEmergency(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reports/emergency?location=${emergencyLocation}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setEmergencyOutput(data);
      }
    } catch {
      setEmergencyOutput({
        location: emergencyLocation,
        emergency_level: "Level 2 (Localized Emergency)",
        evacuation_zone: "Sector East Zone 3",
        primary_exit: "Gate D (East Parking)",
        secondary_exit: "Gate B",
        first_responders_staging: "Service Portal East 2",
        step_by_step_guidelines: [
          "1. Activate blinking emergency guide-lines in Seating Zones 104-106.",
          "2. Send push notifications to mobile devices in Section 110-114 indicating exit directions.",
          "3. Dispatch 8 Volunteer Crowd Stewards to the foot of Elevator West 2.",
          "4. Lock escalator inputs to downwards-only motion to expedite exiting speeds."
        ]
      });
    } finally {
      setLoadingEmergency(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-8 h-8 text-brand-red animate-pulse" /> VENUE OPERATIONS COCKPIT
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          PA Broadcaster scripting, daily briefing summaries and emergency dispatch maps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Briefing & Reports (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Daily Briefing Generator */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <div>
                <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
                  <FileText className="w-4 h-4 text-brand-gold" /> AI DAILY OPERATIONS BRIEFING
                </h3>
                <p className="text-[9px] text-slate-500 font-mono uppercase">Full operational ledger check</p>
              </div>
              <button 
                onClick={handleGenerateDailyReport}
                disabled={loadingReport}
                className="px-3 py-1.5 rounded bg-brand-gold text-slate-950 font-bold text-[10px] font-mono hover:opacity-90 flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingReport ? "animate-spin" : ""}`} /> GENERATE
              </button>
            </div>

            {dailyReport ? (
              <div className="space-y-4 font-mono text-xs animate-fadeIn">
                <div className="p-3 bg-slate-950 rounded-lg border border-card-border text-[10px] text-slate-400">
                  <span className="font-bold text-white uppercase block text-[9px] mb-1">EXECUTIVE SUMMARY:</span>
                  "{dailyReport.summary}"
                </div>

                <div className="space-y-3">
                  {dailyReport.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-bold text-brand-gold text-[10px] block">{sec.header}</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-card-border rounded-lg">
                Click Generate to compile live stadium telemetry logs into an executive daily operational audit file.
              </div>
            )}
          </div>

          {/* Emergency Plan Generator */}
          <div className="glass-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4 text-brand-red" /> AI EMERGENCY DISPATCH GENERATOR
              </h3>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Location-specific escape plan mapping</p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={emergencyLocation}
                onChange={(e) => setEmergencyLocation(e.target.value)}
                placeholder="e.g. Section 112"
                className="flex-1 px-3 py-2 rounded bg-slate-900 border border-card-border text-xs font-mono focus:outline-none focus:border-brand-red"
              />
              <button 
                onClick={handleGenerateEmergencyPlan}
                disabled={loadingEmergency}
                className="px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded text-xs font-mono"
              >
                COMPILE PLAN
              </button>
            </div>

            {emergencyOutput && (
              <div className="p-4 bg-slate-950 border border-card-border rounded-lg font-mono text-xs space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                  <span className="font-bold text-brand-red">{emergencyOutput.emergency_level}</span>
                  <span className="text-[9px] text-slate-500">Staging: {emergencyOutput.first_responders_staging}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <span className="text-slate-500 uppercase block text-[8px]">PRIMARY EXIT</span>
                    <strong className="text-white">{emergencyOutput.primary_exit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[8px]">SECONDARY EXIT</span>
                    <strong className="text-white">{emergencyOutput.secondary_exit}</strong>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-card-border/30">
                  <span className="font-bold text-brand-gold text-[9px] block">EVACUATION ACTIONS:</span>
                  <ul className="space-y-1 text-[10px] text-slate-300">
                    {emergencyOutput.step_by_step_guidelines.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: PA Announcer script tool (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
                <Volume2 className="w-4 h-4 text-brand-cyan" /> AI PUBLIC ANNOUNCEMENT SCRIPT COMPILER
              </h3>
              <p className="text-[9px] text-slate-500 font-mono uppercase">Multi-lingual audio scripts generator</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 block text-[9px] uppercase">Announcement Scenario</label>
                <select 
                  value={announcementType}
                  onChange={(e) => setAnnouncementType(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-card-border text-slate-300"
                >
                  <option value="general">General (Sustainability promotion / Welcome)</option>
                  <option value="weather">Weather (Storm warning / Retractable roof close)</option>
                  <option value="gate_redirect">Redirection (Redirect Metro commuters to Gate D)</option>
                  <option value="emergency">Evacuation (Gate B lockdown / Direct routes)</option>
                </select>
              </div>

              <button 
                onClick={handleGenerateAnnouncement}
                disabled={loadingAnnounce}
                className="w-full py-2.5 rounded bg-brand-cyan text-slate-950 font-bold transition-all text-xs"
              >
                {loadingAnnounce ? "Compiling PA audio files..." : "COMPILE PUBLIC SCRIPT"}
              </button>
            </div>

            {announcementOutput && (
              <div className="p-4 bg-slate-950 border border-cyber-border rounded-lg font-mono text-xs space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>VOLUME: {announcementOutput.recommended_volume}</span>
                  <span>DURATION: {announcementOutput.duration_seconds}s</span>
                </div>
                
                <div className="p-3 bg-slate-900 rounded border border-card-border text-slate-200 leading-relaxed text-[11px]">
                  "{announcementOutput.announcement_text}"
                </div>

                <div className="flex gap-2">
                  {announcementOutput.languages.map((lang: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-card-border text-[9px] text-brand-gold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
