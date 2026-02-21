import api from "../axios";

// ============================
// EXPORTACIONES INDIVIDUALES (para productos y código viejo)
// ============================
export async function getAllCategorias() {
  try {
    const response = await api.get('/categorias');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
}

export async function getCategoriaById(id) {
  try {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    throw error;
  }
}

export async function createCategoria(data) {
  try {
    const response = await api.post('/categorias', {
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      estado: true
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
}

export async function checkCategoriaExists(nombre) {
  try {
    const response = await api.get('/categorias');
    const categorias = response.data;
    const nombreTrimmed = nombre.trim().toLowerCase();
    return categorias.some(categoria => 
      categoria.nombre.toLowerCase().trim() === nombreTrimmed
    );
  } catch (error) {
    console.error('Error al verificar categoría:', error);
    throw error;
  }
}

export async function updateCategoria(id, data) {
  try {
    const response = await api.put(`/categorias/${id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      estado: data.estado
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
}

export async function deleteCategoria(id) {
  try {
    await api.delete(`/categorias/${id}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
}

export async function hasCategoriaProductosAsociados(id) {
  try {
    const response = await api.get('/productos');
    const productos = response.data;
    return productos.some(producto => producto.categoria_id === parseInt(id));
  } catch (error) {
    console.error('Error al verificar productos asociados:', error);
    throw error;
  }
}

export async function toggleCategoriaEstado(id, estadoActual) {
  try {
    const response = await api.put(`/categorias/${id}`, {
      estado: !estadoActual
    });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error);
    throw error;
  }
}

// ============================
// OBJETO AGRUPADO (para la nueva estructura con modal)
// ============================
export const CategoriaData = {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  checkCategoriaExists,
  updateCategoria,
  deleteCategoria,
  hasCategoriaProductosAsociados,
  toggleCategoriaEstado,
  
  // Funciones de utilidad
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