import axios from "../../../../lib/axios";

export const pedidosService = {

  // ── Backend → UI (Pedido) ─────────────────────────────────────────────────
  _toUI(p) {
    const clienteNombre = p.cliente_nombre
      ?? (p.cliente ? `${p.cliente.nombre} ${p.cliente.apellido ?? ""}`.trim() : "");

    return {
      id:                      p.id,
      cliente:                 clienteNombre,
      cliente_id:              p.cliente_id,
      fechaPedido:             p.fecha ? p.fecha.split("T")[0] : "",
      fechaEntrega:            p.fecha_entrega ? p.fecha_entrega.split("T")[0] : "",
      estado:                  p.estado ?? "pendiente",
      metodo_pago:             p.metodo_pago ?? "",
      metodo_entrega:          p.metodo_entrega ?? "",
      direccion_entrega:       p.direccion_entrega ?? "",
      transferencia_comprobante: p.transferencia_comprobante ?? "",
      total:                   p.total ?? 0,
      items: Array.isArray(p.items)
        ? p.items.map((item) => ({
            id:             item.id,
            producto_id:    item.producto_id,
            nombre:         item.producto_nombre ?? item.nombre ?? "",
            descripcion:    item.descripcion ?? "",
            precio:         item.precio_unitario ?? item.precio ?? 0,
            cantidad:       item.cantidad ?? 1,
            subtotal:       item.subtotal ?? 0,
            tipo:           "producto",
          }))
        : [],
    };
  },

  // ── UI/Form → Backend (Pedido) ────────────────────────────────────────────
  _toAPI(data) {
    const payload = {
      cliente_id:     data.cliente_id,
      metodo_pago:    data.metodo_pago    ?? "efectivo",
      metodo_entrega: data.metodo_entrega ?? "tienda",
      ...(data.direccion_entrega  && { direccion_entrega: data.direccion_entrega }),
      ...(data.transferencia_comprobante && { transferencia_comprobante: data.transferencia_comprobante }),
      ...(data.estado             && { estado: data.estado }),
    };

    if (Array.isArray(data.items) && data.items.length > 0) {
      payload.items = data.items.map((item) => ({
        producto_id:    item.producto_id ?? item.id,
        cantidad:       item.cantidad,
        precio_unitario: item.precio ?? item.precio_unitario,
      }));
    } else if (data.total !== undefined) {
      payload.total = data.total;
    }

    return payload;
  },

  async getAllPedidos() {
    try {
      const response = await axios.get("/pedidos");
      return response.data.map((p) => this._toUI(p));
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      throw error;
    }
  },

  async getPedidoById(id) {
    try {
      const response = await axios.get(`/pedidos/${id}`);
      return this._toUI(response.data);
    } catch (error) {
      console.error("Error al obtener pedido:", error);
      throw error;
    }
  },

  async getPedidosByCliente(clienteId) {
    try {
      const response = await axios.get(`/pedidos/cliente/${clienteId}`);
      return response.data.map((p) => this._toUI(p));
    } catch (error) {
      console.error("Error al obtener pedidos del cliente:", error);
      throw error;
    }
  },

  async createPedido(data) {
    try {
      const response = await axios.post("/pedidos", this._toAPI(data));
      return this._toUI(response.data.pedido ?? response.data);
    } catch (error) {
      console.error("Error al crear pedido:", error);
      throw error;
    }
  },

  async updatePedido(id, data) {
    try {
      const payload = {};
      if (data.estado           !== undefined) payload.estado           = data.estado;
      if (data.metodo_pago      !== undefined) payload.metodo_pago      = data.metodo_pago;
      if (data.metodo_entrega   !== undefined) payload.metodo_entrega   = data.metodo_entrega;
      if (data.direccion_entrega !== undefined) payload.direccion_entrega = data.direccion_entrega;
      if (data.transferencia_comprobante !== undefined)
        payload.transferencia_comprobante = data.transferencia_comprobante;
      if (data.total            !== undefined) payload.total            = data.total;

      const response = await axios.put(`/pedidos/${id}`, payload);
      return this._toUI(response.data.pedido ?? response.data);
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      throw error;
    }
  },

  async deletePedido(id) {
    try {
      await axios.delete(`/pedidos/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      throw error;
    }
  },

  // ── ABONOS ───────────────────────────────────────────────────────────────
  async getVentaByPedido(pedidoId) {
    try {
      const response = await axios.get("/ventas");
      return response.data.find((v) => v.pedido_id === pedidoId) ?? null;
    } catch (error) {
      console.error("Error al obtener venta del pedido:", error);
      return null;
    }
  },

  async getAbonosByVenta(ventaId) {
    try {
      const response = await axios.get(`/ventas/${ventaId}/abonos`);
      return response.data ?? [];
    } catch (error) {
      console.error("Error al obtener abonos:", error);
      return [];
    }
  },

  async registrarAbonoConFlujo(pedido, montoAbonado, totalAbonadoActual) {
    let venta = await this.getVentaByPedido(pedido.id);

    if (!venta) {
      if (pedido.estado === "pendiente") {
        await axios.put(`/pedidos/${pedido.id}`, { estado: "confirmado" });
      }
      await axios.put(`/pedidos/${pedido.id}`, { estado: "entregado" });
      venta = await this.getVentaByPedido(pedido.id);
      if (!venta) throw new Error("El backend no generó la venta correctamente.");
    }

    const response = await axios.post(`/ventas/${venta.id}/abonos`, {
      monto_abonado: montoAbonado,
    });
    const abono = response.data.abono ?? response.data;
    const nuevoTotalAbonado = totalAbonadoActual + montoAbonado;
    const pagoCompleto = nuevoTotalAbonado >= pedido.total;

    return { abono, ventaId: venta.id, pagoCompleto };
  },

  async calcularTotalAbonado(pedidoId) {
    const venta = await this.getVentaByPedido(pedidoId);
    if (!venta) return 0;
    const abonos = await this.getAbonosByVenta(venta.id);
    return abonos.reduce((sum, a) => sum + (a.monto_abonado ?? 0), 0);
  },

  async getInfoAbonos(pedidoId, totalPedido) {
    const venta = await this.getVentaByPedido(pedidoId);
    if (!venta) return { totalAbonado: 0, saldoPendiente: totalPedido, abonos: [], ventaId: null };
    const abonos = await this.getAbonosByVenta(venta.id);
    const totalAbonado = abonos.reduce((sum, a) => sum + (a.monto_abonado ?? 0), 0);
    return {
      totalAbonado,
      saldoPendiente: Math.max(0, totalPedido - totalAbonado),
      abonos,
      ventaId: venta.id,
    };
  },

  // ── CLIENTES Y PRODUCTOS ─────────────────────────────────────────────────
  async getClientesActivos() {
    try {
      const response = await axios.get("/clientes");
      return response.data
        .filter((c) => c.estado !== false)
        .map((c) => ({
          id:     c.id,
          nombre: `${c.nombre} ${c.apellido ?? ""}`.trim(),
        }));
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  },

  async getProductosActivos() {
    try {
      const response = await axios.get("/productos");
      return response.data
        .filter((p) => p.estado !== false)
        .map((p) => ({
          id:          p.id,
          nombre:      p.nombre,
          descripcion: p.descripcion ?? "",
          precio:      p.precio_venta,
          stock:       p.stock ?? 0,
          tipo:        "producto",
        }));
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  getEstadoLabel(estado) {
    const labels = {
      pendiente:       "Pendiente",
      confirmado:      "Confirmado",
      en_preparacion:  "En preparación",
      enviado:         "Enviado",
      entregado:       "Entregado",
      cancelado:       "Cancelado",
    };
    return labels[estado] ?? estado;
  },

  getEstadoBadge(estado) {
    const badges = {
      pendiente:      "warning",
      confirmado:     "info",
      en_preparacion: "info",
      enviado:        "info",
      entregado:      "success",
      cancelado:      "error",
    };
    return badges[estado] ?? "default";
  },
};