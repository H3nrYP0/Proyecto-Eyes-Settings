import { useState, useEffect, useCallback } from "react";
import { getAllCompras, deleteCompra, anularCompra } from "../services/comprasService";
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
  const [compras, setCompras]           = useState([]);
  const [search, setSearch]             = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [modalDelete, setModalDelete]   = useState({ open: false, id: null, numeroCompra: "" });
  const [modalAnular, setModalAnular]   = useState({ open: false, row: null });

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
      await cargarCompras();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.error || "Error al eliminar la compra" };
    }
  }, [cargarCompras]);

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