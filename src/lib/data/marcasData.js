import axios from "../axios";

export const MarcaData = {
  // Función para obtener todas las marcas
  async getAllMarcas() {
    try {
      const response = await axios.get('/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  // Función para obtener una marca por ID
  async getMarcaById(id) {
    try {
      const response = await axios.get(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener marca:', error);
      throw error;
    }
  },

  // Función para crear una marca
  async createMarca(data) {
    try {
      const response = await axios.post('/marcas', {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        estado: true // Por defecto activa
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  },

  // Función para actualizar una marca
  async updateMarca(id, data) {
    try {
      const response = await axios.put(`/marcas/${id}`, {
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        estado: data.estado
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar marca:', error);
      throw error;
    }
  },

  // Función para eliminar una marca
  async deleteMarca(id) {
    try {
      await axios.delete(`/marcas/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      throw error;
    }
  },

  // Función para verificar si una marca tiene productos asociados
  async hasMarcaProductosAsociados(id) {
    try {
      const response = await axios.get('/productos');
      const productos = response.data;
      return productos.some(producto => producto.marca_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar productos asociados:', error);
      throw error;
    }
  },

  // Función para cambiar estado (activar/desactivar)
  async toggleMarcaEstado(id, estadoActual) {
    try {
      const response = await axios.put(`/marcas/${id}`, {
        estado: !estadoActual
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de marca:', error);
      throw error;
    }
  },

  // Funciones de utilidad para el frontend
  getEstadoTexto(estado) {
    return estado ? 'Activa' : 'Inactiva';
  },

  getEstadoBadge(estado) {
    return estado ? 'success' : 'error';
  },

  getEstadoColor(estado) {
    return estado ? 'success' : 'error';
  }
};