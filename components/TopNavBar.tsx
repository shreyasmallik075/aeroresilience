"use client";

import { Plane, RotateCcw, LogOut, ChevronDown } from "lucide-react";
import { User } from "@/lib/types";
import { useState } from "react";

interface TopNavBarProps {
  user: User;
  onReset: () => void;
  onLogout: () => void;
}

export default function TopNavBar({ user, onReset, onLogout }: TopNavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <Plane className="w-4 h-4 text-white rotate-[-30deg]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-gray-900 text-base tracking-tight">AeroResilience</span>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">// Engine v1.0</span>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-5 w-px bg-gray-200 mx-1" />

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-green-600 font-medium">Monitoring Active</span>
        </div>
      </div>

      {/* Passenger pill */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600">
        <span className="font-medium text-gray-700">{user.name}</span>
        <span className="text-gray-300">|</span>
        <span className="font-mono text-indigo-600 font-semibold">{user.pnr}</span>
        <span className="text-gray-300">|</span>
        <span className="font-mono text-gray-500">BOM → DEL → AGC</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 text-xs font-medium transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name.split(" ")[0]}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-400 font-mono">{user.email}</div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click-away */}
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
