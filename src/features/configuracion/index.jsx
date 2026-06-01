// ==================== PÁGINAS ====================
export { default as Configuration } from './pages/Configuration';

// ==================== COMPONENTES ====================
export { default as Apariencia } from './components/general/Apariencia';
export { default as Licencias } from './components/legal/Licencias';

// ==================== HOOKS ====================
export { useConfiguracion } from './hooks/useConfiguracion';

// ==================== SERVICIOS ====================
export { getMiPerfil, updateMiPerfil, cambiarContrasenia } from './services/perfilService';

// ==================== UTILS ====================
export * from './utils/configuracionHelpers';

// Nota: Los componentes de EmpresaInfo, PreferenciasSistema, 
// PoliticaPrivacidad y TerminosCondiciones no se exportan por ahora