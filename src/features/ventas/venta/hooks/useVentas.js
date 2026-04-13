import { useState, useEffect, useCallback } from "react";
import { ventasService } from "../services/ventasService";
import { formatCurrency, COLORES_ESTADO_VENTA, getEstadoLabelVenta } from "../utils/ventasUtils";

export function useVentas() {
  const [ventas,       setVentas]       = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading,      setLoading]      = useState(true);

  const cargarVentas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ventasService.getAllVentas();
      setVentas(data ?? []);
    } catch (err) {
      console.error("Error cargando ventas:", err);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarVentas(); }, [cargarVentas]);

  const filteredVentas = ventas.filter((v) => {
    const matchesSearch = (v.cliente_nombre || "")
      .toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || v.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "",               label: "Todos los estados" },
    { value: "completada",     label: "Completada" },
    { value: "anulada",        label: "Anulada" },
    { value: "pendiente_pago", label: "Pendiente de pago" },
  ];

  return {
    ventas: filteredVentas,
    loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    formatCurrency,
    COLORES_ESTADO_VENTA,
    getEstadoLabelVenta,
  };
}