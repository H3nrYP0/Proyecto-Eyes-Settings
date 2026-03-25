import { useState, useEffect, useCallback } from "react";
import {
  getAllCategorias,
  deleteCategoria,
  toggleCategoriaEstado,
  hasCategoriaProductosAsociados,
} from "../services/categoriasService";

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create",
    title: "",
    initialData: null,
  });
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // ============================
  // Cargar categorías
  // ============================
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategorias();
      
      const categoriasTransformadas = data.map(categoria => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        estado: categoria.estado ? 'activa' : 'inactiva'
      }));
      
      setCategorias(categoriasTransformadas);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Eliminar categoría con verificación
  // ============================
  const eliminarCategoria = useCallback(async (id, nombre) => {
    try {
      // Verificar si tiene productos asociados
      const hasProductos = await hasCategoriaProductosAsociados(id);
      if (hasProductos) {
        return { 
          success: false, 
          error: "No se puede eliminar la categoría porque tiene productos asociados" 
        };
      }
      
      await deleteCategoria(id);
      await loadCategorias();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar la categoría" };
    }
  }, [loadCategorias]);

  // ============================
  // Cambiar estado
  // ============================
  const cambiarEstado = useCallback(async (id, estadoActual) => {
    try {
      const estadoActualBoolean = estadoActual === "activa";
      await toggleCategoriaEstado(id, estadoActualBoolean);
      await loadCategorias();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: "Error al cambiar el estado" };
    }
  }, [loadCategorias]);

  // ============================
  // Filtrar categorías
  // ============================
  const categoriasFiltradas = categorias.filter((categoria) => {
    const matchesSearch = 
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || categoria.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // ============================
  // Handlers de modales
  // ============================
  const openCreateModal = useCallback(() => {
    setModalForm({ 
      open: true, 
      mode: "create", 
      title: "Crear Nueva Categoría", 
      initialData: null 
    });
  }, []);

  const openEditModal = useCallback((item) => {
    setModalForm({ 
      open: true, 
      mode: "edit", 
      title: `Editar Categoría: ${item.nombre}`, 
      initialData: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: item.estado === 'activa'
      }
    });
  }, []);

  const openViewModal = useCallback((item) => {
    setModalForm({ 
      open: true, 
      mode: "view", 
      title: `Detalle de Categoría: ${item.nombre}`, 
      initialData: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: item.estado === 'activa'
      }
    });
  }, []);

  const closeFormModal = useCallback(() => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
  }, []);

  const openDeleteModal = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
  }, []);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  // ============================
  // Limpiador de aria-hidden
  // ============================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        const modalExists = document.querySelector('.MuiModal-root');
        if (!modalExists) {
          root.removeAttribute('aria-hidden');
          document.body.style.pointerEvents = 'auto';
        }
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [categorias]);

  return {
    // Datos
    categorias: categoriasFiltradas,
    categoriasRaw: categorias,
    loading,
    error,
    
    // Filtros
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    
    // Acciones CRUD
    loadCategorias,
    eliminarCategoria,
    cambiarEstado,
    
    // Modales
    modalForm,
    modalDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
  };
}