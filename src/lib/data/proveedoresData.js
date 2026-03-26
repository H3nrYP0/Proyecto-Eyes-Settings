import axios from "../axios";

export const ProveedoresData = {

  // ── Backend → UI ─────────────────────────────────────────────────────────
  _toUI(p) {
    return {
      id:            p.id,
      tipoProveedor: p.tipo_proveedor        ?? "Persona Jurídica",
      tipoDocumento: p.tipo_documento         ?? "NIT",
      documento:     p.documento              ?? "",
      razonSocial:   p.razon_social_o_nombre  ?? "",
      contactoNombre: p.contacto              ?? "",
      telefono:      p.telefono               ?? "",
      correo:        p.correo                 ?? "",
      departamento:  p.departamento           ?? "",
      municipio:     p.municipio              ?? "",
      direccion:     p.direccion              ?? "",
      // Estado booleano del backend → string para CrudTable y el form
      estado:        p.estado ? "Activo" : "Inactivo",
      // Booleano puro para el toggle (igual que estadoBool en versión anterior)
      estadoBool:    !!p.estado,
      // Alias búsqueda
      nit:           p.documento ?? "",
    };
  },

  // ── Form/UI → Backend ────────────────────────────────────────────────────
  _toAPI(data) {
    return {
      tipo_proveedor:        data.tipoProveedor   ?? "Persona Jurídica",
      tipo_documento:        data.tipoDocumento    ?? "NIT",
      documento:             data.documento        ?? "",
      razon_social_o_nombre: data.razonSocial      ?? "",
      contacto:              data.contactoNombre   ?? "",
      telefono:              data.telefono         ?? "",
      correo:                data.correo           ?? "",
      departamento:          data.departamento     ?? "",
      municipio:             data.municipio        ?? "",
      direccion:             data.direccion        ?? "",
      // El form envía estado como booleano (lo convierte handleSubmit)
      ...(data.estado !== undefined && { estado: data.estado }),
    };
  },

  // ── CRUD ──────────────────────────────────────────────────────────────────

  async getAllProveedores() {
    try {
      const response = await axios.get("/proveedores");
      return response.data.map((p) => this._toUI(p));
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      throw error;
    }
  },

  async getProveedorById(id) {
    try {
      const response = await axios.get(`/proveedores/${id}`);
      return this._toUI(response.data);
    } catch (error) {
      console.error("Error al obtener proveedor:", error);
      throw error;
    }
  },

  async createProveedor(data) {
    try {
      const response = await axios.post("/proveedores", {
        ...this._toAPI(data),
        estado: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      throw error;
    }
  },

  async updateProveedor(id, data) {
    try {
      const response = await axios.put(`/proveedores/${id}`, this._toAPI(data));
      return this._toUI(response.data.proveedor ?? response.data);
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      throw error;
    }
  },

  async deleteProveedor(id) {
    try {
      await axios.delete(`/proveedores/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      throw error;
    }
  },

  // Toggle usa estadoBool (booleano puro) para invertir correctamente
  async toggleEstadoProveedor(id, estadoBool) {
    try {
      const response = await axios.put(`/proveedores/${id}`, {
        estado: !estadoBool,
      });
      return this._toUI(response.data.proveedor ?? response.data);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  },

  // Para ComprasForm u otros módulos que necesiten solo activos
  async getProveedoresActivos() {
    try {
      const todos = await this.getAllProveedores();
      return todos.filter((p) => p.estadoBool === true);
    } catch (error) {
      console.error("Error al obtener proveedores activos:", error);
      throw error;
    }
  },

  getEstadoTexto(estado) { return estado ? "Activo" : "Inactivo"; },
  getEstadoBadge(estado) { return estado ? "success" : "error"; },
  getEstadoColor(estado)  { return estado ? "success" : "error"; },
};