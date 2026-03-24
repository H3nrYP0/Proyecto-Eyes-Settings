import { useState, useEffect, useCallback } from "react";
import {
  getAllCitas,
  deleteCita,
  updateCitaStatus,
} from "../services/citasService";
import { getAllEstadosCita } from "../services/estadosCitaServices";
import { normalizeCitasForList } from "../utils/citasUtils";

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

  // ============================
  // Cargar citas
  // ============================
  const cargarCitas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [citasData, estadosData] = await Promise.all([
        getAllCitas(),
        getAllEstadosCita(),
      ]);

      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      
      const citasNormalizadas = normalizeCitasForList(citasData, estadosData);
      setCitas(citasNormalizadas);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las citas");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Eliminar cita
  // ============================
  const eliminarCita = useCallback(async (id) => {
    try {
      await deleteCita(id);
      await cargarCitas();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar la cita" };
    }
  }, [cargarCitas]);

  // ============================
  // Cambiar estado
  // ============================
  const cambiarEstado = useCallback(async (id, nuevoEstadoNombre) => {
    try {
      const estadoSeleccionado = estadosCita.find(e => e.nombre === nuevoEstadoNombre);
      
      if (!estadoSeleccionado) {
        return { success: false, error: "Estado no encontrado" };
      }

      await updateCitaStatus(id, estadoSeleccionado.id);
      await cargarCitas();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: "Error al cambiar el estado" };
    }
  }, [estadosCita, cargarCitas]);

  // ============================
  // Filtrar citas
  // ============================
  const citasFiltradas = citas.filter((cita) => {
    const matchesSearch =
      cita.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      cita.servicio_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      cita.empleado_nombre?.toLowerCase().includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado ||
      cita.estado_cita_id === parseInt(filterEstado);

    return matchesSearch && matchesEstado;
  });

  // ============================
  // Handlers de modales
  // ============================
  const openDeleteModal = useCallback((id, descripcion) => {
    setModalDelete({ open: true, id, descripcion });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, descripcion: "" });
  }, []);

  // ============================
  // Opciones de filtros
  // ============================
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    ...estadosCita.map((e) => ({
      value: e.id.toString(),
      label: e.nombre,
    })),
  ];

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarCitas();
  }, [cargarCitas]);

  return {
    citas: citasFiltradas,
    citasRaw: citas,
    estadosCita,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarCita,
    cambiarEstado,
    recargar: cargarCitas,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}