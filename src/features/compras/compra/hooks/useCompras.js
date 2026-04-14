import { useState, useEffect, useCallback } from "react";
import { getAllCompras, deleteCompra, anularCompra } from "../services/comprasService";
import { formatCurrency, formatDate, normalizeCompraForForm } from "../utils/comprasUtils";

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({ open: false, id: null, numeroCompra: "" });
  const [modalAnular, setModalAnular] = useState({ open: false, row: null });

  // ============================
  // Cargar compras
  // ============================
  const cargarCompras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCompras();

      const normalizadas = (Array.isArray(data) ? data : []).map((c) => ({
        ...c,
        ...normalizeCompraForForm(c),
        totalFormateado: formatCurrency(c.total),
        fechaFormateada: formatDate(c.fecha),
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

  // ============================
  // Eliminar compra
  // ============================
  const eliminarCompra = useCallback(
    async (id) => {
      try {
        await deleteCompra(id);
        await cargarCompras();
        return { success: true };
      } catch {
        return { success: false, error: "Error al eliminar la compra" };
      }
    },
    [cargarCompras]
  );

  // ============================
  // Anular compra (irreversible)
  // ============================
  const confirmarAnular = useCallback(
    async () => {
      if (!modalAnular.row) return;
      try {
        await anularCompra(modalAnular.row.id);
        setModalAnular({ open: false, row: null });
        await cargarCompras();
        return { success: true };
      } catch {
        setModalAnular({ open: false, row: null });
        return { success: false, error: "Error al anular la compra" };
      }
    },
    [modalAnular.row, cargarCompras]
  );

  const abrirModalAnular = useCallback((row) => {
    if (row.estado === "Anulada") return;
    setModalAnular({ open: true, row });
  }, []);

  const cerrarModalAnular = useCallback(() => {
    setModalAnular({ open: false, row: null });
  }, []);

  // ============================
  // Filtros
  // ============================
  const comprasFiltradas = compras.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (c.proveedorNombre || c.proveedor_nombre || "").toLowerCase().includes(term) ||
      (c.observaciones || "").toLowerCase().includes(term) ||
      (c.numeroCompra || "").toLowerCase().includes(term) ||
      String(c.total || 0).includes(term);
    const matchesFilter = !filterEstado || c.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const estadoFilters = [
    { value: "", label: "Todos" },
    { value: "Completada", label: "Completadas" },
    { value: "Anulada", label: "Anuladas" },
  ];

  // ============================
  // Modal delete
  // ============================
  const openDeleteModal = useCallback((id, numeroCompra) => {
    setModalDelete({ open: true, id, numeroCompra });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  }, []);

  useEffect(() => {
    cargarCompras();
  }, [cargarCompras]);

  return {
    compras: comprasFiltradas,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarCompra,
    modalAnular,
    abrirModalAnular,
    cerrarModalAnular,
    confirmarAnular,
    recargar: cargarCompras,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}