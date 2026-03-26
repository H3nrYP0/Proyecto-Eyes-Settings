// src/lib/data/serviciosData.js
import api from "../axios";

export const ServicioData = {
  // Obtener todos los servicios
 async getAllServicios() {
  try {
    const response = await api.get('/servicios');

    return response.data.map(servicio => ({
      ...servicio,
      estado: servicio.estado ? 'activo' : 'inactivo',
      estadosDisponibles: ['activo', 'inactivo']
    }));

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
},

  // Obtener un servicio por ID
  async getServicioById(id) {
    try {
      const response = await api.get(`/servicios/${id}`);
      const servicio = response.data;
      
      return {
        id: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        duracion_min: servicio.duracion_min,
        precio: servicio.precio,
        estado: servicio.estado ? 'activo' : 'inactivo'
      };
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      throw error;
    }
  },

  // Crear un nuevo servicio
  async createServicio(data) {
    try {
      const servicioData = {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        duracion_min: data.duracion_min,
        precio: data.precio,
        estado: data.estado
      };

      const response = await api.post('/servicios', servicioData);
      return response.data;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  },

  // Actualizar un servicio
  async updateServicio(id, data) {
    try {
      const servicioData = {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        duracion_min: data.duracion_min,
        precio: data.precio,
        estado: data.estado 
      };

      const response = await api.put(`/servicios/${id}`, servicioData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  },

  // Eliminar un servicio
  async deleteServicio(id) {
    try {
      await api.delete(`/servicios/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw error;
    }
  },

  // Cambiar estado del servicio
  async updateEstadoServicio(id, nuevoEstado) {
    try {
      const payload = {
        estado: nuevoEstado === 'activo'
      };
      const response = await api.put(`/servicios/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de servicio:', error);
      throw error;
    }
  },

  // Funciones de utilidad
  getEstadoTexto(estado) {
    return estado ? 'Activo' : 'Inactivo';
  },

  getEstadoBadge(estado) {
    return estado ? 'success' : 'error';
  },

  getEstadoColor(estado) {
    return estado ? '#2e7d32' : '#d32f2f';
  }
};

// Exportaciones individuales
export const getAllServicios = () => ServicioData.getAllServicios();
export const getServicioById = (id) => ServicioData.getServicioById(id);
export const createServicio = (data) => ServicioData.createServicio(data);
export const updateServicio = (id, data) => ServicioData.updateServicio(id, data);
export const deleteServicio = (id) => ServicioData.deleteServicio(id);
export const updateEstadoServicio = (id, nuevoEstado) => ServicioData.updateEstadoServicio(id, nuevoEstado);