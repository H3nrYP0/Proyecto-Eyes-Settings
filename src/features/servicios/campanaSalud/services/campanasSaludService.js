import api from '@lib/axios';

const BASE_URL = '/campanas-salud';

export const campanasSaludService = {
  getAll: () => api.get(BASE_URL).then(res => res.data),
  getById: (id) => api.get(`${BASE_URL}/${id}`).then(res => res.data),
  create: (data) => api.post(BASE_URL, data).then(res => res.data),
  update: (id, data) => api.put(`${BASE_URL}/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`${BASE_URL}/${id}`).then(() => true),
};

// Exportaciones directas para comodidad
export const getAllCampanasSalud = campanasSaludService.getAll;
export const getCampanaSaludById = campanasSaludService.getById;
export const createCampanaSalud = campanasSaludService.create;
export const updateCampanaSalud = campanasSaludService.update;
export const deleteCampanaSalud = campanasSaludService.delete;