import { useState, useEffect, useCallback } from "react";
import { getAllCompras, deleteCompra, updateEstadoCompra } from "../services/comprasService";
import { formatCurrency, formatDate, normalizeCompraForForm } from "../utils/comprasUtils";

export function useCompras() {
  const [compras, setCompras] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    numeroCompra: "",
  });

  // ============================
  // Cargar compras
  // ============================
  const cargarCompras = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCompras();
      
      const comprasNormalizadas = (Array.isArray(data) ? data : []).map((c) => ({
        ...c,
        ...normalizeCompraForForm(c),
        totalFormateado: formatCurrency(c.total),
        fechaFormateada: formatDate(c.fecha),
      }));
      
      setCompras(comprasNormalizadas);
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
  const eliminarCompra = useCallback(async (id) => {
    try {
      await deleteCompra(id);
      await cargarCompras();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar la compra" };
    }
  }, [cargarCompras]);

  // ============================
  // Cambiar estado
  // ============================
  const cambiarEstado = useCallback(async (row) => {
    if (row.estado === "Anulada") return { success: false, error: "No se puede cambiar estado de una compra anulada" };
    try {
      await updateEstadoCompra(row.id, row.estado);
      await cargarCompras();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: "Error al cambiar el estado" };
    }
  }, [cargarCompras]);

  // ============================
  // Filtrar compras
  // ============================
  const comprasFiltradas = compras.filter((compra) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (compra.proveedorNombre || "").toLowerCase().includes(term) ||
      (compra.observaciones || "").toLowerCase().includes(term) ||
      (compra.numeroCompra || "").toLowerCase().includes(term) ||
      String(compra.total || 0).includes(term);

    const matchesFilter = !filterEstado || compra.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  // ============================
  // Opciones de filtros
  // ============================
  const estadoFilters = [
    { value: "", label: "Todos" },
    { value: "Completada", label: "Completadas" },
    { value: "Anulada", label: "Anuladas" },
  ];

  // ============================
  // Handlers de modales
  // ============================
  const openDeleteModal = useCallback((id, numeroCompra) => {
    setModalDelete({ open: true, id, numeroCompra });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  }, []);

  // ============================
  // Cargar datos iniciales
  // ============================
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
    cambiarEstado,
    recargar: cargarCompras,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}