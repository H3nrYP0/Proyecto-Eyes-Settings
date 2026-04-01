// src/features/compras/pages/producto/services/productosService.js
import api from "../../../../lib/axios";

export const ProductoData = {
  async getAllProductos() {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProductoById(id) {
    try {
      const response = await api.get(`/productos/${id}`);
      const producto = response.data;
      
      let imagenes = [];
      try {
        const imagenesResponse = await api.get(`/imagenes/producto/${id}`);
        if (imagenesResponse.data && Array.isArray(imagenesResponse.data.imagenes)) {
          imagenes = imagenesResponse.data.imagenes;
        } else if (Array.isArray(imagenesResponse.data)) {
          imagenes = imagenesResponse.data;
        }
      } catch (error) {
        // No hay imágenes
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
      throw error;
    }
  },

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
          api.post('/imagenes', {
            url: img.url,
            producto_id: nuevoProducto.id
          })
        );
        await Promise.all(imagenesPromises);
      }

      return nuevoProducto;
    } catch (error) {
      throw error;
    }
  },

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
     
      if (data.nuevasImagenes && data.nuevasImagenes.length > 0) {
        const imagenesPromises = data.nuevasImagenes.map(img => 
          api.post('/imagenes', {
            url: img.url,
            producto_id: id
          })
        );
        await Promise.all(imagenesPromises);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProducto(id) {
    try {
      await api.delete(`/productos/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async deleteImagen(id) {
    try {
      await api.delete(`/imagenes/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async hasProductoVentasAsociadas(id) {
    try {
      const response = await api.get('/detalle-venta');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      return false;
    }
  },

  async hasProductoComprasAsociadas(id) {
    try {
      const response = await api.get('/detalle-compra');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      return false;
    }
  },

  async hasProductoPedidosAsociados(id) {
    try {
      const response = await api.get('/detalle-pedido');
      const detalles = response.data;
      return detalles.some(detalle => detalle.producto_id === parseInt(id));
    } catch (error) {
      return false;
    }
  },

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
      return { tieneAsociaciones: false, detalles: { ventas: false, compras: false, pedidos: false } };
    }
  },

  async updateEstadoProducto(id, nuevoEstado) {
    const payload = {
      estado: nuevoEstado  
    };
    
    const res = await api.put(`/productos/${id}`, payload);
    return res.data;
  },

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
      return false;
    }
  }
};

export const getAllProductos = () => ProductoData.getAllProductos();
export const getProductoById = (id) => ProductoData.getProductoById(id);
export const createProducto = (data) => ProductoData.createProducto(data);
export const updateProducto = (id, data) => ProductoData.updateProducto(id, data);
export const deleteProducto = (id) => ProductoData.deleteProducto(id);
export const deleteImagen = (id) => ProductoData.deleteImagen(id);
export const updateEstadoProducto = (id, nuevoEstado) => ProductoData.updateEstadoProducto(id, nuevoEstado);
export const checkProductoExists = (nombre, excludeId) => ProductoData.checkProductoExists(nombre, excludeId);