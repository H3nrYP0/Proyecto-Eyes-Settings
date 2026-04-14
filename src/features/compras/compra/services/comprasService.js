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
    const [compraRes, proveedoresRes] = await Promise.all([
      api.get(`/compras/${id}`),
      getAllProveedores(),
    ]);

    const detallesRes = await api
      .get(`/compras/${id}/detalles`)
      .catch(() => ({ data: [] }));

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
        precioCompra: Number(d.precio_unitario ?? 0),
        precioVenta: Number(d.precio_venta ?? d.producto?.precio_venta ?? 0),
        total: Number(d.cantidad) * Number(d.precio_unitario ?? 0),
        stockActual: Number(d.producto?.stock ?? 0),
      })),
    };
  } catch (error) {
    console.error("Error al obtener compra:", error);
    return null;
  }
}

// ============================
// Crear compra + detalles + actualizar stock
// ============================
export async function createCompra(data) {
  // 1) Cabecera de la compra
  const compraRes = await api.post("/compras", {
    proveedor_id: Number(data.proveedorId),
    observaciones: data.observaciones || "",
    estado_compra: true,
  });

  const compraId = compraRes.data.id;

  // 2) Detalles + stock de cada producto
  if (data.productos && data.productos.length > 0) {
    await Promise.all(
      data.productos.map(async (p) => {
        await api.post("/detalle-compra", {
          compra_id: compraId,
          producto_id: Number(p.productoId),
          cantidad: Number(p.cantidad),
          precio_unitario: Number(p.precioCompra),
          precio_venta: Number(p.precioVenta),
        });

        // Sumar cantidad al stock actual del producto
        await api.put(`/productos/${Number(p.productoId)}`, {
          stock: p.stockActual + Number(p.cantidad),
          precio_compra: Number(p.precioCompra),
          precio_venta: Number(p.precioVenta),
        });
      })
    );
  }

  return compraRes.data;
}

// ============================
// Eliminar compra
// ============================
export async function deleteCompra(id) {
  const res = await api.delete(`/compras/${id}`);
  return res.data;
}

// ============================
// Anular compra — irreversible
// ============================
export async function anularCompra(id) {
  const res = await api.put(`/compras/${id}`, { estado_compra: false });
  return res.data;
}

// ============================
// Crear proveedor
// ============================
export async function createProveedor(data) {
  const res = await api.post("/proveedores", data);
  return res.data;
}