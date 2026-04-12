import { useState, useEffect, useCallback } from "react";
import {
  getAllHorarios,
  deleteHorario,
  updateEstadoHorario,
} from "../services/horariosService";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { normalizeHorariosForList } from "../utils/horariosUtils";

export function useHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create",
    title: "",
    initialData: null,
  });
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: "",
  });

  // ============================
  // Cargar datos
  // ============================
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [horariosData, empleadosData] = await Promise.all([
        getAllHorarios(),
        getAllEmpleados(),
      ]);

      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      
      const horariosNormalizados = normalizeHorariosForList(
        Array.isArray(horariosData) ? horariosData : [],
        empleadosData
      );

      setHorarios(horariosNormalizados);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los horarios");
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Eliminar horario
  // ============================
  const eliminarHorario = useCallback(async (id) => {
    try {
      await deleteHorario(id);
      await cargarDatos();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar el horario" };
    }
  }, [cargarDatos]);

  // ============================
  // Cambiar estado
  // ============================
 const cambiarEstado = useCallback(async (row, nuevoEstado) => {
  try {
    const activo = nuevoEstado === "activo";
    await updateEstadoHorario(row.id, activo);
    await cargarDatos();
    return { success: true };
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }
}, [cargarDatos]);

  // ============================
  // Filtrar horarios
  // ============================
  const horariosFiltrados = horarios.filter((horario) => {
    const matchesSearch =
      horario.empleado_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      horario.dia_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      horario.hora_inicio?.includes(search) ||
      horario.hora_final?.includes(search);

    const matchesEstado = !filterEstado || horario.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // ============================
  // Handlers de modales
  // ============================
  const openCreateModal = useCallback(() => {
    setModalForm({ 
      open: true, 
      mode: "create", 
      title: "Crear Nuevo Horario", 
      initialData: null 
    });
  }, []);

  const openEditModal = useCallback((item) => {
    const horarioParaEditar = {
      id: item.id,
      empleado_id: item.empleado_id,
      dia: item.dia,
      hora_inicio: item.hora_inicio,
      hora_final: item.hora_final,
      activo: item.estado === "activo"
    };

    setModalForm({ 
      open: true, 
      mode: "edit", 
      title: `Editar Horario: ${item.empleado_nombre} - ${item.dia_nombre} ${item.hora_inicio}`, 
      initialData: horarioParaEditar 
    });
  }, []);

  const openViewModal = useCallback((item) => {
    const horarioParaVer = {
      id: item.id,
      empleado_id: item.empleado_id,
      empleado_nombre: item.empleado_nombre,
      dia: item.dia,
      dia_nombre: item.dia_nombre,
      hora_inicio: item.hora_inicio,
      hora_final: item.hora_final,
      activo: item.estado === "activo"
    };

    setModalForm({ 
      open: true, 
      mode: "view", 
      title: `Detalle de Horario: ${item.empleado_nombre} - ${item.dia_nombre} ${item.hora_inicio}`, 
      initialData: horarioParaVer 
    });
  }, []);

  const closeFormModal = useCallback(() => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
  }, []);

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
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    horarios: horariosFiltrados,
    horariosRaw: horarios,
    empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarHorario,
    cambiarEstado,
    recargar: cargarDatos,
    modalForm,
    modalDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
  };
}