import axios from "../../../../lib/axios";

export const pedidosService = {

  // ── Backend → UI ──────────────────────────────────────────────────────────
  // El backend devuelve estado_nombre (string) en vez de estado (string)
  // También devuelve abono_acumulado y saldo_pendiente
  _toUI(p) {
    try {
      const clienteNombre = p.cliente_nombre
        ?? (p.cliente ? `${p.cliente.nombre} ${p.cliente.apellido ?? ""}`.trim() : "");

      return {
        id:                        p.id,
        cliente:                   clienteNombre,
        cliente_id:                p.cliente_id,
        fechaPedido:               p.fecha ? p.fecha.split("T")[0] : "",
        // El backend devuelve estado_nombre, lo mapeamos a estado para la UI
        estado:                    p.estado_nombre ?? p.estado ?? "pendiente",
        estado_id:                 p.estado_id,
        metodo_pago:               p.metodo_pago ?? "",
        metodo_entrega:            p.metodo_entrega ?? "",
        direccion_entrega:         p.direccion_entrega ?? "",
        transferencia_comprobante: p.transferencia_comprobante ?? "",
        total:                     p.total ?? 0,
        abono_acumulado:           p.abono_acumulado ?? 0,
        saldo_pendiente:           p.saldo_pendiente ?? p.total ?? 0,
        items: Array.isArray(p.items)
          ? p.items.map((item) => ({
              id:          item.id,
              producto_id: item.producto_id,
              nombre:      item.producto_nombre ?? item.nombre ?? "",
              descripcion: item.descripcion ?? "",
              precio:      item.precio_unitario ?? item.precio ?? 0,
              cantidad:    item.cantidad ?? 1,
              subtotal:    item.subtotal ?? 0,
              tipo:        "producto",
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
        total: 0, abono_acumulado: 0, saldo_pendiente: 0, items: [],
      };
    }
  },

  // ── UI/Form → Backend ─────────────────────────────────────────────────────
  _toAPI(data) {
    const payload = {
      cliente_id:     data.cliente_id,
      metodo_pago:    data.metodo_pago    ?? "efectivo",
      metodo_entrega: data.metodo_entrega ?? "tienda",
      ...(data.direccion_entrega         && { direccion_entrega: data.direccion_entrega }),
      ...(data.transferencia_comprobante && { transferencia_comprobante: data.transferencia_comprobante }),
    };
    // El backend acepta estado como string y lo convierte a estado_id internamente
    if (data.estado) payload.estado = data.estado;

    if (Array.isArray(data.items) && data.items.length > 0) {
      payload.items = data.items.map((item) => ({
        producto_id:     item.producto_id ?? item.id,
        cantidad:        item.cantidad,
        precio_unitario: item.precio ?? item.precio_unitario,
      }));
    }
    return payload;
  },

  // ── CRUD PEDIDOS ──────────────────────────────────────────────────────────

  async getAllPedidos() {
    const response = await axios.get("/pedidos");
    if (!Array.isArray(response.data)) {
      console.error("getAllPedidos: respuesta inesperada:", response.data);
      return [];
    }
    return response.data.map((p) => this._toUI(p));
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
    // El backend acepta: estado (string), metodo_pago, metodo_entrega,
    // direccion_entrega, transferencia_comprobante
    // NO acepta: total
    const payload = {};
    if (data.estado            !== undefined) payload.estado            = data.estado;
    if (data.metodo_pago       !== undefined) payload.metodo_pago       = data.metodo_pago;
    if (data.metodo_entrega    !== undefined) payload.metodo_entrega    = data.metodo_entrega;
    if (data.direccion_entrega !== undefined) payload.direccion_entrega = data.direccion_entrega;
    if (data.transferencia_comprobante !== undefined)
      payload.transferencia_comprobante = data.transferencia_comprobante;

    const response = await axios.put(`/pedidos/${id}`, payload);
    return this._toUI(response.data.pedido ?? response.data);
  },

  async deletePedido(id) {
    await axios.delete(`/pedidos/${id}`);
    return true;
  },

  // ── ABONOS ────────────────────────────────────────────────────────────────
  // Flujo:
  // 1. POST /pedidos/:id/abonos  →  registra abono parcial, actualiza abono_acumulado
  // 2. Cuando saldo_pendiente == 0 → PUT /pedidos/:id con estado=entregado
  //    → el backend crea la Venta automáticamente y migra los abonos
  // El botón "Abonar" solo aparece en: pendiente, confirmado, en_preparacion, enviado

  async getAbonosByPedido(pedidoId) {
    try {
      const response = await axios.get(`/pedidos/${pedidoId}/abonos`);
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  // Registra un abono. El backend responde:
  // { message, abono_acumulado, saldo_pendiente }
  // Si saldo_pendiente == 0, el frontend luego llama updatePedido con estado=entregado
  async registrarAbono(pedidoId, montoAbonado) {
    const response = await axios.post(`/pedidos/${pedidoId}/abonos`, {
      monto_abonado: montoAbonado,
    });
    return {
      abonoAcumulado: response.data.abono_acumulado ?? 0,
      saldoPendiente: response.data.saldo_pendiente ?? 0,
    };
  },

  // Carga resumen de abonos para el modal y la vista detalle
  // Abono.to_dict() devuelve: { id, monto, fecha, observacion, pedido_id, venta_id }
  async getInfoAbonos(pedidoId, totalPedido) {
    try {
      const abonos = await this.getAbonosByPedido(pedidoId);
      // Normalizar campo: el modelo usa "monto", la UI espera "monto_abonado"
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
    const response = await axios.get("/clientes");
    const data = Array.isArray(response.data) ? response.data : [];
    return data
      .filter((c) => c.estado !== false)
      .map((c) => ({ id: c.id, nombre: `${c.nombre} ${c.apellido ?? ""}`.trim() }));
  },

  async getProductosActivos() {
    const response = await axios.get("/productos");
    const data = Array.isArray(response.data) ? response.data : [];
    return data
      .filter((p) => p.estado !== false)
      .map((p) => ({
        id:          p.id,
        nombre:      p.nombre,
        descripcion: p.descripcion ?? "",
        precio:      p.precio_venta,
        stock:       p.stock ?? 0,
        tipo:        "producto",
      }));
  },

  // ── DETALLE PEDIDO (para edición de items) ───────────────────────────────

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
    const labels = {
      pendiente:      "Pendiente",
      confirmado:     "Confirmado",
      en_preparacion: "En preparación",
      enviado:        "Enviado",
      entregado:      "Entregado",
      cancelado:      "Cancelado",
    };
    return labels[estado] ?? estado;
  },
};