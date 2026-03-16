import api from "../axios";

export const ProductoData = {
  async getAllProductos() {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`);
      const producto = response.data;
      
      let imagenes = [];
      try {
        const imagenesResponse = await api.get(`/imagen/producto/${id}`);
        imagenes = imagenesResponse.data || [];
      } catch (error) {
        // No hay imágenes, continuamos con array vacío
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
        imagenes: imagenes
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
        categoria_id: parseInt(data.categoria, 10),
        marca_id: parseInt(data.marca, 10),
        estado: true
      };

      const response = await api.post('/productos', productoData);
      const nuevoProducto = response.data.producto;

      if (data.imagenes && data.imagenes.length > 0) {
        const imagenesPromises = data.imagenes.map(img => 
          api.post('/imagen', {
            url: img.url,
            producto_id: nuevoProducto.id
          })
        );
        
        await Promise.all(imagenesPromises);
      }

      return nuevoProducto;
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
        precio_venta: Number(data.precioVenta) || 0,
        precio_compra: Number(data.precioCompra) || 0,
        stock: Number(data.stockActual) || 0,
        stock_minimo: Number(data.stockMinimo) || 0,
        categoria_id: parseInt(data.categoria, 10),
        marca_id: parseInt(data.marca, 10),
         estado: data.estado === true || data.estado === 'activo' 
      };
      const response = await api.put(`/productos/${id}`, productoData);
     
      if (data.imagenes && data.imagenes.length > 0) {
        const imagenesPromises = data.imagenes.map(img => 
          api.post('/imagen', {
            url: img.url,
            producto_id: id
          })
        );
        await Promise.all(imagenesPromises);
      }
      
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
  // Verificar si el producto tiene ventas asociadas
  // ============================
  async hasProductoVentasAsociadas(id) {
    try {
      const response = await api.get('/detalle-venta');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar ventas asociadas:', error);
      return false;
    }
  },

  // ============================
  // Verificar si el producto tiene compras asociadas
  // ============================
  async hasProductoComprasAsociadas(id) {
    try {
      const response = await api.get('/detalle-compra');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar compras asociadas:', error);
      return false;
    }
  },

  // ============================
  // Verificar si el producto tiene pedidos asociados
  // ============================
  async hasProductoPedidosAsociados(id) {
    try {
      const response = await api.get('/detalle-pedido');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      console.error('Error al verificar pedidos asociados:', error);
      return false;
    }
  },

  // ============================
  // Verificación completa (ventas O compras O pedidos)
  // ============================
  async hasProductoAsociaciones(id) {
    try {
      const [tieneVentas, tieneCompras, tienePedidos] = await Promise.all([
        this.hasProductoVentasAsociadas(id).catch(() => false),
        this.hasProductoComprasAsociadas(id).catch(() => false),
        this.hasProductoPedidosAsociados(id).catch(() => false)
      ]);
      
      return {
        tieneAsociaciones: tieneVentas || tieneCompras || tienePedidos,
        detalles: {
          ventas: tieneVentas,
          compras: tieneCompras,
          pedidos: tienePedidos
        }
      };
    } catch (error) {
      console.error('Error al verificar asociaciones del producto:', error);
      return { tieneAsociaciones: false, detalles: { ventas: false, compras: false, pedidos: false } };
    }
  },

  // ============================
  // Cambiar estado del producto
  // ============================
  async updateEstadoProducto(id, nuevoEstado) {
    const payload = {
      estado: nuevoEstado  
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