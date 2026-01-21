import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

/**
 * GuestRoute Component
 *
 * Purpose: Protects authentication pages (login/register) from logged-in users
 */

const GuestRoute = () => {
  const { user, loading } = useAuth();
  // If still checking auth → show loading spinner
  if (loading) {
    return <Spinner />;
  }

  // If user is logged in → redirect to home/watchlist
  if (user) {
    return <Navigate to="/watchlist" />;
  }

  // Step 3: If no user (guest), allow access to login/register pages
  return <Outlet />;
};

export default GuestRoute;
