import api from "../../../../lib/axios";

let pendingRequests = new Map();

export const marcasService = {
  async getAllMarcas() {
    try {
      const response = await api.get('/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  async getMarcaById(id) {
    if (!id) {
      throw new Error('ID de marca no proporcionado');
    }
    try {
      const response = await api.get(`/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener marca:', error);
      throw error;
    }
  },

  async createMarca(data) {
    const requestKey = JSON.stringify({ url: '/marcas', data });
    
    if (pendingRequests.has(requestKey)) {
      throw new Error('Ya hay una solicitud de creación en proceso');
    }
    
    try {
      pendingRequests.set(requestKey, true);
      const response = await api.post('/marcas', {
        nombre: data.nombre,
        estado: true
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    } finally {
      pendingRequests.delete(requestKey);
    }
  },

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

  async updateMarca(id, data) {
    if (!id) {
      throw new Error('ID de marca no proporcionado');
    }
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

  async deleteMarca(id) {
    if (!id) {
      return true;
    }
    
    try {
      await api.delete(`/marcas/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return true;
      }
      console.error('Error al eliminar marca:', error);
      throw error;
    }
  },

  async hasMarcaProductosAsociados(id) {
    if (!id) {
      return false;
    }
    try {
      const response = await api.get('/productos');
      const productos = response.data;
      return productos.some(producto => producto.marca_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar productos asociados:', error);
      return false;
    }
  },

  async toggleMarcaEstado(id, nuevoEstado) {
    if (!id) {
      throw new Error('ID de marca no proporcionado');
    }
    try {
      const estadoBooleano = nuevoEstado === true || nuevoEstado === "true" || nuevoEstado === "activa";
      const response = await api.put(`/marcas/${id}`, {
        estado: estadoBooleano
      });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de marca:', error);
      throw error;
    }
  },

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