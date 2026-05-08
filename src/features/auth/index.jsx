// ==================== SERVICIOS ====================
export { default as authServices } from './services/authServices';

// ==================== UTILS ====================
export * from './utils/authValidators';
export * from './utils/authNormalizer';

// ==================== HOOKS ====================
export { useAuth } from './hooks/useAuth';

// ==================== COMPONENTES INTERNOS ====================
export { default as PasswordStrength } from './components/PasswordStrength';
export { default as VerificationCodeDialog } from './components/VerificationCodeDialog';

// ==================== PÁGINAS ====================
export { default as Login } from './pages/Login';
export { default as Register } from './pages/Register';
export { default as ForgotPassword } from './pages/ForgotPassword';