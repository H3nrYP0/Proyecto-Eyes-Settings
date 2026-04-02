import { useState, useEffect, useCallback } from "react";
import { ventasService } from "../services/ventasService";
import { formatCurrency, ESTADOS_VENTA } from "../utils/ventasUtils";

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    cliente: "",
  });

  const cargarVentas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ventasService.getAllVentas();
      setVentas(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando ventas:", err);
      setError("No se pudieron cargar las ventas");
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarVenta = useCallback(async (id, cliente) => {
    setModalDelete({ open: true, id, cliente });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await ventasService.deleteVenta(modalDelete.id);
      await cargarVentas();
      setModalDelete({ open: false, id: null, cliente: "" });
    } catch (error) {
      const msg = error?.response?.data?.error || "No se pudo eliminar la venta";
      alert(`❌ ${msg}`);
      setModalDelete({ open: false, id: null, cliente: "" });
    }
  }, [modalDelete.id, cargarVentas]);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, cliente: "" });
  }, []);

  const filteredVentas = ventas.filter((venta) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (venta.cliente_nombre || "").toLowerCase().includes(term) ||
      (venta.id?.toString() || "").includes(term);
    const matchesEstado = !filterEstado || venta.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    ...ESTADOS_VENTA.map(e => ({ value: e.value, label: e.label })),
  ];

  // ❌ Eliminamos columns y tableActions del hook

  return {
    ventas: filteredVentas,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    modalDelete,
    confirmDelete,
    closeDeleteModal,
    formatCurrency,
    eliminarVenta,        // <-- para la acción eliminar
    // También exponemos ESTADOS_VENTA y getEstadoBadge si la página los necesita
    ESTADOS_VENTA,
  };
}