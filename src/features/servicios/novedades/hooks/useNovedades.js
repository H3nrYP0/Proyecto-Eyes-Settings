import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllNovedades,
  createNovedad,
  updateNovedad,
  deleteNovedad,
} from '../services/novedadesService';
import { getEmpleadosAgenda } from '@servicios/agenda'; // ✔️ nombre correcto
import { normalizeNovedadesForList } from '../utils/novedadesUtils';

export function useNovedades() {
  const queryClient = useQueryClient();

  // Empleados (comparte caché con agenda)
  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda, // ✔️ corregido
    staleTime: 10 * 60 * 1000,
  });

  // Novedades
  const {
    data: novedadesRaw = [],
    isLoading: loadingNovedades,
    error: novedadesError,
  } = useQuery({
    queryKey: ['novedades'],
    queryFn: getAllNovedades,
    staleTime: 2 * 60 * 1000,
  });

  const novedadesNormalizadas = normalizeNovedadesForList(novedadesRaw, empleados);

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createNovedad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['novedades'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateNovedad(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['novedades'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNovedad,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['novedades'] }),
  });

  // Estados de UI (filtros y modales)
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

  // Filtrado
  const novedadesFiltradas = novedadesNormalizadas.filter((n) => {
    const matchesSearch =
      n.empleado_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      n.tipo_label?.toLowerCase().includes(search.toLowerCase()) ||
      n.motivo?.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || n.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Wrappers
  const crearNovedad = useCallback(async (data) => {
    const result = await createMutation.mutateAsync(data);
    return result;
  }, [createMutation]);

  const editarNovedad = useCallback(async (id, data) => {
    const result = await updateMutation.mutateAsync({ id, data });
    return result;
  }, [updateMutation]);

  const eliminarNovedad = useCallback(async (id) => {
    const result = await deleteMutation.mutateAsync(id);
    return result;
  }, [deleteMutation]);

  const cambiarEstado = useCallback(async (item, nuevoEstado) => {
    const activo = nuevoEstado === 'activo';
    if (item.activo === activo) return { success: true };
    const payload = {
      empleado_id: item.empleado_id,
      fecha_inicio: item.fecha_inicio,
      fecha_fin: item.fecha_fin,
      hora_inicio: item.hora_inicio || null,
      hora_fin: item.hora_fin || null,
      tipo: item.tipo,
      motivo: item.motivo,
      activo,
    };
    const result = await updateMutation.mutateAsync({ id: item.id, data: payload });
    return result;
  }, [updateMutation]);

  // Handlers de modales
  const openCreateModal = useCallback(() => {
    setModalForm({ open: true, mode: 'create', title: 'Crear Novedad', initialData: null });
  }, []);

  const openEditModal = useCallback((item) => {
    setModalForm({
      open: true,
      mode: 'edit',
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
      mode: 'view',
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

  const recargar = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['novedades'] });
  }, [queryClient]);

  return {
    novedades: novedadesFiltradas,
    empleados,
    loading: loadingNovedades,
    error: novedadesError,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarNovedad,
    cambiarEstado,
    crearNovedad,
    editarNovedad,
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