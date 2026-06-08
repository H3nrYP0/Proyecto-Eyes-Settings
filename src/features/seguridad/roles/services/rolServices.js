import api from '@lib/axios';

// Obtener todos los roles (sin paginación) – para filtros frontend
const getAllRoles = async () => {
  const res = await api.get('/roles');
  return res.data.map(rol => ({
    ...rol,
    estado: rol.estado === true ? 'activo' : 'inactivo'
  }));
};

// Obtener roles con paginación (ya no se usa directamente en la lista, pero puede servir para otros lugares)
const getAllRolesPaginated = async (page = 1, perPage = 10, filters = {}) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('per_page', perPage.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.estado) {
    const estadoBool = filters.estado === 'activo' ? 'true' : 'false';
    params.append('estado', estadoBool);
  }

  const res = await api.get(`/roles?${params.toString()}`);

  if (res.data && res.data.data && res.data.pagination) {
    const { data, pagination } = res.data;
    const roles = data.map(rol => ({
      ...rol,
      estado: rol.estado === true ? 'activo' : 'inactivo',
      estadosDisponibles: ['activo', 'inactivo'],
      permisos: rol.permisos || []
    }));
    return {
      items: roles,
      totalPages: pagination.total_pages,
      currentPage: pagination.current_page,
      totalCount: pagination.total,
      hasNext: pagination.has_next,
      hasPrev: pagination.has_prev,
    };
  } else {
    console.warn('Backend no devolvió paginación. Convirtiendo array...');
    const roles = (Array.isArray(res.data) ? res.data : []).map(rol => ({
      ...rol,
      estado: rol.estado === true ? 'activo' : 'inactivo',
      estadosDisponibles: ['activo', 'inactivo'],
      permisos: rol.permisos || []
    }));
    return {
      items: roles,
      totalPages: 1,
      currentPage: 1,
      totalCount: roles.length,
      hasNext: false,
      hasPrev: false,
    };
  }
};

// Obtiene un rol por ID
const getRolById = async (id) => {
  try {
    const res = await api.get(`/roles/${id}`);
    const rol = res.data;
    return {
      ...rol,
      estado: rol.estado === true ? 'activo' : 'inactivo',
      permisos: rol.permisos || [],
      estadosDisponibles: ['activo', 'inactivo']
    };
  } catch (error) {
    console.error(`Error en getRolById(${id}):`, error);
    throw error;
  }
};

// Crear rol
const createRol = async (data) => {
  try {
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado === 'activo',
      permisos: data.permisos
    };
    const res = await api.post('/roles', payload);
    return res.data;
  } catch (error) {
    console.error('Error en createRol:', error);
    throw error;
  }
};

// Actualizar rol
const updateRol = async (id, data) => {
  try {
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado === 'activo',
      permisos: data.permisos
    };
    const res = await api.put(`/roles/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error en updateRol(${id}):`, error);
    throw error;
  }
};

// Eliminar rol
const deleteRol = async (id) => {
  try {
    const res = await api.delete(`/roles/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteRol(${id}):`, error);
    throw error;
  }
};

// Cambiar estado (activo/inactivo)
const updateEstadoRol = async (id, nuevoEstado) => {
  try {
    const rolActual = await getRolById(id);
    const res = await api.put(`/roles/${id}`, {
      nombre: rolActual.nombre,
      descripcion: rolActual.descripcion,
      estado: nuevoEstado === 'activo',
      permisos: rolActual.permisos.map(p => p.id || p),
    });
    return res.data;
  } catch (error) {
    console.error(`Error en updateEstadoRol(${id}):`, error);
    throw error;
  }
};

// Obtener todos los permisos
const getAllPermisos = async () => {
  try {
    const res = await api.get('/permiso');
    return res.data;
  } catch (error) {
    console.error('Error en getAllPermisos:', error);
    throw error;
  }
};

export {
  getAllRoles,
  getAllRolesPaginated,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
  updateEstadoRol,
  getAllPermisos,
};