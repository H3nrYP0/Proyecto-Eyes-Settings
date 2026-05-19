import { ESTADO_CITA } from './constants';

export const formatearFechaLocal = (fechaStr) => {
  if (!fechaStr) return '-';
  const partes = fechaStr.split('-');
  if (partes.length !== 3) return '-';
  const [year, month, day] = partes;
  const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
    // silencio
  }
  return hora;
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