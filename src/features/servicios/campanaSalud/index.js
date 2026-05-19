/**
 * Módulo de Campañas de Salud
 * 
 * Exporta páginas, hooks, servicios y constantes.
 * Usa React Query para la gestión de datos.
 */

// Pages
export { default as CampanasSalud } from './pages/CampanasSalud';
export { default as CrearCampanaSalud } from './pages/CrearCampanaSalud';
export { default as EditarCampanaSalud } from './pages/EditarCampanaSalud';
export { default as DetalleCampanaSalud } from './pages/DetalleCampanaSalud';

// Components 
export { default as CampanaSaludForm } from './components/CampanaSaludForm';

// Hooks
export { useCampanasSalud } from './hooks/useCampanasSalud';
export { useCampanaSaludForm } from './hooks/useCampanaSaludForm';

// Servicios
export * as campanasSaludService from './services/campanasSaludService';
export * as estadosCitaCampanaService from './services/estadosCitaCampanaService';

// Constantes y utils
export {
  ESTADO_CITA,
  ESTADO_CITA_LABELS,
  ESTADO_CITA_FILTERS,
  ESTADOS_BLOQUEADOS,
} from './utils/constants';
export {
  formatearFechaLocal,
  horaA12,
  formatearHora24,
  getEstadoBadgeColor,
  getEstadoLabel,
} from './utils/campanasSaludUtils';