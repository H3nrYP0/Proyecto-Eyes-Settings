import api from "../../../../lib/axios";

export const clientesService = {

  // ── Mapeo de tipos de documento ─────────────────────────────────
  _mapTipoDocumento(tipo) {
    const map = {
      cedula: "CC",
      cedula_extranjeria: "CE",
      pasaporte: "PA",
    };
    return map[tipo] || "OTRO";
  },

  _mapTipoDocumentoBackend(tipo) {
    const map = {
      CC: "cedula",
      CE: "cedula_extranjeria",
      PA: "pasaporte",
    };
    return map[tipo] || "cedula";
  },

  // ── Backend → UI ─────────────────────────────────────────────────
  _toUI(c) {
    return {
      id: c.id,
      nombre: c.nombre || "",
      apellido: c.apellido || "",
      tipoDocumento: this._mapTipoDocumentoBackend(c.tipo_documento) || "cedula",
      documento: c.numero_documento || "",
      telefono: c.telefono || "",
      correo: c.correo || "",
      fechaNacimiento: c.fecha_nacimiento || "",
      genero: c.genero || "",
      ciudad: c.municipio || "",
      direccion: c.direccion || "",
      estado: c.estado ? "activo" : "inactivo",
    };
  },

  // ── UI → Backend ─────────────────────────────────────────────────
  _toAPI(data) {
    return {
      nombre: data.nombre,
      apellido: data.apellido,
      tipo_documento: this._mapTipoDocumento(data.tipoDocumento),
      numero_documento: data.documento,
      fecha_nacimiento: data.fechaNacimiento,
      genero: data.genero,
      telefono: data.telefono || "",
      correo: data.correo || "",
      municipio: data.ciudad,
      direccion: data.direccion || "",
      ocupacion: "",
      telefono_emergencia: "",
      estado: true,
    };
  },

  // ── GET ─────────────────────────────────────────────────────────
  async getAllClientes() {
    try {
      const response = await api.get("/clientes");
      return response.data.map(c => this._toUI(c));
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  },

  async getClienteById(id) {
    try {
      const response = await api.get(`/clientes/${id}`);
      return this._toUI(response.data);
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      throw error;
    }
  },

  // ── POST ─────────────────────────────────────────────────────────
  async createCliente(data) {
    try {
      const response = await api.post("/clientes", this._toAPI(data));
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw error;
    }
  },

  // ── PUT ─────────────────────────────────────────────────────────
  async updateCliente(id, data) {
    try {
      const payload = {
        nombre: data.nombre,
        apellido: data.apellido,
        tipo_documento: this._mapTipoDocumento(data.tipoDocumento),
        numero_documento: data.documento,
        fecha_nacimiento: data.fechaNacimiento,
        genero: data.genero,
        telefono: data.telefono || "",
        correo: data.correo || "",
        municipio: data.ciudad,
        direccion: data.direccion || "",
      };
      const response = await api.put(`/clientes/${id}`, payload);
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  },

  // ── DELETE ───────────────────────────────────────────────────────
  async deleteCliente(id) {
    try {
      await api.delete(`/clientes/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw error;
    }
  },

  // ── Estado ───────────────────────────────────────────────────────
  async updateEstadoCliente(id, nuevoEstado) {
    try {
      const estadoBool = typeof nuevoEstado === "string" ? nuevoEstado === "activo" : nuevoEstado;
      const response = await api.put(`/clientes/${id}`, { estado: estadoBool });
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  },
};