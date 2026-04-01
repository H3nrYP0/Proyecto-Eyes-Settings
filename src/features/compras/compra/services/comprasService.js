import api from "../../../../lib/axios";
import { getAllProveedores } from "../../proveedor/services/proveedoresService";

// ============================
// Obtener todas las compras con nombre del proveedor
// ============================
export async function getAllCompras() {
  try {
    const [comprasRes, proveedoresRes] = await Promise.all([
      api.get("/compras"),
      getAllProveedores(),
    ]);
    
    const compras = comprasRes.data;
    const proveedores = proveedoresRes;
    
    // Mapear proveedores por ID para acceso rápido
    const proveedoresMap = {};
    proveedores.forEach(p => {
      proveedoresMap[p.id] = p.razon_social_o_nombre || p.razonSocial;
    });
    
    // Agregar proveedorNombre a cada compra
    return compras.map(compra => ({
      ...compra,
      proveedor_nombre: proveedoresMap[compra.proveedor_id] || "Proveedor no encontrado",
    }));
  } catch (error) {
    console.error("Error cargando compras:", error);
    return [];
  }
}

// ============================
// Obtener compra por ID
// ============================
export async function getCompraById(id) {
  try {
    const compras = await getAllCompras();
    return compras.find(c => c.id === id) || null;
  } catch (error) {
    console.error("Error al obtener compra:", error);
    return null;
  }
}

// ============================
// Crear compra
// ============================
export async function createCompra(data) {
  const res = await api.post("/compras", data);
  return res.data;
}

// ============================
// Actualizar compra
// ============================
export async function updateCompra(id, data) {
  const res = await api.put(`/compras/${id}`, data);
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
// Actualizar estado de compra
// ============================
export async function updateEstadoCompra(id, estadoActual) {
  const nuevoEstado = estadoActual === "Completada" ? false : true;
  const res = await api.put(`/compras/${id}`, { estado_compra: nuevoEstado });
  return res.data;
}