/**
 * Servicio de autenticación.
 * - Maneja login, registro, recuperación de contraseña.
 * - Almacena token y usuario en localStorage/sessionStorage según "recordarme".
 * - Proporciona funciones para verificar autenticación, rol y permisos granulares.
 * - Los permisos se normalizan a minúsculas y se permite el comodín "*" para acceso total.
 */

import api from "@lib/axios";

// Lista de todos los permisos que permiten acceso al panel administrativo
const ADMIN_PERMISOS = [
  "ver_dashboard",
  "ver_ventas",
  "ver_clientes",
  "ver_pedidos",
  "ver_compras",
  "ver_productos",
  "ver_citas",
  "ver_empleados",
  "ver_proveedores",
  "ver_usuarios",
  "gestionar_configuracion"
];

const authServices = {
  // ============================================================
  // LOGIN
  // ============================================================
  async login(correo, contrasenia, recordarme = false) {
    const response = await api.post("/auth/login", { correo, contrasenia });
    const { token, usuario } = response.data;
    console.log("🔐 Login: token recibido", token ? "SÍ" : "NO");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    const esAdminOEmpleado = usuario?.es_cliente === false;
    const storage = (!esAdminOEmpleado && recordarme) ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(usuario));

    console.log("🔐 Login: token guardado en", storage === localStorage ? "localStorage" : "sessionStorage");
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
  // REGISTRO (verificar código y crear cuenta)
  // ============================================================
  async verifyRegisterCode(correo, codigo) {
    const response = await api.post("/auth/verify-register", { correo, codigo });
    const { token, usuario } = response.data;
    
    if (token && usuario) {
      const storage = sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(usuario));
    }
    
    return response.data;
  },

  // ============================================================
  // RECUPERACIÓN (enviar código)
  // ============================================================
  async sendForgotPasswordCode(correo) {
    const response = await api.post("/auth/forgot-password", { correo });
    return response.data;
  },

  // ============================================================
  // RECUPERACIÓN (resetear contraseña)
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
      
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(usuario));
      
      return usuario;
    } catch (error) {
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

  isCliente() {
    const user = this.getUser();
    return user?.es_cliente === true;
  },

  isEmpleado() {
    const user = this.getUser();
    return user?.es_cliente === false && user?.rol !== null;
  },

  /**
   * Verifica si el usuario tiene un permiso granular.
   * Normaliza los nombres a minúsculas y soporta el comodín "*".
   * @param {Object} usuario - Objeto usuario con array 'permisos'
   * @param {string} permiso - Nombre del permiso (ej: "ver_usuarios")
   * @returns {boolean}
   */
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
  },

  /**
   * Verifica si el usuario tiene acceso al área administrativa.
   * @param {Object} usuario - Objeto usuario (con array 'permisos')
   * @returns {boolean}
   */
  hasAdminAccess(usuario) {
    if (!usuario || !usuario.permisos) return false;
    return ADMIN_PERMISOS.some(permiso => usuario.permisos.includes(permiso));
  }
};

export default authServices;