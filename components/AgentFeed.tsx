"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Plane, Train, Building2, Scale, Radio } from "lucide-react";
import { AgentLog } from "@/lib/types";

interface AgentFeedProps {
  logs: AgentLog[];
  isSimulating: boolean;
}

const getAgentColorAndIcon = (agentName: string) => {
  const name = agentName.toLowerCase();
  if (name.includes("carrier")) {
    return {
      textClass: "text-cyan-400",
      bgClass: "bg-cyan-400/10",
      Icon: Plane,
    };
  } else if (name.includes("transit")) {
    return {
      textClass: "text-violet-400",
      bgClass: "bg-violet-400/10",
      Icon: Train,
    };
  } else if (name.includes("hospitality")) {
    return {
      textClass: "text-amber-400",
      bgClass: "bg-amber-400/10",
      Icon: Building2,
    };
  } else if (name.includes("regulatory")) {
    return {
      textClass: "text-emerald-400",
      bgClass: "bg-emerald-400/10",
      Icon: Scale,
    };
  } else {
    // Default
    return {
      textClass: "text-zinc-400",
      bgClass: "bg-zinc-800",
      Icon: Terminal,
    };
  }
};

const getLogTypeClasses = (type?: string) => {
  switch (type) {
    case "success":
      return "text-emerald-300 bg-emerald-950/30";
    case "error":
      return "text-red-300 bg-red-950/30";
    case "warning":
      return "text-amber-300 bg-amber-950/30";
    default:
      return "text-zinc-300";
  }
};

export default function AgentFeed({ logs, isSimulating }: AgentFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isSimulating]);

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden flex flex-col h-full w-full">
      {/* Header bar */}
      <div className="bg-zinc-800 py-2 px-4 flex items-center border-b border-zinc-700 shrink-0">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center text-zinc-400 font-mono text-xs font-semibold uppercase tracking-wider flex-1 justify-center">
          <Terminal className="w-4 h-4 mr-2" />
          Agent Negotiation Feed
        </div>
      </div>

      {/* Scrollable log area */}
      <div
        ref={scrollRef}
        className="flex-1 max-h-[500px] overflow-y-auto p-4 font-mono text-sm flex flex-col gap-2"
      >
        {logs.length === 0 && !isSimulating ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-3">
            <Radio className="w-8 h-8 opacity-50" />
            <p>Awaiting disruption event...</p>
          </div>
        ) : (
          logs.map((log) => {
            const { textClass, bgClass, Icon } = getAgentColorAndIcon(log.agent);
            const typeClasses = getLogTypeClasses(log.type);

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 p-2 rounded-md ${
                  log.type ? typeClasses : ""
                }`}
              >
                <span className="text-zinc-600 shrink-0 select-none">
                  [{log.timestamp}]
                </span>
                
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium shrink-0 ${bgClass} ${textClass}`}>
                  <Icon className="w-3 h-3" />
                  {log.agent}
                </span>

                <span className={`break-words ${log.type ? "" : "text-zinc-300"}`}>
                  {log.message}
                </span>
              </motion.div>
            );
          })
        )}

        {isSimulating && (
          <div className="flex items-center gap-2 text-zinc-500 mt-2 p-2">
            <span className="animate-pulse">Processing...</span>
            <span className="inline-block w-2 h-4 bg-zinc-500 animate-[pulse_1s_step-end_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}
