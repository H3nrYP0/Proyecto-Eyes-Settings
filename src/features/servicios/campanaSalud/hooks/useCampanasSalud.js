import { useState, useCallback, useEffect, useRef } from 'react';
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
  const estadosCitaRef = useRef([]);

  // Fix: exponer showNotification para que CampanasSalud.jsx pueda usarla
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

  useEffect(() => {
    estadosCitaRef.current = estadosCita;
  }, [estadosCita]);

  // ---------- Transformación de una campaña ----------
  // Fix flash: la transformación aplica la lógica de "vencida → Completada"
  // directamente en el render, sin esperar al efecto asíncrono de mutación.
  const transformCampana = useCallback(
    (campana) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // Parsear fecha sin desfase de zona horaria (solo fecha, sin hora)
      const [y, m, d] = (campana.fecha || '').split('T')[0].split('-').map(Number);
      const fechaCampana = new Date(y, m - 1, d);
      fechaCampana.setHours(0, 0, 0, 0);

      // Fix flash: si la campaña ya venció y no está bloqueada, la mostramos
      // como "Completada" inmediatamente en el UI, sin esperar la mutación.
      const completadaId =
        estadosCitaRef.current.find((e) => e.nombre?.toLowerCase() === 'completada')?.id ||
        ESTADO_CITA.COMPLETADA;

      let estadoCitaId = campana.estado_cita_id;
      if (
        fechaCampana < hoy &&
        !ESTADOS_BLOQUEADOS.includes(estadoCitaId)
      ) {
        estadoCitaId = completadaId;
      }

      const estadoObj = estadosCitaRef.current.find((e) => e.id === estadoCitaId);
      const estadoNombre = estadoObj?.nombre || 'Pendiente';
      const bloqueada = ESTADOS_BLOQUEADOS.includes(estadoCitaId);
      const todosLosEstados = estadosCitaRef.current.map((e) => e.nombre);

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
        estado_cita_id: estadoCitaId,        // estado efectivo (ya corregido si venció)
        estadoOriginal: campana.estado_cita_id, // para saber si necesita persistirse
        estado: estadoNombre,
        estadosDisponibles: todosLosEstados,
        esEditable: !bloqueada,
        esEliminable: !bloqueada,
      };
    },
    [] // estadosCitaRef es un ref, no necesita ir como dependencia
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

  // Fix flash: persistir en backend las campañas vencidas, pero SOLO después
  // de que estadosCita esté cargado. El UI ya las muestra correctamente desde
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

  // Transformar campañas (estado efectivo ya corregido en tiempo de render)
  const campanas = rawCampanas.map(transformCampana);

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

      const estadoSeleccionado = estadosCitaRef.current.find((e) => e.nombre === estadoNombre);
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
    [campanas, updateEstadoMutation, showNotification]
  );

  return {
    campanas,
    loading: isLoading,
    error,
    notification,
    showNotification, // Fix: expuesto para CampanasSalud.jsx
    handleDelete,
    handleCambioEstado,
    hideNotification,
    refetch,
  };
};