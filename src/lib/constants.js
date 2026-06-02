/**
 * Cliente Axios configurado para la API.
 * - Añade automáticamente el token JWT a las cabeceras.
 * - Maneja errores 401 limpiando sesión y redirigiendo.
 * - URL base debe apuntar al backend (cambiar para desarrollo local).
 */

import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Lista de rutas que no requieren token (solo para logging, no afecta seguridad)
const PUBLIC_ROUTES = ["/productos", "/categorias", "/marcas", "/servicios", "/auth/login"];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const isPublic = PUBLIC_ROUTES.some((route) => config.url?.includes(route));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logs en desarrollo
    if (process.env.NODE_ENV !== "production") {
      console.groupCollapsed(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log("¿Es ruta pública?:", isPublic ? "✅ SÍ" : "🔒 NO");
      console.log("Token enviado:", token ? "✅ Presente" : "❌ Ausente");
      console.groupEnd();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const isAuthRoute = config?.url?.includes("/auth/");

    if (response?.status === 401 && !isAuthRoute) {
      console.error("🔴 Sesión inválida o expirada. Redirigiendo...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }

    console.group(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`);
    console.log("Status:", response?.status);
    console.log("Mensaje:", response?.data?.message || response?.data?.error || "Error desconocido");
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default api;
