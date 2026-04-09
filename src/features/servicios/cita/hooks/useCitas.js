import { useState, useEffect, useCallback } from "react";
import { getAllCitas, deleteCita, updateCitaStatus } from "../services/citasService";
import { getAllEstadosCita } from "../services/estadosCitaServices";
import { formatFecha, formatHora } from "../utils/citasUtils";

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: "",
  });

  const cargarCitas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [citasData, estadosData] = await Promise.all([
        getAllCitas(),
        getAllEstadosCita(),
      ]);

      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);

      const citasNormalizadas = (Array.isArray(citasData) ? citasData : []).map((c) => ({
        ...c,
        fecha_formateada: formatFecha(c.fecha),
        hora_formateada: formatHora(c.hora),
        estado: c.estado_nombre,
        estadosDisponibles: estadosData.map((e) => e.nombre),
      }));

      setCitas(citasNormalizadas);
    } catch (err) {
      console.error("Error cargando citas:", err);
      // Extraer mensaje específico si existe
      const errorMsg = err.response?.data?.message || err.message || "No se pudieron cargar las citas";
      setError(errorMsg);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarCita = useCallback(async (id) => {
    try {
      await deleteCita(id);
      await cargarCitas();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Error desconocido al eliminar la cita";
      return { success: false, error: errorMsg };
    }
  }, [cargarCitas]);

  const cambiarEstado = useCallback(async (id, nuevoEstadoNombre) => {
    try {
      const estado = estadosCita.find((e) => e.nombre === nuevoEstadoNombre);
      if (!estado) {
        return { success: false, error: `El estado "${nuevoEstadoNombre}" no existe en el sistema` };
      }
      await updateCitaStatus(id, estado.id);
      await cargarCitas();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Error desconocido al cambiar el estado";
      return { success: false, error: errorMsg };
    }
  }, [estadosCita, cargarCitas]);

  const citasFiltradas = citas.filter((cita) => {
    const matchesSearch =
      (cita.cliente_nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (cita.servicio_nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (cita.empleado_nombre?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado || cita.estado_cita_id === parseInt(filterEstado);

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    ...estadosCita.map((e) => ({
      value: e.id.toString(),
      label: e.nombre,
    })),
  ];

  const openDeleteModal = useCallback((id, descripcion) => {
    setModalDelete({ open: true, id, descripcion });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, descripcion: "" });
  }, []);

  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return {
    citas: citasFiltradas,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarCita,
    cambiarEstado,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}