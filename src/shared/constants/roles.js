// src/shared/constants/roles.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',     // Acceso total (secreto)
  ADMIN: 'admin',                 // Acceso casi total
  VENDEDOR: 'vendedor',          // Solo ver
  OPTICO: 'optico',              // Solo ver
  USUARIO: 'usuario'             // Sin acceso (solo landing) - POR DEFECTO
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.ADMIN]: ['*'],
  [ROLES.VENDEDOR]: ['dashboard', 'ventas', 'clientes', 'config:view'],
  [ROLES.OPTICO]: ['dashboard', 'servicios', 'agenda', 'config:view'],
  [ROLES.USUARIO]: [] // Sin acceso al dashboard
};

// Usuarios de prueba predefinidos
export const TEST_USERS = {
  SUPER_ADMIN: {
    email: "superadmin@visualoutlet.com",
    password: "SuperAdmin123!",
    role: ROLES.SUPER_ADMIN,
    name: "Super Administrador"
  },
  ADMIN: {
    email: "admin@visualoutlet.com",
    password: "Admin123!",
    role: ROLES.ADMIN,
    name: "Administrador"
  },
  VENDEDOR: {
    email: "vendedor@visualoutlet.com",
    password: "Vendedor123!",
    role: ROLES.VENDEDOR,
    name: "Vendedor Demo"
  },
  OPTICO: {
    email: "optico@visualoutlet.com",
    password: "Optico123!",
    role: ROLES.OPTICO,
    name: "Óptico Demo"
  }
};

// Verificar si un email pertenece a un usuario de prueba
export const isTestUser = (email) => {
  return Object.values(TEST_USERS).some(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
};

// Obtener usuario de prueba por email
export const getTestUser = (email) => {
  return Object.values(TEST_USERS).find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
};

// Verificar credenciales de usuario de prueba
export const verifyTestUser = (email, password) => {
  const user = getTestUser(email);
  return user && user.password === password ? user : null;
};