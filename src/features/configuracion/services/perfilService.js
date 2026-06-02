/**
 * Servicios para interactuar con los endpoints unificados de perfil.
 */

import api from '@lib/axios';

export const getMiPerfil = async () => {
  const response = await api.get('/mi-perfil');
  return response.data; // { usuario, cliente }
};

export const updateMiPerfil = async (usuarioData, clienteData) => {
  const payload = {};
  if (usuarioData && Object.keys(usuarioData).length) payload.usuario = usuarioData;
  if (clienteData && Object.keys(clienteData).length) payload.cliente = clienteData;
  const response = await api.put('/mi-perfil', payload);
  return response.data;
};

export const cambiarContrasenia = async (contraseniaActual, nuevaContrasenia) => {
  const response = await api.post('/usuario/cambiar-contrasenia', {
    contrasenia_actual: contraseniaActual,
    nueva_contrasenia: nuevaContrasenia
  });
  return response.data;
};