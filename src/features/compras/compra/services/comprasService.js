import api from "../../../../lib/axios";

// ============================
// Obtener todas las compras
// ============================
export async function getAllCompras() {
  const res = await api.get("/compras");
  return res.data;
}

// ============================
// Obtener compra por ID
// ============================
export async function getCompraById(id) {
  try {
    const res = await api.get(`/compras/${id}`);
    return res.data;
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
  const nuevoEstado = estadoActual === "Completada" ? "Anulada" : "Completada";
  const res = await api.put(`/compras/${id}`, { estado_compra: nuevoEstado === "Completada" });
  return res.data;
}