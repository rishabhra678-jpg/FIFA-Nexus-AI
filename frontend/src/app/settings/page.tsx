"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { Settings as SettingsIcon, Eye, Type, Shield, Server, RefreshCw } from "lucide-react";

export default function Settings() {
  const [contrast, setContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [backendUrl, setBackendUrl] = useState(API_BASE_URL);

  useEffect(() => {
    setContrast(document.body.classList.contains("high-contrast"));
    setLargeText(document.body.classList.contains("large-text"));
  }, []);

  const handleContrastToggle = () => {
    const nextVal = !contrast;
    setContrast(nextVal);
    if (nextVal) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  };

  const handleLargeTextToggle = () => {
    const nextVal = !largeText;
    setLargeText(nextVal);
    if (nextVal) {
      document.body.classList.add("large-text");
    } else {
      document.body.classList.remove("large-text");
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-brand-gold animate-spin" style={{ animationDuration: "12s" }} /> SYSTEM CONFIGURATION CENTER
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          Accessibility profile overrides, AI credentials, and network routing configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Accessibility options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
              <Eye className="w-4 h-4 text-brand-gold" /> ACCESSIBILITY & LAYOUT OVERRIDES
            </h3>

            <div className="space-y-4 font-mono text-xs">
              
              <div className="p-4 bg-slate-900 border border-card-border rounded-lg flex justify-between items-center">
                <div className="space-y-1">
                  <span className="font-bold text-white text-[11px] block">High Contrast Mode</span>
                  <p className="text-slate-400 text-[10px]">Boost contrast colors for maximum visibility.</p>
                </div>
                <button 
                  onClick={handleContrastToggle}
                  className={`px-4 py-2 rounded font-bold text-[10px] uppercase border transition-all ${
                    contrast 
                      ? "bg-yellow-500 text-black border-yellow-400" 
                      : "bg-slate-950 border-card-border text-slate-400 hover:text-white"
                  }`}
                >
                  {contrast ? "ON" : "OFF"}
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-card-border rounded-lg flex justify-between items-center">
                <div className="space-y-1">
                  <span className="font-bold text-white text-[11px] block">Large Font Sizing</span>
                  <p className="text-slate-400 text-[10px]">Scale text metrics upward by 15% across layout hubs.</p>
                </div>
                <button 
                  onClick={handleLargeTextToggle}
                  className={`px-4 py-2 rounded font-bold text-[10px] uppercase border transition-all ${
                    largeText 
                      ? "bg-brand-cyan text-black border-brand-cyan" 
                      : "bg-slate-950 border-card-border text-slate-400 hover:text-white"
                  }`}
                >
                  {largeText ? "ON" : "OFF"}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: AI & Backend configs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase">
              <Server className="w-4 h-4 text-brand-cyan" /> DEPLOYMENT GATEWAY SETTINGS
            </h3>

            <div className="space-y-3 font-mono text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-400 block text-[9px] uppercase">Telemetry Endpoint Server URL</label>
                <input 
                  type="text" 
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 block text-[9px] uppercase">OpenAI Secret API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-........................"
                  className="w-full px-3 py-2 rounded bg-slate-950 border border-card-border text-slate-200"
                />
                <p className="text-[9px] text-slate-500">Provided key overrides internal mock simulation matrices.</p>
              </div>

              <button className="w-full py-2 bg-brand-cyan text-slate-950 font-bold rounded text-xs transition-opacity hover:opacity-90">
                SAVE GATEWAY PARAMETERS
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
