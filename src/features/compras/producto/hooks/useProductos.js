// src/features/compras/pages/producto/hooks/useProductos.js
// CAMBIOS APLICADOS:
// 1. Se separa searchInput (valor del input, inmediato) de debouncedSearch (dispara la query, 400ms después)
// 2. Se elimina el console.log de producción
// 3. Todo lo demás queda IDÉNTICO al original

import { useState, useCallback, useEffect } from "react";
import { useProductosQuery } from "../queries/useProductosQuery";
import { useProductoMutations } from "../mutations/useProductoMutations";
import { productoKeys } from "../queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useActionBlocker } from "@shared/index";
import { useDebounce } from "@shared/hooks/useDebounce"; // ← NUEVO: ajusta la ruta según tu alias @shared

const ESTADO_ACTIVA = "activa";
const ESTADO_INACTIVA = "inactiva";

export const useProductos = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  // ─── CAMBIO PRINCIPAL: dos estados separados para el buscador ───
  // searchInput: lo que el usuario escribe (se actualiza en cada tecla, controla el input)
  // debouncedSearch: lo que se envía a la query (se actualiza 400ms después de que el usuario para de escribir)
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  // ────────────────────────────────────────────────────────────────

  const [filterEstado, setFilterEstado] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

  // Cuando el debounce dispara un nuevo valor, se resetea la página a 1
  // Esto reemplaza el setPage(1) que antes estaba dentro de handleSetSearch
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const filters = {
    search: debouncedSearch,           // ← usa el valor debounced, NO el del input
    categoria_id: filterCategoria || undefined,
    marca_id: filterMarca || undefined,
    estado: filterEstado || undefined,
  };

  const { data, isLoading, error } = useProductosQuery(page, perPage, filters);

  const productos = (data?.items || []).map((p) => ({
    ...p,
    precioVenta: p.precio_venta,
    stockActual: p.stock,
    estado: p.estado === true ? "activa" : "inactiva",
  }));

  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;
  const totalCount = data?.totalCount || 0;
  const hasNext = data?.hasNext || false;
  const hasPrev = data?.hasPrev || false;

  const { deleteProducto, updateEstado } = useProductoMutations();
  const { execute: executeDelete, isProcessing: getIsDeleting } = useActionBlocker();

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // ─── CAMBIO: setSearch ahora solo actualiza el input local (sin setPage, lo hace el useEffect) ───
  const handleSetSearch = useCallback((value) => {
    setSearchInput(value);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────────────────────────────

  const handleSetFilterEstado = useCallback((value) => {
    setFilterEstado(value);
    setPage(1);
  }, []);

  const handleSetFilterMarca = useCallback((value) => {
    setFilterMarca(value);
    setPage(1);
  }, []);

  const handleSetFilterCategoria = useCallback((value) => {
    setFilterCategoria(value);
    setPage(1);
  }, []);

  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = useCallback(() => {
    executeDelete(async () => {
      try {
        await deleteProducto.mutateAsync(modalDelete.id);
        showNotification(
          `Producto "${modalDelete.nombre}" eliminado correctamente`,
          "success"
        );
        setModalDelete({ open: false, id: null, nombre: "" });
      } catch (err) {
        let errorMessage = `Error al eliminar el producto "${modalDelete.nombre}"`;

        if (err.message?.includes("asociado")) {
          errorMessage = err.message;
        } else if (err.response?.status === 400) {
          errorMessage = `El producto "${modalDelete.nombre}" está siendo usado en otras operaciones`;
        } else if (err.response?.status === 404) {
          errorMessage = `El producto "${modalDelete.nombre}" ya no existe`;
        } else if (err.request) {
          errorMessage = "No se pudo conectar con el servidor";
        }

        showNotification(errorMessage, "error");
        setModalDelete({ open: false, id: null, nombre: "" });
      }
    });
  }, [executeDelete, deleteProducto, modalDelete.id, modalDelete.nombre, showNotification]);

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  const cambiarEstado = async (row) => {
    const estadoAnterior = row.estado;
    const nuevoEstadoUI =
      estadoAnterior === ESTADO_ACTIVA ? ESTADO_INACTIVA : ESTADO_ACTIVA;
    const accion =
      estadoAnterior === ESTADO_ACTIVA ? "desactivado" : "activado";

    const previousData = queryClient.getQueryData(productoKeys.all);

    queryClient.setQueryData(productoKeys.all, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        productos: oldData.productos.map((p) =>
          p.id === row.id
            ? { ...p, estado: nuevoEstadoUI === ESTADO_ACTIVA }
            : p
        ),
      };
    });

    try {
      await updateEstado.mutateAsync({
        id: row.id,
        estado: nuevoEstadoUI === ESTADO_ACTIVA,
      });
      showNotification(
        `Producto "${row.nombre}" ${accion} correctamente`,
        "success"
      );
    } catch (err) {
      queryClient.setQueryData(productoKeys.all, previousData);
      showNotification(
        `Error al cambiar el estado para el producto "${row.nombre}"`,
        "error"
      );
    }
  };

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: ESTADO_ACTIVA, label: "Activos" },
    { value: ESTADO_INACTIVA, label: "Inactivos" },
  ];

  // ─── CAMBIO: showEmptyState usa searchInput (lo que el usuario ve) ───
  const showEmptyState =
    productos.length === 0 &&
    !searchInput &&
    !filterEstado &&
    !filterMarca &&
    !filterCategoria &&
    !isLoading;

  return {
    productos,
    loading: isLoading,
    error,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrev,
    // ─── CAMBIO: se expone searchInput como "search" para que el input lo muestre ───
    search: searchInput,
    setSearch: handleSetSearch,
    // ────────────────────────────────────────────────────────────────────────────────
    filterEstado,
    setFilterEstado: handleSetFilterEstado,
    filterMarca,
    setFilterMarca: handleSetFilterMarca,
    filterCategoria,
    setFilterCategoria: handleSetFilterCategoria,
    estadoFilters,
    cambiarEstado,
    showEmptyState,
    notification,
    hideNotification,
    showNotification,
    modalDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete,
    isDeleting: getIsDeleting,
  };
};