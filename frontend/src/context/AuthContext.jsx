import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on app mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await api.get("/auth/me");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function - THROWS error if fails
  const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data);
    return response; // Return for success cases (optional)
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Error handling: ensure hook is used within Provider
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
