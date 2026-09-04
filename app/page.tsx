"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DisruptionScenario,
  ItineraryNode,
  ItineraryEdge,
  AgentLog,
  RecoveryOption,
  CompensationClaim,
} from "@/lib/types";
import {
  initialNodes,
  initialEdges,
  getDelayScenarioNodes,
  getCancelScenarioNodes,
  getDelayScenarioEdges,
  getCancelScenarioEdges,
  getDelayAgentLogs,
  getCancelAgentLogs,
  getDelayRecoveryOptions,
  getCancelRecoveryOptions,
  getCompensationClaim,
  getRecoveredNodes,
  getRecoveredEdges,
} from "@/lib/mockData";
import TopNavBar from "@/components/TopNavBar";
import SimulationControlBar from "@/components/SimulationControlBar";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import AgentFeed from "@/components/AgentFeed";
import RerouteProposal from "@/components/RerouteProposal";
import CompensationModal from "@/components/CompensationModal";
import {
  Activity,
  Route,
  FileText,
  Shield,
} from "lucide-react";

export default function Home() {
  const [scenario, setScenario] = useState<DisruptionScenario>("none");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPhase, setSimulationPhase] = useState(0);
  const [nodes, setNodes] = useState<ItineraryNode[]>(initialNodes);
  const [edges, setEdges] = useState<ItineraryEdge[]>(initialEdges);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOption[]>([]);
  const [showCompensation, setShowCompensation] = useState(false);
  const [recoveryAccepted, setRecoveryAccepted] = useState(false);
  const [compensationClaim, setCompensationClaim] =
    useState<CompensationClaim | null>(null);
  const [activeTab, setActiveTab] = useState<"feed" | "recovery">("feed");

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const handleReset = useCallback(() => {
    clearAllTimeouts();
    setScenario("none");
    setIsSimulating(false);
    setSimulationPhase(0);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setAgentLogs([]);
    setRecoveryOptions([]);
    setShowCompensation(false);
    setRecoveryAccepted(false);
    setCompensationClaim(null);
    setActiveTab("feed");
  }, [clearAllTimeouts]);

  const handleTrigger = useCallback(() => {
    if (scenario === "none" || isSimulating) return;

    clearAllTimeouts();
    setIsSimulating(true);
    setSimulationPhase(0);
    setAgentLogs([]);
    setRecoveryOptions([]);
    setRecoveryAccepted(false);
    setCompensationClaim(null);
    setActiveTab("feed");

    const scenarioNodes =
      scenario === "delay" ? getDelayScenarioNodes() : getCancelScenarioNodes();
    const scenarioEdges =
      scenario === "delay" ? getDelayScenarioEdges() : getCancelScenarioEdges();
    const logs =
      scenario === "delay" ? getDelayAgentLogs() : getCancelAgentLogs();
    const options =
      scenario === "delay"
        ? getDelayRecoveryOptions()
        : getCancelRecoveryOptions();

    // Phase 1: Show disruption on itinerary (after 800ms)
    const t1 = setTimeout(() => {
      setNodes(scenarioNodes);
      setEdges(scenarioEdges);
      setSimulationPhase(1);
    }, 800);
    timeoutsRef.current.push(t1);

    // Phase 2: Stream agent logs one by one (starting at 1.5s, 600ms apart)
    logs.forEach((log, index) => {
      const t = setTimeout(() => {
        setAgentLogs((prev) => [...prev, log]);
        setSimulationPhase(2);
      }, 1500 + index * 600);
      timeoutsRef.current.push(t);
    });

    // Phase 3: Show recovery options (after all logs)
    const t3 = setTimeout(() => {
      setRecoveryOptions(options);
      setCompensationClaim(getCompensationClaim(scenario));
      setSimulationPhase(3);
      setActiveTab("recovery");
    }, 1500 + logs.length * 600 + 500);
    timeoutsRef.current.push(t3);

    // Phase 4: End simulation state
    const t4 = setTimeout(() => {
      setIsSimulating(false);
      setSimulationPhase(4);
    }, 1500 + logs.length * 600 + 800);
    timeoutsRef.current.push(t4);
  }, [scenario, isSimulating, clearAllTimeouts]);

  const handleAcceptRecovery = useCallback(() => {
    setRecoveryAccepted(true);
    setNodes(getRecoveredNodes());
    setEdges(getRecoveredEdges());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Navigation */}
      <TopNavBar onReset={handleReset} />

      {/* Simulation Control */}
      <SimulationControlBar
        selectedScenario={scenario}
        onScenarioChange={setScenario}
        onTrigger={handleTrigger}
        isSimulating={isSimulating}
        recoveryAccepted={recoveryAccepted}
      />

      {/* Main Content: Two Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 pt-4">
        {/* Left Column: Itinerary & Dependency Graph */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Route className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Itinerary Dependency Graph
            </h2>
          </div>
          <ItineraryTimeline
            nodes={nodes}
            edges={edges}
            isSimulating={isSimulating}
          />
        </div>

        {/* Right Column: Agent Feed & Recovery */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800">
            <button
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "feed"
                  ? "bg-zinc-800 text-cyan-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Activity className="w-4 h-4" />
              Live Agent Feed
              {agentLogs.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-cyan-400/10 text-cyan-400 font-mono">
                  {agentLogs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("recovery")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "recovery"
                  ? "bg-zinc-800 text-cyan-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Shield className="w-4 h-4" />
              Recovery Options
              {recoveryOptions.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-400/10 text-indigo-400 font-mono">
                  {recoveryOptions.length}
                </span>
              )}
            </button>
            {compensationClaim && (
              <button
                onClick={() => setShowCompensation(true)}
                className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 transition-all duration-200"
              >
                <FileText className="w-3.5 h-3.5" />
                View Compensation Claim
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "feed" && (
              <AgentFeed logs={agentLogs} isSimulating={isSimulating} />
            )}
            {activeTab === "recovery" && (
              <RerouteProposal
                options={recoveryOptions}
                onAccept={handleAcceptRecovery}
                recoveryAccepted={recoveryAccepted}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="border-t border-zinc-800/50 bg-zinc-900/30 px-6 py-2 flex items-center justify-between text-xs text-zinc-600 font-mono">
        <span>AeroResilience Engine v1.0 // PS-2: Travel Disruption Recovery</span>
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSimulating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          {isSimulating
            ? "Processing disruption event..."
            : recoveryAccepted
            ? "Recovery plan active — all segments confirmed"
            : "System ready"}
        </span>
        <span>Hackathon Demo Build — {new Date().toLocaleDateString()}</span>
      </footer>

      {/* Compensation Modal */}
      <CompensationModal
        claim={compensationClaim}
        isOpen={showCompensation}
        onClose={() => setShowCompensation(false)}
      />
    </div>
  );
}
