import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptor de peticiones ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de respuestas ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");

    // Solo limpiar sesión si el 401 viene de una ruta protegida
    // Nunca interferir con login, register, forgot-password, etc.
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;