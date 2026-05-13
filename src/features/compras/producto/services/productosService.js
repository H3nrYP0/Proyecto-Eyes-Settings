// src/features/compras/pages/producto/services/productosService.js
import api from "@lib/axios";

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
    const response = await api.get(`/productos/lista-completa/${id}`);
    const producto = response.data;
    
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precioVenta: producto.precio_venta,
      precioCompra: producto.precio_compra,
      stockActual: producto.stock,
      stockMinimo: producto.stock_minimo,
      categoria: producto.categoria_id?.toString(),
      categoriaNombre: producto.categoria_nombre || 'Categoría no disponible',
      marca: producto.marca_id?.toString(),
      marcaNombre: producto.marca_nombre || 'Marca no disponible',
      estado: producto.estado ? 'activo' : 'inactivo',
      imagenes: producto.imagenes || []
    };
  } catch (error) {
    throw error;
  }
},

async createProducto(data) {
    try {
      // Validar que los IDs sean números enteros
      const categoria_id = data.categoria ? parseInt(data.categoria, 10) : null;
      const marca_id = data.marca ? parseInt(data.marca, 10) : null;

      if (!categoria_id || isNaN(categoria_id)) {
        throw new Error('Debe seleccionar una categoría válida');
      }
      if (!marca_id || isNaN(marca_id)) {
        throw new Error('Debe seleccionar una marca válida');
      }

      const productoData = {
        nombre: data.nombre,
        codigo: data.codigo || '',
        descripcion: data.descripcion || '',
        precio_venta: Number(data.precioVenta) || 0,
        precio_compra: Number(data.precioCompra) || 0,
        stock: Number(data.stockActual) || 0,
        stock_minimo: Number(data.stockMinimo) || 0,
        categoria_id: categoria_id,
        marca_id: marca_id,
        estado: data.estado !== undefined ? data.estado : true
      };

      const response = await api.post('/productos', productoData);
      const nuevoProducto = response.data.producto;

      if (data.nuevasImagenes && data.nuevasImagenes.length > 0) {
        const imagenesPromises = data.nuevasImagenes.map(img =>
          api.post('/imagenes', {
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

  async updateProducto(id, data) {
    if (!id) {
      throw new Error('ID de producto no proporcionado');
    }
    try {
      const productoData = {
        // nombre: data.nombre,
        // descripcion: data.descripcion || '',
        // precio_venta: Number(data.precioVenta) || 0,
        // precio_compra: Number(data.precioCompra) || 0,
        // stock: Number(data.stockActual) || 0,
        // stock_minimo: Number(data.stockMinimo) || 0,
        // estado: data.estado === true || data.estado === 'activo'
      };
      if (data.nombre !== undefined) productoData.nombre = data.nombre;
      if (data.descripcion !== undefined) productoData.descripcion = data.descripcion;
      if (data.stockMinimo !== undefined) productoData.stock_minimo = Number(data.stockMinimo);
       if (data.estado !== undefined) productoData.estado = data.estado === true || data.estado === 'activo';
      if (data.categoria !== undefined && data.categoria !== null && data.categoria !== '') {
        productoData.categoria_id = parseInt(data.categoria, 10);
      }
      if (data.marca !== undefined && data.marca !== null && data.marca !== '') {
        productoData.marca_id = parseInt(data.marca, 10);
      }

      const response = await api.put(`/productos/${id}`, productoData);

      if (data.nuevasImagenes && data.nuevasImagenes.length > 0) {
        for (const img of data.nuevasImagenes) {
          try {
            await api.post('/imagenes', {
              url: img.url,
              producto_id: id
            });
          } catch (error) {
            // Error silencioso, se continua con el siguiente
          }
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
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
    const response = await api.get(`/productos/${id}/asociaciones`);
    return {
      tieneAsociaciones: response.data.tiene_asociaciones,
      detalles: {
        ventas: response.data.tiene_ventas,
        compras: response.data.tiene_compras,
        pedidos: response.data.tiene_pedidos
      }
    };
  } catch (error) {
    return { tieneAsociaciones: false, detalles: { ventas: false, compras: false, pedidos: false } };
  }
},

  async updateEstadoProducto(id, nuevoEstado) {
    if (!id) {
      throw new Error('ID de producto no proporcionado');
    }
    try {
      const res = await api.put(`/productos/${id}`, {
        estado: nuevoEstado === true || nuevoEstado === 'activo'
      });
      return res.data;
    } catch (error) {
      console.error('Error al cambiar estado de producto:', error);
      throw error;
    }
  },

  async checkProductoExists(nombre, excludeId = null) {
    if (!nombre || nombre.trim().length < 3) return false;
    const params = new URLSearchParams({
      nombre: nombre.trim()
    });
    if (excludeId) params.append('exclude_id', excludeId);
    
    const response = await api.get(`/productos/verificar-existencia?${params}`);
    return response.data.exists;
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