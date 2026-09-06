"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plane, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

const USERS = [
  { email: "alex.vance@aero.com",   password: "pass1234", name: "Alex Vance",   pnr: "AR-9082" },
  { email: "priya.sharma@aero.com", password: "pass1234", name: "Priya Sharma", pnr: "AR-5517" },
  { email: "rohit.mehta@aero.com",  password: "pass1234", name: "Rohit Mehta",  pnr: "AR-7734" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const matched = USERS.find(u => u.email === email && u.password === password);
      const user    = matched ?? (email && password.length >= 4 ? USERS[0] : null);
      if (!user) {
        setError("Incorrect email or password. Please try again.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("ar_user", JSON.stringify({ name: user.name, email: user.email, pnr: user.pnr }));
      router.push("/dashboard");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[50%] bg-indigo-700 flex-col justify-between p-14 relative overflow-hidden">

        {/* Background rings */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute border border-white rounded-full"
              style={{
                width:  `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white -rotate-45" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">AeroResilience</span>
        </div>

        {/* Tagline */}
        <div className="relative">
          <h1 className="text-white text-4xl font-bold leading-tight mb-5">
            Your journey,<br />always on track.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-sm">
            Smart itinerary protection across flights, trains, and hotels.
            When disruptions happen, we handle everything automatically.
          </p>
        </div>

        {/* Trust line */}
        <div className="relative flex items-center gap-3 text-indigo-200 text-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-300 shrink-0" />
          <span>256-bit encrypted &middot; DGCA compliant &middot; Available 24/7</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AeroResilience</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">Welcome back. Enter your credentials to continue.</p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in&hellip;
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            By signing in you agree to our{" "}
            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  );
}
