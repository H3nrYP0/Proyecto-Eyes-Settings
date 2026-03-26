import { useState, useEffect, useCallback } from "react";
import {
  getAllEmpleados,
  deleteEmpleado,
  updateEstadoEmpleado,
} from "../services/empleadosService";
import { normalizeEmpleadoForForm } from "../utils/empleadosUtils";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // ============================
  // Cargar empleados
  // ============================
  const cargarEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllEmpleados();

      const normalizados = (Array.isArray(data) ? data : []).map((e) => ({
        id: e.id,
        nombre: e.nombre,
        cargo: e.cargo,
        correo: e.correo,
        tipoDocumento: e.tipo_documento,
        numero_documento: e.numero_documento,
        telefono: e.telefono,
        direccion: e.direccion,
        fecha_ingreso: e.fecha_ingreso,
        estado: e.estado ? "activo" : "inactivo",
        estadosDisponibles: ["activo", "inactivo"],
      }));

      setEmpleados(normalizados);
    } catch (error) {
      console.error("Error cargando empleados:", error);
      setError("No se pudieron cargar los empleados");
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Eliminar empleado
  // ============================
  const eliminarEmpleado = useCallback(async (id) => {
    try {
      await deleteEmpleado(id);
      await cargarEmpleados();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: error.response?.data?.message || "Error al eliminar el empleado" };
    }
  }, [cargarEmpleados]);

  // ============================
  // Cambiar estado
  // ============================
  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    try {
      await updateEstadoEmpleado(id, nuevoEstado);
      await cargarEmpleados();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: error.response?.data?.message || "Error al cambiar el estado" };
    }
  }, [cargarEmpleados]);

  // ============================
  // Filtrar empleados
  // ============================
  const empleadosFiltrados = empleados.filter((empleado) => {
    const matchesSearch =
      empleado.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      empleado.numero_documento?.toLowerCase().includes(search.toLowerCase()) ||
      empleado.cargo?.toLowerCase().includes(search.toLowerCase()) ||
      empleado.correo?.toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || empleado.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // ============================
  // Handlers de modales
  // ============================
  const openDeleteModal = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
  }, []);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return {
    empleados: empleadosFiltrados,
    empleadosRaw: empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    eliminarEmpleado,
    cambiarEstado,
    recargar: cargarEmpleados,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}