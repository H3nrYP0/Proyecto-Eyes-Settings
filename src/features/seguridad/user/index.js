// Re-exporta las páginas del módulo de roles
export { default as Roles }          from './roles/pages/Roles';
export { default as CrearRol }       from './roles/pages/CrearRol';
export { default as EditarPermisos } from './roles/pages/EditarPermisos';
export { default as DetalleRol }     from './roles/pages/ListaRoles';

// Re-exporta las páginas del módulo de usuarios
export { default as GestionUsuarios } from './user/pages/GestionUsuarios';
export { default as CrearUsuario }    from './user/pages/CrearUsuario';
export { default as EditarUsuario }   from './user/pages/EditarUsuario';
export { default as DetalleUsuario }  from './user/pages/DetalleUsuario';

// Rutas del módulo de roles
export const rolesRoutes = [
  { path: 'roles',             element: <Roles /> },
  { path: 'roles/crear',       element: <CrearRol /> },
  { path: 'roles/editar/:id',  element: <EditarPermisos /> },
  { path: 'roles/detalle/:id', element: <ListaRoles /> },
];

// Rutas del módulo de usuarios
export const usersRoutes = [
  { path: 'usuarios',             element: <GestionUsuarios /> },
  { path: 'usuarios/crear',       element: <CrearUsuario /> },
  { path: 'usuarios/editar/:id',  element: <EditarUsuario /> },
  { path: 'usuarios/detalle/:id', element: <DetalleUsuario /> },
];