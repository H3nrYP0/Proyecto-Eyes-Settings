import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllHorarios, createHorario, updateHorario, deleteHorario, updateEstadoHorario } from '../services/horariosService';
import { getEmpleadosAgenda } from '@servicios/agenda'; 
import { normalizeHorariosForList } from '../utils/horariosUtils';

export function useHorarios() {
  const queryClient = useQueryClient();

  // ---------- Consultas ----------
  // Empleados (misma query que usa agenda, para caché compartido)
  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda,
    staleTime: 10 * 60 * 1000,
  });

  // Horarios
  const {
    data: horariosRaw = [],
    isLoading: loadingHorarios,
    error: horariosError,
  } = useQuery({
    queryKey: ['horarios'],
    queryFn: getAllHorarios,
    staleTime: 2 * 60 * 1000,
  });

  // Normalizamos los horarios (necesita empleados)
  const horariosNormalizados = normalizeHorariosForList(horariosRaw, empleados);

  // ---------- Mutaciones ----------
  const createMutation = useMutation({
    mutationFn: createHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateHorario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHorario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, activo }) => updateEstadoHorario(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios'] });
    },
  });

  // ---------- Estados de UI (filtros y modales) ----------
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: 'create',
    title: '',
    initialData: null,
  });
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: '',
  });

  // ---------- Filtrado ----------
  const horariosFiltrados = horariosNormalizados.filter((horario) => {
    const matchesSearch =
      horario.empleado_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      horario.dia_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      horario.hora_inicio?.includes(search) ||
      horario.hora_final?.includes(search);
    const matchesEstado = !filterEstado || horario.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // ---------- Wrappers de mutaciones (misma interfaz que antes) ----------
  const eliminarHorario = useCallback(async (id) => {
    const result = await deleteMutation.mutateAsync(id);
    return result;
  }, [deleteMutation]);

  const cambiarEstado = useCallback(async (row, nuevoEstado) => {
    const activo = nuevoEstado === 'activo';
    const result = await toggleStatusMutation.mutateAsync({ id: row.id, activo });
    return result;
  }, [toggleStatusMutation]);

  const crearHorario = useCallback(async (data) => {
    const result = await createMutation.mutateAsync(data);
    return result;
  }, [createMutation]);

  const editarHorario = useCallback(async (id, data) => {
    const result = await updateMutation.mutateAsync({ id, data });
    return result;
  }, [updateMutation]);

  // ---------- Handlers de modales ----------
  const openCreateModal = useCallback(() => {
    setModalForm({ open: true, mode: 'create', title: 'Crear Nuevo Horario', initialData: null });
  }, []);

  const openEditModal = useCallback((item) => {
    const horarioParaEditar = {
      id: item.id,
      empleado_id: item.empleado_id,
      dia: item.dia,
      hora_inicio: item.hora_inicio,
      hora_final: item.hora_final,
      activo: item.estado === 'activo',
    };
    setModalForm({
      open: true,
      mode: 'edit',
      title: `Editar Horario: ${item.empleado_nombre} - ${item.dia_nombre} ${item.hora_inicio}`,
      initialData: horarioParaEditar,
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
      activo: item.estado === 'activo',
    };
    setModalForm({
      open: true,
      mode: 'view',
      title: `Detalle de Horario: ${item.empleado_nombre} - ${item.dia_nombre} ${item.hora_inicio}`,
      initialData: horarioParaVer,
    });
  }, []);

  const closeFormModal = useCallback(() => {
    setModalForm({ open: false, mode: 'create', title: '', initialData: null });
  }, []);

  const openDeleteModal = useCallback((id, descripcion) => {
    setModalDelete({ open: true, id, descripcion });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, descripcion: '' });
  }, []);

  const estadoFilters = [
    { value: '', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' },
  ];

  // Función recargar (invalida queries manualmente, aunque las mutaciones ya lo hacen)
  const recargar = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['horarios'] });
  }, [queryClient]);

  return {
    horarios: horariosFiltrados,
    horariosRaw: horariosNormalizados,
    empleados,
    loading: loadingHorarios,
    error: horariosError,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarHorario,
    cambiarEstado,
    crearHorario,
    editarHorario,
    recargar,
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