import api from "../../../../lib/axios";

export const ventasService = {

  // ── Backend → UI ─────────────────────────────────────────────────
  _toUI(v) {
    return {
      id: v.id,
      pedido_id: v.pedido_id,
      cliente_id: v.cliente_id,
      cliente_nombre: v.cliente_nombre || v.cliente?.nombre || "—",
      fecha_pedido: v.fecha_pedido ? new Date(v.fecha_pedido).toLocaleDateString("es-ES") : "—",
      fecha_venta: v.fecha_venta ? new Date(v.fecha_venta).toLocaleDateString("es-ES") : "—",
      total: v.total,
      metodo_pago: v.metodo_pago || "—",
      metodo_entrega: v.metodo_entrega || "—",
      direccion_entrega: v.direccion_entrega || "",
      transferencia_comprobante: v.transferencia_comprobante || "",
      estado: v.estado || "completada",
      detalles: v.detalles || [],
      abonos: v.abonos || [],
    };
  },

  // ── GET ───────────────────────────────────────────────────────────
  async getAllVentas() {
    try {
      const response = await api.get("/ventas");
      return response.data.map(v => this._toUI(v));
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      throw error;
    }
  },

  async getVentaById(id) {
    try {
      const response = await api.get(`/ventas/${id}`);
      return this._toUI(response.data);
    } catch (error) {
      console.error("Error al obtener venta:", error);
      throw error;
    }
  },

  // ── PUT (solo campos permitidos) ───────────────────────────────────
  async updateVenta(id, data) {
    try {
      const payload = {};
      if (data.estado !== undefined) payload.estado = data.estado;
      if (data.metodo_pago !== undefined) payload.metodo_pago = data.metodo_pago;
      if (data.metodo_entrega !== undefined) payload.metodo_entrega = data.metodo_entrega;
      if (data.direccion_entrega !== undefined) payload.direccion_entrega = data.direccion_entrega;
      if (data.transferencia_comprobante !== undefined) payload.transferencia_comprobante = data.transferencia_comprobante;
      if (data.total !== undefined) payload.total = data.total;

      const response = await api.put(`/ventas/${id}`, payload);
      return this._toUI(response.data.venta);
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      throw error;
    }
  },

  // ── DELETE ─────────────────────────────────────────────────────────
  async deleteVenta(id) {
    try {
      await api.delete(`/ventas/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar venta:", error);
      throw error;
    }
  },
};