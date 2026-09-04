"use client";

import React from 'react';
import { RecoveryOption } from '@/lib/types';
import { Clock, Banknote, Heart, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface RerouteProposalProps {
  options: RecoveryOption[];
  onAccept: () => void;
  recoveryAccepted: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function RerouteProposal({ options, onAccept, recoveryAccepted }: RerouteProposalProps) {
  if (!options || options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
        <Sparkles className="w-8 h-8 text-zinc-700 mb-3" />
        <p className="text-zinc-600 text-sm">Recovery options will appear here after disruption analysis.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {options.map((option) => (
        <motion.div
          key={option.id}
          variants={itemVariants}
          className={`relative p-5 rounded-xl border transition-all duration-300 ${
            option.recommended
              ? 'border-cyan-500/30 bg-zinc-800/50 glow-border'
              : 'border-zinc-700 bg-zinc-800/20'
          }`}
        >
          {option.recommended && (
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-400/10 rounded-full border border-cyan-400/20 uppercase">
                Recommended
              </span>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-zinc-100">{option.name}</h3>
              <span className="px-2 py-0.5 text-xs text-zinc-300 bg-zinc-700/50 rounded-full border border-zinc-600/30">
                {option.tag}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{option.description}</p>
          </div>

          <div className="space-y-2 mb-6">
            {option.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-300">{step}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-zinc-700/50">
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">Arrival Delay</span>
              </div>
              <div className="font-mono text-sm text-zinc-100">{option.arrivalDelay}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                <Banknote className="w-3.5 h-3.5" />
                <span className="text-xs">Cost Delta</span>
              </div>
              <div className="font-mono text-sm text-zinc-100">{option.costDelta}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-xs">Stress Score</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i < option.stressScore
                        ? 'bg-indigo-500'
                        : 'bg-zinc-700'
                    }`}
                  />
                ))}
                <span className="text-xs text-zinc-500 ml-1 font-mono">{option.stressScore}/10</span>
              </div>
            </div>
          </div>

          {option.recommended && (
            <div className="mt-4 pt-4 border-t border-zinc-700/50">
              <button
                onClick={onAccept}
                disabled={recoveryAccepted}
                className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all duration-300 ${
                  recoveryAccepted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                {recoveryAccepted ? 'Recovery Plan Accepted ✓' : 'Accept Recovery Plan & Auto-Sync Tickets'}
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
