import api from "../../../lib/axios";

const authServices = {

  // ============================================================
  // LOGIN
  // ============================================================
  async login(correo, contrasenia, recordarme = false) {
    const response = await api.post("/auth/login", { correo, contrasenia });
    const { token, usuario } = response.data;

    // Limpiar ambos storages antes de guardar
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    const storage = recordarme ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(usuario));

    return usuario;
  },

  // ============================================================
  // REGISTRO (Paso 1: enviar código)
  // ============================================================
  async sendRegisterCode(datos) {
    const response = await api.post("/auth/register", datos);
    return response.data;
  },

  // ============================================================
  // REGISTRO (Paso 2: verificar código y crear cuenta)
  // ============================================================
  async verifyRegisterCode(correo, codigo) {
    const response = await api.post("/auth/verify-register", { correo, codigo });
    return response.data;
  },

  // ============================================================
  // RECUPERACIÓN (Paso 1: enviar código)
  // ============================================================
  async sendForgotPasswordCode(correo) {
    const response = await api.post("/auth/forgot-password", { correo });
    return response.data;
  },

  // ============================================================
  // RECUPERACIÓN (Paso 2: resetear contraseña)
  // ============================================================
  async resetPassword(correo, codigo, nueva_contrasenia) {
    const response = await api.post("/auth/reset-password", {
      correo,
      codigo,
      nueva_contrasenia
    });
    return response.data;
  },

  // ============================================================
  // OBTENER PERFIL (rehidratar sesión)
  // ============================================================
  async getMe() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await api.get("/auth/me");
      const { usuario } = response.data;
      
      // Actualizar usuario en el mismo storage donde está el token
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(usuario));
      
      return usuario;
    } catch (error) {
      // Token inválido o expirado
      this.logout();
      return null;
    }
  },

  // ============================================================
  // LOGOUT
  // ============================================================
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },

  // ============================================================
  // UTILIDADES
  // ============================================================
  getUser() {
    try {
      const user = localStorage.getItem("user") || sessionStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  isAuthenticated() {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  },

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

  hasRole(usuario, rol) {
    if (!usuario?.rol) return false;
    return usuario.rol.toLowerCase() === rol.toLowerCase();
  }
};

export default authServices;