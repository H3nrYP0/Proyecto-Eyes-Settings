// productosLandingData.js
// Servicio de datos de productos para el Landing Page
import api from "../../../../lib/axios";

export const ProductoLandingData = {
  // Obtener todos los productos activos para la landing
  async getAllProductos() {
    try {
      const response = await api.get('/productos');
      const productos = response.data;

      const productosConImagenes = await Promise.all(
        productos.map(async (producto) => {
          let imagenes = [];
          try {
            const imagenesResponse = await api.get(`/imagen/producto/${producto.id}`);
            imagenes = imagenesResponse.data || [];
          } catch {
            // Sin imágenes
          }

          return {
            id: producto.id,
            nombre: producto.nombre,
            codigo: producto.codigo || '',
            descripcion: producto.descripcion || '',
            precioVenta: producto.precio_venta,
            precioCompra: producto.precio_compra,
            stockActual: producto.stock,
            stockMinimo: producto.stock_minimo,
            categoria: producto.categoria_id?.toString(),
            marca: producto.marca_id?.toString(),
            estado: producto.estado ? 'activo' : 'inactivo',
            imagenes: imagenes,
            imagenPrincipal: imagenes.length > 0 ? imagenes[0].url : null,
          };
        })
      );

      return productosConImagenes.filter(p => p.estado === 'activo');
    } catch (error) {
      console.error('Error al obtener productos para landing:', error);
      throw error;
    }
  },

  // Obtener un producto por ID — para cargar la descripción completa al voltear la tarjeta
  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`);
      const producto = response.data;

      let imagenes = [];
      try {
        const imagenesResponse = await api.get(`/imagen/producto/${id}`);
        imagenes = imagenesResponse.data || [];
      } catch {
        // Sin imágenes
      }

      return {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precioVenta: producto.precio_venta,
        stockActual: producto.stock,
        categoria: producto.categoria_id?.toString(),
        estado: producto.estado ? 'activo' : 'inactivo',
        imagenes: imagenes,
      };
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  },

  async getProductosDestacados(limit = 6) {
    try {
      const productos = await this.getAllProductos();
      return productos
        .filter(p => p.stockActual > 0)
        .slice(0, limit);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      throw error;
    }
  },
};

export const getAllProductosLanding  = () => ProductoLandingData.getAllProductos();
export const getProductoById         = (id) => ProductoLandingData.getProductoById(id);
export const getProductosDestacados  = (limit) => ProductoLandingData.getProductosDestacados(limit);