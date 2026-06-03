import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategorias,
  deleteCategoria,
  toggleCategoriaEstado,
  hasCategoriaProductosAsociados,
} from "../services/categoriasService";

export function useCategorias() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
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

  const {
    data: categoriasRaw = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getAllCategorias,
    staleTime: 1000 * 60,
    retry: 1,
  });

  const categorias = useMemo(
    () =>
      (Array.isArray(categoriasRaw) ? categoriasRaw : []).map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
        estado: categoria.estado ? "activa" : "inactiva",
      })),
    [categoriasRaw]
  );

  const loading = isLoading;
  const error = isError ? "No se pudieron cargar las categorías" : null;

  const loadCategorias = useCallback(
    () => queryClient.invalidateQueries(["categorias"]),
    [queryClient]
  );

  const eliminarCategoria = useCallback(
    async (id, nombre) => {
      if (!id) return { success: false, error: "ID de categoría inválido" };
      try {
        const hasProductos = await hasCategoriaProductosAsociados(id);
        if (hasProductos) {
          return {
            success: false,
            error: "No se puede eliminar la categoría porque tiene productos asociados",
          };
        }

        await deleteCategoria(id);
        await loadCategorias();
        return { success: true };
      } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: "Error al eliminar la categoría" };
      }
    },
    [loadCategorias]
  );

  const cambiarEstado = useCallback(
    async (id, estadoActual) => {
      if (!id) return { success: false, error: "ID de categoría inválido" };
      try {
        const estadoActualBoolean = estadoActual === "activa";
        await toggleCategoriaEstado(id, estadoActualBoolean);
        await loadCategorias();
        return { success: true };
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        return { success: false, error: "Error al cambiar el estado" };
      }
    },
    [loadCategorias]
  );

  const categoriasFiltradas = categorias.filter((categoria) => {
    const matchesSearch =
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter = !filterEstado || categoria.estado === filterEstado;

    return matchesSearch && matchesFilter;
  });

  const openCreateModal = useCallback(() => {
    setModalForm({
      open: true,
      mode: "create",
      title: "Crear Nueva Categoría",
      initialData: null,
    });
  }, []);

  const openEditModal = useCallback((item) => {
    if (!item || !item.id) return;
    setModalForm({
      open: true,
      mode: "edit",
      title: `Editar Categoría: ${item.nombre}`,
      initialData: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: item.estado === "activa",
      },
    });
  }, []);

  const openViewModal = useCallback((item) => {
    if (!item || !item.id) return;
    setModalForm({
      open: true,
      mode: "view",
      title: `Detalle de Categoría: ${item.nombre}`,
      initialData: {
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: item.estado === "activa",
      },
    });
  }, []);

  const closeFormModal = useCallback(() => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
  }, []);

  const openDeleteModal = useCallback((id, nombre) => {
    if (!id) return;
    setModalDelete({ open: true, id, nombre });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
  }, []);

  return {
    categorias: categoriasFiltradas,
    categoriasRaw: categorias,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    loadCategorias,
    eliminarCategoria,
    cambiarEstado,
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
