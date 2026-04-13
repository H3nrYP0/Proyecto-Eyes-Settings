// features/servicios/campanaSalud/utils/constants.js

export const ESTADO_CITA = {
  PENDIENTE: 1,
  CONFIRMADA: 2,
  COMPLETADA: 3,
  CANCELADA: 4,
  EN_PROGRESO: 5,
};

export const ESTADO_CITA_LABELS = {
  [ESTADO_CITA.PENDIENTE]: 'Pendiente',
  [ESTADO_CITA.CONFIRMADA]: 'Confirmada',
  [ESTADO_CITA.COMPLETADA]: 'Completada',
  [ESTADO_CITA.CANCELADA]: 'Cancelada',
  [ESTADO_CITA.EN_PROGRESO]: 'En Progreso',
};

export const ESTADO_CITA_COLORS = {
  [ESTADO_CITA.PENDIENTE]: 'warning',
  [ESTADO_CITA.CONFIRMADA]: 'info',
  [ESTADO_CITA.COMPLETADA]: 'success',
  [ESTADO_CITA.CANCELADA]: 'error',
  [ESTADO_CITA.EN_PROGRESO]: 'primary',
};

export const ESTADO_CITA_FILTERS = [
  { value: '', label: 'Todos los estados' },
  { value: ESTADO_CITA.PENDIENTE, label: 'Pendiente' },
  { value: 'proxima', label: 'Próxima' },
  { value: ESTADO_CITA.COMPLETADA, label: 'Completada' },
  { value: ESTADO_CITA.CANCELADA, label: 'Cancelada' },
];

export const ESTADOS_BLOQUEADOS = [ESTADO_CITA.COMPLETADA, ESTADO_CITA.CANCELADA];