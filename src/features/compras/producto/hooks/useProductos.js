// src/features/compras/pages/producto/hooks/useProductos.js
import { useState, useMemo, useCallback } from "react";
import { useProductosQuery } from "../queries/useProductosQuery";
import { useProductoMutations } from "../mutations/useProductoMutations";
import { productoKeys } from "../queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useActionBlocker } from "@shared/index";

const ESTADO_ACTIVA = "activa";
const ESTADO_INACTIVA = "inactiva";

export const useProductos = () => {
  const queryClient = useQueryClient();
  
  // Query principal
  const { data, isLoading, error } = useProductosQuery();

  // Mutations
  const { deleteProducto, updateEstado } = useProductoMutations();

  const { execute: executeDelete, isProcessing: getIsDeleting } = useActionBlocker();
  // console.log("isDeleting inicial:", getIsDeleting);
  // Estados UI
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");

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

  // Helpers UI
  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Transformación de datos
  const productosTransformados = useMemo(() => {
    if (!data) return [];

    const { productos, marcas, categorias } = data;

    const ordenar = (arr) =>
      [...arr].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
      );

    return ordenar(
      productos.map((p) => {
        const marca = marcas.find((m) => m.id === p.marca_id);
        const categoria = categorias.find((c) => c.id === p.categoria_id);

        return {
          id: p.id,
          nombre: p.nombre,
          codigo: p.codigo || "",
          descripcion: p.descripcion || "",
          precioVenta: p.precio_venta,
          precioCompra: p.precio_compra,
          stockActual: p.stock,
          stockMinimo: p.stock_minimo,
          marca: marca?.nombre || "-",
          categoria: categoria?.nombre || "-",
          marca_id: p.marca_id,
          categoria_id: p.categoria_id,
          estado: p.estado ? ESTADO_ACTIVA : ESTADO_INACTIVA,
          imagenes: p.imagenes || [],
        };
      })
    );
  }, [data]);

  // Filtros
  const filteredProductos = useMemo(() => {
    return productosTransformados.filter((p) => {
      const normalize = (text) => text?.toLowerCase().replace(/[-_]/g, " ");

      const palabras = normalize(search).trim().split(/\s+/);

      const matchesSearch =
        !search ||
        palabras.every(
          (palabra) =>
            normalize(p.nombre)?.includes(palabra) ||
            normalize(p.codigo)?.includes(palabra) ||
            normalize(p.marca)?.includes(palabra) ||
            normalize(p.categoria)?.includes(palabra)
        );

      const matchesEstado = !filterEstado || p.estado === filterEstado;
      const matchesMarca = !filterMarca || p.marca_id?.toString() === filterMarca;
      const matchesCategoria =
        !filterCategoria || p.categoria_id?.toString() === filterCategoria;

      return matchesSearch && matchesEstado && matchesMarca && matchesCategoria;
    });
  }, [productosTransformados, search, filterEstado, filterMarca, filterCategoria]);

  // DELETE
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

  // ✅ NUEVO: Cambiar estado con React Query
  const cambiarEstado = async (row) => {
    const estadoAnterior = row.estado;
    const nuevoEstadoUI = estadoAnterior === ESTADO_ACTIVA ? ESTADO_INACTIVA : ESTADO_ACTIVA;
    const accion = estadoAnterior === ESTADO_ACTIVA ? "desactivado" : "activado";

    // Optimistic update para feedback inmediato
    const previousData = queryClient.getQueryData(productoKeys.all);
    
    // Actualizar optimistamente la caché
    queryClient.setQueryData(productoKeys.all, (oldData) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        productos: oldData.productos.map((p) =>
          p.id === row.id ? { ...p, estado: nuevoEstadoUI === ESTADO_ACTIVA } : p
        ),
      };
    });

    try {
      await updateEstado.mutateAsync({
        id: row.id,
        estado: nuevoEstadoUI === ESTADO_ACTIVA,
      });
      showNotification(`Producto "${row.nombre}" ${accion} correctamente`, "success");
    } catch (err) {
      // Revertir la caché en caso de error
      queryClient.setQueryData(productoKeys.all, previousData);
      showNotification(
        `Error al cambiar el estado para el producto "${row.nombre}"`,
        "error"
      );
    }
  };

  // Filters UI
  const marcaFilters = useMemo(() => {
    if (!data) return [];
    return [
      { value: "", label: "Todas las marcas" },
      ...data.marcas.map((m) => ({
        value: m.id.toString(),
        label: m.nombre,
      })),
    ];
  }, [data]);

  const categoriaFilters = useMemo(() => {
    if (!data) return [];
    return [
      { value: "", label: "Todas las categorías" },
      ...data.categorias.map((c) => ({
        value: c.id.toString(),
        label: c.nombre,
      })),
    ];
  }, [data]);

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: ESTADO_ACTIVA, label: "Activos" },
    { value: ESTADO_INACTIVA, label: "Inactivos" },
  ];

  const showEmptyState =
    filteredProductos.length === 0 &&
    !search &&
    !filterEstado &&
    !filterMarca &&
    !filterCategoria &&
    !isLoading;

  return {
    productos: filteredProductos,
    loading: isLoading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    filterMarca,
    setFilterMarca,
    filterCategoria,
    setFilterCategoria,
    marcaFilters,
    categoriaFilters,
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