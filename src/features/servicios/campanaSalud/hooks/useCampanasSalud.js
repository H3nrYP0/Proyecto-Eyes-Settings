import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllCampanasSalud,
  updateCampanaSalud,
  deleteCampanaSalud,
} from '../services/campanasSaludService';
import { getEstadosCita } from '../services/estadosCitaCampanaService';
import { ESTADOS_BLOQUEADOS, ESTADO_CITA } from '../utils/constants';
import { formatearFechaLocal, horaA12 } from '../utils/campanasSaludUtils';

/**
 * Hook para la gestión de la lista de campañas de salud.
 * Obtiene campañas y estados de cita mediante React Query,
 * y proporciona mutaciones para eliminar y cambiar estado.
 *
 * @returns {Object} - Campañas, estado de carga, funciones CRUD, notificaciones.
 */
export const useCampanasSalud = () => {
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState({ open: false, type: 'success', message: '' });

  const showNotification = useCallback(
    (type, message) => setNotification({ open: true, type, message }),
    []
  );
  const hideNotification = useCallback(
    () => setNotification((prev) => ({ ...prev, open: false })),
    []
  );

  // ---------- Consulta de estados de cita ----------
  const { data: estadosCita = [] } = useQuery({
    queryKey: ['estados-cita'],
    queryFn: getEstadosCita,
    staleTime: 10 * 60 * 1000,
  });

  // ---------- Transformación de una campaña ----------
  // Fix principal: recibe estadosCita como parámetro directo en lugar de leerlo
  // desde un ref. Así siempre usa el valor sincronizado del render actual,
  // evitando el flash a "Pendiente" cuando el ref aún está vacío.
  const transformCampana = useCallback(
    (campana, estadosActuales) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // Parsear fecha sin desfase de zona horaria
      const [y, m, d] = (campana.fecha || '').split('T')[0].split('-').map(Number);
      const fechaCampana = new Date(y, m - 1, d);
      fechaCampana.setHours(0, 0, 0, 0);

      const completadaId =
        estadosActuales.find((e) => e.nombre?.toLowerCase() === 'completada')?.id ||
        ESTADO_CITA.COMPLETADA;

      let estadoCitaId = campana.estado_cita_id;
      if (fechaCampana < hoy && !ESTADOS_BLOQUEADOS.includes(estadoCitaId)) {
        estadoCitaId = completadaId;
      }

      const estadoObj = estadosActuales.find((e) => e.id === estadoCitaId);
      // Fix: solo usar 'Pendiente' como fallback si estadosCita aún no cargó;
      // en ese caso preferimos mostrar el nombre real del estado original si existe.
      const estadoObjOriginal = estadosActuales.find((e) => e.id === campana.estado_cita_id);
      const estadoNombre = estadoObj?.nombre || estadoObjOriginal?.nombre || 'Pendiente';
      const bloqueada = ESTADOS_BLOQUEADOS.includes(estadoCitaId);
      const todosLosEstados = estadosActuales.map((e) => e.nombre);

      return {
        id: campana.id,
        empleado_id: campana.empleado_id,
        empleado_nombre: campana.empleado_nombre || 'No asignado',
        empresa: campana.empresa,
        contacto: campana.contacto || '-',
        fecha: campana.fecha,
        fechaFormateada: formatearFechaLocal((campana.fecha || '').split('T')[0]),
        fechaObj: fechaCampana,
        hora: campana.hora ? horaA12(campana.hora) : '-',
        horaRaw: campana.hora || '',
        direccion: campana.direccion || '-',
        observaciones: campana.observaciones || '-',
        estado_cita_id: estadoCitaId,
        estadoOriginal: campana.estado_cita_id,
        estado: estadoNombre,
        estadosDisponibles: todosLosEstados,
        esEditable: !bloqueada,
        esEliminable: !bloqueada,
      };
    },
    []
  );

  // ---------- Consulta de campañas ----------
  const {
    data: rawCampanas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['campanas-salud'],
    queryFn: getAllCampanasSalud,
    staleTime: 2 * 60 * 1000,
  });

  // Fix flash: persistir en backend las campañas vencidas SOLO después de que
  // estadosCita esté cargado. El UI ya las muestra correctamente desde
  // transformCampana; esto solo sincroniza el backend en segundo plano.
  useEffect(() => {
    if (!rawCampanas.length || !estadosCita.length) return;

    const updateVencidas = async () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const completadaId =
        estadosCita.find((e) => e.nombre?.toLowerCase() === 'completada')?.id ||
        ESTADO_CITA.COMPLETADA;

      const promises = [];
      for (const campana of rawCampanas) {
        if (ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) continue;
        const [y, m, d] = (campana.fecha || '').split('T')[0].split('-').map(Number);
        const fechaCampana = new Date(y, m - 1, d);
        fechaCampana.setHours(0, 0, 0, 0);
        if (fechaCampana < hoy && campana.estado_cita_id !== completadaId) {
          promises.push(updateCampanaSalud(campana.id, { estado_cita_id: completadaId }));
        }
      }

      if (promises.length) {
        await Promise.all(promises);
        queryClient.invalidateQueries({ queryKey: ['campanas-salud'] });
      }
    };

    updateVencidas();
  }, [rawCampanas, estadosCita, queryClient]);

  // Fix principal: pasar estadosCita directamente a transformCampana en cada render,
  // en lugar de depender del ref. Así el estado siempre es correcto desde el
  // primer render, sin importar el orden de resolución de las queries.
  const campanas = rawCampanas.map((c) => transformCampana(c, estadosCita));

  // ---------- Mutaciones ----------
  const deleteMutation = useMutation({
    mutationFn: deleteCampanaSalud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanas-salud'] });
    },
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado_cita_id }) => updateCampanaSalud(id, { estado_cita_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanas-salud'] });
    },
  });

  // Funciones wrapper
  const handleDelete = useCallback(
    async (id) => {
      const campana = campanas.find((c) => c.id === id);
      if (campana && ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) {
        showNotification(
          'warning',
          `No se puede eliminar la campaña "${campana.empresa}": está ${campana.estado.toLowerCase()} y no admite eliminación.`
        );
        return { success: false };
      }
      try {
        await deleteMutation.mutateAsync(id);
        showNotification('success', `Campaña "${campana?.empresa || ''}" eliminada correctamente`);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.error || 'Error al eliminar la campaña';
        showNotification('error', msg);
        return { success: false, error: msg };
      }
    },
    [campanas, deleteMutation, showNotification]
  );

  const handleCambioEstado = useCallback(
    async (campana, nuevoEstadoNombre) => {
      let targetCampana = campana;
      let estadoNombre = nuevoEstadoNombre;
      if (typeof campana === 'number') {
        targetCampana = campanas.find((c) => c.id === campana);
        estadoNombre = nuevoEstadoNombre;
      }

      if (!targetCampana) {
        showNotification('error', 'Campaña no encontrada');
        return { success: false };
      }

      const estadoSeleccionado = estadosCita.find((e) => e.nombre === estadoNombre);
      if (!estadoSeleccionado) {
        showNotification('error', 'Estado no válido');
        return { success: false };
      }

      if (ESTADOS_BLOQUEADOS.includes(targetCampana.estado_cita_id)) {
        showNotification(
          'warning',
          `No se puede cambiar el estado: la campaña "${targetCampana.empresa}" está ${targetCampana.estado.toLowerCase()} y no admite modificaciones.`
        );
        return { success: false };
      }

      try {
        await updateEstadoMutation.mutateAsync({
          id: targetCampana.id,
          estado_cita_id: estadoSeleccionado.id,
        });
        showNotification(
          'success',
          `Estado de la campaña "${targetCampana.empresa}" actualizado correctamente`
        );
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.error || 'Error al actualizar el estado';
        showNotification('error', msg);
        return { success: false, error: msg };
      }
    },
    [campanas, estadosCita, updateEstadoMutation, showNotification]
  );

  return {
    campanas,
    loading: isLoading,
    error,
    notification,
    estadosCita, 
    showNotification,
    handleDelete,
    handleCambioEstado,
    hideNotification,
    refetch,
  };
};