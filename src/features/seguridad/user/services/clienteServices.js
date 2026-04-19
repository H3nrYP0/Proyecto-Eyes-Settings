import api from '@lib/axios';

// ENDPOINTS PARA PERFIL DE USUARIO (admin, empleados, etc.)

// Obtener mi perfil de USUARIO
export const getMiPerfilUsuario = async () => {
  try {
    const res = await api.get('/usuario/perfil');
    return res.data;
  } catch (error) {
    console.error('Error en getMiPerfilUsuario:', error);
    throw error;
  }
};

// Actualizar mi perfil de USUARIO
export const updateMiPerfilUsuario = async (data) => {
  try {
    const payload = {};
    
    if (data.nombre !== undefined) {
      payload.nombre = data.nombre.trim();
    }
    if (data.telefono !== undefined) {
      payload.telefono = data.telefono || '';
    }

    const res = await api.put('/usuario/perfil', payload);
    return res.data;
  } catch (error) {
    console.error('Error en updateMiPerfilUsuario:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Cambiar mi contraseña de USUARIO
export const cambiarMiContraseniaUsuario = async (data) => {
  try {
    const res = await api.post('/usuario/cambiar-contrasenia', {
      contrasenia_actual: data.contrasenia_actual,
      nueva_contrasenia: data.nueva_contrasenia
    });
    return res.data;
  } catch (error) {
    console.error('Error en cambiarMiContraseniaUsuario:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// ENDPOINTS ESPECÍFICOS DE CLIENTE

// Obtener mi perfil de CLIENTE
export const getMiPerfilCliente = async () => {
  try {
    const res = await api.get('/cliente/perfil');
    return res.data;
  } catch (error) {
    console.error('Error en getMiPerfilCliente:', error);
    throw error;
  }
};

// Actualizar mi perfil de CLIENTE
export const updateMiPerfilCliente = async (data) => {
  try {
    const payload = {};
    
    if (data.nombre !== undefined) {
      payload.nombre = data.nombre.trim();
    }
    if (data.apellido !== undefined) {
      payload.apellido = data.apellido.trim();
    }
    if (data.telefono !== undefined) {
      payload.telefono = data.telefono || '';
    }
    if (data.direccion !== undefined) {
      payload.direccion = data.direccion || '';
    }

    const res = await api.put('/cliente/perfil', payload);
    return res.data;
  } catch (error) {
    console.error('Error en updateMiPerfilCliente:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Cambiar mi contraseña de CLIENTE
export const cambiarMiContraseniaCliente = async (data) => {
  try {
    const res = await api.post('/cliente/cambiar-contrasenia', {
      contrasenia_actual: data.contrasenia_actual,
      nueva_contrasenia: data.nueva_contrasenia
    });
    return res.data;
  } catch (error) {
    console.error('Error en cambiarMiContraseniaCliente:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};