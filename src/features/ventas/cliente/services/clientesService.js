import api from "../../../../lib/axios";

export const clientesService = {

  _mapTipoDocumento(tipo) {
    const map = { cedula: "CC", cedula_extranjeria: "CE", pasaporte: "PA" };
    return map[tipo] || "OTRO";
  },

  _mapTipoDocumentoBackend(tipo) {
    const map = { CC: "cedula", CE: "cedula_extranjeria", PA: "pasaporte" };
    return map[tipo] || "cedula";
  },

  // Backend → UI  (usa los campos exactos que devuelve to_dict())
  _toUI(c) {
    return {
      id:              c.id,
      nombre:          c.nombre           || "",
      apellido:        c.apellido         || "",
      tipoDocumento:   this._mapTipoDocumentoBackend(c.tipo_documento),
      documento:       c.numero_documento || "",
      telefono:        c.telefono         || "",
      correo:          c.correo           || "",
      fechaNacimiento: c.fecha_nacimiento || "",
      genero:          c.genero           || "",
      departamento:    c.departamento     || "",   // ← nuevo campo del modelo
      ciudad:          c.municipio        || "",
      direccion:       c.direccion        || "",
      estado:          c.estado           ? "activo" : "inactivo",
    };
  },

  // UI → Backend para crear (estado siempre true al crear)
  _toAPI(data) {
    return {
      nombre:              data.nombre,
      apellido:            data.apellido,
      tipo_documento:      this._mapTipoDocumento(data.tipoDocumento),
      numero_documento:    data.documento,
      fecha_nacimiento:    data.fechaNacimiento,
      genero:              data.genero,
      telefono:            data.telefono   || "",
      correo:              data.correo     || "",
      departamento:        data.departamento || "",
      municipio:           data.ciudad,
      direccion:           data.direccion  || "",
      ocupacion:           "",
      telefono_emergencia: "",
      estado:              true,
    };
  },

  // ── GET (rutas públicas — no requieren JWT) ───────────────────────
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

  // ── POST (ruta pública) ───────────────────────────────────────────
  async createCliente(data) {
    try {
      const response = await api.post("/clientes", this._toAPI(data));
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw error;
    }
  },

  // ── PUT (ruta pública — no requiere JWT) ──────────────────────────
  async updateCliente(id, data) {
    try {
      const payload = {
        nombre:           data.nombre,
        apellido:         data.apellido,
        tipo_documento:   this._mapTipoDocumento(data.tipoDocumento),
        numero_documento: data.documento,
        fecha_nacimiento: data.fechaNacimiento,
        genero:           data.genero,
        telefono:         data.telefono    || "",
        correo:           data.correo      || "",
        departamento:     data.departamento || "",
        municipio:        data.ciudad,
        direccion:        data.direccion   || "",
        estado:           data.estado === "activo",  // booleano al backend
      };
      const response = await api.put(`/clientes/${id}`, payload);
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  },

  // ── DELETE (ruta pública) ─────────────────────────────────────────
  async deleteCliente(id) {
    try {
      await api.delete(`/clientes/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw error;
    }
  },

  // ── Toggle estado rápido desde tabla (ruta pública) ──────────────
  async updateEstadoCliente(id, nuevoEstado) {
    try {
      const estadoBool = typeof nuevoEstado === "string"
        ? nuevoEstado === "activo"
        : Boolean(nuevoEstado);
      const response = await api.put(`/clientes/${id}`, { estado: estadoBool });
      return this._toUI(response.data.cliente || response.data);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  },

  // ── Historial de fórmulas (rutas admin — requieren JWT) ───────────
  // El axios interceptor ya inyecta el token desde localStorage/sessionStorage.
  // Si sigue fallando con 401, confirmar que el token esté en storage al momento
  // de abrir el modal (window.localStorage.getItem('token') en consola).
  async getHistorialByCliente(clienteId) {
    try {
      const response = await api.get(`/admin/clientes/${clienteId}/historial`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error al obtener historial:", error);
      throw error;
    }
  },

  async createHistorial(clienteId, campos) {
    try {
      const response = await api.post("/admin/historial-formula", {
        cliente_id:  clienteId,
        descripcion: campos.descripcion  || "",
        od_esfera:   campos.od_esfera    || null,
        od_cilindro: campos.od_cilindro  || null,
        od_eje:      campos.od_eje       || null,
        oi_esfera:   campos.oi_esfera    || null,
        oi_cilindro: campos.oi_cilindro  || null,
        oi_eje:      campos.oi_eje       || null,
      });
      return response.data.historial ?? response.data;
    } catch (error) {
      console.error("Error al crear historial:", error);
      throw error;
    }
  },

  async deleteHistorial(id) {
    try {
      await api.delete(`/admin/historial-formula/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar historial:", error);
      throw error;
    }
  },
};