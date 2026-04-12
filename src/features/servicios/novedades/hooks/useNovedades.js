import { useState, useEffect, useCallback } from "react";
import {
  getAllNovedades,
  deleteNovedad,
  updateNovedad,          // ← agregar esta importación
} from "../services/novedadesService";
import { getAllEmpleados } from "../../empleado/services/empleadosService";
import { normalizeNovedadesForList } from "../utils/novedadesUtils";

export function useNovedades() {
  const [novedades, setNovedades] = useState([]);
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

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [novedadesData, empleadosData] = await Promise.all([
        getAllNovedades(),
        getAllEmpleados(),
      ]);
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      const novedadesNormalizadas = normalizeNovedadesForList(
        Array.isArray(novedadesData) ? novedadesData : [],
        empleadosData
      );
      setNovedades(novedadesNormalizadas);
    } catch (error) {
      console.error("Error cargando novedades:", error);
      setError("No se pudieron cargar las novedades");
      setNovedades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarNovedad = useCallback(async (id) => {
    try {
      const result = await deleteNovedad(id);
      if (result.success) {
        await cargarDatos();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar la novedad" };
    }
  }, [cargarDatos]);

  // ============================
  // Cambiar estado (activo/inactivo)
  // ============================
  const cambiarEstado = useCallback(async (item, nuevoEstado) => {
    const nuevoValor = nuevoEstado === "activo";
    if (item.activo === nuevoValor) return { success: true };

    try {
      // Construir payload con los datos actuales más el nuevo estado
      const payload = {
        empleado_id: item.empleado_id,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        hora_inicio: item.hora_inicio || null,
        hora_fin: item.hora_fin || null,
        tipo: item.tipo,
        motivo: item.motivo,
        activo: nuevoValor,
      };
      const result = await updateNovedad(item.id, payload);
      if (result.success) {
        await cargarDatos();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: "Error al cambiar el estado" };
    }
  }, [cargarDatos]);

  const novedadesFiltradas = novedades.filter((n) => {
    const matchesSearch =
      n.empleado_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      n.tipo_label?.toLowerCase().includes(search.toLowerCase()) ||
      n.motivo?.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || n.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const openCreateModal = useCallback(() => {
    setModalForm({
      open: true,
      mode: "create",
      title: "Crear Novedad",
      initialData: null,
    });
  }, []);

  const openEditModal = useCallback((item) => {
    setModalForm({
      open: true,
      mode: "edit",
      title: `Editar Novedad: ${item.descripcion}`,
      initialData: {
        id: item.id,
        empleado_id: item.empleado_id,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        tipo: item.tipo,
        motivo: item.motivo,
        activo: item.activo,
      },
    });
  }, []);

  const openViewModal = useCallback((item) => {
    setModalForm({
      open: true,
      mode: "view",
      title: `Detalle Novedad: ${item.descripcion}`,
      initialData: {
        id: item.id,
        empleado_id: item.empleado_id,
        empleado_nombre: item.empleado_nombre,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        tipo: item.tipo,
        motivo: item.motivo,
        activo: item.activo,
      },
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

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    novedades: novedadesFiltradas,
    empleados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarNovedad,
    cambiarEstado,               // ← exportar la función
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