<<<<<<<< HEAD:src/features/seguridad/user/index.js
// Re-exporta las páginas del módulo de roles
========
// ==================== PÁGINAS ====================
// Roles
>>>>>>>> 41edc39 (encarpetado 100%):src/features/seguridad/index.jsx
export { default as Roles }          from './roles/pages/Roles';
export { default as CrearRol }       from './roles/pages/CrearRol';
export { default as EditarPermisos } from './roles/pages/EditarPermisos';
export { default as DetalleRol }     from './roles/pages/ListaRoles';

// Usuarios
export { default as GestionUsuarios } from './user/pages/GestionUsuarios';
export { default as CrearUsuario }    from './user/pages/CrearUsuario';
export { default as EditarUsuario }   from './user/pages/EditarUsuario';
export { default as DetalleUsuario }  from './user/pages/DetalleUsuario';

<<<<<<<< HEAD:src/features/seguridad/user/index.js
// Rutas del módulo de roles
========
// ==================== SERVICIOS ====================
export * from './roles/services/rolServices';
export * from './user/services/userServices';

// ==================== HOOKS ====================
export * from './roles/hooks/useRol';
export * from './user/hooks/useUsuario';

// ==================== COMPONENTES ====================
export { default as RolForm }          from './roles/components/RolForm';
export { default as PermisosSelector } from './roles/components/PermisosSelector';
export { default as UserForm }         from './user/components/UserForm';

// ==================== UTILS ====================
// Roles
export * from './roles/utils/permisosUtils';
export * from './roles/utils/rolFilters';
export * from './roles/utils/rolNormalizer';
export * from './roles/utils/rolValidators';

// Usuarios
export * from './user/utils/userFilters';
export * from './user/utils/userNormalizer';
export * from './user/utils/userValidators';

// ==================== RUTAS ====================
// Importaciones necesarias para las rutas
import Roles from './roles/pages/Roles';
import CrearRol from './roles/pages/CrearRol';
import EditarPermisos from './roles/pages/EditarPermisos';
import ListaRoles from './roles/pages/ListaRoles';
import GestionUsuarios from './user/pages/GestionUsuarios';
import CrearUsuario from './user/pages/CrearUsuario';
import EditarUsuario from './user/pages/EditarUsuario';
import DetalleUsuario from './user/pages/DetalleUsuario';

>>>>>>>> 41edc39 (encarpetado 100%):src/features/seguridad/index.jsx
export const rolesRoutes = [
  { path: 'roles',             element: <Roles /> },
  { path: 'roles/crear',       element: <CrearRol /> },
  { path: 'roles/editar/:id',  element: <EditarPermisos /> },
  { path: 'roles/detalle/:id', element: <ListaRoles /> },
];

<<<<<<<< HEAD:src/features/seguridad/user/index.js
// Rutas del módulo de usuarios
export const usersRoutes = [
========
export const userRoutes = [
>>>>>>>> 41edc39 (encarpetado 100%):src/features/seguridad/index.jsx
  { path: 'usuarios',             element: <GestionUsuarios /> },
  { path: 'usuarios/crear',       element: <CrearUsuario /> },
  { path: 'usuarios/editar/:id',  element: <EditarUsuario /> },
  { path: 'usuarios/detalle/:id', element: <DetalleUsuario /> },
];