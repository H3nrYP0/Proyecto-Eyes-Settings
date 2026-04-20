import api from "../../../../lib/axios";
import { getAllProveedores } from "../../proveedor/services/proveedoresService";

// ============================
// Obtener todas las compras
// ============================
export async function getAllCompras() {
  try {
    const [comprasRes, proveedoresRes] = await Promise.all([
      api.get("/compras"),
      getAllProveedores(),
    ]);

    const proveedoresMap = {};
    proveedoresRes.forEach((p) => {
      proveedoresMap[p.id] = p.razon_social_o_nombre || p.razonSocial || p.nombre || "";
    });

    return comprasRes.data.map((compra) => ({
      ...compra,
      proveedor_nombre: proveedoresMap[compra.proveedor_id] || "Proveedor no encontrado",
    }));
  } catch (error) {
    console.error("Error cargando compras:", error);
    return [];
  }
}

// ============================
// Obtener compra por ID con detalles
// ============================
export async function getCompraById(id) {
  try {
    const [compraRes, proveedoresRes, detallesRes] = await Promise.all([
      api.get(`/compras/${id}`),
      getAllProveedores(),
      api.get(`/compras/${id}/detalles`).catch(() => ({ data: [] })),
    ]);

    const compra = compraRes.data;
    const detalles = Array.isArray(detallesRes.data) ? detallesRes.data : [];

    const proveedoresMap = {};
    proveedoresRes.forEach((p) => {
      proveedoresMap[p.id] = p.razon_social_o_nombre || p.razonSocial || p.nombre || "";
    });

    return {
      ...compra,
      proveedor_nombre: proveedoresMap[compra.proveedor_id] || "Proveedor no encontrado",
      productos: detalles.map((d) => ({
        id: d.id,
        productoId: d.producto_id,
        nombre: d.nombre_producto || d.producto?.nombre || "",
        cantidad: Number(d.cantidad),
        precioCompra: Number(d.precio_unitario ?? d.precio_unidad ?? 0),
        precioVenta: Number(d.precio_venta ?? d.producto?.precio_venta ?? 0),
        total: Number(d.subtotal ?? (Number(d.cantidad) * Number(d.precio_unitario ?? d.precio_unidad ?? 0))),
        stockActual: Number(d.producto?.stock ?? 0),
      })),
    };
  } catch (error) {
    console.error("Error al obtener compra:", error);
    return null;
  }
}

// ============================
// Crear compra — el backend maneja detalles dentro del mismo POST /compras
// Endpoint: POST /compras  body: { proveedor_id, estado_compra, detalles: [...] }
// ============================
export async function createCompra(data) {
  const payload = {
    proveedor_id: Number(data.proveedorId),
    observaciones: data.observaciones || "",
    estado_compra: true,
    detalles: data.productos.map((p) => ({
      producto_id: Number(p.productoId),
      cantidad: Number(p.cantidad),
      precio_unidad: Number(p.precioCompra),
      precio_venta: Number(p.precioVenta),
    })),
  };

  const res = await api.post("/compras", payload);
  return res.data;
}

// ============================
// Eliminar compra
// ============================
export async function deleteCompra(id) {
  const res = await api.delete(`/compras/${id}`);
  return res.data;
}

// ============================
// Anular compra — PUT /compras/:id  { estado_compra: false }
// ============================
export async function anularCompra(id) {
  const res = await api.put(`/compras/${id}`, { estado_compra: false });
  return res.data;
}

// ============================
// Crear proveedor — POST /proveedores
// El backend requiere: razon_social_o_nombre, documento (obligatorios)
// ============================
export async function createProveedor(data) {
  const res = await api.post("/proveedores", {
    razon_social_o_nombre: data.razon_social_o_nombre,
    documento: data.documento || `TEMP-${Date.now()}`, // fallback si no se captura
    telefono: data.telefono || undefined,
    correo: data.email || undefined,
    direccion: data.direccion || undefined,
    estado: true,
  });
  return res.data?.proveedor ?? res.data;
}