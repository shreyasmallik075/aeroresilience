"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Train, Building2, Car, AlertTriangle, CheckCircle2, ArrowRight, Clock,
} from "lucide-react";
import { ItineraryNode, ItineraryEdge } from "@/lib/types";

interface ItineraryTimelineProps {
  nodes: ItineraryNode[];
  edges: ItineraryEdge[];
  isSimulating: boolean;
}

const statusStyles = {
  intact:    { border: "border-gray-200",    bg: "bg-white",          icon: "text-blue-600",    badge: "", badgeBg: "" },
  warning:   { border: "border-amber-400",   bg: "bg-amber-50",       icon: "text-amber-600",   badge: "bg-amber-100 text-amber-700 border-amber-300",  badgeBg: "card-warning" },
  critical:  { border: "border-red-400",     bg: "bg-red-50",         icon: "text-red-600",     badge: "bg-red-100 text-red-700 border-red-300",        badgeBg: "card-danger" },
  recovered: { border: "border-emerald-400", bg: "bg-emerald-50",     icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700 border-emerald-300", badgeBg: "card-success" },
};

function NodeIcon({ type, status }: { type: ItineraryNode["type"]; status: ItineraryNode["status"] }) {
  const cls = `w-5 h-5 ${statusStyles[status].icon}`;
  if (type === "flight")   return <Plane className={cls} />;
  if (type === "train")    return <Train className={cls} />;
  if (type === "hotel")    return <Building2 className={cls} />;
  if (type === "transfer") return <Car className={cls} />;
  return <Plane className={cls} />;
}

export default function ItineraryTimeline({ nodes, edges }: ItineraryTimelineProps) {
  const counts = useMemo(() => nodes.reduce((a, n) => ({ ...a, [n.status]: (a[n.status] || 0) + 1 }), {} as Record<string, number>), [nodes]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">Itinerary Dependency Graph</h2>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">BOM → DEL → AGC · PNR AR-9082</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {counts.intact    > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium">{counts.intact} On Track</span>}
          {counts.warning   > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">{counts.warning} At Risk</span>}
          {counts.critical  > 0 && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium">{counts.critical} Critical</span>}
          {counts.recovered > 0 && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">{counts.recovered} Recovered</span>}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="relative">
          {/* Vertical spine */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-gray-200" />

          <AnimatePresence mode="popLayout">
            {nodes.map((node, idx) => {
              const s = statusStyles[node.status];
              const edge = idx < edges.length ? edges[idx] : undefined;

              return (
                <motion.div
                  key={node.id + node.status}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="relative"
                >
                  {/* Node row */}
                  <div className="flex items-start gap-4 mb-0">
                    {/* Circle on spine */}
                    <div className={`relative z-10 mt-4 w-10 h-10 rounded-full border-2 ${s.border} ${s.bg} flex items-center justify-center shadow-sm shrink-0`}>
                      <NodeIcon type={node.type} status={node.status} />
                    </div>

                    {/* Card */}
                    <motion.div
                      layout
                      className={`flex-1 mb-3 rounded-xl border ${s.border} ${s.bg} p-4 transition-all duration-500 ${s.badgeBg}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm">{node.label}</span>
                          <span className="text-[11px] font-mono bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                            {node.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-mono whitespace-nowrap shrink-0">
                          <Clock className="w-3 h-3" />
                          {node.scheduledDeparture}–{node.scheduledArrival}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <span className="font-medium text-gray-600">{node.from}</span>
                        <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                        <span className="font-medium text-gray-600">{node.to}</span>
                      </div>

                      {node.details && <p className="text-xs text-gray-400 mb-2">{node.details}</p>}

                      <AnimatePresence>
                        {node.statusMessage && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${s.badge} ${
                              node.status === "critical" || node.status === "warning" ? "animate-pulse" : ""
                            }`}>
                              {node.status === "critical"  && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                              {node.status === "warning"   && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                              {node.status === "recovered" && <CheckCircle2  className="w-3.5 h-3.5 shrink-0" />}
                              {node.statusMessage}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Edge connector */}
                  {edge && (
                    <motion.div layout className="flex items-center gap-4 h-10 mb-0">
                      <div className="w-10 shrink-0 flex justify-center">
                        <div className={`w-px h-full ${
                          edge.status === "critical"  ? "bg-red-400" :
                          edge.status === "warning"   ? "bg-amber-400" :
                          edge.status === "recovered" ? "bg-emerald-400" :
                          "bg-gray-200"
                        }`} />
                      </div>
                      <div className={`text-xs font-mono px-3 py-1 rounded-full border ${
                        edge.status === "critical"  ? "bg-red-50 text-red-600 border-red-200" :
                        edge.status === "warning"   ? "bg-amber-50 text-amber-600 border-amber-200" :
                        edge.status === "recovered" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        "bg-gray-50 text-gray-400 border-gray-200"
                      }`}>
                        {edge.status === "critical"  && <span className="mr-1">⚠</span>}
                        {edge.status === "recovered" && <span className="mr-1">✓</span>}
                        {edge.label}
                        {edge.bufferMinutes > 0 && ` · ${edge.bufferMinutes} min`}
                        {edge.bufferMinutes < 0 && ` · ${Math.abs(edge.bufferMinutes)} min deficit`}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
