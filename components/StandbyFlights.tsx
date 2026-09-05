"use client";

import { StandbyFlight } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Plane, CheckCircle2, Clock, Users, Tag, MapPin, Info,
} from "lucide-react";

interface StandbyFlightsProps {
  flights: StandbyFlight[];
  selectedFlight: StandbyFlight | null;
  onSelect: (f: StandbyFlight) => void;
  disabled: boolean;
}

const statusConfig = {
  available:  { label: "Available",  dot: "bg-green-500",  badge: "bg-green-50 text-green-700 border-green-200",  btn: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  waitlisted: { label: "Waitlisted", dot: "bg-amber-500",  badge: "bg-amber-50 text-amber-700 border-amber-200",  btn: "bg-amber-500 hover:bg-amber-600 text-white" },
  full:       { label: "Full",       dot: "bg-red-400",    badge: "bg-red-50 text-red-600 border-red-200",        btn: "bg-gray-100 text-gray-400 cursor-not-allowed" },
};

const airlineColors: Record<string, string> = {
  AI: "bg-red-100 text-red-700",
  "6E": "bg-blue-100 text-blue-700",
  UK: "bg-purple-100 text-purple-700",
  SG: "bg-orange-100 text-orange-700",
};

export default function StandbyFlights({ flights, selectedFlight, onSelect, disabled }: StandbyFlightsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">Standby Flight Options</h2>
          <p className="text-xs text-gray-400 mt-0.5">BOM → DEL · Select your preferred alternative</p>
        </div>
        {disabled && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
            <Info className="w-3.5 h-3.5" />
            Trigger a disruption first
          </div>
        )}
        {selectedFlight && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {selectedFlight.flightCode} selected
          </div>
        )}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span>Flight</span>
        <span>Departure</span>
        <span>Seats</span>
        <span>Class</span>
        <span>Fare Δ</span>
        <span />
      </div>

      {/* Flight rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {flights.map((f, idx) => {
          const sc = statusConfig[f.status];
          const airlineColor = airlineColors[f.airlineCode] ?? "bg-gray-100 text-gray-600";
          const isSelected = selectedFlight?.id === f.id;
          const isFull = f.status === "full";

          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 items-center px-5 py-3.5 transition-all ${
                isSelected
                  ? "bg-indigo-50 border-l-2 border-indigo-500"
                  : isFull
                  ? "bg-gray-50 opacity-60"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Flight info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${airlineColor}`}>
                  {f.airlineCode}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 text-sm font-mono">{f.flightCode}</div>
                  <div className="text-xs text-gray-400 truncate">{f.airline} · {f.aircraft}</div>
                </div>
              </div>

              {/* Departure → Arrival */}
              <div>
                <div className="text-sm font-mono font-semibold text-gray-700">
                  {f.departure}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  {f.arrival} arr
                </div>
              </div>

              {/* Seats */}
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-300" />
                <span className={`text-sm font-semibold ${
                  f.seatsAvailable === 0 ? "text-red-500" :
                  f.seatsAvailable <= 2  ? "text-amber-600" :
                  "text-green-600"
                }`}>
                  {f.seatsAvailable === 0 ? "Full" : f.seatsAvailable}
                </span>
              </div>

              {/* Fare class */}
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-gray-300" />
                <span className="text-xs text-gray-600">{f.fareClass}</span>
              </div>

              {/* Fare delta */}
              <div>
                <span className={`text-xs font-medium font-mono ${
                  f.fareDelta.includes("₹0") ? "text-green-600" : "text-gray-700"
                }`}>
                  {f.fareDelta}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  Gate {f.gate} · {f.terminal}
                </div>
              </div>

              {/* CTA */}
              <div>
                {isSelected ? (
                  <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-lg border border-indigo-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </span>
                ) : (
                  <button
                    onClick={() => !isFull && !disabled && onSelect(f)}
                    disabled={isFull || disabled}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${sc.btn} ${
                      isFull || disabled ? "cursor-not-allowed opacity-60" : "active:scale-95"
                    }`}
                  >
                    {isFull ? "Full" : f.status === "waitlisted" ? "Waitlist" : "Select"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          Selecting a flight updates your Recovery Plan with that specific flight code, gate, and terminal.
        </p>
      </div>
    </div>
  );
}
