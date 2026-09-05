import {
  DisruptionScenario,
  ItineraryNode,
  ItineraryEdge,
  AgentLog,
  RecoveryOption,
  CompensationClaim,
  StandbyFlight,
} from './types';

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

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
    details: 'Boeing 787-8 · Seat 14B · Terminal 2 · Gate 42',
    code: 'AI-804',
    statusMessage: 'On Time · Gate 42 Open',
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
    details: 'Executive Class · Coach E1, Seat 24 · Platform 1',
    code: 'GE-1202',
    statusMessage: 'Scheduled On Time · Platform 1',
  },
  {
    id: 'node-hotel-1',
    type: 'hotel',
    label: 'The Oberoi Amarvilas, Agra',
    from: 'Agra Cantt (AGC)',
    to: 'Taj East Gate Rd, Agra',
    scheduledDeparture: '20:00',
    scheduledArrival: '20:30',
    status: 'intact',
    details: 'Premier Room · Taj View · Check-in by 20:00',
    code: 'OA-RES-4401',
    statusMessage: 'Reservation Confirmed · Guaranteed Check-in',
  },
];

export const initialEdges: ItineraryEdge[] = [
  {
    id: 'edge-1',
    label: 'DEL T3 → Nizamuddin Station',
    bufferMinutes: 75,
    status: 'intact',
  },
  {
    id: 'edge-2',
    label: 'Agra Cantt → Oberoi Transfer',
    bufferMinutes: 45,
    status: 'intact',
  },
];

// ─── DELAY SCENARIO (dynamic based on delay minutes) ─────────────────────────

export function getDelayScenarioNodes(delayMins: number): ItineraryNode[] {
  const origDep = 14 * 60; // 14:00 in minutes
  const origArr = 16 * 60 + 15; // 16:15
  const newDep = origDep + delayMins;
  const newArr = origArr + delayMins;
  const fmt = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const trainDep = 17 * 60 + 30; // 17:30
  const bufferLeft = trainDep - newArr; // positive = buffer remaining, negative = deficit
  const trainStatus: ItineraryNode['status'] = bufferLeft >= 45 ? 'warning' : 'critical';
  const hotelStatus: ItineraryNode['status'] = bufferLeft < 0 ? 'warning' : 'intact';

  return [
    {
      id: 'node-flight-1',
      type: 'flight',
      label: 'Air India AI-804',
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      scheduledDeparture: fmt(newDep),
      scheduledArrival: fmt(newArr),
      status: 'warning',
      details: `Boeing 787-8 · Seat 14B · Original departure: 14:00`,
      code: 'AI-804',
      statusMessage: `DELAYED +${delayMins} MIN — Weather at BOM`,
    },
    {
      id: 'node-train-1',
      type: 'train',
      label: 'Gatimaan Express 1202',
      from: 'Hazrat Nizamuddin (NZM)',
      to: 'Agra Cantt (AGC)',
      scheduledDeparture: '17:30',
      scheduledArrival: '19:10',
      status: trainStatus,
      details: `Executive Class · Departure at 17:30 · Buffer after flight arrival: ${bufferLeft >= 0 ? bufferLeft + ' min' : 'DEFICIT ' + Math.abs(bufferLeft) + ' min'}`,
      code: 'GE-1202',
      statusMessage:
        bufferLeft < 0
          ? `MISSED CONNECTION RISK: 100% · ${Math.abs(bufferLeft)} min deficit`
          : `Connection Risk: HIGH · Only ${bufferLeft} min buffer`,
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas, Agra',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '20:00',
      scheduledArrival: '20:30',
      status: hotelStatus,
      details: 'Premier Room · Check-in cutoff 20:00 — late arrival without waiver incurs penalty',
      code: 'OA-RES-4401',
      statusMessage: hotelStatus === 'warning' ? 'LATE CHECK-IN — PENALTY RISK' : 'At Risk — Cascade Impact',
    },
  ];
}

export function getDelayScenarioEdges(delayMins: number): ItineraryEdge[] {
  const trainDep = 17 * 60 + 30;
  const flightArr = 16 * 60 + 15 + delayMins;
  const buffer = trainDep - flightArr;
  return [
    {
      id: 'edge-1',
      label: buffer < 0 ? `Connection broken · ${Math.abs(buffer)} min deficit` : `Buffer: ${buffer} min remaining`,
      bufferMinutes: buffer,
      status: buffer < 0 ? 'critical' : 'warning',
    },
    {
      id: 'edge-2',
      label: 'Agra Cantt → Oberoi Transfer',
      bufferMinutes: 45,
      status: buffer < 0 ? 'warning' : 'intact',
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
      details: 'Boeing 787-8 · Grounded at BOM — Unserviceable hydraulic line',
      code: 'AI-804',
      statusMessage: 'FLIGHT CANCELED — Technical Issue',
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
      details: 'Passenger stranded in Mumbai — upstream flight canceled',
      code: 'GE-1202',
      statusMessage: 'MISSED CONNECTION — No Upstream Flight',
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas, Agra',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '20:00',
      scheduledArrival: '20:30',
      status: 'critical',
      details: 'Non-arrival without waiver = full night charge penalty',
      code: 'OA-RES-4401',
      statusMessage: 'NO-SHOW — Full Penalty Risk',
    },
  ];
}

export function getCancelScenarioEdges(): ItineraryEdge[] {
  return [
    { id: 'edge-1', label: 'Flight canceled — connection broken', bufferMinutes: 0, status: 'critical' },
    { id: 'edge-2', label: 'Destination unreachable', bufferMinutes: 0, status: 'critical' },
  ];
}

// ─── STANDBY FLIGHTS ──────────────────────────────────────────────────────────

export const standbyFlights: StandbyFlight[] = [
  {
    id: 'sb-1',
    flightCode: 'AI-806',
    airline: 'Air India',
    airlineCode: 'AI',
    departure: '15:30',
    arrival: '17:45',
    aircraft: 'Airbus A320',
    seatsAvailable: 3,
    fareClass: 'Economy+',
    fareDelta: '₹0 (airline covers)',
    status: 'available',
    gate: '34B',
    terminal: 'T2',
    durationMins: 135,
  },
  {
    id: 'sb-2',
    flightCode: '6E-331',
    airline: 'IndiGo',
    airlineCode: '6E',
    departure: '14:45',
    arrival: '17:00',
    aircraft: 'Airbus A321neo',
    seatsAvailable: 7,
    fareClass: 'Economy',
    fareDelta: '₹2,200 (you pay)',
    status: 'available',
    gate: '11A',
    terminal: 'T1',
    durationMins: 135,
  },
  {
    id: 'sb-3',
    flightCode: 'UK-992',
    airline: 'Vistara',
    airlineCode: 'UK',
    departure: '15:15',
    arrival: '17:25',
    aircraft: 'Boeing 737-800',
    seatsAvailable: 2,
    fareClass: 'Business',
    fareDelta: '₹8,500 (upgrade cost)',
    status: 'available',
    gate: '22C',
    terminal: 'T2',
    durationMins: 130,
  },
  {
    id: 'sb-4',
    flightCode: 'SG-104',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    departure: '16:10',
    arrival: '18:30',
    aircraft: 'Boeing 737 MAX',
    seatsAvailable: 1,
    fareClass: 'Economy',
    fareDelta: '₹1,800 (you pay)',
    status: 'waitlisted',
    gate: '8D',
    terminal: 'T1',
    durationMins: 140,
  },
  {
    id: 'sb-5',
    flightCode: 'AI-860',
    airline: 'Air India',
    airlineCode: 'AI',
    departure: '16:30',
    arrival: '18:45',
    aircraft: 'Airbus A320',
    seatsAvailable: 0,
    fareClass: 'Economy',
    fareDelta: '₹0 (airline covers)',
    status: 'full',
    gate: '41A',
    terminal: 'T2',
    durationMins: 135,
  },
];

// ─── AGENT LOGS ───────────────────────────────────────────────────────────────

export function getDelayAgentLogs(delayMins: number): AgentLog[] {
  const trainDep = 17 * 60 + 30;
  const flightArr = 16 * 60 + 15 + delayMins;
  const deficit = trainDep - flightArr;

  return [
    { id: 'l1', timestamp: '14:32:05', agent: 'Carrier', type: 'warning',
      message: `Disruption alert: AI-804 delayed ${delayMins} min due to adverse weather conditions at BOM. Recovery protocol initiated.` },
    { id: 'l2', timestamp: '14:32:09', agent: 'Carrier', type: 'info',
      message: `Scanning available standby seats BOM → DEL across 5 partner carriers via GDS... Found ${standbyFlights.filter(f => f.status === 'available').length} viable slots.` },
    { id: 'l3', timestamp: '14:32:14', agent: 'Carrier', type: 'success',
      message: `Best interline option: AI-806 departing 15:30, arriving 17:45 (Economy+, ₹0 passenger cost). Seat 12A held for 10 mins.` },
    { id: 'l4', timestamp: '14:32:19', agent: 'Transit', type: 'error',
      message: `Cascade detected: AI-804 arrival ${new Date(Date.now()).toTimeString().slice(0,5)} → train departure 17:30 → connection ${deficit < 0 ? 'DEFICIT ' + Math.abs(deficit) + ' min' : 'buffer only ' + deficit + ' min'}.` },
    { id: 'l5', timestamp: '14:32:24', agent: 'Transit', type: 'info',
      message: `Alternate rail: Vande Bharat Express departs 19:45 (viable if flight lands by 19:00). Private chauffeur DEL→AGR also available (3h 15m, ₹3,200).` },
    { id: 'l6', timestamp: '14:32:30', agent: 'Hospitality', type: 'warning',
      message: `Oberoi Amarvilas check-in cutoff 20:00 at risk. Initiating automated no-show waiver request under Force Majeure clause.` },
    { id: 'l7', timestamp: '14:32:35', agent: 'Hospitality', type: 'success',
      message: `Waiver accepted. Oberoi Amarvilas extended check-in deadline to 23:30 with zero penalty. Reservation OA-RES-4401 secured.` },
    { id: 'l8', timestamp: '14:32:41', agent: 'Regulatory', type: 'warning',
      message: `Delay >${delayMins >= 120 ? '2' : '1'} hours on domestic route triggers DGCA CAR Section 3 Series M Part IV compensation rights.` },
    { id: 'l9', timestamp: '14:32:46', agent: 'Regulatory', type: 'info',
      message: `Compensation claim pre-drafted: ${delayMins >= 180 ? '₹10,000' : '₹7,500'} statutory amount. Claim ready for one-tap submission.` },
    { id: 'l10', timestamp: '14:32:52', agent: 'Carrier', type: 'success',
      message: `Recovery bundle assembled. Please review standby options and select your preferred flight to finalize the recovery plan.` },
  ];
}

export function getCancelAgentLogs(): AgentLog[] {
  return [
    { id: 'c1', timestamp: '14:10:02', agent: 'Carrier', type: 'error',
      message: 'CRITICAL: AI-804 BOM→DEL canceled — aircraft grounded (hydraulic system fault). Level-1 emergency protocol activated.' },
    { id: 'c2', timestamp: '14:10:07', agent: 'Carrier', type: 'info',
      message: 'Querying interline inventory across 6 carriers for immediate BOM→DEL seats... 3 carrier options found.' },
    { id: 'c3', timestamp: '14:10:13', agent: 'Carrier', type: 'warning',
      message: 'Vistara UK-992 (15:15) has 2 business seats on hold. IndiGo 6E-331 (14:45) has 7 economy seats available.' },
    { id: 'c4', timestamp: '14:10:18', agent: 'Transit', type: 'error',
      message: 'Total cascade failure: Gatimaan Express 17:30 NZM unreachable — passenger cannot board from Delhi.' },
    { id: 'c5', timestamp: '14:10:24', agent: 'Transit', type: 'info',
      message: 'Auto-filing IRCTC TDR (Ticket Deposit Receipt) for 100% rail fare refund — disruption clause applied.' },
    { id: 'c6', timestamp: '14:10:30', agent: 'Hospitality', type: 'warning',
      message: 'Hotel check-in 20:00 will be breached. Sending flight cancellation attestation to Oberoi Amarvilas.' },
    { id: 'c7', timestamp: '14:10:36', agent: 'Hospitality', type: 'success',
      message: 'Oberoi Amarvilas: late check-in extended to 23:30, zero penalty. Reservation fully secured.' },
    { id: 'c8', timestamp: '14:10:42', agent: 'Regulatory', type: 'warning',
      message: 'Involuntary cancellation <24h notice → DGCA CAR Section 3 Series M Part IV mandatory compensation triggered.' },
    { id: 'c9', timestamp: '14:10:48', agent: 'Regulatory', type: 'info',
      message: 'Claim generated: ₹15,000 statutory compensation + 100% ticket refund. Letter ready for export.' },
    { id: 'c10', timestamp: '14:10:54', agent: 'Carrier', type: 'success',
      message: 'Full recovery bundle ready. Select your preferred standby flight to confirm the re-route plan.' },
  ];
}

// ─── RECOVERY OPTIONS ─────────────────────────────────────────────────────────

export function buildRecoveryOptions(
  selectedFlight: StandbyFlight | null,
  scenario: DisruptionScenario
): RecoveryOption[] {
  if (scenario === 'cancel') {
    const chosenFlight = selectedFlight ?? standbyFlights[0];
    return [
      {
        id: 'r1',
        name: `Interline Rebook via ${chosenFlight.airline}`,
        tag: 'Full Interline Re-route',
        description: `Immediate ticket reissue on ${chosenFlight.flightCode} with seamless luggage transfer and private chauffeur to Agra.`,
        steps: [
          `Rebook to ${chosenFlight.flightCode} (${chosenFlight.departure} DEP, ${chosenFlight.arrival} ARR)`,
          'Full automatic refund for Gatimaan Express ticket',
          `Executive chauffeur from ${chosenFlight.terminal} Terminal → Oberoi Amarvilas Agra`,
          'Hotel check-in extended to 23:30 (confirmed)',
        ],
        arrivalDelay: '+90 min',
        costDelta: chosenFlight.fareDelta,
        stressScore: 2,
        recommended: true,
        flightCode: chosenFlight.flightCode,
      },
      {
        id: 'r2',
        name: 'Next Flight + Vande Bharat Express',
        tag: 'Rail Re-route',
        description: 'Rebook to the next available Air India flight and connect via late Vande Bharat Express.',
        steps: [
          'Rebook to Air India AI-860 (16:30 DEP, 18:45 ARR)',
          'Metro transfer DEL T3 → New Delhi Railway Station',
          'Vande Bharat Express #22470 (20:10 DEP, 21:40 ARR Agra)',
          'Pre-paid taxi to Oberoi Amarvilas (ETA 22:15)',
        ],
        arrivalDelay: '+105 min',
        costDelta: '₹0 (carrier absorbed)',
        stressScore: 4,
        recommended: false,
        flightCode: 'AI-860',
      },
    ];
  }

  const chosenFlight = selectedFlight ?? standbyFlights[0];
  const chosenArrMins = parseInt(chosenFlight.arrival.split(':')[0]) * 60 + parseInt(chosenFlight.arrival.split(':')[1]);
  const trainDep = 17 * 60 + 30;
  const bufferAfterChosen = trainDep - chosenArrMins;

  return [
    {
      id: 'r1',
      name: `Rebook ${chosenFlight.flightCode} + Chauffeur Transfer`,
      tag: 'Balanced Recovery',
      description: `Switch to ${chosenFlight.flightCode} (${chosenFlight.airline}) and replace the train leg with a private chauffeur direct to Agra.`,
      steps: [
        `Rebook to ${chosenFlight.flightCode} (${chosenFlight.departure} DEP, ${chosenFlight.arrival} ARR) — ${chosenFlight.fareClass}`,
        'Cancel Gatimaan Express ticket (full refund processed)',
        `Premium cab from DEL ${chosenFlight.terminal} Terminal → Oberoi Amarvilas Agra (3h 15m)`,
        'Hotel check-in extended to 22:00 (waiver approved)',
      ],
      arrivalDelay: bufferAfterChosen >= 45 ? '+30 min' : '+60 min',
      costDelta: chosenFlight.fareDelta,
      stressScore: 2,
      recommended: true,
      flightCode: chosenFlight.flightCode,
    },
    {
      id: 'r2',
      name: 'Rebook + Vande Bharat Express',
      tag: 'Rail Option',
      description: `Take ${chosenFlight.flightCode} and catch the late Vande Bharat Express from Delhi if arrival time permits.`,
      steps: [
        `Board ${chosenFlight.flightCode} (${chosenFlight.departure} DEP)`,
        `Transfer DEL ${chosenFlight.terminal} → Hazrat Nizamuddin (metro, 35 min)`,
        bufferAfterChosen >= 30 ? 'Catch Gatimaan Express 17:30 (tight but viable)' : 'Board Vande Bharat Express at 19:45',
        'Arrive Agra Cantt, taxi to Oberoi Amarvilas',
      ],
      arrivalDelay: '+45 min',
      costDelta: '₹0 (airline covered)',
      stressScore: 3,
      recommended: false,
      flightCode: chosenFlight.flightCode,
    },
  ];
}

// ─── COMPENSATION CLAIM ───────────────────────────────────────────────────────

export function getCompensationClaim(
  scenario: DisruptionScenario,
  delayMins: number
): CompensationClaim {
  if (scenario === 'cancel') {
    return {
      passengerName: 'Alex Vance',
      pnr: 'AR-9082',
      flightCode: 'AI-804',
      route: 'Mumbai (BOM) → Delhi (DEL)',
      disruptionType: 'Involuntary Flight Cancellation',
      delayDuration: 'Flight Canceled (Technical Defect)',
      regulation: 'DGCA CAR Section 3 Series M Part IV',
      compensationAmount: '₹15,000 + Full Refund',
      claimDate: new Date().toISOString().split('T')[0],
      body: `To: Air India Nodal Officer & Appellate Authority
Reference: PNR AR-9082 / AI-804 (Mumbai to Delhi)
Scheduled Departure: 14:00 IST

Dear Sir/Madam,

I am writing to submit a formal statutory compensation claim pursuant to the Directorate General of Civil Aviation (DGCA) Civil Aviation Requirements (CAR), Section 3 — Air Transport, Series M, Part IV, Issue I.

On the date of travel, flight AI-804 from Chhatrapati Shivaji Maharaj International Airport (BOM) to Indira Gandhi International Airport (DEL), on which I held a confirmed reservation under PNR AR-9082, was canceled involuntarily due to a technical aircraft maintenance defect. Notice of cancellation was communicated less than 2 hours prior to scheduled departure, failing the statutory 24-hour notification window mandated under DGCA regulations.

Pursuant to Clause 3.3.2 of the DGCA CAR Series M Part IV, passengers affected by cancellations without requisite advance notice are entitled to statutory compensation of ₹15,000 along with a full refund of all unutilized sectors. As the cancellation was due to a carrier-side technical grounding, extraordinary circumstance exemptions do not apply.

I request that the compensation of ₹15,000 be remitted to the originating payment account associated with PNR AR-9082 within 14 business days. Failure to resolve this claim will result in escalation to the AirSewa Grievance Redressal Portal and the Ministry of Civil Aviation Ombudsman.

Yours faithfully,
Alex Vance
Passenger & Claimant`,
    };
  }

  const amount = delayMins >= 180 ? '₹10,000' : '₹7,500';
  return {
    passengerName: 'Alex Vance',
    pnr: 'AR-9082',
    flightCode: 'AI-804',
    route: 'Mumbai (BOM) → Delhi (DEL)',
    disruptionType: `Flight Delay (${delayMins} Minutes)`,
    delayDuration: `${delayMins} Minutes (${Math.floor(delayMins / 60)}h ${delayMins % 60}m)`,
    regulation: 'DGCA CAR Section 3 Series M Part IV',
    compensationAmount: amount,
    claimDate: new Date().toISOString().split('T')[0],
    body: `To: Air India Customer Relations & Nodal Officer
Reference: PNR AR-9082 / AI-804 (Mumbai to Delhi)
Scheduled Departure: 14:00 IST

Dear Sir/Madam,

I am submitting a formal compensation claim under the Directorate General of Civil Aviation (DGCA) Civil Aviation Requirements (CAR), Section 3 — Air Transport, Series M, Part IV, governing passenger rights in cases of flight delays.

I was booked on flight AI-804 scheduled to depart Mumbai (BOM) at 14:00 IST. The flight suffered an operational delay of ${delayMins} minutes (${Math.floor(delayMins / 60)} hours ${delayMins % 60} minutes) due to adverse weather conditions at origin. This delay caused a cascading failure of my onward inter-modal connections, specifically the Gatimaan Express departure at 17:30 IST from Hazrat Nizamuddin.

Pursuant to DGCA CAR Section 3 Series M Part IV, Clause 3.5, for delays exceeding ${delayMins >= 180 ? '3' : '2'} hours on domestic routes, the operating carrier is mandated to provide statutory compensation of ${amount} for demonstrated passenger disruption where alternative arrangements were not expedited within prescribed time limits.

I request disbursement of ${amount} to the originating payment account within 14 calendar days. In absence of a satisfactory response, this dispute will be escalated to the DGCA Consumer Grievance Cell.

Sincerely,
Alex Vance
Passenger & Claimant`,
  };
}

// ─── RECOVERED STATE ──────────────────────────────────────────────────────────

export function getRecoveredNodes(selectedFlight: StandbyFlight | null): ItineraryNode[] {
  const flight = selectedFlight ?? standbyFlights[0];
  return [
    {
      id: 'node-flight-1',
      type: 'flight',
      label: `${flight.airline} ${flight.flightCode}`,
      from: 'Mumbai (BOM)',
      to: 'Delhi (DEL)',
      scheduledDeparture: flight.departure,
      scheduledArrival: flight.arrival,
      status: 'recovered',
      details: `${flight.aircraft} · ${flight.fareClass} · Gate ${flight.gate} · ${flight.terminal} Terminal`,
      code: flight.flightCode,
      statusMessage: `REBOOKED & CONFIRMED — Gate ${flight.gate}`,
    },
    {
      id: 'node-transfer-1',
      type: 'transfer',
      label: 'Yamuna Expressway Executive Chauffeur',
      from: `DEL ${flight.terminal} Terminal`,
      to: 'The Oberoi Amarvilas, Agra',
      scheduledDeparture: flight.arrival,
      scheduledArrival: '21:30',
      status: 'recovered',
      details: 'Mercedes-Benz E-Class · Chauffeur: Rajesh Kumar · VIP Fastag Lane',
      code: 'CHAUFFEUR-DEL-AGC',
      statusMessage: 'DISPATCHED & EN ROUTE',
    },
    {
      id: 'node-hotel-1',
      type: 'hotel',
      label: 'The Oberoi Amarvilas, Agra',
      from: 'Agra Cantt (AGC)',
      to: 'Taj East Gate Rd, Agra',
      scheduledDeparture: '21:30',
      scheduledArrival: '22:00',
      status: 'recovered',
      details: 'Premier Room · Taj View · Check-in extended to 23:30 · Zero penalty',
      code: 'OA-RES-4401',
      statusMessage: 'WAIVER APPROVED · LATE CHECK-IN ASSURED',
    },
  ];
}

export function getRecoveredEdges(): ItineraryEdge[] {
  return [
    { id: 'edge-1', label: 'Baggage Priority + Chauffeur Pickup (30 min)', bufferMinutes: 30, status: 'recovered' },
    { id: 'edge-2', label: 'Hotel Late Check-in Window (90 min)', bufferMinutes: 90, status: 'recovered' },
  ];
}
