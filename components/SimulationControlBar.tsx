"use client";

import React from "react";
import { DisruptionScenario } from "@/lib/types";
import {
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";

interface SimulationControlBarProps {
  selectedScenario: DisruptionScenario;
  onScenarioChange: (scenario: DisruptionScenario) => void;
  onTrigger: () => void;
  isSimulating: boolean;
  recoveryAccepted: boolean;
}

export default function SimulationControlBar({
  selectedScenario,
  onScenarioChange,
  onTrigger,
  isSimulating,
  recoveryAccepted,
}: SimulationControlBarProps) {
  const scenarioConfigs: {
    id: DisruptionScenario;
    label: string;
    icon: typeof CheckCircle2;
    selectedStyles: string;
    iconColor: string;
  }[] = [
    {
      id: "none",
      label: "Normal Operations",
      icon: CheckCircle2,
      selectedStyles:
        "bg-emerald-950/60 text-emerald-200 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.35)]",
      iconColor: "text-emerald-400",
    },
    {
      id: "delay",
      label: "Flight Delayed +180m",
      icon: Clock,
      selectedStyles:
        "bg-amber-950/60 text-amber-200 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.35)]",
      iconColor: "text-amber-400",
    },
    {
      id: "cancel",
      label: "Flight Canceled",
      icon: XCircle,
      selectedStyles:
        "bg-rose-950/60 text-rose-200 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.35)]",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl mx-6 mt-4 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Left side: Label and Scenario Toggle Group */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase select-none shrink-0">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Disruption Simulator</span>
        </div>

        {/* Button group for scenarios */}
        <div className="inline-flex flex-wrap sm:flex-nowrap p-1 bg-zinc-950/70 rounded-lg border border-zinc-800/80 gap-1.5">
          {scenarioConfigs.map((item) => {
            const isSelected = selectedScenario === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                disabled={isSimulating}
                onClick={() => onScenarioChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 select-none ${
                  isSelected
                    ? `${item.selectedStyles} font-semibold`
                    : "bg-zinc-800 text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-zinc-750"
                } ${
                  isSimulating
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    isSelected ? item.iconColor : "text-zinc-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Action Button */}
      <div className="flex items-center justify-end">
        {recoveryAccepted ? (
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-not-allowed transition-all duration-200 select-none"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Recovery Complete ✓</span>
          </button>
        ) : isSimulating ? (
          <button
            type="button"
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 border border-zinc-600 text-sm font-medium shadow-inner cursor-not-allowed transition-all duration-200 select-none"
          >
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Simulation Running...</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onTrigger}
            disabled={selectedScenario === "none"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border select-none ${
              selectedScenario === "none"
                ? "bg-zinc-800 text-zinc-500 border-zinc-700/60 cursor-not-allowed opacity-50 shadow-none"
                : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white border-cyan-400/30 shadow-[0_0_18px_rgba(6,182,212,0.35)] active:scale-95 cursor-pointer"
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 transition-colors ${
                selectedScenario === "none" ? "text-zinc-500" : "text-white"
              }`}
            />
            <span>Trigger Disruption Event</span>
          </button>
        )}
      </div>
    </div>
  );
}
