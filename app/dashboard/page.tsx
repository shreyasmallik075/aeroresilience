"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DisruptionScenario,
  ItineraryNode,
  ItineraryEdge,
  AgentLog,
  RecoveryOption,
  CompensationClaim,
  StandbyFlight,
  User,
} from "@/lib/types";
import {
  initialNodes,
  initialEdges,
  getDelayScenarioNodes,
  getDelayScenarioEdges,
  getCancelScenarioNodes,
  getCancelScenarioEdges,
  getDelayAgentLogs,
  getCancelAgentLogs,
  buildRecoveryOptions,
  getCompensationClaim,
  getRecoveredNodes,
  getRecoveredEdges,
  standbyFlights,
} from "@/lib/mockData";
import TopNavBar from "@/components/TopNavBar";
import SimulationControlBar from "@/components/SimulationControlBar";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import AgentFeed from "@/components/AgentFeed";
import StandbyFlights from "@/components/StandbyFlights";
import RerouteProposal from "@/components/RerouteProposal";
import CompensationModal from "@/components/CompensationModal";
import { Activity, Plane, Shield, FileText } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Simulation state
  const [scenario, setScenario] = useState<DisruptionScenario>("none");
  const [delayMins, setDelayMins] = useState(180);
  const [isSimulating, setIsSimulating] = useState(false);
  const [nodes, setNodes] = useState<ItineraryNode[]>(initialNodes);
  const [edges, setEdges] = useState<ItineraryEdge[]>(initialEdges);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOption[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<StandbyFlight | null>(null);
  const [showCompensation, setShowCompensation] = useState(false);
  const [recoveryAccepted, setRecoveryAccepted] = useState(false);
  const [compensationClaim, setCompensationClaim] = useState<CompensationClaim | null>(null);
  const [activeTab, setActiveTab] = useState<"standby" | "feed" | "recovery">("feed");
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Auth guard
  useEffect(() => {
    const raw = sessionStorage.getItem("ar_user");
    if (!raw) { router.replace("/login"); return; }
    try { setUser(JSON.parse(raw)); } catch { router.replace("/login"); }
  }, [router]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const handleReset = useCallback(() => {
    clearTimeouts();
    setScenario("none");
    setDelayMins(180);
    setIsSimulating(false);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setAgentLogs([]);
    setRecoveryOptions([]);
    setSelectedFlight(null);
    setShowCompensation(false);
    setRecoveryAccepted(false);
    setCompensationClaim(null);
    setActiveTab("feed");
  }, [clearTimeouts]);

  const handleTrigger = useCallback(() => {
    if (scenario === "none" || isSimulating) return;
    clearTimeouts();
    setIsSimulating(true);
    setAgentLogs([]);
    setRecoveryOptions([]);
    setRecoveryAccepted(false);
    setCompensationClaim(null);
    setSelectedFlight(null);
    setActiveTab("feed");

    const disruptedNodes = scenario === "delay"
      ? getDelayScenarioNodes(delayMins)
      : getCancelScenarioNodes();
    const disruptedEdges = scenario === "delay"
      ? getDelayScenarioEdges(delayMins)
      : getCancelScenarioEdges();
    const logs = scenario === "delay"
      ? getDelayAgentLogs(delayMins)
      : getCancelAgentLogs();

    // Phase 1: show disruption
    const t1 = setTimeout(() => {
      setNodes(disruptedNodes);
      setEdges(disruptedEdges);
    }, 700);
    timeoutsRef.current.push(t1);

    // Phase 2: stream logs
    logs.forEach((log, i) => {
      const t = setTimeout(() => setAgentLogs(prev => [...prev, log]), 1200 + i * 550);
      timeoutsRef.current.push(t);
    });

    // Phase 3: show standby + recovery
    const t3 = setTimeout(() => {
      setRecoveryOptions(buildRecoveryOptions(selectedFlight, scenario));
      setCompensationClaim(getCompensationClaim(scenario, delayMins));
      setActiveTab("standby");
      setIsSimulating(false);
    }, 1200 + logs.length * 550 + 400);
    timeoutsRef.current.push(t3);
  }, [scenario, delayMins, isSimulating, selectedFlight, clearTimeouts]);

  // When user picks a flight, refresh recovery options
  const handleSelectFlight = useCallback((flight: StandbyFlight) => {
    setSelectedFlight(flight);
    if (recoveryOptions.length > 0) {
      setRecoveryOptions(buildRecoveryOptions(flight, scenario));
    }
  }, [recoveryOptions.length, scenario]);

  const handleAcceptRecovery = useCallback(() => {
    setRecoveryAccepted(true);
    setNodes(getRecoveredNodes(selectedFlight));
    setEdges(getRecoveredEdges());
  }, [selectedFlight]);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  if (!user) return null;

  const tabs = [
    { key: "feed" as const, label: "Agent Feed", icon: Activity, count: agentLogs.length },
    { key: "standby" as const, label: "Standby Flights", icon: Plane, count: standbyFlights.filter(f => f.status === "available").length },
    { key: "recovery" as const, label: "Recovery Plan", icon: Shield, count: recoveryOptions.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavBar user={user} onReset={handleReset} onLogout={() => { sessionStorage.clear(); router.push("/login"); }} />

      <SimulationControlBar
        selectedScenario={scenario}
        onScenarioChange={setScenario}
        onTrigger={handleTrigger}
        isSimulating={isSimulating}
        recoveryAccepted={recoveryAccepted}
        delayMins={delayMins}
        onDelayChange={setDelayMins}
      />

      {/* Main two-column grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 pt-4 max-w-[1600px] mx-auto w-full">
        {/* Left: Itinerary */}
        <div>
          <ItineraryTimeline nodes={nodes} edges={edges} isSimulating={isSimulating} />
        </div>

        {/* Right: Tabs */}
        <div className="flex flex-col gap-4">
          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex-1 justify-center ${
                  activeTab === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                    activeTab === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
            {compensationClaim && (
              <button
                onClick={() => setShowCompensation(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                Claim
              </button>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-[480px]">
            {activeTab === "feed" && <AgentFeed logs={agentLogs} isSimulating={isSimulating} />}
            {activeTab === "standby" && (
              <StandbyFlights
                flights={standbyFlights}
                selectedFlight={selectedFlight}
                onSelect={handleSelectFlight}
                disabled={scenario === "none"}
              />
            )}
            {activeTab === "recovery" && (
              <RerouteProposal
                options={recoveryOptions}
                onAccept={handleAcceptRecovery}
                recoveryAccepted={recoveryAccepted}
                selectedFlight={selectedFlight}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-2.5 flex items-center justify-between text-xs text-gray-400">
        <span>© {new Date().getFullYear()} AeroResilience. All rights reserved.</span>
        <span className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? "bg-amber-400 pulse-dot" : "bg-green-400"}`} />
          {isSimulating ? "Agents running…" : recoveryAccepted ? "Recovery complete" : "System ready"}
        </span>
        <span>Privacy Policy · Terms of Service</span>
      </footer>

      <CompensationModal claim={compensationClaim} isOpen={showCompensation} onClose={() => setShowCompensation(false)} />
    </div>
  );
}
