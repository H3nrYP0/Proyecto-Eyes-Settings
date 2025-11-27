export const ROLES = {
  SUPER_ADMIN: 'super_admin',     // Acceso total (secreto)
  ADMIN: 'admin',                 // Acceso casi total
  VENDEDOR: 'vendedor',          // Solo ver
  OPTICO: 'optico',              // Solo ver
  USUARIO: 'usuario'             // Sin acceso (solo landing)
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'], // Acceso total absoluto
  [ROLES.ADMIN]: ['*'], // Acceso total
  [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes', 'config:view'],
  [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda', 'config:view'],
  [ROLES.USUARIO]: [] // Sin acceso
};