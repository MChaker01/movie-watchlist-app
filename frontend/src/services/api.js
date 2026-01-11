import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Request interceptor - attach token to every request
api.interceptors.request.use((config) => {
  // Do something before request is sent
  const token = localStorage.getItem("token");
  if (token) {
    // attach token to every request.
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response, // If successful, just return response
  (error) => {
    // Only redirect on 401 if user was logged in
    // (Don't redirect on failed login/register attempts)
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");

      if (token) {
        console.log("Session expired, redirecting to login");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Force redirect to login
      }

      // If no token, it's just a failed login attempt - let component handle it
    }
    return Promise.reject(error);
  }
);

export default api;
