// src/features/seguridad/user/services/userServices.js

import api from '@lib/axios';
import { 
  validateEmail, 
  validateNombre, 
  validatePassword, 
  validateRolId,
  validateTelefono,
  validateFechaNacimiento,
  validateTipoDocumento,
  validateNumeroDocumento 
} from '../utils/userValidators';

// Obtiene todos los usuarios
export const getAllUsers = async () => {
  try {
    const res = await api.get('/usuarios');
    return res.data;
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
};

// Obtiene un usuario por ID
export const getUserById = async (id) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('ID de usuario inválido');
    }
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en getUserById(${id}):`, error);
    throw error;
  }
};

// Crea un nuevo usuario
export const createUser = async (data) => {
  try {
    // Validaciones
    const nombreValid = validateNombre(data.nombre);
    if (!nombreValid.valid) throw new Error(nombreValid.error);

    const emailValid = validateEmail(data.correo);
    if (!emailValid.valid) throw new Error(emailValid.error);

    const passwordValid = validatePassword(data.contrasenia, true);
    if (!passwordValid.valid) throw new Error(passwordValid.error);

    const rolValid = validateRolId(data.rol_id);
    if (!rolValid.valid) throw new Error(rolValid.error);

    const telefonoValid = validateTelefono(data.telefono);
    if (!telefonoValid.valid) throw new Error(telefonoValid.error);

    const fechaValid = validateFechaNacimiento(data.fecha_nacimiento);
    if (!fechaValid.valid) throw new Error(fechaValid.error);

    const tipoDocValid = validateTipoDocumento(data.tipo_documento);
    if (!tipoDocValid.valid) throw new Error(tipoDocValid.error);

    const numeroDocValid = validateNumeroDocumento(data.numero_documento);
    if (!numeroDocValid.valid) throw new Error(numeroDocValid.error);

    const payload = {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      contrasenia: data.contrasenia,
      rol_id: Number(data.rol_id),
      estado: data.estado !== undefined ? data.estado : true,
      telefono: data.telefono || '',
      fecha_nacimiento: data.fecha_nacimiento,
      tipo_documento: data.tipo_documento,
      numero_documento: data.numero_documento
    };

    const res = await api.post('/usuarios', payload);
    return res.data;
  } catch (error) {
    console.error('Error en createUser:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Actualiza un usuario existente
export const updateUser = async (id, data) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('ID de usuario inválido');
    }

    const payload = {};
    
    if (data.nombre !== undefined) {
      const nombreValid = validateNombre(data.nombre);
      if (!nombreValid.valid) throw new Error(nombreValid.error);
      payload.nombre = data.nombre.trim();
    }

    if (data.correo !== undefined) {
      const emailValid = validateEmail(data.correo);
      if (!emailValid.valid) throw new Error(emailValid.error);
      payload.correo = data.correo.trim().toLowerCase();
    }

    if (data.contrasenia !== undefined && data.contrasenia !== '') {
      const passwordValid = validatePassword(data.contrasenia, false);
      if (!passwordValid.valid) throw new Error(passwordValid.error);
      if (!passwordValid.isEmpty) {
        payload.contrasenia = data.contrasenia;
      }
    }

    if (data.rol_id !== undefined) {
      const rolValid = validateRolId(data.rol_id);
      if (!rolValid.valid) throw new Error(rolValid.error);
      payload.rol_id = Number(data.rol_id);
    }

    if (data.estado !== undefined) {
      payload.estado = data.estado;
    }

    if (data.telefono !== undefined) {
      const telefonoValid = validateTelefono(data.telefono);
      if (!telefonoValid.valid) throw new Error(telefonoValid.error);
      payload.telefono = data.telefono || '';
    }

    if (data.fecha_nacimiento !== undefined && data.fecha_nacimiento !== '') {
      const fechaValid = validateFechaNacimiento(data.fecha_nacimiento);
      if (!fechaValid.valid) throw new Error(fechaValid.error);
      payload.fecha_nacimiento = data.fecha_nacimiento;
    }

    if (data.tipo_documento !== undefined) {
      const tipoDocValid = validateTipoDocumento(data.tipo_documento);
      if (!tipoDocValid.valid) throw new Error(tipoDocValid.error);
      payload.tipo_documento = data.tipo_documento;
    }

    if (data.numero_documento !== undefined) {
      const numeroDocValid = validateNumeroDocumento(data.numero_documento);
      if (!numeroDocValid.valid) throw new Error(numeroDocValid.error);
      payload.numero_documento = data.numero_documento;
    }

    const res = await api.put(`/usuarios/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error en updateUser(${id}):`, error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Elimina un usuario
export const deleteUser = async (id) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('ID de usuario inválido');
    }
    const res = await api.delete(`/usuarios/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error en deleteUser(${id}):`, error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

// Cambia el estado de un usuario
export const updateEstadoUser = async (id, nuevoEstado) => {
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error('ID de usuario inválido');
    }

    if (nuevoEstado !== 'activo' && nuevoEstado !== 'inactivo') {
      throw new Error('Estado inválido. Debe ser "activo" o "inactivo"');
    }

    const userActual = await getUserById(id);
    
    const payload = {
      nombre: userActual.nombre,
      correo: userActual.correo,
      rol_id: userActual.rol_id,
      estado: nuevoEstado === 'activo',
      telefono: userActual.telefono || '',
      fecha_nacimiento: userActual.fecha_nacimiento,
      tipo_documento: userActual.tipo_documento || '',
      numero_documento: userActual.numero_documento || ''
    };

    const res = await api.put(`/usuarios/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error(`Error en updateEstadoUser(${id}):`, error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};