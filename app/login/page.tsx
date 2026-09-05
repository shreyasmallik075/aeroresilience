"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Plane,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const DEMO_USERS = [
  { email: "alex.vance@aero.com", password: "demo1234", name: "Alex Vance", pnr: "AR-9082", route: "BOM → DEL → AGC" },
  { email: "priya.sharma@aero.com", password: "demo1234", name: "Priya Sharma", pnr: "AR-5517", route: "DEL → BOM → GOI" },
  { email: "rohit.mehta@aero.com", password: "demo1234", name: "Rohit Mehta", pnr: "AR-7734", route: "BOM → CCU → DEL" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // Accept any of the demo users OR any non-empty email+password (demo mode)
      const matched = DEMO_USERS.find(u => u.email === email && u.password === password);
      const user = matched ?? (email && password.length >= 4 ? DEMO_USERS[0] : null);

      if (!user) {
        setError("Invalid credentials. Use any email with password ≥ 4 characters.");
        setLoading(false);
        return;
      }

      // Persist minimal session
      sessionStorage.setItem("ar_user", JSON.stringify({ name: user.name, email: user.email, pnr: user.pnr }));
      router.push("/dashboard");
    }, 900);
  };

  const quickFill = (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] bg-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-white rounded-full"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white rotate-[-30deg]" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">AeroResilience</div>
            <div className="text-indigo-200 text-xs font-mono mt-0.5">Engine v1.0</div>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Travel disruption<br />
            resolved before<br />
            you know it.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-10 max-w-sm">
            AI-powered multi-modal itinerary protection. When your flight is delayed,
            our agents rebook, negotiate, and claim compensation automatically.
          </p>

          <div className="space-y-4">
            {[
              { icon: Zap, text: "Real-time cascade impact analysis" },
              { icon: Globe, text: "Multi-modal: Flight + Train + Hotel" },
              { icon: Shield, text: "Auto DGCA compensation claims" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary preview card */}
        <div className="relative bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
          <div className="text-indigo-200 text-xs font-mono uppercase tracking-wider mb-3">Live Itinerary · PNR AR-9082</div>
          <div className="space-y-3">
            {[
              { code: "AI-804", from: "BOM", to: "DEL", time: "14:00 → 16:15", status: "bg-amber-400" },
              { code: "GE-1202", from: "NZM", to: "AGC", time: "17:30 → 19:10", status: "bg-red-400" },
              { code: "OA-RES", from: "AGC", to: "HOTEL", time: "Check-in 20:00", status: "bg-amber-400" },
            ].map((item) => (
              <div key={item.code} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.status} shrink-0`} />
                <span className="text-white font-mono text-xs w-16">{item.code}</span>
                <span className="text-indigo-200 text-xs">{item.from} → {item.to}</span>
                <span className="text-indigo-300 text-xs ml-auto">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white rotate-[-30deg]" />
            </div>
            <span className="font-bold text-gray-900">AeroResilience</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your credentials or use a quick-fill demo account below.
          </p>

          {/* Demo quick-fill */}
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-3">
              Demo Accounts — click to fill
            </p>
            <div className="space-y-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => quickFill(u)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{u.pnr} · {u.route}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white placeholder-gray-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white placeholder-gray-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            Demo mode — no real data transmitted. For hackathon use only.
          </div>
        </div>
      </div>
    </div>
  );
}
