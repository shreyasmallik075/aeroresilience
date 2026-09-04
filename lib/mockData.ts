import {
  DisruptionScenario,
  ItineraryNode,
  ItineraryEdge,
  AgentLog,
  RecoveryOption,
  CompensationClaim,
} from './types';

export const initialNodes: ItineraryNode[] = [
  {
    id: 'node-flight-1',
    type: 'flight',
    label: 'Air India AI-804',
    from: 'Mumbai (BOM)',
    to: 'Delhi (DEL)',
    scheduledDeparture: '14:00',
    scheduledArrival: '16:15',
    status: 'intact',
    details: 'Boeing 787-8 Dreamliner • Seat 14B • Terminal 2',
    code: 'AI-804',
    statusMessage: 'On Time • Gate 42',
  },
  {
    id: 'node-train-1',
    type: 'train',
    label: 'Gatimaan Express 1202',
    from: 'Hazrat Nizamuddin (NZM)',
    to: 'Agra Cantt (AGC)',
    scheduledDeparture: '17:30',
    scheduledArrival: '19:10',
    status: 'intact',
    details: 'Executive Anubhuti Class • Coach E1, Seat 24 • Platform 1',
    code: 'GE-1202',
    statusMessage: 'Scheduled On Time',
  },
  {
    id: 'node-hotel-1',
    type: 'hotel',
    label: 'The Oberoi Amarvilas',
    from: 'Agra Cantt (AGC)',
    to: 'Taj East Gate Rd, Agra',
    scheduledDeparture: '20:00',
    scheduledArrival: '20:30',
    status: 'intact',
    details: 'Premier Room with Taj Mahal View • Check-in by 20:00',
    code: 'OA-RES-4401',
    statusMessage: 'Reservation Confirmed • Check-in guaranteed',
  },
];

export const initialEdges: ItineraryEdge[] = [
  {
    id: 'edge-flight-train',
    label: 'DEL T3 to NZM Station Transit Buffer',
    bufferMinutes: 75,
    status: 'intact',
  },
  {
    id: 'edge-train-hotel',
    label: 'Agra Cantt to Oberoi Transfer Buffer',
    bufferMinutes: 45,
    status: 'intact',
  },
];

export function getDelayScenarioNodes(): ItineraryNode[] {
  return [
    {
      id: 'node-flight-1',
      type: 'flight',
      label: 'Air India AI-804',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      scheduledDeparture: '17:00',
      scheduledArrival: '19:15',
      status: 'warning',
      details: 'Boeing 787-8 Dreamliner • Seat 14B • Departure delayed from 14:00',
      code: 'AI-804',
      statusMessage: 'DELAYED +180 MIN (Weather)',
    },
    {
      id: 'node-train-1',
      type: 'train',
      label: 'Gatimaan Express 1202',
      from: 'Hazrat Nizamuddin (NZM)',
      to: 'Agra Cantt (AGC)',
      scheduledDeparture: '17:30',
      scheduledArrival: '19:10',
      status: 'critical',
      details: 'Executive Anubhuti Class • Train will depart 1h 45m before flight arrival in Delhi',
      code: 'GE-1202',
      statusMessage: 'MISSED CONNECTION RISK: 100%',
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '20:00',
      scheduledArrival: '20:30',
      status: 'warning',
      details: 'Check-in cutoff 20:00 • Arrival postponed past 22:30 without intervention',
      code: 'OA-RES-4401',
      statusMessage: 'LATE CHECK-IN — PENALTY RISK',
    },
  ];
}

export function getCancelScenarioNodes(): ItineraryNode[] {
  return [
    {
      id: 'node-flight-1',
      type: 'flight',
      label: 'Air India AI-804',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      scheduledDeparture: '14:00',
      scheduledArrival: '16:15',
      status: 'critical',
      details: 'Boeing 787-8 Dreamliner • Grounded at BOM due to unserviceable hydraulic line',
      code: 'AI-804',
      statusMessage: 'FLIGHT CANCELED (Technical Issue)',
    },
    {
      id: 'node-train-1',
      type: 'train',
      label: 'Gatimaan Express 1202',
      from: 'Hazrat Nizamuddin (NZM)',
      to: 'Agra Cantt (AGC)',
      scheduledDeparture: '17:30',
      scheduledArrival: '19:10',
      status: 'critical',
      details: 'Executive Anubhuti Class • Passenger stranded in Mumbai; cannot board in Delhi',
      code: 'GE-1202',
      statusMessage: 'MISSED CONNECTION — NO UPSTREAM FLIGHT',
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '20:00',
      scheduledArrival: '20:30',
      status: 'critical',
      details: 'Premier Room with Taj Mahal View • Non-arrival without waiver will incur full charge',
      code: 'OA-RES-4401',
      statusMessage: 'NO-SHOW — FULL PENALTY RISK',
    },
  ];
}

export function getDelayScenarioEdges(): ItineraryEdge[] {
  return [
    {
      id: 'edge-flight-train',
      label: 'DEL Connection Buffer Deficit (-105 min)',
      bufferMinutes: -105,
      status: 'critical',
    },
    {
      id: 'edge-train-hotel',
      label: 'Agra Arrival to Check-in Buffer Tight',
      bufferMinutes: 15,
      status: 'warning',
    },
  ];
}

export function getCancelScenarioEdges(): ItineraryEdge[] {
  return [
    {
      id: 'edge-flight-train',
      label: 'Flight canceled — Connection broken',
      bufferMinutes: 0,
      status: 'critical',
    },
    {
      id: 'edge-train-hotel',
      label: 'Ground leg isolated — Destination unreachable',
      bufferMinutes: 0,
      status: 'critical',
    },
  ];
}

export function getDelayAgentLogs(): AgentLog[] {
  return [
    {
      id: 'log-del-1',
      timestamp: '14:32:05',
      agent: 'Carrier',
      message: 'Disruption detected: AI-804 delayed 180 mins due to adverse weather at BOM. Initiating recovery protocol...',
      type: 'warning',
    },
    {
      id: 'log-del-2',
      timestamp: '14:32:08',
      agent: 'Carrier',
      message: 'Scanning alternative flights BOM → DEL via Amadeus Sandbox API... Found 3 viable slots.',
      type: 'info',
    },
    {
      id: 'log-del-3',
      timestamp: '14:32:12',
      agent: 'Carrier',
      message: 'Best alternative: AI-806 departing 15:30, arriving 17:45. Seat 12A available in Economy+.',
      type: 'success',
    },
    {
      id: 'log-del-4',
      timestamp: '14:32:16',
      agent: 'Transit',
      message: 'Original connection Gatimaan Express 17:30 no longer viable. Buffer deficit: -105 mins.',
      type: 'error',
    },
    {
      id: 'log-del-5',
      timestamp: '14:32:20',
      agent: 'Transit',
      message: 'Re-routing rail segment: Vande Bharat Express at 19:45 OR private chauffeur (ETA 3h 15m).',
      type: 'info',
    },
    {
      id: 'log-del-6',
      timestamp: '14:32:25',
      agent: 'Hospitality',
      message: 'Hotel check-in deadline 20:00 at risk. Initiating no-show waiver under Force Majeure clause.',
      type: 'warning',
    },
    {
      id: 'log-del-7',
      timestamp: '14:32:29',
      agent: 'Hospitality',
      message: 'Automated waiver request sent to Oberoi Amarvilas front desk. Awaiting confirmation...',
      type: 'info',
    },
    {
      id: 'log-del-8',
      timestamp: '14:32:34',
      agent: 'Regulatory',
      message: 'Delay exceeds 2 hours. Pre-drafting DGCA CAR Section 3 Series M Part IV compensation claim.',
      type: 'warning',
    },
    {
      id: 'log-del-9',
      timestamp: '14:32:38',
      agent: 'Regulatory',
      message: 'Estimated compensation: ₹10,000 under DGCA guidelines for delays >3 hours on domestic routes.',
      type: 'info',
    },
    {
      id: 'log-del-10',
      timestamp: '14:32:44',
      agent: 'Carrier',
      message: 'Recovery plan generated. 2 Pareto-optimal options ready for passenger review.',
      type: 'success',
    },
  ];
}

export function getCancelAgentLogs(): AgentLog[] {
  return [
    {
      id: 'log-cnc-1',
      timestamp: '14:10:02',
      agent: 'Carrier',
      message: 'CRITICAL ALERT: AI-804 BOM → DEL canceled due to technical issue (aircraft maintenance grounding). Initiating Level-1 Emergency Protocol.',
      type: 'error',
    },
    {
      id: 'log-cnc-2',
      timestamp: '14:10:06',
      agent: 'Carrier',
      message: 'Querying GDS interline inventory for immediate replacement flights BOM → DEL... 2 immediate seats identified on partner carrier.',
      type: 'info',
    },
    {
      id: 'log-cnc-3',
      timestamp: '14:10:11',
      agent: 'Carrier',
      message: 'Partner flight Vistara UK-992 departing 15:15 (2 seats) and Air India AI-860 departing 16:30 reserved on 30-minute hold.',
      type: 'warning',
    },
    {
      id: 'log-cnc-4',
      timestamp: '14:10:17',
      agent: 'Transit',
      message: 'Cascading failure detected: Gatimaan Express connection (17:30 NZM) broken. Upstream arrival before departure impossible.',
      type: 'error',
    },
    {
      id: 'log-cnc-5',
      timestamp: '14:10:22',
      agent: 'Transit',
      message: 'Auto-filing IRCTC Ticket Deposit Receipt (TDR) under disruption clause for 100% railway fare refund without cancellation penalty.',
      type: 'info',
    },
    {
      id: 'log-cnc-6',
      timestamp: '14:10:28',
      agent: 'Hospitality',
      message: 'Hotel check-in deadline 20:00 will be breached. Contacting Oberoi Amarvilas reservation desk with flight cancellation attestation.',
      type: 'warning',
    },
    {
      id: 'log-cnc-7',
      timestamp: '14:10:35',
      agent: 'Hospitality',
      message: 'Oberoi Amarvilas accepted late check-in extension to 23:30 with full fee waiver. Reservation status secured.',
      type: 'success',
    },
    {
      id: 'log-cnc-8',
      timestamp: '14:10:41',
      agent: 'Regulatory',
      message: 'Involuntary cancellation notified <24 hours prior triggers statutory DGCA CAR Section 3 Series M Part IV compensation mandate.',
      type: 'warning',
    },
    {
      id: 'log-cnc-9',
      timestamp: '14:10:47',
      agent: 'Regulatory',
      message: 'Generated formal compensation claim: ₹15,000 statutory compensation + 100% full ticket reimbursement.',
      type: 'info',
    },
    {
      id: 'log-cnc-10',
      timestamp: '14:10:53',
      agent: 'Carrier',
      message: 'Multi-modal recovery bundle assembled. Two comprehensive options synthesized and awaiting passenger authorization.',
      type: 'success',
    },
  ];
}

export function getDelayRecoveryOptions(): RecoveryOption[] {
  return [
    {
      id: 'rec-delay-1',
      name: 'Carrier Rebook + Expressway Chauffeur',
      tag: 'Balanced Recovery',
      description: 'Rebook to earlier standby flight AI-806 and switch transit to a private luxury cab from Delhi directly to Agra.',
      steps: [
        'Rebook to AI-806 (15:30 DEP)',
        'Cancel Gatimaan Express ticket (full refund)',
        'Book premium cab DEL → Agra (3h 15m)',
        'Hotel check-in pushed to 21:00 (waiver approved)',
      ],
      arrivalDelay: '+45 min',
      costDelta: '₹0 (airline covered)',
      stressScore: 2,
      recommended: true,
    },
    {
      id: 'rec-delay-2',
      name: 'Express Interline Transfer',
      tag: 'Ultra-Fast Premium',
      description: 'Emergency rebook to rival carrier IndiGo with VIP tarmac transfer, express lounge access, and pre-staged high-speed sedan.',
      steps: [
        'Emergency rebook to IndiGo 6E-331 (14:45 DEP)',
        'Priority lounge access at DEL T1',
        'Pre-booked Luxury sedan DEL → Agra',
        'Hotel ETA: 20:30',
      ],
      arrivalDelay: '+30 min',
      costDelta: '₹4,500 (partial coverage)',
      stressScore: 1,
      recommended: false,
    },
  ];
}

export function getCancelRecoveryOptions(): RecoveryOption[] {
  return [
    {
      id: 'rec-cancel-1',
      name: 'Vistara VIP Interline + Dedicated Chauffeur',
      tag: 'Full Interline Re-route',
      description: 'Immediate ticket reissue on Vistara UK-992 with seamless luggage transfer, followed by private chauffeur transit along Yamuna Expressway.',
      steps: [
        'Rebook to Vistara UK-992 BOM → DEL (15:15 DEP, 17:25 ARR)',
        'Full automatic refund credited for Gatimaan Express',
        'Dedicated executive chauffeur DEL T3 → Oberoi Amarvilas Agra',
        'Hotel guaranteed check-in extended to 22:30 (waiver confirmed)',
      ],
      arrivalDelay: '+90 min',
      costDelta: '₹0 (carrier absorbed)',
      stressScore: 2,
      recommended: true,
    },
    {
      id: 'rec-cancel-2',
      name: 'Next Available Flight + Vande Bharat Express',
      tag: 'Direct Rail Re-route',
      description: 'Rebook onto Air India AI-860 departing 16:30, connecting to the late-evening Vande Bharat Express to Agra.',
      steps: [
        'Rebook to Air India AI-860 (16:30 DEP, 18:45 ARR)',
        'Fast-track metro transfer DEL T3 to New Delhi Railway Station',
        'Board Vande Bharat Express #22470 (20:10 DEP, 21:40 ARR at Agra)',
        'Short pre-paid taxi to Oberoi Amarvilas (ETA 22:15)',
      ],
      arrivalDelay: '+105 min',
      costDelta: '₹0 (carrier absorbed)',
      stressScore: 4,
      recommended: false,
    },
  ];
}

export function getCompensationClaim(scenario: DisruptionScenario): CompensationClaim {
  if (scenario === 'cancel') {
    return {
      passengerName: 'Alex Vance',
      pnr: 'AR-9082',
      flightCode: 'AI-804',
      route: 'Mumbai (BOM) → Delhi (DEL)',
      disruptionType: 'Involuntary Flight Cancellation',
      delayDuration: 'Flight Canceled (Tech Defect)',
      regulation: 'DGCA CAR Section 3 Series M Part IV',
      compensationAmount: '₹15,000 + full refund',
      claimDate: '2024-03-15',
      body: `To: Air India Nodal Officer & Appellate Authority\nReference: PNR AR-9082 / AI-804 (Mumbai to Delhi) - Scheduled Departure March 15, 2024, 14:00 IST\n\nDear Sir/Madam,\n\nI am writing to submit a formal statutory compensation claim pursuant to the Directorate General of Civil Aviation (DGCA) Civil Aviation Requirements (CAR), Section 3 - Air Transport, Series M, Part IV, Issue I, dated August 6, 2010 (as amended).\n\nOn March 15, 2024, flight AI-804 from Chhatrapati Shivaji Maharaj International Airport (BOM) to Indira Gandhi International Airport (DEL), on which I held a confirmed reservation under PNR AR-9082, was canceled involuntarily due to technical maintenance defects. Notice of cancellation was communicated less than 2 hours prior to scheduled departure, failing the statutory 24-hour notification window, and no equivalent alternate arrangement was provided by the operating carrier within the stipulated two-hour threshold.\n\nIn accordance with Clause 3.3.2 of the DGCA CAR Series M Part IV, passengers affected by cancellations without requisite advance notice on domestic routes exceeding 2 hours block time are entitled to statutory compensation of ₹15,000 (or booked one-way basic fare plus airline fuel charge, whichever is less, along with a full refund of all unutilized sectors). Due to the carrier-side technical grounding, extraordinary circumstances exemptions do not apply.\n\nPlease remit the statutory compensation of ₹15,000 along with the full fare reimbursement to the originating payment account within 14 business days. Failure to settle this claim will result in escalation to the AirSewa Grievance Redressal Portal and the Ministry of Civil Aviation Ombudsman.\n\nYours faithfully,\nAlex Vance\nPassenger & Claimant`,
    };
  }

  // Default to delay scenario
  return {
    passengerName: 'Alex Vance',
    pnr: 'AR-9082',
    flightCode: 'AI-804',
    route: 'Mumbai (BOM) → Delhi (DEL)',
    disruptionType: 'Flight Delay (>3 Hours)',
    delayDuration: '180 Minutes (3h 00m)',
    regulation: 'DGCA CAR Section 3 Series M Part IV',
    compensationAmount: '₹10,000',
    claimDate: '2024-03-15',
    body: `To: Air India Customer Relations & Nodal Officer\nReference: PNR AR-9082 / AI-804 (Mumbai to Delhi) - Scheduled Departure March 15, 2024, 14:00 IST\n\nDear Sir/Madam,\n\nI am submitting a formal claim for statutory compensation and care provision under the Directorate General of Civil Aviation (DGCA) Civil Aviation Requirements (CAR), Section 3 - Air Transport, Series M, Part IV, governing facilities and compensation to passengers in case of flight delays and cancellations.\n\nI was booked on flight AI-804 scheduled to depart Mumbai (BOM) at 14:00 IST on March 15, 2024, arriving in Delhi (DEL) at 16:15 IST. The flight suffered an unmitigated operational delay of 180 minutes (3 hours), with revised departure at 17:00 IST and arrival at 19:15 IST. This delay caused a total collapse of onward inter-modal transit connections, specifically the Gatimaan Express departing at 17:30 IST from Hazrat Nizamuddin.\n\nPursuant to DGCA CAR Section 3 Series M Part IV, Clause 3.5, for flights with a block time between 1 and 2 hours experiencing delays exceeding 3 hours, the operating carrier is mandated to provide free refreshments/meals and statutory compensation of ₹10,000 for incurred passenger damages and delays where alternative travel was not expedited by the carrier.\n\nI hereby request that the compensation amount of ₹10,000 be disbursed directly to the passenger account associated with PNR AR-9082 within 14 calendar days, as prescribed under civil aviation consumer protection regulations. In the absence of a satisfactory response, this dispute will be escalated to the DGCA Consumer Grievance Cell.\n\nSincerely,\nAlex Vance\nPassenger & Claimant`,
  };
}

export function getRecoveredNodes(): ItineraryNode[] {
  return [
    {
      id: 'node-flight-1',
      type: 'flight',
      label: 'Air India AI-806',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      scheduledDeparture: '15:30',
      scheduledArrival: '17:45',
      status: 'recovered',
      details: 'Boeing 787-8 Dreamliner • Economy+ Seat 12A • Gate 34B',
      code: 'AI-806',
      statusMessage: 'REBOOKED & CONFIRMED (AI-806, Seat 12A)',
    },
    {
      id: 'node-train-1',
      type: 'transfer',
      label: 'Yamuna Expressway Executive Chauffeur',
      from: 'DEL T3 Airport',
      to: 'The Oberoi Amarvilas, Agra',
      scheduledDeparture: '18:15',
      scheduledArrival: '21:30',
      status: 'recovered',
      details: 'Mercedes-Benz E-Class • Chauffeur: Rajesh Kumar (+91 98110 44219) • Fastag VIP Lane',
      code: 'CHAUFFEUR-DEL-AGC',
      statusMessage: 'DISPATCHED & EN ROUTE',
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '21:30',
      scheduledArrival: '22:00',
      status: 'recovered',
      details: 'Premier Room with Taj View • Check-in deadline extended to 23:30 • No penalty fee',
      code: 'OA-RES-4401',
      statusMessage: 'WAIVER APPROVED • LATE CHECK-IN ASSURED',
    },
  ];
}

export function getRecoveredEdges(): ItineraryEdge[] {
  return [
    {
      id: 'edge-flight-train',
      label: 'Baggage Priority + Chauffeur Pickup Buffer (30m)',
      bufferMinutes: 30,
      status: 'recovered',
    },
    {
      id: 'edge-train-hotel',
      label: 'Hotel Late Check-in Buffer Window (60m)',
      bufferMinutes: 60,
      status: 'recovered',
    },
  ];
}
