// features/servicios/campanaSalud/services/estadosCitaCampanaService.js
// Reutiliza el endpoint /estado-cita para poblar el select dinámicamente

import api from '../../../../lib/axios';

export const getEstadosCita = async () => {
  const response = await api.get('/estado-cita');
  return response.data; // [{ id, nombre }, ...]
};