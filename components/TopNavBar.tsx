"use client";

import React from "react";
import { Plane, RotateCcw } from "lucide-react";

interface TopNavBarProps {
  onReset: () => void;
}

export default function TopNavBar({ onReset }: TopNavBarProps) {
  return (
    <header className="w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section: Logo & Active Status Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
            <Plane className="w-5 h-5 text-cyan-400 transform -rotate-45" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg tracking-tight text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              AeroResilience
            </span>
            <span className="text-xs font-mono text-zinc-400">
              // Engine v1.0
            </span>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-5 w-px bg-zinc-800" />

        {/* Active Status Indicator */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </span>
          <span className="text-cyan-400 text-xs font-mono tracking-wide">
            Monitoring Active Itineraries
          </span>
        </div>
      </div>

      {/* Center Section: Passenger Info Pill */}
      <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300 shadow-inner">
        <span className="text-zinc-400 font-medium">Passenger:</span>
        <span className="font-semibold text-zinc-100">Alex Vance</span>
        <span className="text-zinc-600 select-none">|</span>
        <span className="text-zinc-400 font-medium">PNR:</span>
        <span className="font-mono font-semibold text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/50">
          AR-9082
        </span>
        <span className="text-zinc-600 select-none">|</span>
        <span className="text-zinc-400 font-medium">Route:</span>
        <span className="font-mono font-semibold text-zinc-200">
          BOM → DEL → AGC
        </span>
      </div>

      {/* Right Section: Reset Demo Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-zinc-100 text-xs font-medium transition-all duration-200 border border-zinc-600/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
          title="Reset simulation to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}
