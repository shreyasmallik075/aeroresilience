"use client";

import React from 'react';
import { CompensationClaim } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Download, Mail, Scale } from 'lucide-react';

interface CompensationModalProps {
  claim: CompensationClaim | null;
  isOpen: boolean;
  onClose: () => void;
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[600px] max-w-full bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <Scale className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-mono text-sm font-semibold text-zinc-100 tracking-wide uppercase">
                    Compensation Claim Document
                  </h2>
                  <p className="text-xs text-zinc-500 font-mono">Auto-Generated • {claim.claimDate}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Passenger</div>
                  <div className="font-medium text-zinc-200 text-sm">{claim.passengerName}</div>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">PNR</div>
                  <div className="font-mono font-medium text-cyan-400 text-sm">{claim.pnr}</div>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Flight</div>
                  <div className="font-mono font-medium text-zinc-200 text-sm">{claim.flightCode}</div>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Route</div>
                  <div className="font-medium text-zinc-200 text-sm">{claim.route}</div>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Disruption</div>
                  <div className="font-medium text-red-400 text-sm">{claim.disruptionType}</div>
                </div>
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Regulation</div>
                  <div className="font-medium text-zinc-200 text-xs">{claim.regulation}</div>
                </div>
              </div>

              {/* Compensation Amount Highlight */}
              <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-between glow-border">
                <div>
                  <span className="text-xs font-mono text-cyan-500/70 uppercase tracking-wider">Statutory Compensation Amount</span>
                  <div className="text-xs text-zinc-500 mt-0.5">Under {claim.regulation}</div>
                </div>
                <span className="text-2xl font-mono font-bold text-cyan-300">{claim.compensationAmount}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-800 w-full" />

              {/* Formal Letter Body */}
              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Formal Compensation Letter</span>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-[system-ui]">
                  {claim.body}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm grid grid-cols-2 gap-3">
              <button
                onClick={() => alert("PDF export initiated. In production, this generates a downloadable PDF document.")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors font-medium text-sm border border-zinc-700/50"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={() => alert("Email draft created. In production, this sends the compensation claim via email.")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors font-medium text-sm border border-zinc-700/50"
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
