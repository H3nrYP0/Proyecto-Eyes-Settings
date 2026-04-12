// features/servicios/campanaSalud/utils/campanasSaludUtils.js

import { ESTADO_CITA_LABELS, ESTADO_CITA_COLORS } from './constants';

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
    estado_cita_id: campana.estado_cita_id || 1,
    estado_nombre: campana.estado_nombre || ESTADO_CITA_LABELS[campana.estado_cita_id] || 'Pendiente'
  };
};

export const transformCampanaToBackend = (formData) => {
  // ✅ Asegurar que empresa NUNCA sea null o undefined
  const empresaValue = formData.empresa?.trim();
  if (!empresaValue) {
    throw new Error('El nombre de la empresa es requerido');
  }

  return {
    empleado_id: parseInt(formData.empleado_id, 10),
    empresa: empresaValue,
    // Solo incluir contacto si tiene valor
    ...(formData.contacto?.trim() && { contacto: formData.contacto.trim() }),
    fecha: formData.fecha,
    hora: formData.hora,
    // Solo incluir direccion si tiene valor
    ...(formData.direccion?.trim() && { direccion: formData.direccion.trim() }),
    // Solo incluir observaciones si tiene valor
    ...(formData.observaciones?.trim() && { observaciones: formData.observaciones.trim() }),
    estado_cita_id: parseInt(formData.estado_cita_id, 10) || 2  // Default: 2 (Confirmada según backend)
  };
};

export const getEstadoBadgeColor = (estadoCitaId) => {
  return ESTADO_CITA_COLORS[estadoCitaId] || 'default';
};

export const getEstadoLabel = (estadoCitaId) => {
  return ESTADO_CITA_LABELS[estadoCitaId] || 'Desconocido';
};