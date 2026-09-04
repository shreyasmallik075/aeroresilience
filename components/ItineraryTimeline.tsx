"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Train, Building2, Car, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ItineraryNode, ItineraryEdge } from '@/lib/types';

interface ItineraryTimelineProps {
  nodes: ItineraryNode[];
  edges: ItineraryEdge[];
  isSimulating: boolean;
}

export default function ItineraryTimeline({ nodes, edges }: ItineraryTimelineProps) {
  const statusCounts = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        acc[node.status] = (acc[node.status] || 0) + 1;
        return acc;
      },
      { intact: 0, warning: 0, critical: 0, recovered: 0 } as Record<string, number>
    );
  }, [nodes]);

  const getNodeIcon = (type: string, status: string) => {
    const iconClass = getStatusColor(status, 'text');
    switch (type) {
      case 'flight':
        return <Plane className={`w-5 h-5 ${iconClass}`} />;
      case 'train':
        return <Train className={`w-5 h-5 ${iconClass}`} />;
      case 'hotel':
        return <Building2 className={`w-5 h-5 ${iconClass}`} />;
      case 'transfer':
        return <Car className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Plane className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getStatusColor = (status: string, property: 'border' | 'text' | 'bg') => {
    switch (status) {
      case 'warning':
        return property === 'border' ? 'border-amber-500/50 glow-border-warning' : property === 'text' ? 'text-amber-500' : 'bg-amber-500/10';
      case 'critical':
        return property === 'border' ? 'border-red-500/50 glow-border-danger' : property === 'text' ? 'text-red-500' : 'bg-red-500/10';
      case 'recovered':
        return property === 'border' ? 'border-emerald-500/50 glow-border-success' : property === 'text' ? 'text-emerald-500' : 'bg-emerald-500/10';
      case 'intact':
      default:
        return property === 'border' ? 'border-zinc-700' : property === 'text' ? 'text-zinc-400' : 'bg-zinc-800/50';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-zinc-500">
          <h2 className="text-xs font-mono tracking-widest uppercase">Dependency Chain</h2>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono">
          {statusCounts.intact > 0 && <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400">{statusCounts.intact} Intact</span>}
          {statusCounts.warning > 0 && <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{statusCounts.warning} Warning</span>}
          {statusCounts.critical > 0 && <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20">{statusCounts.critical} Critical</span>}
          {statusCounts.recovered > 0 && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{statusCounts.recovered} Recovered</span>}
        </div>
      </div>

      <div className="relative flex-1">
        {/* Left main connecting line */}
        <div className="absolute left-[1.375rem] top-4 bottom-4 w-px bg-zinc-800 -z-0" />

        <div className="flex flex-col gap-0 pb-4">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => {
              // Edge appears between node[index] and node[index+1]
              const edge = index < edges.length ? edges[index] : undefined;
              const isCritical = node.status === 'critical';
              
              return (
                <motion.div
                  key={node.id + '-' + node.status}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="relative flex items-start gap-4">
                    {/* Node Circle on timeline */}
                    <div className={`relative z-10 mt-4 flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900 border-2 shadow-sm shrink-0 transition-colors duration-500 ${
                      node.status === 'critical' ? 'border-red-500/60' :
                      node.status === 'warning' ? 'border-amber-500/60' :
                      node.status === 'recovered' ? 'border-emerald-500/60' :
                      'border-zinc-700'
                    }`}>
                      {getNodeIcon(node.type, node.status)}
                    </div>
                    
                    {/* Node Card */}
                    <motion.div 
                      layout
                      className={`flex-1 my-2 rounded-lg border bg-zinc-800/50 p-4 transition-all duration-500 ${getStatusColor(node.status, 'border')} ${isCritical ? 'animate-pulse' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-zinc-200">{node.label}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-700 text-zinc-300">
                            {node.code}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-2 flex-wrap">
                        <span>{node.from}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                        <span>{node.to}</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded bg-zinc-900/50 border border-zinc-700/50 text-xs whitespace-nowrap">
                          {node.scheduledDeparture} - {node.scheduledArrival}
                        </span>
                      </div>

                      {node.details && (
                        <div className="text-xs text-zinc-500">
                          {node.details}
                        </div>
                      )}

                      <AnimatePresence>
                        {node.statusMessage && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${
                              node.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                              node.status === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                              node.status === 'recovered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              'bg-zinc-800 text-zinc-400'
                            }`}>
                              {node.status === 'critical' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                              {node.status === 'recovered' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                              {node.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                              <span>{node.statusMessage}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Edge Connection (shown between this node and the next) */}
                  {edge && (
                    <motion.div 
                      layout 
                      className="relative flex items-center h-12 my-1"
                    >
                      <div className="absolute top-0 bottom-0 left-[1.375rem] -ml-px w-[2px] z-10">
                        {edge.status === 'critical' ? (
                          <div className="w-full h-full bg-red-500 animate-pulse" />
                        ) : edge.status === 'recovered' ? (
                          <div className="w-full h-full bg-emerald-500" />
                        ) : edge.status === 'warning' ? (
                          <div className="w-full h-full border-l-2 border-dashed border-amber-500" />
                        ) : (
                          <div className="w-full h-full border-l-2 border-dashed border-zinc-700" />
                        )}
                      </div>
                      
                      <div className="ml-[4.5rem]">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                          edge.status === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          edge.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          edge.status === 'recovered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}>
                          {edge.status === 'critical' && <AlertTriangle className="w-3 h-3 shrink-0" />}
                          {edge.status === 'recovered' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                          <span>{edge.label} • {edge.bufferMinutes > 0 ? `${edge.bufferMinutes} min buffer` : edge.bufferMinutes === 0 ? 'BROKEN' : `${Math.abs(edge.bufferMinutes)} min deficit`}</span>
                        </div>
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
