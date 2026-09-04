import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroResilience // Travel Disruption Recovery Engine v1.0",
  description: "AI-driven proactive travel disruption recovery engine. Maps multimodal itineraries, detects disruptions, evaluates cascading impacts, and autonomously resolves travel disruptions.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✈️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
