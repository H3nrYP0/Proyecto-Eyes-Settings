import { formatCurrency, formatDate } from './comprasUtils';

// ── Estado ────────────────────────────────────────────────────────────────────
// Convierte cualquier representación de estado al string canónico del módulo:
//   true / "completada" / 1  → 'completada'
//   false / null / undefined / "anulada" / 0 → 'anulada'
export const normalizarCompraEstado = (estadoCompra) => {
  if (typeof estadoCompra === 'string') {
    return estadoCompra === 'completada' ? 'completada' : 'anulada';
  }
  if (typeof estadoCompra === 'boolean') {
    return estadoCompra ? 'completada' : 'anulada';
  }
  if (typeof estadoCompra === 'number') {
    return estadoCompra === 1 ? 'completada' : 'anulada';
  }
  return 'anulada'; // fallback seguro
};

// ── Normalizar fila individual (para la tabla de Compras) ─────────────────────
export const normalizarCompra = (compra) => ({
  ...compra,
  id:              compra.id,
  numeroCompra:    compra.numeroCompra || compra.numero_compra || `C-${compra.id}`,
  proveedorNombre: compra.proveedor_nombre || compra.proveedorNombre || '—',
  fechaFormateada: formatDate(compra.fecha),
  totalFormateado: formatCurrency(compra.total ?? 0),
  total:           Number(compra.total ?? 0),
  observaciones:   compra.observaciones || '',
  estado:          normalizarCompraEstado(compra.estado_compra ?? compra.estado),
});

// ── Normalizar lista de compras (para useQuery select) ────────────────────────
export const normalizarCompras = (compras) => {
  if (!Array.isArray(compras)) return [];
  return compras.map(normalizarCompra);
};

// ── Normalizar compra individual para el formulario (crear/editar/ver) ─────────
// Espejo de normalizarRolInitialData
export const normalizarCompraForForm = (compra) => ({
  id:              compra.id,
  numeroCompra:    compra.numeroCompra || compra.numero_compra || `C-${compra.id}`,
  proveedorId:     compra.proveedor_id     || compra.proveedorId     || '',
  proveedorNombre: compra.proveedor_nombre || compra.proveedorNombre || '',
  observaciones:   compra.observaciones ?? '',
  fecha:           compra.fecha,
  estado:          normalizarCompraEstado(compra.estado_compra ?? compra.estado),
  subtotal:        Number(compra.subtotal ?? 0),
  iva:             Number(compra.iva      ?? 0),
  total:           Number(compra.total    ?? 0),
  productos: (compra.productos || compra.detalles || []).map((p) => ({
    id:           p.id,
    productoId:   p.producto_id   || p.productoId,
    nombre:       p.producto_nombre || p.nombre || '',
    stockActual:  Number(p.stock ?? p.stockActual ?? 0),
    cantidad:     Number(p.cantidad ?? 1),
    precioCompra: Number(p.precio_unidad  || p.precio_unitario || p.precioCompra  || 0),
    precioVenta:  Number(p.precio_venta   || p.precioVenta  || 0),
    total:        Number(p.subtotal       || p.total        || 0),
  })),
});

// ── Payload para creación ─────────────────────────────────────────────────────
// Espejo de buildRolCreatePayload
export const buildCompraCreatePayload = (data) => ({
  proveedor_id:  Number(data.proveedorId),
  observaciones: data.observaciones || '',
  estado_compra: true,
  detalles: (data.productos || []).map((p) => ({
    producto_id:  Number(p.productoId),
    cantidad:     Number(p.cantidad),
    precio_unidad: Number(p.precioCompra),
    precio_venta:  Number(p.precioVenta),
  })),
});

// ── Payload para actualización ────────────────────────────────────────────────
export const buildCompraUpdatePayload = (data) => ({
  proveedor_id:  Number(data.proveedorId),
  observaciones: data.observaciones || '',
  estado_compra: data.estado === 'completada',
  detalles: (data.productos || []).map((p) => ({
    producto_id:   Number(p.productoId),
    cantidad:      Number(p.cantidad),
    precio_unidad: Number(p.precioCompra),
    precio_venta:  Number(p.precioVenta),
  })),
});