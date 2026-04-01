import axios from "../axios";

export const PedidosData = {

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
      // Los abonos viven en Venta, no en Pedido.
      // Se calculan aparte con getAbonosByVenta si se necesitan.
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

    // Items → DetallePedido
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

  // ── CRUD PEDIDOS ──────────────────────────────────────────────────────────

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
      // Solo enviamos los campos que pueden editarse vía PUT /pedidos/:id
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
  // Flujo: al abonar sobre un pedido que aún no es "entregado",
  // primero se cambia el estado a "entregado" (el backend crea la Venta
  // automáticamente), luego se registra el abono sobre esa Venta.
  // Los estados desde los que se puede abonar: pendiente, confirmado,
  // en_preparacion, enviado. No se puede abonar en: entregado (ya
  // completado), cancelado.

  // Obtiene la Venta asociada a un pedido (si ya existe)
  async getVentaByPedido(pedidoId) {
    try {
      const response = await axios.get("/ventas");
      return response.data.find((v) => v.pedido_id === pedidoId) ?? null;
    } catch (error) {
      console.error("Error al obtener venta del pedido:", error);
      return null;
    }
  },

  // Obtiene los abonos de una venta
  async getAbonosByVenta(ventaId) {
    try {
      const response = await axios.get(`/ventas/${ventaId}/abonos`);
      return response.data ?? [];
    } catch (error) {
      console.error("Error al obtener abonos:", error);
      return [];
    }
  },

  // Registra un abono sobre un pedido.
  // El backend solo puede registrar abonos sobre Ventas, y las Ventas
  // solo se crean cuando el pedido pasa a "entregado".
  // Por eso: siempre creamos la Venta internamente (marcando entregado),
  // pero solo devolvemos pagoCompleto=true si el saldo llega a 0.
  // Si el saldo no es 0, la UI mantiene el botón activo para seguir abonando.
  // Devuelve { abono, ventaId, pagoCompleto }
  async registrarAbonoConFlujo(pedido, montoAbonado, totalAbonadoActual) {
    // 1. Buscar si ya existe una Venta para este pedido
    let venta = await this.getVentaByPedido(pedido.id);

    // 2. Si no hay Venta aún, necesitamos crearla marcando el pedido como entregado
    //    El backend crea la Venta automáticamente en ese momento.
    if (!venta) {
      // El backend solo acepta "entregado" desde: enviado, confirmado, en_preparacion
      // Si está en pendiente, subimos a confirmado primero
      if (pedido.estado === "pendiente") {
        await axios.put(`/pedidos/${pedido.id}`, { estado: "confirmado" });
      }
      await axios.put(`/pedidos/${pedido.id}`, { estado: "entregado" });

      venta = await this.getVentaByPedido(pedido.id);
      if (!venta) {
        throw new Error("El backend no generó la venta correctamente.");
      }
    }

    // 3. Registrar el abono sobre la Venta
    const response = await axios.post(`/ventas/${venta.id}/abonos`, {
      monto_abonado: montoAbonado,
    });
    const abono = response.data.abono ?? response.data;

    // 4. Calcular si el pago está completo
    const nuevoTotalAbonado = totalAbonadoActual + montoAbonado;
    const pagoCompleto = nuevoTotalAbonado >= pedido.total;

    return { abono, ventaId: venta.id, pagoCompleto };
  },

  // Calcula el total abonado sumando los abonos de la venta
  async calcularTotalAbonado(pedidoId) {
    const venta = await this.getVentaByPedido(pedidoId);
    if (!venta) return 0;
    const abonos = await this.getAbonosByVenta(venta.id);
    return abonos.reduce((sum, a) => sum + (a.monto_abonado ?? 0), 0);
  },

  // Carga toda la info de abonos para mostrar en el detalle
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

  // ── CLIENTES (para el select en el form) ─────────────────────────────────

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

  // ── PRODUCTOS (para el selector de ítems en el form) ─────────────────────

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

  // Textos de utilidad para la UI
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