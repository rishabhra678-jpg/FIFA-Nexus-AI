"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/config";
import { UserCheck, Shield, HelpCircle, FileText, CheckSquare, Search, ClipboardList, MapPin } from "lucide-react";

export default function VolunteerPortal() {
  const [activeTab, setActiveTab] = useState<"sop" | "missing_child" | "tasks" | "lost_found">("missing_child");
  const [childName, setChildName] = useState("");
  const [childDesc, setChildDesc] = useState("Blue shirt, khaki shorts, age 6");
  const [lastSeen, setLastSeen] = useState("Section 104 Food Court");
  const [amberActive, setAmberActive] = useState(false);
  const [amberSOP, setAmberSOP] = useState<string[]>([]);
  const [sopQuery, setSopQuery] = useState("");
  
  // Tasks list
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify Elevator 4 wheelchair ramp status", completed: true },
    { id: 2, text: "Perform safety sweep of Section 202 aisles", completed: false },
    { id: 3, text: "Supply manual maps to Gate B Info Kiosk", completed: false },
    { id: 4, text: "Assist lost guest at turnstile corridor C", completed: false }
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleTriggerCodeAmber = () => {
    if (!childDesc.trim() || !lastSeen.trim()) return;
    setAmberActive(true);
    setAmberSOP([
      `1. Lockdown Section: Enact localized corridor containment around ${lastSeen}.`,
      "2. Alert Exits: Dispatched Amber instructions to turnstiles at Gate A, B, and C.",
      "3. CCTV Lock: Directing security camera dome 14 to trace last-seen time tags.",
      "4. Volunteer Deployment: Stationing adjacent volunteer sweepers to check nearest washrooms."
    ]);
    
    // Push alert to backend
    fetch(`${API_BASE_URL}/api/v1/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Code Amber: Missing Child (${childName || "Unnamed"})`,
        location: lastSeen,
        severity: "High",
        description: `Description: ${childDesc}. Last seen near ${lastSeen}. Enact lockdown SOP.`,
        reporter: "Volunteer"
      })
    }).catch(e => console.warn("Failed to notify backend: offline.", e));
  };

  const handleCancelAmber = () => {
    setAmberActive(false);
    setAmberSOP([]);
  };

  const sops = [
    { title: "Missing Child Workflow (Code Amber)", category: "Security", id: "amber" },
    { title: "Medical Distress response (Cardiac/Faint)", category: "Medical", id: "medical" },
    { title: "Lost & Found Item Retrieval", category: "Operations", id: "lost" },
    { title: "Slippery Surface / Hazard Mitigation", category: "Safety", id: "hazard" }
  ];

  const filteredSops = sops.filter(s => s.title.toLowerCase().includes(sopQuery.toLowerCase()));

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-brand-gold animate-pulse" /> VOLUNTEER COPILOT CONTROL
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Standard operating procedures guide, active incidents logger and volunteer tasks dashboard
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border">
        {(["missing_child", "sop", "tasks", "lost_found"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab
                ? "border-brand-gold text-brand-gold bg-slate-900/30"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Active Tab view (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Active: Missing Child Workflow */}
          {activeTab === "missing_child" && (
            <div className="glass-card p-6 space-y-6">
              <div>
                <h3 className="font-bold text-white text-sm tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-gold" /> INTERACTIVE MISSING CHILD PROTOCOL (CODE AMBER)
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Step-by-step walkthrough workflow guidance</p>
              </div>

              {!amberActive ? (
                <div className="space-y-4 font-mono text-xs max-w-xl">
                  <div className="space-y-2">
                    <label className="text-slate-400 block uppercase tracking-wider text-[10px]">Child's Name (Optional)</label>
                    <input 
                      type="text" 
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g., Liam"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 block uppercase tracking-wider text-[10px]">Visual Indicators & Clothing</label>
                    <input 
                      type="text" 
                      value={childDesc}
                      onChange={(e) => setChildDesc(e.target.value)}
                      placeholder="e.g., Yellow hat, blue shirt, age 7"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 block uppercase tracking-wider text-[10px]">Last Seen Location</label>
                    <input 
                      type="text" 
                      value={lastSeen}
                      onChange={(e) => setLastSeen(e.target.value)}
                      placeholder="e.g., Section 104 concession block"
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <button 
                    onClick={handleTriggerCodeAmber}
                    className="px-6 py-3 rounded bg-gradient-to-r from-brand-red to-brand-gold font-bold text-white hover:opacity-95"
                  >
                    ACTIVATE CODE AMBER LOCKDOWN
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-brand-red/10 border border-brand-red/40 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-brand-red uppercase font-bold tracking-widest block animate-pulse">
                        CODE AMBER ACTIVE CORRIDOR LOCKDOWN
                      </span>
                      <p className="text-xs text-slate-300 font-mono">
                        Targeting {childName || "Unnamed Child"} | Visual: {childDesc} | Last Seen: {lastSeen}
                      </p>
                    </div>
                    <button 
                      onClick={handleCancelAmber}
                      className="px-3 py-1.5 rounded bg-slate-900 border border-card-border text-xs text-slate-300 hover:text-white"
                    >
                      Cancel SOP
                    </button>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-lg border border-card-border space-y-3 font-mono text-xs">
                    <span className="font-bold text-brand-gold text-[10px] tracking-wide uppercase">ACTIVE ACTION CHECKLIST:</span>
                    <div className="space-y-3.5">
                      {amberSOP.map((sopStep, idx) => (
                        <div key={idx} className="flex gap-3 leading-relaxed text-slate-300">
                          <CheckSquare className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                          <p>{sopStep}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active: SOP Manual Finder */}
          {activeTab === "sop" && (
            <div className="glass-card p-6 space-y-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    value={sopQuery}
                    onChange={(e) => setSopQuery(e.target.value)}
                    placeholder="Search SOP folders (e.g. cardiac, lost item)..."
                    className="w-full pl-9 pr-4 py-2 rounded bg-slate-900 border border-card-border focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredSops.map((sop, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/60 border border-card-border rounded-lg flex justify-between items-center hover:bg-slate-800/40 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs font-semibold text-white font-mono">{sop.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-card-border text-slate-400 font-mono uppercase">
                      {sop.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active: Tasks Board */}
          {activeTab === "tasks" && (
            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm tracking-wider flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-brand-gold" /> ASSIGNED AREA DUTIES
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Shift checklists & turnstile patrols</p>
              </div>

              <div className="space-y-2.5">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="p-3 bg-slate-900/60 border border-card-border rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-850"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      task.completed ? "bg-brand-emerald border-brand-emerald text-black" : "border-slate-600"
                    }`}>
                      {task.completed && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`text-xs font-mono ${task.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active: Lost & Found */}
          {activeTab === "lost_found" && (
            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm tracking-wider">LOG NEW FOUND ITEM</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase">Enter item tags for direct AI database pairing</p>
              </div>

              <div className="space-y-4 font-mono text-xs max-w-md">
                <div className="space-y-2">
                  <label className="text-slate-400 block uppercase text-[10px]">Item Description</label>
                  <input type="text" placeholder="e.g., Black Leather Wallet, Visa inside" className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 block uppercase text-[10px]">Found Location</label>
                  <input type="text" placeholder="e.g., Section 112 Row D" className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border" />
                </div>
                <button className="px-5 py-2.5 bg-brand-gold text-slate-950 font-bold rounded">
                  LOG INTO INVENTORY
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right pane: Quick SOP Help (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-gold" /> QUICK VOLUNTEER FAQS
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-slate-400 font-mono">
              <div className="p-3 bg-slate-900/60 rounded-lg border border-card-border space-y-1">
                <span className="text-[10px] font-bold text-white block">Where is Medical Staging 2?</span>
                <p className="text-[11px]">Located right behind Sector West 4 turnstiles. Next to Elevator Lobby 3.</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-card-border space-y-1">
                <span className="text-[10px] font-bold text-white block">How do I access High Contrast keys?</span>
                <p className="text-[11px]">Toggle the 'High Contrast' option in the sidebar settings box.</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-card-border space-y-1">
                <span className="text-[10px] font-bold text-white block">Lost property center location?</span>
                <p className="text-[11px]">Information Center 2 (South West Stand).</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
