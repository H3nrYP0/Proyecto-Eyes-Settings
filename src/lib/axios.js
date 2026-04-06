// lib/axios.js - YA ESTÁ CORRECTO
import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    console.group(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    console.log("Token en storage:", token ? `✅ ${token.substring(0, 30)}...` : "❌ NO HAY TOKEN");
    console.log("Longitud del token:", token?.length);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Header Authorization:", config.headers.Authorization.substring(0, 40) + "...");
    } else {
      console.warn("⚠️ No se encontró token en localStorage ni sessionStorage");
    }
    console.groupEnd();
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");
    
    console.group(`❌ ERROR ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.log("Status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("Headers enviados:", error.config?.headers);
    console.log("¿Es ruta auth?:", isAuthRoute);
    console.groupEnd();

    // LIMPIEZA DESACTIVADA TEMPORALMENTE
    // if (error.response?.status === 401 && !isAuthRoute) {
    //   console.warn("🧹 Limpiando sesión por 401 en ruta protegida");
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   sessionStorage.removeItem("token");
    //   sessionStorage.removeItem("user");
    //   window.location.href = "/login";
    // }

    return Promise.reject(error);
  }
);

export default api;