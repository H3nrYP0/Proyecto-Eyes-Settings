import api from "../axios";

export const ProductoData = {
  // Obtener todos los productos
  async getAllProductos() {
    try {
      const response = await api.get('/productos', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`);
        

      const producto = response.data;
      
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
        estado: producto.estado ? 'activo' : 'inactivo'
      };
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProducto(data) {
    try {
      const productoData = {
        nombre: data.nombre,
        codigo: data.codigo || '',
        descripcion: data.descripcion || '',
        precio_venta: data.precioVenta,
        precio_compra: data.precioCompra,
        stock: data.stockActual,
        stock_minimo: data.stockMinimo,
        categoria_producto_id: parseInt(data.categoria, 10),
        marca_id: parseInt(data.marca, 10),
        estado: true
      };

      const response = await api.post('/productos', productoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProducto(id, data) {
    try {
      const productoData = {
        nombre: data.nombre,
        codigo: data.codigo || '',
        descripcion: data.descripcion || '',
        precio_venta: data.precioVenta,
        precio_compra: data.precioCompra,
        stock: data.stockActual,
        stock_minimo: data.stockMinimo,
        categoria_producto_id: parseInt(data.categoria, 10),
        marca_id: parseInt(data.marca, 10),
        estado: data.estado === 'activo'
      };

      const response = await api.put(`/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProducto(id) {
    try {
      await api.delete(`/productos/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },
// ============================
// Cambiar estado del producto
// ============================
async updateEstadoProducto(id, nuevoEstado) {
  const payload = {
    estado: nuevoEstado === "activo" 
  };

  const res = await api.put(`/productos/${id}`, payload);
  return res.data;
},
  // Verificar si ya existe un producto con ese nombre
  async checkProductoExists(nombre, excludeId = null) {
    try {
      const response = await api.get('/productos');
      const productos = response.data;
      const nombreTrimmed = nombre.trim().toLowerCase();
      
      return productos.some(producto => 
        producto.nombre?.toLowerCase().trim() === nombreTrimmed &&
        (excludeId ? producto.id !== excludeId : true)
      );
    } catch (error) {
      console.error('Error al verificar producto:', error);
      return false;
    }
  },

  // Funciones de utilidad
  getEstadoTexto(estado) {
    const estados = {
      activo: 'Activo',
      inactivo: 'Inactivo',
      'bajo-stock': 'Bajo Stock'
    };
    return estados[estado] || estado;
  },

  getEstadoBadge(estado) {
    const badges = {
      activo: 'success',
      inactivo: 'error',
      'bajo-stock': 'warning'
    };
    return badges[estado] || 'default';
  },

  getEstadoColor(estado) {
    const colores = {
      activo: '#2e7d32',
      inactivo: '#d32f2f',
      'bajo-stock': '#ed6c02'
    };
    return colores[estado] || '#1976d2';
  }
};

// Exportaciones individuales
export const getAllProductos = () => ProductoData.getAllProductos();
export const getProductoById = (id) => ProductoData.getProductoById(id);
export const createProducto = (data) => ProductoData.createProducto(data);
export const updateProducto = (id, data) => ProductoData.updateProducto(id, data);
export const deleteProducto = (id) => ProductoData.deleteProducto(id);
export const updateEstadoProducto = (id, nuevoEstado) => ProductoData.updateEstadoProducto(id, nuevoEstado);
export const checkProductoExists = (nombre, excludeId) => ProductoData.checkProductoExists(nombre, excludeId);