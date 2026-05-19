import api from '@lib/axios';

export const getEstadosCita = async () => {
  const response = await api.get('/estado-cita');
  return response.data;
};