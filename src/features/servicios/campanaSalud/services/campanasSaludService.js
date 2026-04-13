// features/servicios/campanaSalud/services/campanasSaludService.js

import api from '../../../../lib/axios';

const BASE_URL = '/campanas-salud';

export const campanasSaludService = {
  async getAll() {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post(BASE_URL, data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`${BASE_URL}/${id}`);
    return true;
  }
};

export const getAllCampanasSalud = () => campanasSaludService.getAll();
export const getCampanaSaludById = (id) => campanasSaludService.getById(id);
export const createCampanaSalud = (data) => campanasSaludService.create(data);
export const updateCampanaSalud = (id, data) => campanasSaludService.update(id, data);
export const deleteCampanaSalud = (id) => campanasSaludService.delete(id);