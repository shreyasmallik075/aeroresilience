"use client";

import { DisruptionScenario } from "@/lib/types";
import {
  CheckCircle2, Clock, XCircle, AlertTriangle, Loader2, Check, Info,
} from "lucide-react";

interface SimulationControlBarProps {
  selectedScenario: DisruptionScenario;
  onScenarioChange: (s: DisruptionScenario) => void;
  onTrigger: () => void;
  isSimulating: boolean;
  recoveryAccepted: boolean;
  delayMins: number;
  onDelayChange: (v: number) => void;
}

function computeImpact(delayMins: number): { text: string; color: string } {
  const flightArrMins = 16 * 60 + 15 + delayMins; // 16:15 + delay
  const trainDepMins = 17 * 60 + 30; // 17:30
  const buffer = trainDepMins - flightArrMins;

  if (buffer >= 45)
    return { text: `${buffer} min buffer remaining — connection at risk but catchable`, color: "text-amber-600" };
  if (buffer >= 0)
    return { text: `Only ${buffer} min buffer — connection critically tight`, color: "text-orange-600" };
  return { text: `${Math.abs(buffer)} min connection deficit — train MISSED, cascade triggered`, color: "text-red-600" };
}

export default function SimulationControlBar({
  selectedScenario, onScenarioChange, onTrigger,
  isSimulating, recoveryAccepted, delayMins, onDelayChange,
}: SimulationControlBarProps) {
  const impact = computeImpact(delayMins);

  return (
    <div className="bg-white border-b border-gray-200 px-5 py-4 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center gap-4">

        {/* Scenario pills */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Scenario
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { id: "none" as const,   label: "Normal Operations",  Icon: CheckCircle2, sel: "bg-green-600 text-white border-green-600",   unsel: "border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50" },
              { id: "delay" as const,  label: "Flight Delayed",     Icon: Clock,        sel: "bg-amber-500 text-white border-amber-500",    unsel: "border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50" },
              { id: "cancel" as const, label: "Flight Canceled",    Icon: XCircle,      sel: "bg-red-600 text-white border-red-600",        unsel: "border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50" },
            ].map(({ id, label, Icon, sel, unsel }) => (
              <button
                key={id}
                disabled={isSimulating}
                onClick={() => onScenarioChange(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedScenario === id ? sel : unsel
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Delay slider — only when delay selected */}
        {selectedScenario === "delay" && (
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Flight Delay Duration
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={15}
                  max={360}
                  step={15}
                  value={delayMins}
                  onChange={e => onDelayChange(Math.min(360, Math.max(15, Number(e.target.value))))}
                  className="w-16 text-center text-sm font-mono font-bold text-amber-900 bg-white border border-amber-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-xs text-amber-700 font-medium">mins</span>
              </div>
            </div>

            <input
              type="range"
              min={15}
              max={360}
              step={15}
              value={delayMins}
              onChange={e => onDelayChange(Number(e.target.value))}
              className="w-full accent-amber-500"
            />

            <div className="flex justify-between text-[10px] text-amber-600 font-mono mt-1 mb-2">
              <span>15m</span><span>1h</span><span>2h</span><span>3h</span><span>4h</span><span>5h</span><span>6h</span>
            </div>

            {/* Impact computation */}
            <div className={`flex items-start gap-2 text-xs ${impact.color}`}>
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="font-medium">{impact.text}</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {recoveryAccepted ? (
            <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-100 text-green-700 border border-green-200 text-sm font-semibold cursor-not-allowed">
              <Check className="w-4 h-4" /> Recovery Complete
            </button>
          ) : isSimulating ? (
            <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 text-sm font-semibold cursor-not-allowed">
              <Loader2 className="w-4 h-4 animate-spin" /> Running…
            </button>
          ) : (
            <button
              onClick={onTrigger}
              disabled={selectedScenario === "none"}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                selectedScenario === "none"
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md active:scale-95"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Trigger Disruption Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
