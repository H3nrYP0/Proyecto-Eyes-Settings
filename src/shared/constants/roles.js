export const ROLES = {
  ADMIN: 'admin',
  DEMO: 'demo',
  VENDEDOR: 'vendedor',
  OPTICO: 'optico'
};

export const PERMISSIONS = {
  [ROLES.ADMIN]: ['*'], // Acceso total
  [ROLES.DEMO]: ['dashboard', 'ventas'], // Solo dashboard y ventas
  [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes'],
  [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda']
};