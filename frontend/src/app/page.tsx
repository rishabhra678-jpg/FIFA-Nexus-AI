"use client";

import Link from "next/link";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Zap, Radio, Globe, Compass, 
  HelpCircle, ChevronRight, Terminal, HeartHandshake, Eye
} from "lucide-react";

export default function LandingPage() {
  const agents = [
    { name: "Fan Assistant", desc: "Indoor navigation, seat mapping, custom queue and food recommendations.", color: "border-brand-red" },
    { name: "Volunteer Copilot", desc: "Automated SOP retrieval, missing child workflows, lost & found logs.", color: "border-brand-gold" },
    { name: "Security Intelligence", desc: "Crowd density alerts, hazard logging, incident resolution AI advice.", color: "border-brand-cyan" },
    { name: "Operations Director", desc: "Predictive bottlenecks, gate flow calculations, executive actions.", color: "border-red-500" },
    { name: "Accessibility Coordinator", desc: "Step-free routes, tactile maps, audio feeds, and scale sizing.", color: "border-blue-500" },
    { name: "Sustainability Auditor", desc: "Real-time tracker for water usage, clean energy grids, carbon outputs.", color: "border-brand-emerald" },
    { name: "Transport Planner", desc: "Metro wait predictions, lot fills, shuttle timelines, and transit updates.", color: "border-purple-500" }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden grid-overlay bg-[#03060c]">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-red/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-brand-cyan/800 bg-opacity-[0.05] bg-brand-cyan/5 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 bg-brand-red rounded-full animate-ping"></span>
          <span className="font-extrabold tracking-widest text-lg text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-gold to-brand-cyan">
            FIFA NEXUS AI
          </span>
        </div>
        <div className="flex gap-4">
          <a 
            href={`${API_BASE_URL}/docs`} 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white glass-card"
          >
            <Terminal className="w-3.5 h-3.5" /> API Reference
          </a>
          <Link 
            href="/dashboard" 
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-white text-black hover:bg-slate-200 transition-all font-mono"
          >
            LAUNCH PORTAL
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24 z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-card-border text-xs text-brand-gold font-mono uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 text-brand-red animate-pulse" />
              FIFA World Cup 2026 Operational Core
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black leading-tight text-white tracking-tight">
              Stadium Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-gold to-brand-cyan">
                Copilot Engine
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              An enterprise GenAI-enabled multi-agent platform automating crowd dynamics, venue logistics, emergency dispatches, and fan flows for the 2026 matches.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-red to-brand-gold hover:opacity-90 font-bold text-sm tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                ENTER COMMAND CENTER <ChevronRight className="w-4 h-4" />
              </Link>
              <a 
                href="#agents"
                className="px-8 py-4 rounded-xl glass-card font-semibold text-sm hover:bg-slate-800/40 flex items-center justify-center"
              >
                Explore Agent Core
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-card-border max-w-md">
              <div>
                <p className="text-2xl font-black text-white">7</p>
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">AI Agent Roles</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-cyan">2s</p>
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Telemetry Poll</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-emerald">LEED</p>
                <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Green Compliant</p>
              </div>
            </div>
          </div>

          {/* Interactive UI Mockup Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-brand-cyan/20 blur-[60px] rounded-full" />
            
            <div className="relative glass-card border border-cyber-border bg-[#0a1122]/90 p-6 shadow-2xl rounded-2xl space-y-6">
              
              {/* Card top bar */}
              <div className="flex justify-between items-center border-b border-card-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Live Telemetry State</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/20 text-[9px] font-mono text-brand-red uppercase">
                  SIMULATOR READY
                </div>
              </div>

              {/* Fake Widget details */}
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Match Attendance:</span>
                  <span className="text-white font-bold">68,200 / 75,000 (91%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-card-border">
                  <div className="bg-gradient-to-r from-brand-red to-brand-gold h-full rounded-full w-[91%]" />
                </div>

                <div className="p-3 bg-slate-950/80 border border-card-border rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-brand-gold text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> OPERATIONS DIRECTIVE
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    "Gate B turnstiles will exceed safe queuing thresholds within 8 minutes. Redirect shuttle arrivals to Gate D now."
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] tracking-wider uppercase block">Current Active Agents</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="px-2 py-1 rounded bg-brand-red/5 border border-brand-red/10 text-brand-red flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> Fan Assistant
                    </div>
                    <div className="px-2 py-1 rounded bg-brand-gold/5 border border-brand-gold/10 text-brand-gold flex items-center gap-1.5">
                      <HeartHandshake className="w-3 h-3" /> Volunteer Co
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Agents Feature Grid */}
      <section id="agents" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-card-border z-10 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">THE MULTI-AGENT INTELLIGENCE</h2>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">7 Specialised LLM Brains Operating in Parallel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, i) => (
            <div 
              key={i} 
              className={`glass-card p-6 border-t-4 ${agent.color} space-y-3 relative hover:translate-y-[-2px] transition-transform`}
            >
              <h3 className="font-bold text-white tracking-wide text-sm">{agent.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border py-8 text-center text-slate-500 text-xs font-mono max-w-7xl mx-auto w-full px-6 z-10 flex flex-col sm:flex-row justify-between gap-4">
        <span>&copy; FIFA World Cup 2026. Stadium Operations Command Center.</span>
        <div className="flex gap-4 justify-center">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Terms of Use</a>
          <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer" className="hover:text-slate-300">API Gateway</a>
        </div>
      </footer>
    </div>
  );
}
