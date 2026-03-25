import api from "../axios";

// ============================================================
//  HELPERS — mapeo entre snake_case (API) y camelCase (UI)
// ============================================================

/**
 * Convierte una compra que viene del backend al formato que usa la UI.
 * El backend devuelve: { id, proveedor_id, proveedor_nombre, fecha,
 *   subtotal, iva, total, estado_compra, observaciones, productos: [...] }
 */
function _toUI(compra) {
  return {
    id:               compra.id,
    numeroCompra:     compra.numero_compra || `C-${String(compra.id).padStart(3, "0")}`,
    proveedorId:      compra.proveedor_id,
    proveedorNombre:  compra.proveedor_nombre || "",
    fecha:            compra.fecha ? compra.fecha.split("T")[0] : "",
    subtotal:         Number(compra.subtotal  || 0),
    iva:              Number(compra.iva       || 0),
    total:            Number(compra.total     || 0),
    // estado_compra: true = Completada, false = Anulada
    estado:           compra.estado_compra === false ? "Anulada" : "Completada",
    observaciones:    compra.observaciones || "",
    // productos viene del endpoint de detalle-compra
    productos: (compra.productos || []).map(_detalleToUI),
  };
}

/**
 * Convierte un detalle de compra (producto) del backend al formato UI.
 * Backend: { id, compra_id, producto_id, nombre, cantidad, precio_unidad, subtotal }
 */
function _detalleToUI(detalle) {
  return {
    id:             detalle.id,
    productoId:     detalle.producto_id,
    nombre:         detalle.nombre || detalle.producto_nombre || "",
    cantidad:       Number(detalle.cantidad       || 0),
    precioUnitario: Number(detalle.precio_unidad  || 0),
    total:          Number(detalle.subtotal        || 0),
  };
}

// ============================================================
//  COMPRAS — CRUD
// ============================================================

/** GET /compras → lista de compras */
export async function getAllCompras() {
  const res = await api.get("/compras");
  return res.data.map(_toUI);
}

/** GET /compras/:id → una compra con sus detalles */
export async function getCompraById(id) {
  const res = await api.get(`/compras/${id}`);
  return _toUI(res.data);
}

/**
 * POST /compras + POST /detalle-compra (uno por producto)
 * payload UI esperado:
 *   { proveedorId, proveedorNombre, fecha, subtotal, iva, total,
 *     estado, observaciones, productos: [{ productoId, cantidad, precioUnitario, total }] }
 */
export async function createCompra(data) {
  // 1. Crear la compra principal
  const compraPayload = {
    proveedor_id:   data.proveedorId,
    total:          data.total,
    subtotal:       data.subtotal,
    iva:            data.iva,
    fecha:          data.fecha,
    observaciones:  data.observaciones || "",
    estado_compra:  data.estado !== "Anulada", // true = Completada
  };

  const compraRes = await api.post("/compras", compraPayload);
  const nuevaCompra = compraRes.data.compra || compraRes.data;

  // 2. Crear cada detalle (producto)
  const detallesPromises = (data.productos || []).map((p) =>
    api.post("/detalle-compra", {
      compra_id:    nuevaCompra.id,
      producto_id:  p.productoId,
      cantidad:     p.cantidad,
      precio_unidad: p.precioUnitario,
    })
  );
  await Promise.all(detallesPromises);

  return _toUI(nuevaCompra);
}

/**
 * PUT /compras/:id  (campos de cabecera)
 * También elimina los detalles viejos y recrea los nuevos
 * si el payload trae productos[].
 */
export async function updateCompra(id, data) {
  const compraPayload = {
    proveedor_id:  data.proveedorId,
    total:         data.total,
    subtotal:      data.subtotal,
    iva:           data.iva,
    fecha:         data.fecha,
    observaciones: data.observaciones || "",
    estado_compra: data.estado !== "Anulada",
  };

  const res = await api.put(`/compras/${id}`, compraPayload);

  // Si vienen productos nuevos, borramos los detalles actuales y los recreamos
  if (data.productos && data.productos.length > 0) {
    // Obtener detalles actuales para borrarlos
    const detallesRes = await api.get("/detalle-compra");
    const detallesActuales = detallesRes.data.filter((d) => d.compra_id === id);

    await Promise.all(
      detallesActuales.map((d) => api.delete(`/detalle-compra/${d.id}`))
    );

    // Crear los nuevos
    await Promise.all(
      data.productos.map((p) =>
        api.post("/detalle-compra", {
          compra_id:     id,
          producto_id:   p.productoId,
          cantidad:      p.cantidad,
          precio_unidad: p.precioUnitario,
        })
      )
    );
  }

  return _toUI(res.data.compra || res.data);
}

/** DELETE /compras/:id */
export async function deleteCompra(id) {
  await api.delete(`/compras/${id}`);
}

/**
 * Cambiar estado: Completada ↔ Anulada
 * PUT /compras/:id  con { estado_compra: boolean }
 */
export async function updateEstadoCompra(id, estadoActual) {
  const nuevoEstado = estadoActual === "Completada" ? false : true;
  const res = await api.put(`/compras/${id}`, { estado_compra: nuevoEstado });
  return _toUI(res.data.compra || res.data);
}