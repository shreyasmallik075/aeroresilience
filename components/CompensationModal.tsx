"use client";

import { CompensationClaim } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Download, Mail, Scale, AlertCircle } from "lucide-react";

interface CompensationModalProps {
  claim: CompensationClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

export default function CompensationModal({ claim, isOpen, onClose }: CompensationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && claim && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-[600px] max-w-full bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Compensation Claim Document</h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Auto-generated · {claim.claimDate}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Disruption alert */}
              <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-red-700">{claim.disruptionType}</span>
                  <span className="text-sm text-red-600 ml-2">· {claim.delayDuration}</span>
                  <p className="text-xs text-red-500 mt-0.5">{claim.regulation}</p>
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                <MetaCell label="Passenger"      value={claim.passengerName} />
                <MetaCell label="PNR"            value={claim.pnr}           mono />
                <MetaCell label="Flight"         value={claim.flightCode}    mono />
                <MetaCell label="Route"          value={claim.route} />
              </div>

              {/* Compensation amount */}
              <div className="flex items-center justify-between px-5 py-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-0.5">
                    Statutory Compensation Amount
                  </div>
                  <div className="text-xs text-indigo-400">Under {claim.regulation}</div>
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-700">
                  {claim.compensationAmount}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Letter body */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Formal Compensation Letter
                  </span>
                </div>
                <div className="p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white font-[system-ui]">
                  {claim.body}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 grid grid-cols-2 gap-3">
              <button
                onClick={() => alert("PDF export initiated. In production, this generates a downloadable PDF.")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={() => alert("Email draft created. In production, this sends the compensation letter via email.")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
