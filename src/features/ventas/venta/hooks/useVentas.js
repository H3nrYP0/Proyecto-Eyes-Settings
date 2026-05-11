import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ventasService } from "../services/ventasService";
import { formatCurrency, COLORES_ESTADO_VENTA, getEstadoLabelVenta } from "../utils/ventasUtils";

export function useVentas() {
  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const { data: ventas = [], isLoading: loading } = useQuery({
    queryKey: ["ventas"],
    queryFn:  () => ventasService.getAllVentas(),
    staleTime: 30_000,
  });

  const filteredVentas = ventas.filter((v) => {
    const matchesSearch = (v.cliente_nombre || "")
      .toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || v.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Solo completada y anulada
  const estadoFilters = [
    { value: "",            label: "Todos los estados" },
    { value: "completada",  label: "Completada"        },
    { value: "anulada",     label: "Anulada"           },
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