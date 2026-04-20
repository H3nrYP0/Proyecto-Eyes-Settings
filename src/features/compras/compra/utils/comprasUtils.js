// ============================
// Formatear moneda (COP)
// ============================
export const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toLocaleString("es-CO")}`;
};

// ============================
// Formatear fecha
// ============================
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-ES");
};

// ============================
// Calcular subtotal, IVA y total
// ============================
export const calculateTotals = (productos) => {
  const subtotal = productos.reduce((s, p) => s + (p.total || 0), 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;
  return { subtotal, iva, total };
};

// ============================
// Fila vacía para productos
// ============================
export const EMPTY_PRODUCT_ROW = {
  productoId: "",
  nombre: "",
  stock: 0,
  cantidad: 1,
  precioCompra: 0,
  precioVenta: 0,
  total: 0,
};

// ============================
// Normalizar compra para formulario
// estado_compra:
//   true  → "Completada"
//   false / null / undefined → null (sin estado asignado aún, fila gris)
// ============================
export const normalizeCompraForForm = (compra) => ({
  id: compra.id,
  proveedorId: compra.proveedor_id || compra.proveedorId || "",
  proveedorNombre: compra.proveedor_nombre || compra.proveedorNombre || "",
  observaciones: compra.observaciones || "",
  fecha: compra.fecha,
  // null cuando estado_compra es null/undefined/false salvo true
  estado: compra.estado_compra === true ? "Completada" : null,
  numeroCompra: compra.numeroCompra || `C-${compra.id}`,
  subtotal: compra.subtotal || 0,
  iva: compra.iva || 0,
  total: compra.total || 0,
  productos: (compra.productos || compra.detalles || []).map((p) => ({
    id: p.id,
    productoId: p.producto_id || p.productoId,
    nombre: p.producto_nombre || p.nombre,
    stockActual: p.stock || p.stockActual || 0,
    cantidad: p.cantidad,
    precioCompra: p.precio_unidad || p.precio_unitario || p.precioCompra || 0,
    precioVenta: p.precio_venta || p.precioVenta || 0,
    total: p.subtotal || p.total || 0,
  })),
});