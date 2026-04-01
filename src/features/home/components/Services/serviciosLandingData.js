// serviciosLandingData.js
// Servicio de datos de servicios para el Landing Page
// Sigue exactamente el mismo patrón que productosData.js
import api from "../../../../lib/axios";

export const ServicioLandingData = {
  // Obtener todos los servicios activos para la landing
  async getAllServicios() {
    try {
      const response = await api.get('/servicios');
      const servicios = response.data;

      return servicios.map((servicio) => ({
        id: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        duracion: servicio.duracion_min,
        precio: servicio.precio,
        estado: servicio.estado ? 'activo' : 'inactivo',
      }));
    } catch (error) {
      console.error('Error al obtener servicios para landing:', error);
      throw error;
    }
  },

  // Obtener servicios activos únicamente
  async getServiciosActivos() {
    try {
      const servicios = await this.getAllServicios();
      return servicios.filter(s => s.estado === 'activo');
    } catch (error) {
      console.error('Error al obtener servicios activos:', error);
      throw error;
    }
  },
};

export const getAllServiciosLanding = () => ServicioLandingData.getAllServicios();
export const getServiciosActivos = () => ServicioLandingData.getServiciosActivos();