"use client";

import { RecoveryOption, StandbyFlight } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Clock, Banknote, Heart, CheckCircle2, Sparkles, Plane, Info,
} from "lucide-react";

interface RerouteProposalProps {
  options: RecoveryOption[];
  onAccept: () => void;
  recoveryAccepted: boolean;
  selectedFlight: StandbyFlight | null;
}

export default function RerouteProposal({
  options,
  onAccept,
  recoveryAccepted,
  selectedFlight,
}: RerouteProposalProps) {
  if (!options || options.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] h-full gap-3">
        <Sparkles className="w-8 h-8 text-gray-200" />
        <p className="text-gray-400 text-sm text-center max-w-xs">
          Trigger a disruption event to generate AI-powered recovery options.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Selected flight banner */}
      {selectedFlight && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm"
        >
          <Plane className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="text-indigo-800">
            Recovery plans built around{" "}
            <span className="font-bold font-mono">{selectedFlight.flightCode}</span>{" "}
            ({selectedFlight.airline} · {selectedFlight.departure} DEP · Gate {selectedFlight.gate},{" "}
            {selectedFlight.terminal})
          </span>
        </motion.div>
      )}

      {!selectedFlight && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <Info className="w-3.5 h-3.5 shrink-0" />
          No standby flight selected — showing default recovery plan. Switch to Standby Flights tab to choose.
        </div>
      )}

      {options.map((option, i) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.35 }}
          className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
            option.recommended ? "border-indigo-300" : "border-gray-200"
          }`}
        >
          {/* Card header */}
          <div className={`px-5 py-3 flex items-center justify-between ${
            option.recommended ? "bg-indigo-600" : "bg-gray-50 border-b border-gray-100"
          }`}>
            <div>
              <h3 className={`font-semibold text-sm ${option.recommended ? "text-white" : "text-gray-800"}`}>
                {option.name}
              </h3>
              <p className={`text-xs mt-0.5 ${option.recommended ? "text-indigo-200" : "text-gray-400"}`}>
                {option.description}
              </p>
            </div>
            {option.recommended && (
              <span className="ml-4 shrink-0 px-2.5 py-1 bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/30">
                Recommended
              </span>
            )}
            {!option.recommended && (
              <span className="ml-4 shrink-0 px-2.5 py-1 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-200">
                {option.tag}
              </span>
            )}
          </div>

          <div className="p-5">
            {/* Steps */}
            <div className="space-y-2 mb-5">
              {option.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    option.recommended
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">Arrival Delay</span>
                </div>
                <div className="font-mono text-sm font-bold text-gray-800">{option.arrivalDelay}</div>
              </div>
              <div className="text-center border-x border-gray-100">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Banknote className="w-3.5 h-3.5" />
                  <span className="text-xs">Cost Delta</span>
                </div>
                <div className={`font-mono text-sm font-bold ${
                  option.costDelta.includes("₹0") ? "text-green-600" : "text-gray-800"
                }`}>
                  {option.costDelta}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs">Stress Score</span>
                </div>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-2 w-2 rounded-full ${
                        j < option.stressScore ? "bg-indigo-400" : "bg-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">{option.stressScore}/10</div>
              </div>
            </div>

            {/* Accept CTA — only on recommended */}
            {option.recommended && (
              <button
                onClick={onAccept}
                disabled={recoveryAccepted}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  recoveryAccepted
                    ? "bg-green-50 text-green-700 border border-green-200 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {recoveryAccepted
                  ? "Recovery Plan Accepted ✓"
                  : "Accept Recovery Plan & Auto-Sync Tickets"}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
