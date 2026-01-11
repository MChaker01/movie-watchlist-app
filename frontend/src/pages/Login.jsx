import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/watchlist");
    } catch (error) {
      console.error("Error while login.", error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md px-8 py-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Continue your watchlist journey
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 rounded-xl bg-linear-to-r from-amber-500 to-red-500 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-neutral-400 text-center">
          No account yet?{" "}
          <Link
            to="/register"
            className="text-amber-400 hover:text-amber-300 transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
