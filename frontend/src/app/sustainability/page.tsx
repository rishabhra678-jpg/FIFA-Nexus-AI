"use client";

import React from "react";
import { Leaf, Flame, Droplet, Recycle, Award, CheckCircle, RefreshCw } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function SustainabilityDashboard() {
  const { telemetry } = useTelemetry();

  const recommendations = [
    {
      title: "Chiller / HVAC Chilled Water Optimization",
      desc: "Raise chiller coolant settings by 0.5°C in unoccupied corridors. Estimated savings: 48 kWh/hr.",
      applied: true
    },
    {
      title: "Graywater Recycling Valve Flush redirection",
      desc: "Trigger flushing loop 2 to route precipitation harvest from storm reserves to North toilets.",
      applied: false
    },
    {
      title: "Eco-Waste Custodial sweep",
      desc: "Send custodial sweepers to East Food Court kiosk zone; recycling sorting points are near capacity (84%).",
      applied: false
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Leaf className="w-8 h-8 text-brand-emerald animate-pulse" /> SUSTAINABILITY INTELLIGENCE AUDIT
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
          LEED Gold carbon accounting, energy output gauges and greywater harvesting telemetry
        </p>
      </div>

      {/* Sustainability indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 space-y-3 border-l-4 border-brand-emerald">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Clean Energy Draw</span>
            <Flame className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="text-2xl font-bold font-tech text-white">
            {Math.round(telemetry.sustainability.energy_kwh).toLocaleString()} <span className="text-xs font-mono text-slate-400">kWh</span>
          </div>
          <div className="w-full bg-slate-900 border border-card-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-emerald h-full w-[82%]" />
          </div>
          <p className="text-[9px] text-slate-500 font-mono">82% Carbon Free Energy Grid</p>
        </div>

        <div className="glass-card p-5 space-y-3 border-l-4 border-blue-500">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Water Recycled</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-tech text-white">
            {Math.round(telemetry.sustainability.water_liters).toLocaleString()} <span className="text-xs font-mono text-slate-400">Liters</span>
          </div>
          <div className="w-full bg-slate-900 border border-card-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[65%]" />
          </div>
          <p className="text-[9px] text-slate-500 font-mono">Precipitation harvesting enabled</p>
        </div>

        <div className="glass-card p-5 space-y-3 border-l-4 border-brand-gold">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Waste Sorted</span>
            <Recycle className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-bold font-tech text-white">
            {Math.round(telemetry.sustainability.waste_kg).toLocaleString()} <span className="text-xs font-mono text-slate-400">kg</span>
          </div>
          <div className="w-full bg-slate-900 border border-card-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-gold h-full w-[78%]" />
          </div>
          <p className="text-[9px] text-slate-500 font-mono">78% Diversion Rate target</p>
        </div>

        <div className="glass-card p-5 space-y-3 border-l-4 border-purple-500">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Carbon Footprint</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-tech text-white">
            {Math.round(telemetry.sustainability.carbon_g).toLocaleString()} <span className="text-xs font-mono text-slate-400">g CO2/user</span>
          </div>
          <div className="w-full bg-slate-900 border border-card-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[45%]" />
          </div>
          <p className="text-[9px] text-slate-500 font-mono">LEED Gold Offset Goal: 400g</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-card p-5 space-y-4">
            <div>
              <h3 className="font-bold text-white text-sm tracking-wider">AI SUSTAINABILITY STRATEGY DIRECTIVES</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase">Optimized resource-saving instructions</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-slate-900/60 border border-card-border rounded-lg flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-[11px] block">{rec.title}</span>
                    <p className="text-slate-400 leading-relaxed text-[10px]">{rec.desc}</p>
                  </div>
                  {rec.applied ? (
                    <span className="px-2 py-1 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-bold text-[9px] uppercase whitespace-nowrap flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> APPLIED
                    </span>
                  ) : (
                    <button className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-card-border text-[10px] font-bold text-slate-300 hover:text-white whitespace-nowrap">
                      APPLY SOP
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Energy grid details (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-bold text-white text-xs tracking-wider uppercase">AUXILIARY GRID MATRIX</h3>
            
            <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-400">
              <div className="space-y-1.5">
                <div className="flex justify-between text-white text-[11px]">
                  <span>Solar Array Generation</span>
                  <span>420 kW</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-emerald h-full w-[94%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-white text-[11px]">
                  <span>Tesla Megapacks Stored</span>
                  <span>1,240 kWh</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-cyan h-full w-[78%]" />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 pt-2 border-t border-card-border/50">
                Stadium retractable canopy acts as a solar shield, lowering mechanical AC cooling demand by 14% under peak sunlight indexes.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
