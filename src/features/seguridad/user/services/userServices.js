import api from '@lib/axios';

// Obtiene todos los usuarios
const getAllUsers = async () => {
  try {
    const res = await api.get('/usuarios');
    return res.data;
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
};

// Obtiene un usuario por ID
const getUserById = async (id) => {
  try {
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en getUserById(${id}):`, error);
    throw error;
  }
};

// Crea un nuevo usuario
const createUser = async (data) => {
  try {
    const res = await api.post('/usuarios', data);
    return res.data;
  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

// Actualiza un usuario existente
const updateUser = async (id, data) => {
  try {
    const res = await api.put(`/usuarios/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error en updateUser(${id}):`, error);
    throw error;
  }
};

// Elimina un usuario
const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteUser(${id}):`, error);
    throw error;
  }
};

// Cambia el estado del usuario manteniendo sus datos actuales
const toggleUserEstado = async (usuario, nuevoEstado) => {
  try {
    const res = await api.put(`/usuarios/${usuario.id}`, {
      nombre:      usuario.nombre,
      correo:      usuario.correo,
      contrasenia: usuario.contrasenia,
      rol_id:      usuario.rol_id,
      estado:      nuevoEstado === 'activo',
    });
    return res.data;
  } catch (error) {
    console.error(`Error en toggleUserEstado(${usuario.id}):`, error);
    throw error;
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserEstado,
};