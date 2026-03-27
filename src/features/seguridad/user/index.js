// Re-exporta las páginas del módulo de roles
export { default as Roles }          from './pages/Roles';
export { default as CrearRol }       from './pages/CrearRol';
export { default as EditarPermisos } from './pages/EditarPermisos';
export { default as DetalleRol }     from './pages/DetalleRol';

// Re-exporta las páginas del módulo de usuarios
export { default as GestionUsuarios } from './pages/GestionUsuarios';
export { default as CrearUsuario }    from './pages/CrearUsuario';
export { default as EditarUsuario }   from './pages/EditarUsuario';
export { default as DetalleUsuario }  from './pages/DetalleUsuario';

// Rutas del módulo de roles
export const rolesRoutes = [
  { path: 'roles',             element: <Roles /> },
  { path: 'roles/crear',       element: <CrearRol /> },
  { path: 'roles/editar/:id',  element: <EditarPermisos /> },
  { path: 'roles/detalle/:id', element: <DetalleRol /> },
];

// Rutas del módulo de usuarios
export const usersRoutes = [
  { path: 'usuarios',             element: <GestionUsuarios /> },
  { path: 'usuarios/crear',       element: <CrearUsuario /> },
  { path: 'usuarios/editar/:id',  element: <EditarUsuario /> },
  { path: 'usuarios/detalle/:id', element: <DetalleUsuario /> },
];