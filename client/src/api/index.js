import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// Add an interceptor if needed for authenticated routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth routes
export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
