"use client";

import React, { useState } from "react";
import { MapPin, Search, Navigation, Utensils, AlertCircle, MessageSquare, Send } from "lucide-react";
import LiveMap from "@/components/LiveMap";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function FanAssistant() {
  const { telemetry } = useTelemetry();
  const [seatQuery, setSeatQuery] = useState("Section 104");
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai"; text: string; actions?: string[] }>>([
    {
      sender: "ai",
      text: "Welcome to FIFA World Cup 2026! I am your Stadium Fan Assistant. Ask me how to find your seat, locate concessions, check restroom lines, or get transportation schedules.",
      actions: ["Seat Finder", "Food Recommendations", "Emergency Exit Path"]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState<number[][] | null>(null);

  const handleSeatLookup = () => {
    // Mock seat routing coordinates
    setActiveRoute([[150.0, 80.0], [180.0, 110.0], [200.0, 120.0], [210.0, 125.0]]);
    
    setChatLog(prev => [
      ...prev,
      {
        sender: "ai",
        text: `**Seat Finder Route Active:** Plotted path from Gate B entrance to Section 104, Row K, Seat 12. Total walking time: 4 minutes. Step-free elevators accessible at Sector West.`,
        actions: ["Locate Elevators", "Show Gate B Queue"]
      }
    ]);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userText = textToSend;
    setChatInput("");
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "fan_session_1",
          agent_role: "Fan",
          message: userText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatLog(prev => [...prev, { 
          sender: "ai", 
          text: data.response,
          actions: data.suggested_actions
        }]);
        if (data.nav_route_coords) {
          setActiveRoute(data.nav_route_coords);
        }
      }
    } catch {
      // Fallback
      setTimeout(() => {
        let responseText = "I can guide you anywhere. Ask for seat directions, food stands, or exit points.";
        let actions = ["Menu & Food wait times", "Cleanest rest rooms"];
        
        if (userText.toLowerCase().includes("food") || userText.toLowerCase().includes("eat")) {
          responseText = "Here are the top wait-times: \n1. **Taco Fiesta** (Sec 108) - 4 min wait.\n2. **Stadium Burger** (Sec 104) - 12 min wait. Get 15% off using a Visa card.";
          actions = ["Route to Taco Fiesta", "Food Map Grid"];
        } else if (userText.toLowerCase().includes("seat")) {
          responseText = "Your Section 104 Seat finder is running on the main map. Please follow the cyan path from Gate B.";
          setActiveRoute([[150.0, 80.0], [180.0, 110.0], [200.0, 120.0], [210.0, 125.0]]);
        }
        
        setChatLog(prev => [...prev, { sender: "ai", text: responseText, actions }]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <MapPin className="w-8 h-8 text-brand-red animate-pulse" /> FAN INTELLIGENCE COMPASS
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Indoor positioning, concession estimations and digital navigation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Map Overlay (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Seat Finder Input */}
          <div className="glass-card p-4 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Seat Finder & Indoor Navigation</span>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={seatQuery}
                  onChange={(e) => setSeatQuery(e.target.value)}
                  placeholder="Enter seat (e.g., Section 104, Row K)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-900 border border-card-border focus:border-brand-cyan focus:outline-none text-xs font-mono"
                />
              </div>
              <button 
                onClick={handleSeatLookup}
                className="px-5 rounded-lg bg-gradient-to-r from-brand-red to-brand-gold text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" /> PLOT ROUTE
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[350px]">
            <LiveMap telemetry={telemetry} activeSimulation={null} selectedRoute={activeRoute} />
          </div>
        </div>

        {/* Right Side: AI Assistant & Concessions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          {/* AI Chat assistant */}
          <div className="glass-card p-5 flex flex-col h-[350px] space-y-4">
            <div className="border-b border-card-border pb-3 flex justify-between items-center">
              <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-brand-red" /> FAN AI COMPANION
              </h3>
              <span className="w-2.5 h-2.5 bg-brand-emerald rounded-full animate-pulse"></span>
            </div>

            {/* Chat Logs */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex flex-col space-y-1.5 ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-lg max-w-[85%] font-mono leading-relaxed ${
                    chat.sender === "user" 
                      ? "bg-slate-900 border border-card-border text-slate-100" 
                      : "bg-brand-red/5 border border-brand-red/10 text-slate-300"
                  }`}>
                    {chat.text}
                  </div>
                  {chat.actions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {chat.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act)}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-card-border text-[9px] font-mono text-slate-400 hover:text-white"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="text-[10px] text-slate-500 font-mono animate-pulse">
                  AI is calculating seat navigation patterns...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t border-card-border pt-3">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
                placeholder="Ask for directions, food wait times, restrooms..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-card-border text-xs focus:outline-none focus:border-brand-red font-mono"
              />
              <button 
                onClick={() => handleSendMessage(chatInput)}
                className="p-2 bg-brand-red hover:bg-brand-red/80 rounded-lg text-white"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Concessions queues panel */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-brand-gold" /> CONCESSION QUEUES & DEALS
            </h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-900/60 border border-card-border rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-200">Taco Fiesta Express (Sec 108)</span>
                  <p className="text-[9px] text-slate-500">Wait Time: 4 mins | Queue: 15 people</p>
                </div>
                <span className="text-[10px] font-bold text-brand-emerald">Shortest Line</span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-card-border rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-200">Stadium Grill (Sec 104)</span>
                  <p className="text-[9px] text-slate-500">Wait Time: 12 mins | Queue: 45 people</p>
                </div>
                <span className="text-[10px] font-bold text-brand-gold">15% Visa Discount</span>
              </div>

              <div className="p-3 bg-slate-900/60 border border-card-border rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-200">Arena Brew House (Sec 212)</span>
                  <p className="text-[9px] text-slate-500">Wait Time: 18 mins | Queue: 68 people</p>
                </div>
                <span className="text-[10px] font-bold text-brand-red">Heavy Volume</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
