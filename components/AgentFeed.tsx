"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Plane, Train, Building2, Scale, Radio } from "lucide-react";
import { AgentLog } from "@/lib/types";

interface AgentFeedProps {
  logs: AgentLog[];
  isSimulating: boolean;
}

const agentMeta: Record<AgentLog["agent"], { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Carrier:     { icon: Plane,     color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   label: "Carrier Agent" },
  Transit:     { icon: Train,     color: "text-violet-700", bg: "bg-violet-50 border-violet-200", label: "Transit Agent" },
  Hospitality: { icon: Building2, color: "text-amber-700",  bg: "bg-amber-50 border-amber-200",  label: "Hospitality Agent" },
  Regulatory:  { icon: Scale,     color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200", label: "Legal Agent" },
};

const typeBg: Record<AgentLog["type"], string> = {
  info:    "",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  error:   "bg-red-50",
};

export default function AgentFeed({ logs, isSimulating }: AgentFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Terminal title bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Agent Negotiation Feed</span>
        </div>
        {isSimulating && (
          <div className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </div>
        )}
      </div>

      {/* Log area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs bg-gray-50 max-h-[500px]"
      >
        {logs.length === 0 && !isSimulating ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-300 gap-3">
            <Radio className="w-8 h-8" />
            <p>Awaiting disruption event…</p>
          </div>
        ) : (
          <>
            {logs.map((log) => {
              const meta = agentMeta[log.agent];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg ${typeBg[log.type]}`}
                >
                  <span className="text-gray-400 shrink-0">[{log.timestamp}]</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold shrink-0 ${meta.color} ${meta.bg}`}>
                    <Icon className="w-3 h-3" />
                    {log.agent}
                  </span>
                  <span className={`break-words leading-relaxed ${
                    log.type === "success" ? "text-emerald-800" :
                    log.type === "error"   ? "text-red-800" :
                    log.type === "warning" ? "text-amber-800" :
                    "text-gray-700"
                  }`}>
                    {log.message}
                  </span>
                </motion.div>
              );
            })}

            {isSimulating && (
              <div className="flex items-center gap-2 px-3 py-2 text-gray-400">
                <span className="animate-pulse">Processing</span>
                <span className="cursor-blink" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
