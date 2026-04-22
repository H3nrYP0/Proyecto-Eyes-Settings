import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Lista de rutas que el backend permite sin token (Landing Page)
const PUBLIC_ROUTES = ["/productos", "/categorias", "/marcas", "/servicios", "/auth/login"];

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    // Verificamos si la URL actual es una de las públicas
    const isPublic = PUBLIC_ROUTES.some(route => config.url?.includes(route));

    // Si tenemos token, lo enviamos siempre (por si acaso hay lógica mixta)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    
    // Solo mostramos logs detallados en desarrollo para no ensuciar la consola
    if (process.env.NODE_ENV !== 'production') {
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
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;
    const isAuthRoute = config?.url?.includes("/auth/");

    // Si recibimos un 401 (No autorizado) y NO es una ruta de login/registro
    if (response?.status === 401 && !isAuthRoute) {
      console.error("🔴 Sesión inválida o expirada. Redirigiendo...");
      
      // Limpiamos todo rastro de sesión
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Opcional: Redirigir al login si no estás ya ahí
      if (window.location.pathname.startsWith('/admin')) {
          window.location.href = "/login";
      }
    }

    // Log de errores para depuración
    console.group(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`);
    console.log("Status:", response?.status);
    console.log("Mensaje:", response?.data?.message || response?.data?.error || "Error desconocido");
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default api;