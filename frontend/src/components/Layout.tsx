"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, UserCheck, ShieldAlert, SlidersHorizontal, 
  MapPin, Route, Leaf, Settings as SettingsIcon, MessageSquare, 
  Menu, X, Radio, Eye, Type, AlertCircle
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Check WS Status by polling the endpoint
  useEffect(() => {
    const checkWS = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/telemetry");
        setWsConnected(res.ok);
      } catch {
        setWsConnected(false);
      }
    };
    checkWS();
    const interval = setInterval(checkWS, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync Accessibility Modes to document.body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add("large-text");
    } else {
      document.body.classList.remove("large-text");
    }
  }, [largeText]);

  const navItems = [
    { name: "Command Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Fan Assistant", path: "/fan", icon: MapPin },
    { name: "Volunteer Portal", path: "/volunteer", icon: UserCheck },
    { name: "Security Center", path: "/security", icon: ShieldAlert },
    { name: "Operations Center", path: "/operations", icon: SlidersHorizontal },
    { name: "Sustainability", path: "/sustainability", icon: Leaf },
    { name: "Transport Hub", path: "/transport", icon: Route },
    { name: "Agent Chat Console", path: "/chat", icon: MessageSquare },
    { name: "Control Settings", path: "/settings", icon: SettingsIcon },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-slate-100 grid-overlay">
      {/* Top Header for Mobile */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-card border-b border-card-border backdrop-blur-lg sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-3 h-3 bg-brand-red rounded-full animate-pulse"></span>
          <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-gold to-brand-cyan">
            FIFA NEXUS AI
          </span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 glass-card rounded-md text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 xl:w-72 bg-card-solid border-r border-card-border p-6 flex-shrink-0 justify-between">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 py-2 px-1 border-b border-card-border pb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-red via-brand-gold to-brand-cyan flex items-center justify-center font-bold text-white shadow-lg">
              F
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-gold to-brand-cyan">
                FIFA NEXUS
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Stadium Intelligence</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-brand-red/10 to-brand-gold/10 text-white border-l-2 border-brand-red font-semibold"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-red" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls & Connection health */}
        <div className="space-y-4 pt-6 border-t border-card-border">
          {/* Accessibility Shortcuts */}
          <div className="flex gap-2">
            <button
              onClick={() => setHighContrast(!highContrast)}
              title="Toggle High Contrast Mode"
              className={`flex-1 p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                highContrast 
                  ? "bg-yellow-500 text-black border-yellow-400" 
                  : "bg-slate-800/50 hover:bg-slate-800 border-card-border text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> High Contrast
            </button>
            <button
              onClick={() => setLargeText(!largeText)}
              title="Toggle Large Font Mode"
              className={`flex-1 p-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                largeText 
                  ? "bg-brand-cyan text-black border-brand-cyan" 
                  : "bg-slate-800/50 hover:bg-slate-800 border-card-border text-slate-400 hover:text-white"
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Text Size
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-card-border font-mono text-xs">
            <span className="text-slate-500">Telemetry Stream:</span>
            <span className={`flex items-center gap-1.5 font-bold uppercase ${wsConnected ? "text-brand-emerald" : "text-brand-gold animate-pulse"}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              {wsConnected ? "WS: Live" : "Fallback Poll"}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col p-6 animate-fadeIn">
          <div className="flex justify-between items-center pb-6 border-b border-card-border">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-gold to-brand-cyan">
              FIFA NEXUS AI
            </span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 pt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-4 px-5 py-4 rounded-lg text-base font-semibold ${
                    isActive 
                      ? "bg-slate-800 text-white border-l-4 border-brand-red" 
                      : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5 text-brand-gold" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="pt-6 border-t border-card-border flex gap-4">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="flex-1 p-3 rounded-lg bg-slate-900 border border-card-border text-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Contrast
            </button>
            <button
              onClick={() => setLargeText(!largeText)}
              className="flex-1 p-3 rounded-lg bg-slate-900 border border-card-border text-sm flex items-center justify-center gap-2"
            >
              <Type className="w-4 h-4" /> Font Size
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
