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

/**
 * Cambia la contraseña del usuario autenticado.
 *
 * IMPORTANTE: Esta función usa fetch() nativo en lugar de la instancia axios
 * para evitar que el interceptor global de axios trate el 401 de "contraseña
 * actual incorrecta" como un token expirado y fuerce el cierre de sesión.
 *
 * El token JWT se obtiene del mismo lugar donde axios lo guarda (localStorage
 * o sessionStorage).
 */
export const cambiarContrasenia = async (contraseniaActual, nuevaContrasenia) => {
  // Obtener el token de la misma fuente que usa tu instancia axios.
  // Ajusta 'token' a la clave real que uses (ej: 'access_token', 'jwt', etc.)
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    '';

  // Determinar la base URL de la misma forma que lo hace axios.
  // Si tu instancia axios tiene baseURL configurada, úsala aquí también.
  const baseURL =
    import.meta.env?.VITE_API_URL ||
    process.env?.REACT_APP_API_URL ||
    api.defaults?.baseURL ||
    '';

  const res = await fetch(`${baseURL}/usuario/cambiar-contrasenia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      contrasenia_actual: contraseniaActual,
      nueva_contrasenia: nuevaContrasenia,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Lanzar un error con el formato que espera el onError del mutation
    const err = new Error(data?.error || 'Error al cambiar contraseña');
    err.response = { status: res.status, data };
    throw err;
  }

  return data;
};