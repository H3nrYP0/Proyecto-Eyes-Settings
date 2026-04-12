// features/servicios/campanaSalud/hooks/useCampanasSalud.js

import { useState, useEffect, useCallback } from 'react';
import {
  getAllCampanasSalud,
  deleteCampanaSalud,
  updateCampanaSalud
} from '../services/campanasSaludService';
import {
  ESTADO_CITA,
  ESTADO_CITA_LABELS,
  ESTADO_CITA_COLORS,
  ESTADOS_BLOQUEADOS
} from '../utils/constants';

export const useCampanasSalud = () => {
  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Notificación CRUD ────────────────────────────────────────────────────────
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });

  const showNotification = (type, message) => {
    setNotification({ open: true, type, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // ─── Estado automático por fecha ─────────────────────────────────────────────
  const calcularEstadoAutomatico = (campana) => {
    if (campana.estado_cita_id === ESTADO_CITA.CANCELADA) return campana.estado_cita_id;
    if (campana.estado_cita_id === ESTADO_CITA.COMPLETADA) return campana.estado_cita_id;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCampana = new Date(campana.fecha);
    fechaCampana.setHours(0, 0, 0, 0);

    if (fechaCampana < hoy) return ESTADO_CITA.COMPLETADA;
    return campana.estado_cita_id;
  };

  const actualizarEstadosAutomaticamente = async (campanasData) => {
    let huboCambios = false;
    for (const campana of campanasData) {
      const nuevoEstado = calcularEstadoAutomatico(campana);
      if (nuevoEstado !== campana.estado_cita_id) {
        try {
          await updateCampanaSalud(campana.id, { estado_cita_id: nuevoEstado });
          huboCambios = true;
        } catch (err) {
          console.error(`Error actualizando campaña ${campana.id}:`, err);
        }
      }
    }
    return huboCambios;
  };

  // ─── Transform ────────────────────────────────────────────────────────────────
  const horaA12 = (hora) => {
    if (!hora || hora === '-') return hora || '-';
    const partes = hora.split(':');
    let h = parseInt(partes[0], 10);
    const m = partes[1] ? partes[1].substring(0, 2) : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const transformCampana = (campana) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCampana = new Date(campana.fecha);
    fechaCampana.setHours(0, 0, 0, 0);

    const bloqueada = ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id);

    return {
      id: campana.id,
      empleado_id: campana.empleado_id,
      empleado_nombre: campana.empleado_nombre || 'No asignado',
      empresa: campana.empresa,
      contacto: campana.contacto || '-',
      fecha: campana.fecha,
      fechaFormateada: campana.fecha
        ? new Date(campana.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        : '-',
      fechaObj: fechaCampana,
      hora: campana.hora ? horaA12(campana.hora) : '-',
      horaRaw: campana.hora || '',
      direccion: campana.direccion || '-',
      observaciones: campana.observaciones || '-',
      estado_cita_id: campana.estado_cita_id,
      estado_nombre: campana.estado_nombre || ESTADO_CITA_LABELS[campana.estado_cita_id] || 'Pendiente',
      estado_color: ESTADO_CITA_COLORS[campana.estado_cita_id] || 'default',
      esFechaPasada: fechaCampana < hoy,
      esEditable: !bloqueada,
      esEliminable: !bloqueada
    };
  };

  // ─── Carga ────────────────────────────────────────────────────────────────────
  const loadCampanas = useCallback(async () => {
    try {
      setLoading(true);
      let data = await getAllCampanasSalud();
      const huboCambios = await actualizarEstadosAutomaticamente(data);
      if (huboCambios) data = await getAllCampanasSalud();
      setCampanas(data.map(transformCampana));
      setError(null);
    } catch (err) {
      console.error('Error loading campanas:', err);
      setError(err.response?.data?.error || 'Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampanas();
    const intervalo = setInterval(loadCampanas, 60 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, [loadCampanas]);

  // ─── Cambio de estado desde el listado ───────────────────────────────────────
  const handleCambioEstado = async (campana, nuevoEstadoId) => {
    if (ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) {
      const nombreEstado = ESTADO_CITA_LABELS[campana.estado_cita_id] || 'este estado';
      showNotification(
        'warning',
        `No se puede cambiar el estado: la campaña "${campana.empresa}" está ${nombreEstado.toLowerCase()} y no admite modificaciones.`
      );
      return { success: false };
    }
    try {
      await updateCampanaSalud(campana.id, {
        estado_cita_id: parseInt(nuevoEstadoId, 10)
      });
      await loadCampanas();
      showNotification('success', `Estado de la campaña "${campana.empresa}" actualizado correctamente`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al actualizar el estado';
      showNotification('error', msg);
      return { success: false, error: msg };
    }
  };

  // ─── Eliminar ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const campana = campanas.find(c => c.id === id);
    if (campana && ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) {
      const nombreEstado = ESTADO_CITA_LABELS[campana.estado_cita_id] || 'este estado';
      showNotification(
        'warning',
        `No se puede eliminar la campaña "${campana.empresa}": está ${nombreEstado.toLowerCase()} y no admite eliminación.`
      );
      return { success: false };
    }
    try {
      await deleteCampanaSalud(id);
      await loadCampanas();
      showNotification('success', `Campaña "${campana?.empresa || ''}" eliminada correctamente`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al eliminar la campaña';
      showNotification('error', msg);
      return { success: false, error: msg };
    }
  };

  return {
    campanas,
    loading,
    error,
    notification,
    loadCampanas,
    handleDelete,
    handleCambioEstado,
    hideNotification
  };
};