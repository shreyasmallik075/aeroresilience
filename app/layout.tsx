import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroResilience — Travel Disruption Recovery Engine",
  description:
    "AI-driven proactive travel disruption recovery. Real-time cascade analysis, autonomous agent negotiation, and smart re-routing for modern travellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
