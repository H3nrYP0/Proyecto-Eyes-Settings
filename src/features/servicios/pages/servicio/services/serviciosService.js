// src/features/servicios/pages/servicio/services/serviciosService.js
import axios from "../../../../../lib/axios";

export const ServicioData = {
  async getAllServicios() {
    try {
      const response = await axios.get('/servicios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getServicioById(id) {
    try {
      const response = await axios.get(`/servicios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createServicio(data) {
    try {
      const response = await axios.post('/servicios', {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        duracion_min: data.duracion_min,
        precio: data.precio,
        estado: data.estado !== undefined ? data.estado : true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateServicio(id, data) {
    try {
      const response = await axios.put(`/servicios/${id}`, {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        duracion_min: data.duracion_min,
        precio: data.precio,
        estado: data.estado
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteServicio(id) {
    try {
      await axios.delete(`/servicios/${id}`);
    return true;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data?.error || "Error al eliminar el servicio";
      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      throw enhancedError;
    }
    throw error;
  }
},

  async toggleServicioEstado(id, nuevoEstado) {
    try {
      const response = await axios.put(`/servicios/${id}`, {
        estado: nuevoEstado
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async checkServicioExists(nombre, excludeId = null) {
    try {
      const response = await axios.get('/servicios');
      const servicios = response.data;
      const nombreTrimmed = nombre.trim().toLowerCase();
      return servicios.some(servicio => 
        servicio.nombre.toLowerCase().trim() === nombreTrimmed &&
        (excludeId ? servicio.id !== excludeId : true)
      );
    } catch (error) {
      throw error;
    }
  },

  getEstadoTexto(estado) {
    return estado ? 'activo' : 'inactivo';
  },

  getEstadoBadge(estado) {
    return estado ? 'success' : 'error';
  }
};