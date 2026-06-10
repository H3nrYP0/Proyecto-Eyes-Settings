import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompras, deleteCompra, anularCompra } from "../services/comprasService";
import { formatCurrency, formatDate } from "../utils/comprasUtils";

// Normaliza cualquier valor de estado_compra que pueda venir del backend:
//   true / 1 / "true" / "1" / "completada" → "completada"
//   false / 0 / "false" / "0" / "anulada"  → "anulada"
//   null / undefined                         → "anulada"  (fallback seguro)
function normalizarEstado(estado_compra) {
  if (
    estado_compra === true  ||
    estado_compra === 1     ||
    estado_compra === "true"  ||
    estado_compra === "1"     ||
    (typeof estado_compra === "string" &&
      estado_compra.toLowerCase() === "completada")
  ) return "completada";
  return "anulada";
}

export function useCompras() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [page, setPage] = useState(1);

  const cargarCompras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCompras();

      const normalizadas = (Array.isArray(data) ? data : []).map((c) => ({
        id:              c.id,
        proveedorNombre: c.proveedor_nombre || c.proveedorNombre || "—",
        fechaFormateada: formatDate(c.fecha),
        totalFormateado: formatCurrency(c.total),
        total:           c.total,
        numeroCompra:    c.numeroCompra || c.numero_compra || `C-${c.id}`,
        observaciones:   c.observaciones || "",
        // Usa el normalizador canónico — siempre "completada" | "anulada"
        estado:          normalizarEstado(c.estado_compra ?? c.estado),
      }));

      setCompras(normalizadas);
    } catch (err) {
      console.error("Error cargando compras:", err);
      setError("No se pudieron cargar las compras");
      setCompras([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarCompra = useCallback(async (id) => {
    try {
      await deleteCompra(id);
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      return { success: true };
    } catch (e) {
      const msg = e.response?.data?.error || e.message || "Error al eliminar la compra";
      return { success: false, error: msg };
    }
  }, [queryClient]);

  const confirmarAnular = useCallback(async () => {
    if (!modalAnular.row) return;
    try {
      await anularCompra(modalAnular.row.id);
      setModalAnular({ open: false, row: null });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      return { success: true };
    } catch (e) {
      const msg = e.response?.data?.error || e.message || "Error al anular la compra";
      setModalAnular({ open: false, row: null });
      return { success: false, error: msg };
    }
  }, [modalAnular.row, queryClient]);

  const abrirModalAnular = useCallback((row) => {
    if (row.estado !== "completada") return;
    setModalAnular({ open: true, row });
  }, []);

  const cerrarModalAnular = useCallback(() => {
    setModalAnular({ open: false, row: null });
  }, []);

  const comprasFiltradas = compras.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (c.proveedorNombre || "").toLowerCase().includes(term) ||
      (c.observaciones   || "").toLowerCase().includes(term) ||
      (c.numeroCompra    || "").toLowerCase().includes(term) ||
      String(c.total || 0).includes(term);

    const matchesFilter =
      !filterEstado || c.estado === filterEstado;

    return matchesSearch && matchesFilter;
  });

  const estadoFilters = [
    { value: "",           label: "Todos"       },
    { value: "completada", label: "Completadas" },
    { value: "anulada",    label: "Anuladas"    },
  ];

  const openDeleteModal = useCallback((id, numeroCompra) => {
    setModalDelete({ open: true, id, numeroCompra });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  }, []);

  // Convertir error a string para evitar "Objects are not valid as React child"
  const errorMessage = error?.message || (typeof error === 'string' ? error : null);

  return {
    compras,
    loading,
    error: errorMessage,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    page, setPage,
    pagination,
    eliminarCompra,
    modalAnular, abrirModalAnular, cerrarModalAnular, confirmarAnular,
    modalDelete, openDeleteModal, closeDeleteModal,
    recargar: () => queryClient.invalidateQueries({ queryKey: ["compras"] }),
  };
}