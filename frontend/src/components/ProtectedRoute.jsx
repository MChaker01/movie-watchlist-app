import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Step 1: If still checking auth, show loading
  if (loading) {
    return <Spinner />;
  }

  // Step 2: If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Step 3: If user exists, render the protected page
  return <Outlet />;
};

export default ProtectedRoute;
