import api from "../../../../lib/axios";

export const ventasService = {

  _toUI(v) {
    // Si tiene cita_id y no tiene pedido_id → venta generada desde una cita
    const esCita = !!v.cita_id && !v.pedido_id;

    const detalles = Array.isArray(v.detalles)
      ? v.detalles.map((d) => ({
          ...d,
          // Ventas de cita usan servicio_nombre; ventas de pedido usan producto_nombre
          nombre_display: d.producto_nombre || d.nombre || d.servicio_nombre || "—",
        }))
      : [];

    return {
      id:                        v.id,
      cita_id:                   v.cita_id ?? null,
      pedido_id:                 v.pedido_id ?? null,
      esCita,
      cliente_id:                v.cliente_id,
      cliente_nombre:            v.cliente_nombre ?? "—",
      fecha_venta:               v.fecha_venta
        ? new Date(v.fecha_venta).toLocaleDateString("es-CO")
        : "—",
      total:                     v.total ?? 0,
      metodo_pago:               v.metodo_pago ?? null,
      metodo_entrega:            v.metodo_entrega ?? null,
      direccion_entrega:         v.direccion_entrega ?? "",
      transferencia_comprobante: v.transferencia_comprobante ?? "",
      estado:                    v.estado_nombre ?? v.estado ?? "completada",
      saldo_pendiente:           v.saldo_pendiente ?? 0,
      detalles,
      abonos: Array.isArray(v.abonos)
        ? v.abonos.map((a) => ({ ...a, monto_abonado: a.monto ?? a.monto_abonado ?? 0 }))
        : [],
    };
  },

  async getAllVentas() {
    const response = await api.get("/ventas");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((v) => this._toUI(v));
  },

  async getVentaById(id) {
    const response = await api.get(`/ventas/${id}`);
    return this._toUI(response.data);
  },

  async updateVenta(id, payload) {
    const response = await api.put(`/ventas/${id}`, payload);
    return this._toUI(response.data?.venta ?? response.data);
  },
};