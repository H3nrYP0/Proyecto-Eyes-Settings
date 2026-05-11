import api from '@lib/axios';

// ============================================================
// USUARIOS ADMINISTRATIVOS
// ============================================================

export const getAllUsers = async () => {
  try {
    const res = await api.get('/admin/usuarios');
    return res.data;
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    if (!id || isNaN(Number(id))) throw new Error('ID de usuario inválido');
    const res = await api.get(`/admin/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en getUserById(${id}):`, error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const payload = {
      nombre:      data.nombre,
      correo:      data.correo,
      contrasenia: data.contrasenia,
      rol_id:      Number(data.rol_id),
      estado:      data.estado !== undefined ? data.estado : true,
    };
    const res = await api.post('/admin/usuarios', payload);
    return res.data;
  } catch (error) {
    console.error('Error en createUser:', error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    if (!id || isNaN(Number(id))) throw new Error('ID de usuario inválido');

    const payload = {};
    if (data.nombre     !== undefined) payload.nombre  = data.nombre;
    if (data.correo     !== undefined) payload.correo  = data.correo.trim().toLowerCase();
    if (data.rol_id     !== undefined) payload.rol_id  = Number(data.rol_id);
    if (data.estado     !== undefined) payload.estado  = data.estado;
    if (data.contrasenia)              payload.contrasenia = data.contrasenia;

    const res = await api.put(`/admin/usuarios/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error en updateUser(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    if (!id || isNaN(Number(id))) throw new Error('ID de usuario inválido');
    const res = await api.delete(`/admin/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteUser(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

export const updateEstadoUser = async (id, nuevoEstado) => {
  try {
    if (!id || isNaN(Number(id))) throw new Error('ID de usuario inválido');
    const res = await api.put(`/admin/usuarios/${id}`, { estado: nuevoEstado === 'activo' });
    return res.data;
  } catch (error) {
    console.error(`Error en updateEstadoUser(${id}):`, error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};

// ============================================================
// PERFIL DEL USUARIO AUTENTICADO
// ============================================================

export const getMiPerfil = async () => {
  try {
    const res = await api.get('/usuario/perfil');
    return res.data;
  } catch (error) {
    console.error('Error en getMiPerfil:', error);
    throw error;
  }
};

export const cambiarMiContrasenia = async (data) => {
  try {
    const res = await api.post('/usuario/cambiar-contrasenia', {
      contrasenia_actual:  data.contrasenia_actual,
      nueva_contrasenia:   data.nueva_contrasenia,
    });
    return res.data;
  } catch (error) {
    console.error('Error en cambiarMiContrasenia:', error);
    if (error.response?.data?.error) throw new Error(error.response.data.error);
    throw error;
  }
};