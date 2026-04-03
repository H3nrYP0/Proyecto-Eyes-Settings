// ==================== PÁGINAS ====================
export { default as Login }          from './auth/pages/Login';
export { default as Register }       from './auth/pages/Register';
export { default as ForgotPassword } from './auth/pages/ForgotPassword';

// ==================== SERVICIOS ====================
export { default as authServices }   from './auth/services/authServices';

// ==================== HOOKS ====================
export * from './auth/hooks/useAuth';

// ==================== COMPONENTES ====================
export { default as PasswordStrength }        from './auth/components/PasswordStrength';
export { default as VerificationCodeDialog }  from './auth/components/VerificationCodeDialog';

// ==================== UTILS ====================
export * from './auth/utils/authValidators';
export * from './auth/utils/authNormalizer';