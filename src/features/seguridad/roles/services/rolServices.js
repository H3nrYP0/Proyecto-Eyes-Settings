import api from '@lib/axios';

// Obtiene todos los roles
const getAllRoles = async () => {
  try {
    const res = await api.get('/roles');
    return res.data;
  } catch (error) {
    console.error('Error en getAllRoles:', error);
    throw error;
  }
};

// Obtiene un rol por ID
const getRolById = async (id) => {
  try {
    const res = await api.get(`/roles/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en getRolById(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// Crea un nuevo rol
const createRol = async (data) => {
  try {
    const res = await api.post('/roles', data);
    return res.data;
  } catch (error) {
    console.error('Error en createRol:', error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// Actualiza un rol existente
const updateRol = async (id, data) => {
  try {
    const res = await api.put(`/roles/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error en updateRol(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// Elimina un rol
const deleteRol = async (id) => {
  try {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteRol(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// Cambia el estado manteniendo los permisos actuales
const updateEstadoRol = async (id, nuevoEstado) => {
  try {
    const rolActual = await getRolById(id);
    const res = await api.put(`/roles/${id}`, {
      nombre:      rolActual.nombre,
      descripcion: rolActual.descripcion,
      estado:      nuevoEstado,
      permisos:    Array.isArray(rolActual.permisos)
        ? rolActual.permisos.map((p) => p.id ?? p)
        : [],
    });
    return res.data;
  } catch (error) {
    console.error(`Error en updateEstadoRol(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// Obtiene todos los permisos disponibles
const getAllPermisos = async () => {
  try {
    const res = await api.get('/permiso');
    return res.data;
  } catch (error) {
    console.error('Error en getAllPermisos:', error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

export {
  getAllRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  updateEstadoRol,
  getAllPermisos,
};