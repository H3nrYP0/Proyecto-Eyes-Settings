import api from "../axios";

// ============================
// Obtener todas las categorías
// ============================
export async function getAllCategorias() {
  const res = await api.get("/categorias");
  return res.data;
}

// ============================
// Obtener categoría por ID
// ============================
export async function getCategoriaById(id) {
  const res = await api.get("/categorias");
  const categorias = res.data || [];
  return categorias.find((c) => c.id === id);
}

// ============================
// Crear categoría
// ============================
export async function createCategoria(data) {
  const payload = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    // La API usa boolean
    estado: data.estado === "activa",
  };

  const res = await api.post("/categorias", payload);
  return res.data;
}

// ============================
// Actualizar categoría
// ============================
export async function updateCategoria(id, data) {
  const payload = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    estado: data.estado === "activa",
  };

  const res = await api.put(`/categorias/${id}`, payload);
  return res.data;
}

// ============================
// Eliminar categoría
// ============================
export async function deleteCategoria(id) {
  const res = await api.delete(`/categorias/${id}`);
  return res.data;
}

// ============================
// Cambiar estado categoría
// ============================
export async function updateEstadoCategoria(id, nuevoEstado) {
  const payload = {
    estado: nuevoEstado === "activa", // true / false
  };

  const res = await api.put(`/categorias/${id}`, payload);
  return res.data;
}
