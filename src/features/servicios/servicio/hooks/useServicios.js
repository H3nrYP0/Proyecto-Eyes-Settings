import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ServicioData } from '../services/serviciosService';
import { useActionBlocker } from '@shared/hooks/useActionBlocker';
import axios from '@lib/axios';
import { formatCOP } from '@shared/utils/formatCOP';

export const useServicios = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: 'create',
    title: '',
    initialData: null,
  });
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const clickLockRef = useRef(false);
  const submitButtonRef = useRef(null);

  const { execute: executeDelete } = useActionBlocker();

  // ---------- Queries ----------
  const { data: serviciosRaw = [], isLoading, error: queryError } = useQuery({
    queryKey: ['servicios'],
    queryFn: ServicioData.getAllServicios,
    staleTime: 2 * 60 * 1000,
  });

  const servicios = serviciosRaw.map(servicio => ({
    id: servicio.id,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion || '',
    duracion_min: servicio.duracion_min,
    precio: servicio.precio,
    estado: servicio.estado ? 'activo' : 'inactivo'
  })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));

  // ---------- Mutations ----------
  const createMutation = useMutation({
    mutationFn: ServicioData.createServicio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ServicioData.updateServicio(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ServicioData.deleteServicio,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['servicios'] }),
  });

  // ---------- UI helpers ----------
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const cleanupModalState = useCallback(() => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root?.hasAttribute('aria-hidden')) root.removeAttribute('aria-hidden');
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, []);

  const handleCloseForm = useCallback(() => {
    setModalForm({ open: false, mode: 'create', title: '', initialData: null });
    cleanupModalState();
  }, [cleanupModalState]);

  // ---------- Wrappers de mutaciones ----------
  const crearServicio = useCallback(async (data) => {
    setIsSaving(true);
    try {
      const result = await createMutation.mutateAsync(data);
      showNotification('Servicio creado exitosamente', 'success');
      handleCloseForm();
      return result;
    } catch (error) {
      showNotification(error.message || 'Error al crear servicio', 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [createMutation, showNotification, handleCloseForm]);

  const editarServicio = useCallback(async (id, data) => {
    setIsSaving(true);
    try {
      const result = await updateMutation.mutateAsync({ id, data });
      showNotification('Servicio actualizado exitosamente', 'success');
      handleCloseForm();
      return result;
    } catch (error) {
      showNotification(error.message || 'Error al actualizar servicio', 'error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [updateMutation, showNotification, handleCloseForm]);

  const eliminarServicio = useCallback(async (id, nombre) => {
    await executeDelete(async () => {
      try {
        await deleteMutation.mutateAsync(id);
        showNotification(`Servicio "${nombre}" eliminado exitosamente`, 'success');
        setModalDelete({ open: false, id: null, nombre: '' });
        cleanupModalState();
      } catch (err) {
        let errorMessage = 'Error al eliminar el servicio';
        if (err.response?.status === 500) {
          errorMessage = 'Este servicio tiene citas registradas y no puede eliminarse. Desactívelo en su lugar.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        showNotification(errorMessage, 'warning');
        setModalDelete({ open: false, id: null, nombre: '' });
        cleanupModalState();
      }
    });
  }, [deleteMutation, executeDelete, showNotification, cleanupModalState]);

  // ✅ Cambio de estado SIN useActionBlocker (directamente)
  const cambiarEstado = useCallback(async (row, nuevoEstado) => {
    const shouldActivate = nuevoEstado === 'activo';
    
    // Validar si se puede desactivar (citas pendientes/confirmadas)
    if (!shouldActivate) {
      try {
        const estadosQueBloquean = await ServicioData.getEstadosQueBloquean();
        const citasResponse = await axios.get('/citas');
        const citasList = citasResponse.data.data || citasResponse.data || [];
        const citasQueBloquean = citasList.filter(cita => 
          cita.servicio_id === row.id && estadosQueBloquean.includes(cita.estado_cita_id)
        );
        if (citasQueBloquean.length > 0) {
          const estadosUnicos = [...new Set(citasQueBloquean.map(c => c.estado_nombre))];
          showNotification(
            `No se puede desactivar "${row.nombre}" porque tiene ${citasQueBloquean.length} cita(s) en estado: ${estadosUnicos.join(' y ')}.`,
            'error'
          );
          return;
        }
      } catch (err) {
        showNotification('Error al verificar citas asociadas', 'error');
        return;
      }
    }
    
    const payload = {
      nombre: row.nombre,
      duracion_min: Number(row.duracion_min) || 0,
      precio: Number(row.precio) || 0,
      descripcion: row.descripcion || '',
      estado: shouldActivate
    };
    
    try {
      await updateMutation.mutateAsync({ id: row.id, data: payload });
      showNotification(`Servicio "${row.nombre}" ${shouldActivate ? 'activado' : 'desactivado'} exitosamente`, 'success');
    } catch (error) {
      showNotification(error.message || 'Error al cambiar el estado', 'error');
    }
  }, [updateMutation, showNotification]);

  // ---------- Handlers de modales ----------
  const handleOpenCreate = useCallback(() => {
    setModalForm({ open: true, mode: 'create', title: 'Crear Nuevo Servicio', initialData: null });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleOpenEdit = useCallback((item) => {
    setModalForm({ open: true, mode: 'edit', title: `Editar Servicio: ${item.nombre}`, initialData: item });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleOpenView = useCallback((item) => {
    setModalForm({ open: true, mode: 'view', title: `Detalle de Servicio: ${item.nombre}`, initialData: item });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleDelete = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const handleCancelDelete = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: '' });
    cleanupModalState();
  }, [cleanupModalState]);

  // ---------- Filtros y tabla ----------
  const filteredServicios = servicios.filter((servicio) => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (servicio.descripcion && servicio.descripcion.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = !filterEstado || servicio.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  const columns = [
    { field: 'nombre', header: 'Nombre' },
    { field: 'duracion_min', header: 'Duración', render: (row) => `${row.duracion_min} min` },
    { field: 'precio', header: 'Precio', render: (row) => formatCOP(row.precio) }
  ];

  const tableActions = [
    { label: 'Cambiar estado', type: 'toggle-status', onClick: (item) => cambiarEstado(item, item.estado === 'activo' ? 'inactivo' : 'activo') },
    { label: 'Ver Detalles', type: 'view', onClick: (item) => handleOpenView(item) },
    { label: 'Editar', type: 'edit', onClick: (item) => handleOpenEdit(item) },
    { label: 'Eliminar', type: 'delete', onClick: (item) => handleDelete(item.id, item.nombre) },
  ];

  const handleModalConfirm = useCallback(() => {
    if (clickLockRef.current) return;
    if (modalForm.mode === 'view') {
      // En vista, no hacemos nada aquí; el botón ahora dirá "Editar" y su handler es otro.
      // El click en "Editar" se manejará en el componente.
      return;
    }
    if (submitButtonRef.current) {
      clickLockRef.current = true;
      submitButtonRef.current.click();
    }
  }, [modalForm.mode]);

  return {
    servicios: filteredServicios,
    loading: isLoading,
    error: queryError,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    notification,
    modalForm,
    modalDelete,
    submitButtonRef,
    isSaving,
    searchFilters,
    columns,
    tableActions,
    crearServicio,
    editarServicio,
    eliminarServicio,
    handleOpenCreate,
    handleOpenEdit,      // necesario para edición desde vista
    handleOpenView,
    handleCloseForm,
    handleCancelDelete,
    handleCloseNotification,
    handleModalConfirm,
  };
};