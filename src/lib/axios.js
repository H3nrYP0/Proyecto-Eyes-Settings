import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptor de peticiones ──
// Agrega el token JWT automáticamente en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de respuestas ──
// Si el token expiró (401), limpia sesión y redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
