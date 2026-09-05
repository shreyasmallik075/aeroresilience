export type DisruptionScenario = 'none' | 'delay' | 'cancel';
export type NodeStatus = 'intact' | 'warning' | 'critical' | 'recovered';

export interface ItineraryNode {
  id: string;
  type: 'flight' | 'train' | 'hotel' | 'transfer';
  label: string;
  from: string;
  to: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  status: NodeStatus;
  details: string;
  code: string;
  statusMessage?: string;
}

export interface ItineraryEdge {
  id: string;
  label: string;
  bufferMinutes: number;
  status: NodeStatus;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: 'Carrier' | 'Transit' | 'Hospitality' | 'Regulatory';
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface StandbyFlight {
  id: string;
  flightCode: string;
  airline: string;
  airlineCode: string;
  departure: string;
  arrival: string;
  aircraft: string;
  seatsAvailable: number;
  fareClass: string;
  fareDelta: string;
  status: 'available' | 'waitlisted' | 'full';
  gate: string;
  terminal: string;
  durationMins: number;
}

export interface RecoveryOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  steps: string[];
  arrivalDelay: string;
  costDelta: string;
  stressScore: number;
  recommended: boolean;
  flightCode?: string;
}

export interface CompensationClaim {
  passengerName: string;
  pnr: string;
  flightCode: string;
  route: string;
  disruptionType: string;
  delayDuration: string;
  regulation: string;
  compensationAmount: string;
  claimDate: string;
  body: string;
}

export interface User {
  name: string;
  email: string;
  pnr: string;
  avatarInitials: string;
}
