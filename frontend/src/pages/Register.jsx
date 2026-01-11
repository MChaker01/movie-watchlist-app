import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (confirmPassword !== password) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      // Call api.post('/auth/register', { username, email, password })
      await api.post("/auth/register", {
        username,
        email,
        password,
      });
      // On success, navigate to /login
      navigate("/login");
    } catch (error) {
      console.error("Error while creating accounte.", error);
      setError(error.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-neutral-900 to-neutral-950 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-112.5 h-112.5 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-87.5 h-87.5 bg-red-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-lg px-8 py-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Create account
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Build your personal movie universe
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
              className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white focus:outline-none focus:border-amber-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white focus:outline-none focus:border-amber-400 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-2">
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-700 px-1 py-2 text-white focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 rounded-xl bg-linear-to-r from-red-500 to-amber-500 py-3 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-sm text-neutral-400 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
