import { useState, useEffect, useCallback } from "react";
import { getAllCompras, deleteCompra, anularCompra } from "../services/comprasService";
import { formatCurrency, formatDate } from "../utils/comprasUtils";

export function useCompras() {
  const [compras, setCompras]           = useState([]);
  const [search, setSearch]             = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [modalDelete, setModalDelete]   = useState({ open: false, id: null, numeroCompra: "" });
  const [modalAnular, setModalAnular]   = useState({ open: false, row: null });

  // ─── Cargar compras ───────────────────────────────────────────────────────
  // El objeto de cada fila tiene EXACTAMENTE estos campos.
  // "estado" sigue el mismo patrón que Empleados:
  //   estado_compra true  → "activo"   (Completada)
  //   estado_compra false/null → "inactivo"  (Sin estado / Anulada)
  // CrudTable lee el campo "estado" internamente para el badge y el toggle.
  // NO se define "estado" como columna en columns[] — CrudTable lo gestiona solo.
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
        numeroCompra:    c.numeroCompra || `C-${c.id}`,
        observaciones:   c.observaciones || "",
        estado: c.estado_compra === true ? "completada" : null,
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

  // ─── Eliminar ─────────────────────────────────────────────────────────────
  const eliminarCompra = useCallback(async (id) => {
    try {
      await deleteCompra(id);
      await cargarCompras();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || "Error al eliminar la compra" };
    }
  }, [cargarCompras]);

  // ─── Anular (toggle de estado → pone estado_compra: false) ───────────────
  const confirmarAnular = useCallback(async () => {
    if (!modalAnular.row) return;
    try {
      await anularCompra(modalAnular.row.id);
      setModalAnular({ open: false, row: null });
      await cargarCompras();
      return { success: true };
    } catch (e) {
      setModalAnular({ open: false, row: null });
      return { success: false, error: e.response?.data?.error || "Error al anular la compra" };
    }
  }, [modalAnular.row, cargarCompras]);

  const abrirModalAnular = useCallback((row) => {
    if (row.estado !== "completada") return;
    setModalAnular({ open: true, row });
  }, []);

  const cerrarModalAnular = useCallback(() => {
    setModalAnular({ open: false, row: null });
  }, []);

  // ─── Filtros ──────────────────────────────────────────────────────────────
  const comprasFiltradas = compras.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (c.proveedorNombre || "").toLowerCase().includes(term) ||
      (c.observaciones   || "").toLowerCase().includes(term) ||
      (c.numeroCompra    || "").toLowerCase().includes(term) ||
      String(c.total || 0).includes(term);

    const matchesFilter =
      !filterEstado ||
      (filterEstado === "completada" ? c.estado === "completada" : c.estado === null);

    return matchesSearch && matchesFilter;
  });

  const estadoFilters = [
    { value: "",           label: "Todos"       },
    { value: "completada", label: "Completadas" },
    { value: "anulada",    label: "Anuladas"    },
  ];

  // ─── Modal eliminar ───────────────────────────────────────────────────────
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
    search,        setSearch,
    filterEstado,  setFilterEstado,
    estadoFilters,
    eliminarCompra,
    modalAnular, abrirModalAnular, cerrarModalAnular, confirmarAnular,
    recargar: cargarCompras,
    modalDelete, openDeleteModal, closeDeleteModal,
  };
}