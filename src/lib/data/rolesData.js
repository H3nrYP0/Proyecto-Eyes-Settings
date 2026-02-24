import api from "../axios";

// Obtener todos
export async function getAllRoles() {
  try {
    const res = await api.get("/roles");
    return res.data;
  } catch (error) {
    console.error("Error en getAllRoles:", error);
    throw error;
  }
}

// Obtener por ID
export async function getRolById(id) {
  try {
    const res = await api.get(`/roles/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en getRolById(${id}):`, error);
    throw error;
  }
}

// Crear
export async function createRol(data) {
  try {
    const res = await api.post("/roles", data);
    return res.data;
  } catch (error) {
    console.error("Error en createRol:", error);
    throw error;
  }
}

// Actualizar
export async function updateRol(id, data) {
  try {
    const res = await api.put(`/roles/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error en updateRol(${id}):`, error);
    throw error;
  }
}

// Eliminar
export async function deleteRol(id) {
  try {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteRol(${id}):`, error);
    throw error;
  }
}

// Cambiar estado (CORREGIDO - mantiene permisos)
export async function updateEstadoRol(id, nuevoEstado) {
  try {
    // 1. Obtener el rol actual con sus permisos
    const rolActual = await getRolById(id);
    
    // 2. Enviar TODOS los datos, no solo el estado
    const res = await api.put(`/roles/${id}`, {
      nombre: rolActual.nombre,
      descripcion: rolActual.descripcion,
      estado: nuevoEstado, // "activo" o "inactivo"
      permisos: Array.isArray(rolActual.permisos) 
        ? rolActual.permisos.map(p => p.id || p) // Mantener permisos
        : []
    });
    
    return res.data;
  } catch (error) {
    console.error("Error actualizando estado:", error);
    throw error;
  }
}

// Permisos
export async function getAllPermisos() {
  try {
    const res = await api.get("/permiso");
    return res.data;
  } catch (error) {
    console.error("Error en getAllPermisos:", error);
    throw error;
  }
}