import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCompras, deleteCompra, anularCompra } from "../services/comprasService";
import { formatCurrency, formatDate } from "../utils/comprasUtils";

// El backend devuelve estado_compra como STRING: "t", "true", "f", "false"
// Nunca como booleano real. Esta función lo normaliza correctamente.
function esAnulada(valor) {
  if (valor === null || valor === undefined) return false;
  const v = String(valor).toLowerCase().trim();
  return v === "f" || v === "false";
}

function normalizarCompra(c) {
  return {
    id:              c.id,
    proveedorNombre: c.proveedor_nombre || c.proveedorNombre || "—",
    fechaFormateada: formatDate(c.fecha),
    totalFormateado: formatCurrency(c.total),
    total:           c.total,
    numeroCompra:    c.numeroCompra || `C-${c.id}`,
    observaciones:   c.observaciones || "",
    estado:          esAnulada(c.estado_compra) ? null : "completada",
  };
}

export function useCompras() {
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [modalDelete,  setModalDelete]  = useState({ open: false, id: null, numeroCompra: "" });
  const [modalAnular,  setModalAnular]  = useState({ open: false, row: null });

  const rowAnularRef = useRef(null);

  const openDeleteModal = useCallback((id, numeroCompra) => {
    setModalDelete({ open: true, id, numeroCompra });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  }, []);

  const abrirModalAnular = useCallback((row) => {
    if (row.estado !== "completada") return;
    rowAnularRef.current = row;
    setModalAnular({ open: true, row });
  }, []);

  const cerrarModalAnular = useCallback(() => {
    rowAnularRef.current = null;
    setModalAnular({ open: false, row: null });
  }, []);

  const {
    data: comprasRaw = [],
    isLoading: loading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ["compras"],
    queryFn: getAllCompras,
    select: (data) => (Array.isArray(data) ? data : []).map(normalizarCompra),
  });

  const error = isError
    ? queryError?.message || "No se pudieron cargar las compras"
    : null;

  const eliminarMutation = useMutation({
    mutationFn: (id) => deleteCompra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      closeDeleteModal();
    },
  });

  const eliminarCompra = useCallback(async (id) => {
    try {
      await eliminarMutation.mutateAsync(id);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || "Error al eliminar la compra" };
    }
  }, [eliminarMutation]);

  const anularMutation = useMutation({
    mutationFn: (id) => anularCompra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      rowAnularRef.current = null;
      setModalAnular({ open: false, row: null });
    },
    onError: () => {
      rowAnularRef.current = null;
      setModalAnular({ open: false, row: null });
    },
  });

  const confirmarAnular = async () => {
    const row = rowAnularRef.current;
    if (!row) return;
    try {
      await anularMutation.mutateAsync(row.id);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || "Error al anular la compra" };
    }
  };

  const comprasFiltradas = comprasRaw.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (c.proveedorNombre || "").toLowerCase().includes(term) ||
      (c.observaciones   || "").toLowerCase().includes(term) ||
      (c.numeroCompra    || "").toLowerCase().includes(term) ||
      String(c.total || 0).includes(term);

    const matchesFilter =
      !filterEstado ||
      (filterEstado === "completada"
        ? c.estado === "completada"
        : c.estado === null);

    return matchesSearch && matchesFilter;
  });

  const estadoFilters = [
    { value: "",           label: "Todos"       },
    { value: "completada", label: "Completadas" },
    { value: "anulada",    label: "Anuladas"    },
  ];

  const recargar = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["compras"] });
  }, [queryClient]);

  return {
    compras: comprasFiltradas,
    loading,
    error,
    search,       setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    eliminarCompra,
    modalAnular,  abrirModalAnular, cerrarModalAnular, confirmarAnular,
    recargar,
    modalDelete,  openDeleteModal,  closeDeleteModal,
  };
}