import api from '@lib/axios';

export const pedidosService = {

  // ── Backend → UI ──────────────────────────────────────────────────────────
  _toUI(p) {
    try {
      const clienteNombre =
        p.cliente_nombre_completo ??
        p.cliente_nombre ??
        (p.cliente
          ? `${p.cliente.nombre ?? ""} ${p.cliente.apellido ?? ""}`.trim()
          : "");

      return {
        id:                        p.id,
        cliente:                   clienteNombre,
        cliente_id:                p.cliente_id,
        fechaPedido:               p.fecha ? p.fecha.split("T")[0] : "",
        estado:                    p.estado_nombre ?? p.estado ?? "pendiente",
        estado_id:                 p.estado_id,
        metodo_pago:               p.metodo_pago      ?? "",
        metodo_entrega:            p.metodo_entrega   ?? "",
        direccion_entrega:         p.direccion_entrega ?? "",
        transferencia_comprobante: p.transferencia_comprobante ?? "",
        total:                     p.total            ?? 0,
        costo_envio:               p.costo_envio      ?? 0,
        abono_acumulado:           p.abono_acumulado  ?? 0,
        saldo_pendiente:           p.saldo_pendiente  ?? (p.total ?? 0) - (p.abono_acumulado ?? 0),
        items: Array.isArray(p.items)
          ? p.items.map((item) => ({
              id:          item.id,
              producto_id: item.producto_id ?? null,
              servicio_id: item.servicio_id ?? null,
              nombre:      item.nombre ?? item.producto_nombre ?? item.servicio_nombre ?? "",
              descripcion: item.descripcion ?? "",
              precio:      item.precio_unitario ?? item.precio ?? 0,
              cantidad:    item.cantidad ?? 1,
              subtotal:    item.subtotal ?? 0,
              tipo:        item.tipo ?? (item.producto_id ? "producto" : "servicio"),
              stock:       (item.tipo === "producto" || item.producto_id) ? (item.stock ?? null) : null,
            }))
          : [],
      };
    } catch (err) {
      console.error("Error en _toUI:", p?.id, err);
      return {
        id: p?.id, cliente: "—", cliente_id: null, fechaPedido: "",
        estado: "pendiente", estado_id: null,
        metodo_pago: "", metodo_entrega: "",
        direccion_entrega: "", transferencia_comprobante: "",
        total: 0, costo_envio: 0, abono_acumulado: 0, saldo_pendiente: 0, items: [],
      };
    }
  },

  // ── UI/Form → Backend ─────────────────────────────────────────────────────
  _toAPI(data) {
    const payload = {
      cliente_id:     data.cliente_id,
      metodo_pago:    data.metodo_pago    ?? "efectivo",
      metodo_entrega: data.metodo_entrega ?? "tienda",
      ...(data.direccion_entrega         && { direccion_entrega:         data.direccion_entrega }),
      ...(data.transferencia_comprobante && { transferencia_comprobante: data.transferencia_comprobante }),
    };

    if (data.estado) payload.estado = data.estado;

    if (Array.isArray(data.items) && data.items.length > 0) {
      payload.items = data.items.map((item) => {
        const base = {
          cantidad:        item.cantidad,
          precio_unitario: item.precio ?? item.precio_unitario,
        };
        if (item.tipo === "servicio" || item.servicio_id) {
          return { ...base, servicio_id: item.servicio_id ?? item.id };
        }
        return { ...base, producto_id: item.producto_id ?? item.id };
      });
    }
    return payload;
  },

  // ── CRUD PEDIDOS ──────────────────────────────────────────────────────────

  /**
   * Obtiene pedidos paginados desde el backend.
   * @param {object} params - { page, perPage, search, estado }
   * @returns {{ data: array, pagination: object }}
   */
  async getAllPedidos({ page = 1, perPage = 10, search = "", estado = "" } = {}) {
    const params = { page, per_page: perPage };
    if (search) params.search = search;

    // Convertir nombre del estado a ID (back-end espera estado_id)
    if (estado) {
      const estadoMap = {
        pendiente: 1,
        pagado:    2,
        anulado:   3,
      };
      const estadoId = estadoMap[estado.toLowerCase()];
      if (estadoId) {
        params.estado_id = estadoId;
      }
    }

    const response = await axios.get("/pedidos", { params });
    const raw = response.data;

    // Retrocompatibilidad: si el back aún devuelve array plano
    if (Array.isArray(raw)) {
      return {
        data:       raw.map((p) => this._toUI(p)),
        pagination: { current_page: 1, total_pages: 1, total: raw.length, has_next: false, has_prev: false },
      };
    }

    // Respuesta paginada: { data: [...], pagination: {...} }
    return {
      data:       (raw.data ?? []).map((p) => this._toUI(p)),
      pagination: raw.pagination ?? {
        current_page: 1, total_pages: 1, total: 0, has_next: false, has_prev: false,
      },
    };
  },

  async getPedidoById(id) {
    const response = await axios.get(`/pedidos/${id}`);
    return this._toUI(response.data);
  },

  async createPedido(data) {
    const response = await axios.post("/pedidos", this._toAPI(data));
    return this._toUI(response.data.pedido ?? response.data);
  },

  async updatePedido(id, data) {
    const payload = {};
    if (data.estado                    !== undefined) payload.estado                    = data.estado;
    if (data.metodo_pago               !== undefined) payload.metodo_pago               = data.metodo_pago;
    if (data.metodo_entrega            !== undefined) payload.metodo_entrega            = data.metodo_entrega;
    if (data.direccion_entrega         !== undefined) payload.direccion_entrega         = data.direccion_entrega;
    if (data.transferencia_comprobante !== undefined) payload.transferencia_comprobante = data.transferencia_comprobante;

    const response = await axios.put(`/pedidos/${id}`, payload);
    return this._toUI(response.data.pedido ?? response.data);
  },

  async deletePedido(id) {
    await axios.delete(`/pedidos/${id}`);
    return true;
  },

  // ── ABONOS ────────────────────────────────────────────────────────────────

  async getAbonosByPedido(pedidoId) {
    try {
      const response = await axios.get(`/pedidos/${pedidoId}/abonos`);
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  async registrarAbono(pedidoId, montoAbonado) {
    const response = await axios.post(`/pedidos/${pedidoId}/abonos`, {
      monto_abonado: montoAbonado,
    });
    return {
      abonoAcumulado: response.data.abono_acumulado ?? 0,
      saldoPendiente: response.data.saldo_pendiente ?? 0,
    };
  },

  async getInfoAbonos(pedidoId, totalPedido) {
    try {
      const abonos = await this.getAbonosByPedido(pedidoId);
      const normalizado = abonos.map((a) => ({
        ...a,
        monto_abonado: a.monto ?? a.monto_abonado ?? 0,
      }));
      const totalAbonado = normalizado.reduce((sum, a) => sum + a.monto_abonado, 0);
      return {
        totalAbonado,
        saldoPendiente: Math.max(0, totalPedido - totalAbonado),
        abonos: normalizado,
      };
    } catch {
      return { totalAbonado: 0, saldoPendiente: totalPedido, abonos: [] };
    }
  },

  // ── CATÁLOGOS ─────────────────────────────────────────────────────────────

  async getClientesActivos() {
    const response = await axios.get("/admin/clientes");
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data?.data ?? []);
    return data
      .filter((c) => c.estado !== false)
      .map((c) => ({
        id:     c.id,
        nombre: `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim(),
      }));
  },

  async getProductosActivos() {
    const response = await axios.get("/productos");
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data?.data ?? []);
    return data
      .filter((p) => p.estado !== false && (p.stock ?? 0) > 0)
      .map((p) => ({
        id:          p.id,
        nombre:      p.nombre,
        descripcion: p.descripcion ?? "",
        precio:      p.precio_venta,
        stock:       p.stock ?? 0,
        tipo:        "producto",
      }));
  },

  async getServiciosActivos() {
    const response = await axios.get("/servicios");
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data?.data ?? []);
    return data
      .filter((s) => s.estado !== false)
      .map((s) => ({
        id:          s.id,
        nombre:      s.nombre,
        descripcion: s.descripcion ?? "",
        precio:      s.precio,
        stock:       null,
        tipo:        "servicio",
      }));
  },

  // ── DETALLE PEDIDO ────────────────────────────────────────────────────────

  async createDetallePedido(data) {
    const response = await axios.post("/detalle-pedido", data);
    return response.data;
  },

  async updateDetallePedido(id, data) {
    const response = await axios.put(`/detalle-pedido/${id}`, data);
    return response.data;
  },

  async deleteDetallePedido(id) {
    await axios.delete(`/detalle-pedido/${id}`);
    return true;
  },

  getEstadoLabel(estado) {
    const labels = { pendiente: "Pendiente", pagado: "Pagado", anulado: "Anulado" };
    return labels[estado] ?? estado;
  },
};