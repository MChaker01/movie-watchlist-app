import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Helper function to check if link is active
  const isActive = (path) => location.pathname === path;

  if (loading) {
    return null;
  }

  if (isAuthPage) {
    return (
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-white hover:text-amber-400 transition"
        >
          Movie<span className="text-amber-400">App</span>
        </Link>
      </div>
    );
  }

  return (
    <nav className="bg-neutral-950 border-b border-white/10 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-y-4">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-white hover:text-amber-400 transition"
        >
          Movie<span className="text-amber-400">App</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Link
            to="/"
            className={`text-sm font-medium transition ${
              isActive("/")
                ? "text-amber-400"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Search
          </Link>

          {user ? (
            <>
              <Link
                to="/watchlist"
                className={`text-sm font-medium transition ${
                  isActive("/watchlist")
                    ? "text-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Watchlist
              </Link>

              <Link
                to="/my-reviews"
                className={`text-sm font-medium transition ${
                  isActive("/my-reviews")
                    ? "text-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                My Reviews
              </Link>

              <div className="flex items-center gap-3 sm:ml-4 sm:pl-4 sm:border-l sm:border-white/10 w-full sm:w-auto">
                <span className="text-sm text-neutral-400">
                  Hello,{" "}
                  <span className="text-white font-medium">
                    {user.username}
                  </span>
                </span>

                <button
                  onClick={logout}
                  className="text-sm px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-neutral-400 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
