import api from "../axios";

// Obtener todos
export async function getAllRoles() {
  const res = await api.get("/roles");
  return res.data;
}

// Obtener por ID
export async function getRolById(id) {
  const res = await api.get(`/roles/${id}`);
  return res.data;
}

// Crear
export async function createRol(data) {
  const res = await api.post("/roles", data);
  return res.data;
}

// Actualizar
export async function updateRol(id, data) {
  const res = await api.put(`/roles/${id}`, data);
  return res.data;
}

// Eliminar
export async function deleteRol(id) {
  const res = await api.delete(`/roles/${id}`);
  return res.data;
}

// Cambiar estado
export async function updateEstadoRol(id, nuevoEstado) {
  const res = await api.put(`/roles/${id}`, {
    estado: nuevoEstado === "activo",
  });
  return res.data;
}

// Permisos
export async function getAllPermisos() {
  const res = await api.get("/permiso");
  return res.data;
}
