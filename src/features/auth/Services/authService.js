import api from "../../../lib/axios";

const authService = {

  // ── Login ──
  async login(correo, contrasenia) {
    const response = await api.post("/auth/login", { correo, contrasenia });
    const { token, usuario } = response.data;

    // Guardar token y usuario en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario));

    return usuario;
  },

  // ── Logout ──
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // ── Obtener usuario guardado ──
  getUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // ── Obtener token ──
  getToken() {
    return localStorage.getItem("token");
  },

  // ── Verificar si está autenticado ──
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  // ── Verificar si tiene un permiso específico ──
  hasPermission(usuario, permiso) {
    if (!usuario?.permisos || !Array.isArray(usuario.permisos)) {
      return false;
    }

    const permisosNormalizados = usuario.permisos.map(p => {
      if (typeof p === "string") return p.toLowerCase();
      if (typeof p === "object" && p !== null) return p.nombre?.toLowerCase();
      return "";
    });

    return (
      permisosNormalizados.includes(permiso.toLowerCase()) ||
      permisosNormalizados.includes("*")
    );
  },

  // ── Verificar si tiene un rol específico ──
  hasRole(usuario, rol) {
    if (!usuario?.rol) return false;
    return usuario.rol.toLowerCase() === rol.toLowerCase();
  }
};

export default authService;