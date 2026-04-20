// src/features/servicios/pages/servicio/services/serviciosService.js
import axios from "../../../../lib/axios";

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
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        duracion_min: Number(data.duracion_min),
        precio: Number(data.precio),
        estado: data.estado === true
      };
      
      // Solo validar si los valores existen
      if (isNaN(payload.duracion_min) || payload.duracion_min <= 0) {
        console.warn('Duración inválida, usando valor existente');
        // No lanzar error, dejar que el backend maneje
      }
      if (isNaN(payload.precio) || payload.precio <= 0) {
        console.warn('Precio inválido, usando valor existente');
      }
      
      const response = await axios.put(`/servicios/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error en updateServicio:', error);
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
      const servicioActual = await this.getServicioById(id);
      const response = await axios.put(`/servicios/${id}`, {
        nombre: servicioActual.nombre,
        duracion_min: servicioActual.duracion_min,
        precio: servicioActual.precio,
        descripcion: servicioActual.descripcion || '',
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

  /**
   * Obtiene todos los estados de cita disponibles
   * @returns {Promise<Array>} Lista de estados de cita
   */
  async getEstadosCita() {
    try {
      const response = await axios.get('/estado-cita');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene los IDs de los estados de cita que bloquean la desactivación de servicios
   * @returns {Promise<Array<number>>} Lista de IDs de estados bloqueantes
   */
  async getEstadosQueBloquean() {
    try {
      const estados = await this.getEstadosCita();
      const estadosBloqueantes = estados.filter(
        estado => estado.nombre.toLowerCase() === 'pendiente' || 
                  estado.nombre.toLowerCase() === 'confirmada'
      );
      return estadosBloqueantes.map(estado => estado.id);
    } catch (error) {
      return [1, 2];
    }
  },

  getEstadoTexto(estado) {
    return estado ? 'activo' : 'inactivo';
  },

  getEstadoBadge(estado) {
    return estado ? 'success' : 'error';
  }
};