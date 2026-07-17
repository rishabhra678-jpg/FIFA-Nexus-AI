"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Bot, ShieldCheck, HeartHandshake, Zap, Route, Leaf, Accessibility } from "lucide-react";

export default function ChatConsole() {
  const [selectedAgent, setSelectedAgent] = useState("Fan");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string; actions?: string[] }>>([
    {
      sender: "ai",
      text: "Hello! I am your FIFA Stadium Intelligence Copilot. Select an agent department from the left column to query specific standard operating procedures, telemetry sensor states, or routing vectors.",
      actions: ["Seat Finder", "Crowd Density Hotspots", "Missing Child SOP"]
    }
  ]);
  const [loading, setLoading] = useState(false);

  const agentsList = [
    { name: "Fan", title: "Fan Assistant", icon: Zap, color: "text-brand-red", bg: "bg-brand-red/10 border-brand-red/20" },
    { name: "Volunteer", title: "Volunteer Copilot", icon: HeartHandshake, color: "text-brand-gold", bg: "bg-brand-gold/10 border-brand-gold/20" },
    { name: "Security", title: "Security AI", icon: ShieldCheck, color: "text-brand-cyan", bg: "bg-brand-cyan/10 border-brand-cyan/20" },
    { name: "Operations", title: "Operations Director", icon: Bot, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
    { name: "Accessibility", title: "Accessibility Coord", icon: Accessibility, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { name: "Sustainability", title: "Sustainability Auditor", icon: Leaf, color: "text-brand-emerald", bg: "bg-brand-emerald/10 border-brand-emerald/20" },
    { name: "Transport", title: "Transport Planner", icon: Route, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text;
    setChatInput("");
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "console_session_1",
          agent_role: selectedAgent,
          message: userMsg
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, {
          sender: "ai",
          text: data.response,
          actions: data.suggested_actions
        }]);
      }
    } catch {
      // Offline fallback
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          sender: "ai",
          text: `[Offline Fallback] As the ${selectedAgent} AI agent, I processed your query: "${userMsg}". Telemetry sensors report normal values. Please check settings.`,
          actions: ["View Dashboard", "Check Systems status"]
        }]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col h-[calc(100vh-64px)] md:h-screen">
      
      {/* Header */}
      <div className="pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-brand-red animate-pulse" /> MULTI-AGENT COPILOT PLAYGROUND
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Direct dialogue terminal with the 7 stadium intelligence sub-agents
        </p>
      </div>

      {/* Main Panel Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Selector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto pr-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2 px-1">Select Active LLM Agent Persona</span>
          {agentsList.map(agent => {
            const Icon = agent.icon;
            const isSelected = selectedAgent === agent.name;
            return (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                className={`p-3.5 rounded-lg border text-left flex items-center gap-3 transition-all ${
                  isSelected 
                    ? "bg-slate-900 border-brand-red text-white shadow" 
                    : "bg-slate-950 border-card-border text-slate-400 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? agent.bg : "bg-slate-900"}`}>
                  <Icon className={`w-4 h-4 ${agent.color}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono tracking-wide">{agent.title}</h4>
                  <p className="text-[9px] text-slate-500 font-mono">Status: Connected</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Chat box (8 cols) */}
        <div className="lg:col-span-8 glass-card p-5 flex flex-col h-full min-h-0">
          
          {/* Box Header */}
          <div className="border-b border-card-border pb-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-gold animate-bounce" />
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {selectedAgent.toUpperCase()} INTERFACE NODE
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-500">SESSION ID: FIFA-26-CORE</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 text-xs">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex flex-col space-y-1.5 ${chat.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-3.5 rounded-xl max-w-[85%] font-mono leading-relaxed whitespace-pre-line ${
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
                Agent is indexing SOP catalogs & spatial grids...
              </div>
            )}
          </div>

          {/* Box Input */}
          <div className="flex gap-2 border-t border-card-border pt-4">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatInput)}
              placeholder={`Ask the ${selectedAgent} Agent anything...`}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-card-border text-xs focus:outline-none focus:border-brand-red font-mono"
            />
            <button
              onClick={() => handleSendMessage(chatInput)}
              className="p-3 bg-brand-red hover:bg-brand-red/90 rounded-lg text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
