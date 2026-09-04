# ✈️ AeroResilience // Travel Disruption Recovery Engine v1.0

> **PS-2: AI-Driven Proactive Travel Disruption Recovery Engine**  
> Built for 24-hour hackathon demo — zero external dependencies, one-click Vercel deploy.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)

## 🚀 What is AeroResilience?

AeroResilience is an AI-driven, **proactive** travel disruption engine that:

1. **Maps** multi-leg multimodal itineraries as a dependency graph (Flight → Transfer → Train → Hotel)
2. **Detects** disruptions in real time
3. **Evaluates** cascading downstream impacts automatically
4. **Resolves** via autonomous agents (Carrier, Transit, Hospitality, Regulatory) that negotiate alternatives, draft waivers, and claim compensation

## 🎮 Demo Scenarios

| Scenario | Trigger | What Happens |
|----------|---------|--------------|
| **Flight Delayed +180m** | Weather delay on AI-804 | Cascading failure: missed train, hotel penalty risk → Agent resolution |
| **Flight Canceled** | Technical grounding | Total itinerary collapse → Emergency interline rebook + chauffeur |
| **Normal Operations** | Control state | All segments green and on-time |

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — Full type safety
- **Tailwind CSS** — Dark theme UI
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon system
- **100% Mock Data** — No API keys needed

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/aeroresilience)

**Zero environment variables required.** Push to GitHub → Import in Vercel → Done.

## 📁 Project Structure

```
aeroresilience/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main orchestrator (state management)
│   └── globals.css         # Tailwind + custom animations
├── components/
│   ├── TopNavBar.tsx        # App branding & passenger info
│   ├── SimulationControlBar.tsx  # Scenario triggers
│   ├── ItineraryTimeline.tsx     # Dependency graph visualization
│   ├── AgentFeed.tsx        # Terminal-style agent negotiation logs
│   ├── RerouteProposal.tsx  # Pareto-optimal recovery options
│   └── CompensationModal.tsx # Legal compensation claim drawer
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   └── mockData.ts          # Complete mock datasets
└── package.json
```

## 📄 License

MIT — Built for hackathon demonstration purposes.
