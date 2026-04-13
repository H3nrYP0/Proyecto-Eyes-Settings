// features/servicios/campanaSalud/utils/campanasSaludUtils.js

import { ESTADO_CITA } from './constants';

export const formatearFechaLocal = (fechaStr) => {
  if (!fechaStr) return '-';
  const partes = fechaStr.split('-');
  if (partes.length !== 3) return '-';
  const [year, month, day] = partes;
  const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const horaA12 = (hora) => {
  if (!hora || hora === '-') return hora || '-';
  const partes = hora.split(':');
  let h = parseInt(partes[0], 10);
  const m = partes[1] ? partes[1].substring(0, 2) : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

export const formatearHora24 = (hora) => {
  if (!hora) return '';
  if (/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(hora)) return hora;
  try {
    if (hora.includes(':')) {
      const partes = hora.split(':');
      if (partes.length >= 2) {
        return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0').substring(0, 2)}`;
      }
    }
  } catch (e) {
    // Silencio
  }
  return hora;
};

export const transformCampanaFromBackend = (campana) => {
  if (!campana) return null;
  return {
    id: campana.id,
    empleado_id: campana.empleado_id,
    empleado_nombre: campana.empleado_nombre || 'No asignado',
    empresa: campana.empresa || '',
    contacto: campana.contacto || '',
    fecha: campana.fecha ? campana.fecha.split('T')[0] : '',
    hora: campana.hora || '',
    direccion: campana.direccion || '',
    observaciones: campana.observaciones || '',
    estado_cita_id: campana.estado_cita_id || ESTADO_CITA.PENDIENTE,
    estado_nombre: campana.estado_nombre || 'Pendiente',
  };
};

export const transformCampanaToBackend = (formData, isEdit = false, originalData = null) => {
  if (isEdit && originalData) {
    const changed = {};
    if (formData.empleado_id !== originalData.empleado_id)
      changed.empleado_id = parseInt(formData.empleado_id, 10);
    if (formData.empresa !== originalData.empresa)
      changed.empresa = formData.empresa.trim();
    if (formData.contacto !== originalData.contacto)
      changed.contacto = formData.contacto?.trim() || null;
    if (formData.fecha !== originalData.fecha)
      changed.fecha = formData.fecha;
    if (formData.hora !== originalData.hora)
      changed.hora = formatearHora24(formData.hora);
    if (formData.direccion !== originalData.direccion)
      changed.direccion = formData.direccion?.trim() || null;
    if (formData.observaciones !== originalData.observaciones)
      changed.observaciones = formData.observaciones?.trim() || null;
    if (formData.estado_cita_id !== originalData.estado_cita_id)
      changed.estado_cita_id = parseInt(formData.estado_cita_id, 10);
    return changed;
  }

  const empresaValue = formData.empresa?.trim();
  if (!empresaValue) {
    throw new Error('El nombre de la empresa es requerido');
  }

  return {
    empleado_id: parseInt(formData.empleado_id, 10),
    empresa: empresaValue,
    ...(formData.contacto?.trim() && { contacto: formData.contacto.trim() }),
    fecha: formData.fecha,
    hora: formatearHora24(formData.hora),
    ...(formData.direccion?.trim() && { direccion: formData.direccion.trim() }),
    ...(formData.observaciones?.trim() && { observaciones: formData.observaciones.trim() }),
    estado_cita_id: ESTADO_CITA.PENDIENTE,
  };
};

export const getEstadoBadgeColor = (estadoCitaId) => {
  const colors = {
    [ESTADO_CITA.PENDIENTE]: 'warning',
    [ESTADO_CITA.CONFIRMADA]: 'info',
    [ESTADO_CITA.COMPLETADA]: 'success',
    [ESTADO_CITA.CANCELADA]: 'error',
    [ESTADO_CITA.EN_PROGRESO]: 'primary',
  };
  return colors[estadoCitaId] || 'default';
};

export const getEstadoLabel = (estadoCitaId) => {
  const labels = {
    [ESTADO_CITA.PENDIENTE]: 'Pendiente',
    [ESTADO_CITA.CONFIRMADA]: 'Confirmada',
    [ESTADO_CITA.COMPLETADA]: 'Completada',
    [ESTADO_CITA.CANCELADA]: 'Cancelada',
    [ESTADO_CITA.EN_PROGRESO]: 'En Progreso',
  };
  return labels[estadoCitaId] || 'Desconocido';
};