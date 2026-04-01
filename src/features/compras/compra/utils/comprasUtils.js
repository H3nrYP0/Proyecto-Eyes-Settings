// ============================
// Formatear moneda (COP)
// ============================
export const formatCurrency = (amount) => {
  return `$${Number(amount).toLocaleString("es-CO")}`;
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
  precioUnitario: 0,
  total: 0,
};

// ============================
// Normalizar compra para formulario
// ============================
export const normalizeCompraForForm = (compra) => ({
  id: compra.id,
  proveedorId: compra.proveedor_id || compra.proveedorId || "",
  proveedorNombre: compra.proveedor_nombre || compra.proveedorNombre || "",
  observaciones: compra.observaciones || "",
  fecha: compra.fecha,
  estado: compra.estado_compra === true ? "Completada" : "Anulada",
  numeroCompra: compra.numeroCompra || `C-${compra.id}`,
  productos: (compra.productos || compra.detalles || []).map((p) => ({
    id: p.id,
    productoId: p.producto_id || p.productoId,
    nombre: p.producto_nombre || p.nombre,
    stock: p.stock || 0,
    cantidad: p.cantidad,
    precioUnitario: p.precio_unidad || p.precioUnitario,
    total: p.subtotal || p.total,
  })),
});