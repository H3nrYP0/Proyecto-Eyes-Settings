import api from "../axios";

export const CampanaSaludData = {
  // Obtener todas las campañas
  async getAllCampanasSalud() {
    try {
      const response = await api.get('/campanas-salud');
      return response.data;
    } catch (error) {
      console.error('Error al obtener campañas:', error);
      throw error;
    }
  },

  // Obtener una campaña por ID - CORREGIDO
  async getCampanaSaludById(id) {
    try {
      console.log('🔍 getCampanaSaludById - ID recibido:', id);
    console.log('🔍 getCampanaSaludById - Tipo de ID:', typeof id);
    

      const response = await api.get(`/campanas-salud/${id}`);
   console.log('✅ Respuesta del backend - status:', response.status);
    console.log('✅ Respuesta del backend - data:', response.data);

      const campana = response.data;


        // Si el backend devuelve un array y necesitas el primer elemento
    const campanaData = Array.isArray(campana) ? campana[0] : campana;
    
    console.log('📦 Datos transformados:', {
      id: campanaData.id,
      empleado_id: campanaData.empleado_id,
      empresa: campanaData.empresa,
      fecha: campanaData.fecha,
      hora: campanaData.hora,
      estado: campanaData.estado
    });
      
      // IMPORTANTE: Devolver los datos EXACTAMENTE como los espera el formulario
      return {
        id: campana.id,
        empleado_id: campana.empleado_id,
        empresa: campana.empresa,
        contacto: campana.contacto || '',
        fecha: campana.fecha,
        hora: campana.hora,
        direccion: campana.direccion || '',
        observaciones: campana.observaciones || '',
        estado: campana.estado // Mantener como booleano, NO convertir a string
      };
    } catch (error) {
      console.error('❌ Error en getCampanaSaludById:');
    console.error('   - ID:', id);
    console.error('   - Status:', error.response?.status);
    console.error('   - Data:', error.response?.data);
    console.error('   - Message:', error.message);
    throw error;
    }
  },

  // Crear una nueva campaña
  async createCampanaSalud(data) {
    try {
      const campanaData = {
        empleado_id: data.empleado_id,
        empresa: data.empresa,
        contacto: data.contacto || null,
        fecha: data.fecha,
        hora: data.hora,
        direccion: data.direccion || null,
        observaciones: data.observaciones || null,
        estado: true // Por defecto activa
      };

      const response = await api.post('/campanas-salud', campanaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear campaña:', error);
      throw error;
    }
  },

  // Actualizar una campaña - CORREGIDO
  async updateCampanaSalud(id, data) {
    try {
      const campanaData = {
        empleado_id: data.empleado_id,
        empresa: data.empresa,
        contacto: data.contacto || null,
        fecha: data.fecha,
        hora: data.hora,
        direccion: data.direccion || null,
        observaciones: data.observaciones || null,
        estado: data.estado // Mantener como booleano
      };

      const response = await api.put(`/campanas-salud/${id}`, campanaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar campaña:', error);
      throw error;
    }
  },

  // Eliminar una campaña
  async deleteCampanaSalud(id) {
    try {
      await api.delete(`/campanas-salud/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar campaña:', error);
      throw error;
    }
  },

  // Cambiar estado de la campaña - CORREGIDO
  async updateEstadoCampanaSalud(id, nuevoEstado) {
    try {
      // nuevoEstado puede venir como booleano o como string
      const estadoBooleano = typeof nuevoEstado === 'boolean' 
        ? nuevoEstado 
        : nuevoEstado === 'activo';
        
      const payload = {
        estado: estadoBooleano
      };
      const response = await api.put(`/campanas-salud/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado de campaña:', error);
      throw error;
    }
  },

  // Funciones de utilidad (estas sí pueden usar strings para la UI)
  getEstadoTexto(estado) {
    return estado ? 'Activa' : 'Inactiva';
  },

  getEstadoBadge(estado) {
    return estado ? 'success' : 'error';
  },

  getEstadoColor(estado) {
    return estado ? '#2e7d32' : '#d32f2f';
  }
};

// Exportaciones individuales
export const getAllCampanasSalud = () => CampanaSaludData.getAllCampanasSalud();
export const getCampanaSaludById = (id) => CampanaSaludData.getCampanaSaludById(id);
export const createCampanaSalud = (data) => CampanaSaludData.createCampanaSalud(data);
export const updateCampanaSalud = (id, data) => CampanaSaludData.updateCampanaSalud(id, data);
export const deleteCampanaSalud = (id) => CampanaSaludData.deleteCampanaSalud(id);
export const updateEstadoCampanaSalud = (id, nuevoEstado) => CampanaSaludData.updateEstadoCampanaSalud(id, nuevoEstado);