import api from "../../../../lib/axios";

export const marcasService = {
  // Obtener todas las marcas
  async getAllMarcas() {
    try {
      const response = await api.get('/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  // Obtener una marca por ID
  async getMarcaById(id) {
    try {
      const response = await api.get(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener marca:', error);
      throw error;
    }
  },

  // Crear una marca
  async createMarca(data) {
    try {
      const response = await api.post('/marcas', {
        nombre: data.nombre,
        estado: true
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  },

  // Verificar si ya existe una marca con ese nombre
  async checkMarcaExists(nombre) {
    try {
      const response = await api.get('/marcas');
      const marcas = response.data;
      const nombreTrimmed = nombre.trim().toLowerCase();
      return marcas.some(marca => marca.nombre.toLowerCase().trim() === nombreTrimmed);
    } catch (error) {
      console.error('Error al verificar marca:', error);
      throw error;
    }
  },

  // Actualizar una marca
  async updateMarca(id, data) {
    try {
      const response = await api.put(`/marcas/${id}`, {
        nombre: data.nombre,
        estado: data.estado
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar marca:', error);
      throw error;
    }
  },

  // Eliminar una marca
  async deleteMarca(id) {
    try {
      await api.delete(`/marcas/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      throw error;
    }
  },

  // Verificar si una marca tiene productos asociados
  async hasMarcaProductosAsociados(id) {
    try {
      const response = await api.get('/productos');
      const productos = response.data;
      return productos.some(producto => producto.marca_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar productos asociados:', error);
      throw error;
    }
  },

  // Cambiar estado (activar/desactivar)
  async toggleMarcaEstado(id, nuevoEstado) {
    try {
      const response = await api.put(`/marcas/${id}`, {
        estado: nuevoEstado
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de marca:', error);
      throw error;
    }
  },

  // Utilidades
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